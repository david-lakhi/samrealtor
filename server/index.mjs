import { createServer } from 'node:http';
import { randomUUID, randomBytes, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dataFile = resolve(here, '../data/properties.json');
const leadsFile = resolve(here, '../data/leads.json');
const uploadsDir = resolve(here, '../uploads');
const port = Number(process.env.API_PORT || 3001);
const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;
const sessions = new Map();
const leadRequests = new Map();
let leadWriteQueue = Promise.resolve();

if (!adminUsername || !adminPassword) {
  console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD before starting the property API.');
  process.exit(1);
}

async function readProperties() {
  try {
    return JSON.parse(await readFile(dataFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(dirname(dataFile), { recursive: true });
    await writeFile(dataFile, '[]\n', 'utf8');
    return [];
  }
}

async function saveProperties(properties) {
  await mkdir(dirname(dataFile), { recursive: true });
  await writeFile(dataFile, `${JSON.stringify(properties, null, 2)}\n`, 'utf8');
}

async function readLeads() {
  try {
    return JSON.parse(await readFile(leadsFile, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await mkdir(dirname(leadsFile), { recursive: true });
    await writeFile(leadsFile, '[]\n', 'utf8');
    return [];
  }
}

async function saveLeads(leads) {
  await mkdir(dirname(leadsFile), { recursive: true });
  await writeFile(leadsFile, `${JSON.stringify(leads, null, 2)}\n`, 'utf8');
}

function serializeLeadWrite(update) {
  const operation = leadWriteQueue.then(update);
  leadWriteQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

async function sendLeadNotifications(lead) {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL;
  const webhookSecret = process.env.LEAD_WEBHOOK_SECRET;
  let webhook = 'not-configured';
  if (webhookUrl) {
    try {
      const result = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...(webhookSecret ? { authorization: `Bearer ${webhookSecret}` } : {}) },
        body: JSON.stringify({ event: 'new_property_lead', lead }),
        signal: AbortSignal.timeout(8000),
      });
      webhook = result.ok ? 'sent' : 'failed';
      if (!result.ok) console.error(`Lead webhook returned HTTP ${result.status}.`);
    } catch (error) {
      webhook = 'failed';
      console.error('Lead webhook delivery failed:', error.message);
    }
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.WHATSAPP_ADMIN_NUMBER;
  const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
  const apiVersion = process.env.WHATSAPP_GRAPH_API_VERSION;
  let whatsapp = 'not-configured';
  if (token && phoneNumberId && recipient && templateName && apiVersion) {
    try {
      const response = await fetch(`https://graph.facebook.com/${encodeURIComponent(apiVersion)}/${encodeURIComponent(phoneNumberId)}/messages`, {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipient.replace(/\D/g, ''),
          type: 'template',
          template: {
            name: templateName,
            language: { code: process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en' },
            components: [{ type: 'body', parameters: [
              lead.type === 'visit' ? 'Visit request' : 'Property enquiry', lead.name, lead.phone,
              lead.date && lead.time ? `${lead.date} at ${lead.time} IST` : 'No visit requested',
              lead.location || 'Not specified', lead.propertyTitle || 'Not selected', lead.message || lead.note || lead.budget || 'No additional details',
            ].map((text) => ({ type: 'text', text: String(text).slice(0, 500) })) }],
          },
        }),
        signal: AbortSignal.timeout(8000),
      });
      whatsapp = response.ok ? 'sent' : 'failed';
      if (!response.ok) console.error('WhatsApp lead notification failed:', await response.text());
    } catch (error) {
      whatsapp = 'failed';
      console.error('WhatsApp lead notification failed:', error.message);
    }
  }
  return { webhook, whatsapp };
}

function send(response, status, payload) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function credentialsMatch(candidate, expected) {
  const candidateBytes = Buffer.from(candidate);
  const expectedBytes = Buffer.from(expected);
  return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes);
}

function sessionToken(request) {
  const cookies = request.headers.cookie || '';
  const entry = cookies.split(';').map((part) => part.trim()).find((part) => part.startsWith('sam_admin_session='));
  return entry?.slice('sam_admin_session='.length);
}

function isAdmin(request) {
  const token = sessionToken(request);
  const expiresAt = token && sessions.get(token);
  if (!expiresAt) return false;
  if (expiresAt < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

async function readBody(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 100_000) throw new Error('Request body is too large.');
  }
  return JSON.parse(body || '{}');
}

async function readRawBody(request, maxBytes) {
  const chunks = [];
  let length = 0;
  for await (const chunk of request) {
    length += chunk.length;
    if (length > maxBytes) throw new Error('Upload is too large.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

const uploadTypes = {
  'image/jpeg': { extension: '.jpg', maxBytes: 10 * 1024 * 1024 },
  'image/png': { extension: '.png', maxBytes: 10 * 1024 * 1024 },
  'image/webp': { extension: '.webp', maxBytes: 10 * 1024 * 1024 },
  'image/gif': { extension: '.gif', maxBytes: 10 * 1024 * 1024 },
  'video/mp4': { extension: '.mp4', maxBytes: 100 * 1024 * 1024 },
  'video/webm': { extension: '.webm', maxBytes: 100 * 1024 * 1024 },
  'video/quicktime': { extension: '.mov', maxBytes: 100 * 1024 * 1024 },
};

function parseUploadedFile(body, boundary) {
  const marker = Buffer.from(`--${boundary}`);
  let partStart = body.indexOf(marker);
  while (partStart !== -1) {
    const headersStart = partStart + marker.length + 2;
    const contentStart = body.indexOf(Buffer.from('\r\n\r\n'), headersStart);
    if (contentStart === -1) break;
    const headers = body.subarray(headersStart, contentStart).toString('utf8');
    const contentEnd = body.indexOf(Buffer.from(`\r\n--${boundary}`), contentStart + 4);
    if (contentEnd === -1) break;
    if (/Content-Disposition: form-data;\s*name="file";\s*filename="[^"]+"/i.test(headers)) {
      return { headers, data: body.subarray(contentStart + 4, contentEnd) };
    }
    partStart = body.indexOf(marker, contentEnd + 2);
  }
  return null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  try {
    if (url.pathname === '/api/admin/login' && request.method === 'POST') {
      const input = await readBody(request);
      if (!credentialsMatch(String(input.username || ''), adminUsername) || !credentialsMatch(String(input.password || ''), adminPassword)) {
        return send(response, 401, { error: 'Username or password is incorrect.' });
      }
      const token = randomBytes(32).toString('base64url');
      sessions.set(token, Date.now() + 8 * 60 * 60 * 1000);
      const secureCookie = request.socket.encrypted || request.headers['x-forwarded-proto'] === 'https' ? '; Secure' : '';
      response.setHeader('set-cookie', `sam_admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secureCookie}`);
      return send(response, 200, { authenticated: true, username: adminUsername });
    }

    if (url.pathname === '/api/admin/session' && request.method === 'GET') {
      return send(response, 200, { authenticated: isAdmin(request), username: isAdmin(request) ? adminUsername : null });
    }

    if (url.pathname === '/api/admin/logout' && request.method === 'POST') {
      const token = sessionToken(request);
      if (token) sessions.delete(token);
      response.setHeader('set-cookie', 'sam_admin_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');
      return send(response, 200, { authenticated: false });
    }

    if (url.pathname === '/api/leads' && request.method === 'POST') {
      const client = request.socket.remoteAddress || 'unknown';
      const now = Date.now();
      const recent = (leadRequests.get(client) || []).filter((timestamp) => now - timestamp < 60 * 60 * 1000);
      if (recent.length >= 5) return send(response, 429, { error: 'Too many requests. Please contact Sam directly on WhatsApp.' });

      const input = await readBody(request);
      if (String(input.website || '').trim()) return send(response, 201, { received: true });
      const type = input.type === 'visit' ? 'visit' : 'inquiry';
      const name = String(input.name || '').trim().slice(0, 100);
      const phone = String(input.phone || '').trim();
      const phoneDigits = phone.replace(/\D/g, '');
      const date = String(input.date || '').trim();
      const time = String(input.time || '').trim();
      const location = String(input.location || '').trim().slice(0, 200);
      const email = String(input.email || '').trim().slice(0, 200);
      const budget = String(input.budget || '').trim().slice(0, 100);
      const propertyType = String(input.propertyType || '').trim().slice(0, 100);
      const message = String(input.message || '').trim().slice(0, 1200);
      const note = String(input.note || '').trim().slice(0, 1200);
      const validPhone = /^\+?[\d\s().-]{8,20}$/.test(phone) && phoneDigits.length >= 8 && phoneDigits.length <= 15;
      const validVisit = type !== 'visit' || (/^\d{4}-\d{2}-\d{2}$/.test(date) && /^([01]\d|2[0-3]):[0-5]\d$/.test(time) && location.length >= 2);
      const validInquiry = type !== 'inquiry' || message.length >= 2;
      if (!name || !validPhone || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) || !validVisit || !validInquiry || input.consent !== true) {
        return send(response, 400, { error: 'Enter your name and a valid phone number; add a message or complete the visit details, and agree to be contacted.' });
      }
      const todayInIndia = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      if (type === 'visit' && date < todayInIndia) return send(response, 400, { error: 'Choose a visit date from today onward.' });
      const properties = await readProperties();
      const selectedProperty = input.propertyId ? properties.find((property) => property.id === String(input.propertyId)) : null;
      if (input.propertyId && !selectedProperty) return send(response, 400, { error: 'The selected listing is no longer available. Please choose another listing.' });
      const lead = {
        id: randomUUID(),
        type,
        source: String(input.source || (type === 'visit' ? 'concierge' : 'contact form')).slice(0, 50),
        name,
        phone,
        email,
        date,
        time,
        location,
        propertyId: selectedProperty?.id || '',
        propertyTitle: selectedProperty?.title || '',
        propertyType,
        budget,
        message,
        note,
        status: 'new',
        createdAt: new Date().toISOString(),
        notifications: { webhook: 'pending', whatsapp: 'pending' },
      };
      recent.push(now);
      leadRequests.set(client, recent);
      await serializeLeadWrite(async () => {
        const leads = await readLeads();
        leads.unshift(lead);
        await saveLeads(leads);
      });

      const notifications = await sendLeadNotifications(lead);
      lead.notifications = notifications;
      await serializeLeadWrite(async () => {
        const leads = await readLeads();
        await saveLeads(leads.map((item) => item.id === lead.id ? lead : item));
      });
      return send(response, 201, { received: true, id: lead.id, notifications });
    }

    if (url.pathname === '/api/admin/leads' && request.method === 'GET') {
      if (!isAdmin(request)) return send(response, 401, { error: 'Please sign in to view enquiries.' });
      return send(response, 200, await readLeads());
    }

    const leadMatch = url.pathname.match(/^\/api\/admin\/leads\/([^/]+)$/);
    if (leadMatch && request.method === 'PATCH') {
      if (!isAdmin(request)) return send(response, 401, { error: 'Please sign in to manage enquiries.' });
      const input = await readBody(request);
      const statuses = ['new', 'contacted', 'visit arranged', 'closed'];
      if (!statuses.includes(input.status)) return send(response, 400, { error: 'Choose a valid enquiry status.' });
      const updated = await serializeLeadWrite(async () => {
        const leads = await readLeads();
        const index = leads.findIndex((lead) => lead.id === decodeURIComponent(leadMatch[1]));
        if (index === -1) return null;
        leads[index] = { ...leads[index], status: input.status, updatedAt: new Date().toISOString() };
        await saveLeads(leads);
        return leads[index];
      });
      return updated ? send(response, 200, updated) : send(response, 404, { error: 'Enquiry not found.' });
    }

    if (url.pathname === '/api/properties' && request.method === 'GET') {
      return send(response, 200, await readProperties());
    }

    if (url.pathname === '/api/properties' && request.method === 'POST') {
      if (!isAdmin(request)) return send(response, 401, { error: 'Please sign in to manage listings.' });
      const input = await readBody(request);
      const required = ['title', 'location', 'city', 'price', 'area'];
      const missing = required.filter((field) => !String(input[field] ?? '').trim());
      if (missing.length) return send(response, 400, { error: `Required fields: ${missing.join(', ')}` });
      const price = Number(input.price);
      const bedrooms = Number(input.bedrooms);
      const bathrooms = Number(input.bathrooms);
      const parking = Number(input.parking);
      if (![price, bedrooms, bathrooms, parking].every(Number.isFinite) || price <= 0 || [bedrooms, bathrooms, parking].some((value) => value < 0)) {
        return send(response, 400, { error: 'Enter a valid price and non-negative room and parking counts.' });
      }
      const property = {
        id: randomUUID(),
        title: String(input.title).trim(),
        location: String(input.location).trim(),
        city: String(input.city).trim(),
        propertyType: String(input.propertyType || 'Apartment').trim(),
        price,
        bedrooms,
        bathrooms,
        parking,
        area: String(input.area).trim(),
        images: Array.isArray(input.images) ? input.images.map((item) => String(item).trim()).filter(Boolean) : String(input.image || '').trim() ? [String(input.image).trim()] : [],
        videos: Array.isArray(input.videos) ? input.videos.map((item) => String(item).trim()).filter(Boolean) : String(input.video || '').trim() ? [String(input.video).trim()] : [],
        description: String(input.description || '').trim(),
        features: String(input.features || '').split(',').map((feature) => feature.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      property.image = property.images[0] || '';
      property.video = property.videos[0] || '';
      const properties = await readProperties();
      properties.unshift(property);
      await saveProperties(properties);
      return send(response, 201, property);
    }

    if (url.pathname === '/api/uploads' && request.method === 'POST') {
      if (!isAdmin(request)) return send(response, 401, { error: 'Please sign in to upload files.' });
      const contentType = request.headers['content-type'] || '';
      const boundary = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
      if (!contentType.toLowerCase().startsWith('multipart/form-data') || !boundary) {
        return send(response, 400, { error: 'Upload must use multipart form data.' });
      }
      const body = await readRawBody(request, 105 * 1024 * 1024);
      const file = parseUploadedFile(body, (boundary[1] || boundary[2]).trim());
      if (!file) return send(response, 400, { error: 'Choose an image or video file to upload.' });
      const mimeType = file.headers.match(/Content-Type:\s*([^\r\n]+)/i)?.[1]?.trim().toLowerCase();
      const type = uploadTypes[mimeType];
      if (!type) return send(response, 415, { error: 'Use JPG, PNG, WebP, GIF, MP4, WebM, or MOV files.' });
      if (file.data.length > type.maxBytes) {
        return send(response, 413, { error: mimeType.startsWith('image/') ? 'Images must be 10 MB or smaller.' : 'Videos must be 100 MB or smaller.' });
      }
      await mkdir(uploadsDir, { recursive: true });
      const filename = `${randomUUID()}${type.extension}`;
      await writeFile(resolve(uploadsDir, filename), file.data, { flag: 'wx' });
      return send(response, 201, { url: `/uploads/${filename}`, mimeType, size: file.data.length });
    }

    const match = url.pathname.match(/^\/api\/properties\/([^/]+)$/);
    if (match && request.method === 'GET') {
      const property = (await readProperties()).find((item) => item.id === decodeURIComponent(match[1]));
      return property ? send(response, 200, property) : send(response, 404, { error: 'Property not found.' });
    }

    if (match && request.method === 'PUT') {
      if (!isAdmin(request)) return send(response, 401, { error: 'Please sign in to manage listings.' });
      const input = await readBody(request);
      const required = ['title', 'location', 'city', 'price', 'area'];
      const missing = required.filter((field) => !String(input[field] ?? '').trim());
      if (missing.length) return send(response, 400, { error: `Required fields: ${missing.join(', ')}` });
      const price = Number(input.price);
      const bedrooms = Number(input.bedrooms);
      const bathrooms = Number(input.bathrooms);
      const parking = Number(input.parking);
      if (![price, bedrooms, bathrooms, parking].every(Number.isFinite) || price <= 0 || [bedrooms, bathrooms, parking].some((value) => value < 0)) {
        return send(response, 400, { error: 'Enter a valid price and non-negative room and parking counts.' });
      }
      const properties = await readProperties();
      const index = properties.findIndex((property) => property.id === decodeURIComponent(match[1]));
      if (index === -1) return send(response, 404, { error: 'Property not found.' });
      const existing = properties[index];
      const updated = {
        ...existing,
        title: String(input.title).trim(),
        location: String(input.location).trim(),
        city: String(input.city).trim(),
        propertyType: String(input.propertyType || 'Apartment').trim(),
        price,
        bedrooms,
        bathrooms,
        parking,
        area: String(input.area).trim(),
        images: Array.isArray(input.images) ? input.images.map((item) => String(item).trim()).filter(Boolean) : String(input.image || existing.image || '').trim() ? [String(input.image || existing.image).trim()] : [],
        videos: Array.isArray(input.videos) ? input.videos.map((item) => String(item).trim()).filter(Boolean) : String(input.video || existing.video || '').trim() ? [String(input.video || existing.video).trim()] : [],
        description: String(input.description || '').trim(),
        features: String(input.features || '').split(',').map((feature) => feature.trim()).filter(Boolean),
        updatedAt: new Date().toISOString(),
      };
      updated.image = updated.images[0] || '';
      updated.video = updated.videos[0] || '';
      properties[index] = updated;
      await saveProperties(properties);
      return send(response, 200, updated);
    }

    if (match && request.method === 'DELETE') {
      if (!isAdmin(request)) return send(response, 401, { error: 'Please sign in to manage listings.' });
      const properties = await readProperties();
      const next = properties.filter((property) => property.id !== decodeURIComponent(match[1]));
      if (next.length === properties.length) return send(response, 404, { error: 'Property not found.' });
      await saveProperties(next);
      return send(response, 200, { ok: true });
    }

    const uploadMatch = url.pathname.match(/^\/uploads\/([0-9a-f-]+\.(?:jpg|png|webp|gif|mp4|webm|mov))$/i);
    if (uploadMatch && request.method === 'GET') {
      const filepath = resolve(uploadsDir, uploadMatch[1]);
      try {
        const info = await stat(filepath);
        const mimeType = Object.entries(uploadTypes).find(([, type]) => filepath.endsWith(type.extension))?.[0] || 'application/octet-stream';
        const range = request.headers.range;
        response.setHeader('content-type', mimeType);
        response.setHeader('accept-ranges', 'bytes');
        response.setHeader('x-content-type-options', 'nosniff');
        response.setHeader('cache-control', 'public, max-age=86400');
        if (range) {
          const parsed = range.match(/^bytes=(\d*)-(\d*)$/);
          if (!parsed) {
            response.writeHead(416, { 'content-range': `bytes */${info.size}` });
            return response.end();
          }
          const start = parsed[1] ? Number(parsed[1]) : Math.max(0, info.size - Number(parsed[2]));
          const end = parsed[2] && parsed[1] ? Math.min(Number(parsed[2]), info.size - 1) : info.size - 1;
          if (start > end || start >= info.size) {
            response.writeHead(416, { 'content-range': `bytes */${info.size}` });
            return response.end();
          }
          response.writeHead(206, { 'content-range': `bytes ${start}-${end}/${info.size}`, 'content-length': end - start + 1 });
          return createReadStream(filepath, { start, end }).pipe(response);
        }
        response.writeHead(200, { 'content-length': info.size });
        return createReadStream(filepath).pipe(response);
      } catch (error) {
        if (error.code === 'ENOENT') return send(response, 404, { error: 'File not found.' });
        throw error;
      }
    }

    return send(response, 404, { error: 'Not found.' });
  } catch (error) {
    if (error instanceof SyntaxError) return send(response, 400, { error: 'Request body must be valid JSON.' });
    if (error.message === 'Upload is too large.') return send(response, 413, { error: 'Upload request is too large.' });
    console.error(error);
    return send(response, 500, { error: 'The property service encountered an error.' });
  }
});

server.listen(port, '127.0.0.1', () => console.log(`Property API listening on http://127.0.0.1:${port}`));
