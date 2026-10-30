import React, { useEffect, useState } from 'react';
import { ArrowLeft, Building2, CalendarClock, LogOut, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import type { Property } from '../types/property';
import { formatPrice, getPropertyImages, getPropertyVideos } from '../types/property';
import { PropertyDetails } from './PropertyDetails';

interface FilePreview {
  file: File;
  url: string;
}

interface Lead {
  id: string;
  type?: 'inquiry' | 'visit';
  source?: string;
  name: string;
  phone: string;
  email?: string;
  date?: string;
  time?: string;
  location: string;
  propertyTitle: string;
  note: string;
  message?: string;
  propertyType?: string;
  budget?: string;
  status: 'new' | 'contacted' | 'visit arranged' | 'closed';
  createdAt: string;
  notifications?: { whatsapp?: string; webhook?: string };
}

const emptyForm = {
  title: '', location: '', city: 'Chandigarh', propertyType: 'Apartment', price: '',
  bedrooms: '2', bathrooms: '2', parking: '1', area: '', imageUrl: '', features: '', description: '',
};

const fieldClass = 'w-full rounded-lg border border-gray-600 bg-gray-900/70 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-cyan-400';
const mainSiteUrl = `${window.location.protocol}//${window.location.host.replace(/^admin\./, '')}`;

const AdminProperties: React.FC = () => {
  const [form, setForm] = useState(emptyForm);
  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadTypeFilter, setLeadTypeFilter] = useState('all');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urls = [...imageFiles, ...videoFiles].map((item) => item.url);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [imageFiles, videoFiles]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) throw new Error('Could not load properties.');
      setProperties(await response.json());
    } catch {
      setMessage('Could not reach the property backend. Start the app with npm run dev.');
    } finally {
      setLoading(false);
    }
  };

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const response = await fetch('/api/admin/leads');
      if (!response.ok) throw new Error('Could not load visit requests.');
      setLeads(await response.json());
    } catch {
      setMessage('Could not load visit requests from the property backend.');
    } finally {
      setLoadingLeads(false);
    }
  };

  const updateLeadStatus = async (lead: Lead, status: Lead['status']) => {
    const response = await fetch(`/api/admin/leads/${encodeURIComponent(lead.id)}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setMessage('Could not update this visit request.');
      return;
    }
    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, status } : item));
  };

  const visibleLeads = leads.filter((lead) => {
    const leadType = lead.type || (lead.date ? 'visit' : 'inquiry');
    const searchable = [lead.name, lead.email, lead.phone, lead.propertyTitle, lead.location, lead.message, lead.note, lead.budget, lead.propertyType, lead.source].join(' ').toLowerCase();
    return (leadTypeFilter === 'all' || leadType === leadTypeFilter)
      && (leadStatusFilter === 'all' || lead.status === leadStatusFilter)
      && searchable.includes(leadSearch.trim().toLowerCase());
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/admin/session');
        const session = await response.json();
        if (session.authenticated) {
          setAuthenticated(true);
          await Promise.all([loadProperties(), loadLeads()]);
        }
      } catch {
        setMessage('Could not reach the login service. Start the app with npm run dev.');
      } finally {
        setCheckingSession(false);
      }
    };
    void checkSession();
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Login failed.');
      setAuthenticated(true);
      setPassword('');
      await Promise.all([loadProperties(), loadLeads()]);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed.');
    }
  };

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setProperties([]);
    setLeads([]);
    setMessage('');
  };

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => name === 'propertyType' && value === 'Commercial'
      ? { ...current, propertyType: value, bedrooms: '0', bathrooms: '0' }
      : { ...current, [name]: value });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const upload = async (files: FilePreview[], label: string) => {
        const urls: string[] = [];
        for (let index = 0; index < files.length; index += 1) {
          const uploadData = new FormData();
          uploadData.append('file', files[index].file);
          setMessage(`Uploading ${label} ${index + 1} of ${files.length}…`);
          const uploadResponse = await fetch('/api/uploads', { method: 'POST', body: uploadData });
          const uploadResult = await uploadResponse.json();
          if (!uploadResponse.ok) throw new Error(uploadResult.error || 'Could not upload file.');
          urls.push(uploadResult.url as string);
        }
        return urls;
      };
      const [uploadedImages, uploadedVideos] = await Promise.all([upload(imageFiles, 'image'), upload(videoFiles, 'video')]);
      const baseImages = editingProperty ? getPropertyImages(editingProperty) : [];
      const baseVideos = editingProperty ? getPropertyVideos(editingProperty) : [];
      const payload = {
        ...form,
        images: [...baseImages, ...uploadedImages, ...(form.imageUrl && !baseImages.includes(form.imageUrl) ? [form.imageUrl] : [])],
        videos: [...baseVideos, ...uploadedVideos],
      };
      const response = await fetch(editingProperty ? `/api/properties/${encodeURIComponent(editingProperty.id)}` : '/api/properties', {
        method: editingProperty ? 'PUT' : 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save property.');
      setForm(emptyForm);
      setImageFiles([]);
      setVideoFiles([]);
      setEditingProperty(null);
      setMessage(editingProperty ? 'Property updated.' : 'Property added and now visible in Smart Finder.');
      await loadProperties();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save property.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const response = await fetch(`/api/properties/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (response.ok) setProperties((current) => current.filter((property) => property.id !== id));
    else setMessage('Could not remove this property.');
  };

  const edit = (property: Property) => {
    setEditingProperty(property);
    setForm({
      title: property.title,
      location: property.location,
      city: property.city,
      propertyType: property.propertyType || 'Apartment',
      price: String(property.price),
      bedrooms: String(property.bedrooms),
      bathrooms: String(property.bathrooms),
      parking: String(property.parking),
      area: property.area,
      imageUrl: '',
      features: (property.features || []).join(', '),
      description: property.description || '',
    });
    setImageFiles([]);
    setVideoFiles([]);
    setMessage('');
    document.getElementById('property-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelEdit = () => {
    setEditingProperty(null);
    setForm(emptyForm);
    setImageFiles([]);
    setVideoFiles([]);
    setMessage('');
  };

  const addFiles = (event: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<FilePreview[]>>) => {
    const files = Array.from(event.target.files || []).map((file) => ({ file, url: URL.createObjectURL(file) }));
    if (files.length) setter((current) => [...current, ...files]);
    event.target.value = '';
  };

  const removeFile = (url: string, setter: React.Dispatch<React.SetStateAction<FilePreview[]>>) => {
    URL.revokeObjectURL(url);
    setter((current) => current.filter((item) => item.url !== url));
  };

  const existingImages = editingProperty ? getPropertyImages(editingProperty) : [];
  const existingVideos = editingProperty ? getPropertyVideos(editingProperty) : [];
  const previewProperty: Property = {
    id: editingProperty?.id || 'new-property-preview',
    title: form.title,
    location: form.location,
    city: form.city,
    propertyType: form.propertyType,
    price: Number(form.price) || 0,
    bedrooms: Number(form.bedrooms) || 0,
    bathrooms: Number(form.bathrooms) || 0,
    parking: Number(form.parking) || 0,
    area: form.area,
    images: [...existingImages, ...imageFiles.map((item) => item.url), ...(form.imageUrl ? [form.imageUrl] : [])],
    videos: [...existingVideos, ...videoFiles.map((item) => item.url)],
    description: form.description,
    features: form.features.split(',').map((feature) => feature.trim()).filter(Boolean),
    createdAt: editingProperty?.createdAt || new Date().toISOString(),
  };

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <a href={mainSiteUrl} className="mb-8 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"><ArrowLeft className="h-4 w-4" /> Back to website</a>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3"><Building2 className="h-8 w-8 text-cyan-400" /><div><h1 className="text-3xl font-bold">Property Admin</h1><p className="text-gray-400">Private listing management</p></div></div>
          {authenticated && <button onClick={() => void logout()} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:border-cyan-400 hover:text-white"><LogOut className="h-4 w-4" /> Sign out</button>}
        </div>

        {checkingSession ? <p className="text-gray-400">Checking sign-in…</p> : !authenticated ? (
          <form onSubmit={login} className="max-w-md rounded-2xl border border-cyan-500/30 bg-gray-800/60 p-6 sm:p-8">
            <h2 className="mb-2 text-xl font-semibold">Admin sign in</h2>
            <p className="mb-6 text-sm text-gray-400">Sign in to add, edit, or remove property listings.</p>
            <label className="mb-4 block text-sm text-gray-300">Username<input className={`${fieldClass} mt-1`} autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
            <label className="mb-5 block text-sm text-gray-300">Password<input className={`${fieldClass} mt-1`} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
            <button className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-3 font-semibold">Sign in</button>
            {message && <p role="alert" className="mt-4 text-sm text-red-300">{message}</p>}
          </form>
        ) : (
          <>
            <div className="mb-10 grid items-start gap-8 xl:grid-cols-[1fr_0.9fr]">
            <form id="property-form" onSubmit={submit} className="scroll-mt-6 rounded-2xl border border-cyan-500/30 bg-gray-800/60 p-6 sm:p-8">
              <h2 className="mb-6 text-xl font-semibold">{editingProperty ? `Edit: ${editingProperty.title}` : 'Add a property'}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={fieldClass} name="title" value={form.title} onChange={update} placeholder="Listing title *" required />
                <input className={fieldClass} name="location" value={form.location} onChange={update} placeholder="Area / sector *" required />
                <select className={fieldClass} name="city" value={form.city} onChange={update}>{['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula'].map((city) => <option key={city}>{city}</option>)}</select>
                <select className={fieldClass} name="propertyType" value={form.propertyType} onChange={update}>{['Apartment', 'Independent house', 'Villa', 'Plot', 'Commercial'].map((type) => <option key={type}>{type}</option>)}</select>
                <label className="text-sm text-gray-400">Price (INR) *<input className={`${fieldClass} mt-1`} type="number" min="1" name="price" value={form.price} onChange={update} placeholder="8500000" required /></label>
                <input className={fieldClass} name="area" value={form.area} onChange={update} placeholder="Area, e.g. 1,450 sq ft *" required />
                {form.propertyType !== 'Commercial' && <>
                  <label className="text-sm text-gray-400">Bedrooms<input className={`${fieldClass} mt-1`} type="number" min="0" name="bedrooms" value={form.bedrooms} onChange={update} /></label>
                  <label className="text-sm text-gray-400">Bathrooms<input className={`${fieldClass} mt-1`} type="number" min="0" name="bathrooms" value={form.bathrooms} onChange={update} /></label>
                </>}
                <label className="text-sm text-gray-400">Parking spaces<input className={`${fieldClass} mt-1`} type="number" min="0" name="parking" value={form.parking} onChange={update} /></label>
                <label className="text-sm text-gray-400">Property images <span className="text-gray-500">(select multiple · JPG, PNG, WebP, GIF · max 10 MB each)</span><input className={`${fieldClass} mt-1 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-2 file:text-cyan-200`} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => addFiles(event, setImageFiles)} /></label>
                <label className="text-sm text-gray-400">Property videos <span className="text-gray-500">(select multiple · MP4, WebM, MOV · max 100 MB each)</span><input className={`${fieldClass} mt-1 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-500/20 file:px-3 file:py-2 file:text-cyan-200`} type="file" multiple accept="video/mp4,video/webm,video/quicktime" onChange={(event) => addFiles(event, setVideoFiles)} /></label>
                {imageFiles.length > 0 && <div className="space-y-2 sm:col-span-2">{imageFiles.map((item) => <div key={item.url} className="flex items-center justify-between gap-3 rounded-lg bg-gray-900/50 px-3 py-2 text-xs text-gray-300"><span className="truncate">{item.file.name}</span><button type="button" onClick={() => removeFile(item.url, setImageFiles)} aria-label={`Remove ${item.file.name}`} className="shrink-0 text-gray-400 hover:text-red-300"><X className="h-4 w-4" /></button></div>)}</div>}
                {videoFiles.length > 0 && <div className="space-y-2 sm:col-span-2">{videoFiles.map((item) => <div key={item.url} className="flex items-center justify-between gap-3 rounded-lg bg-gray-900/50 px-3 py-2 text-xs text-gray-300"><span className="truncate">{item.file.name}</span><button type="button" onClick={() => removeFile(item.url, setVideoFiles)} aria-label={`Remove ${item.file.name}`} className="shrink-0 text-gray-400 hover:text-red-300"><X className="h-4 w-4" /></button></div>)}</div>}
                {editingProperty && <p className="text-xs text-gray-400 sm:col-span-2">Existing photos and videos stay on the listing. New files are added to its gallery.</p>}
                <input className={`${fieldClass} sm:col-span-2`} name="imageUrl" type="url" value={form.imageUrl} onChange={update} placeholder="Or paste an image URL (optional)" />
                <input className={`${fieldClass} sm:col-span-2`} name="features" value={form.features} onChange={update} placeholder="Features, comma separated" />
                <textarea className={`${fieldClass} sm:col-span-2`} name="description" value={form.description} onChange={update} placeholder="Description" rows={3} />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-3 font-semibold disabled:opacity-50">{editingProperty ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{saving ? 'Saving…' : editingProperty ? 'Save changes' : 'Add property'}</button>
                {editingProperty && <button type="button" onClick={cancelEdit} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-3 text-gray-300 hover:text-white"><X className="h-4 w-4" />Cancel</button>}
                {message && <p role="status" className="text-sm text-cyan-200">{message}</p>}
              </div>
            </form>
            <div className="xl:sticky xl:top-6"><PropertyDetails property={previewProperty} preview /></div>
            </div>

            <section className="mb-8 rounded-2xl border border-cyan-500/30 bg-gray-800/50 p-6 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3"><CalendarClock className="h-6 w-6 text-cyan-300" /><div><h2 className="text-xl font-semibold">Lead CRM ({leads.length})</h2><p className="text-sm text-gray-400">{leads.filter((lead) => lead.status === 'new').length} new · enquiries and visit requests</p></div></div>
                <button type="button" onClick={() => void loadLeads()} disabled={loadingLeads} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm text-gray-300 hover:border-cyan-400 hover:text-white disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loadingLeads ? 'animate-spin' : ''}`} />Refresh</button>
              </div>
              <div className="mb-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <label className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" /><input aria-label="Search leads" value={leadSearch} onChange={(event) => setLeadSearch(event.target.value)} placeholder="Search name, phone, email, property…" className="w-full rounded-lg border border-gray-600 bg-gray-900/70 py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-400" /></label>
                <select aria-label="Filter leads by type" value={leadTypeFilter} onChange={(event) => setLeadTypeFilter(event.target.value)} className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white"><option value="all">All lead types</option><option value="inquiry">Enquiries</option><option value="visit">Visit requests</option></select>
                <select aria-label="Filter leads by status" value={leadStatusFilter} onChange={(event) => setLeadStatusFilter(event.target.value)} className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2.5 text-sm text-white"><option value="all">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="visit arranged">Visit arranged</option><option value="closed">Closed</option></select>
              </div>
              {loadingLeads && leads.length === 0 ? <p className="text-gray-400">Loading leads…</p> : leads.length === 0 ? <p className="rounded-xl bg-gray-900/50 p-4 text-sm text-gray-400">No leads yet. Enquiries and visit requests will appear here.</p> : visibleLeads.length === 0 ? <p className="rounded-xl bg-gray-900/50 p-4 text-sm text-gray-400">No leads match these filters.</p> : (
                <div className="space-y-3">{visibleLeads.map((lead) => {
                  const digits = lead.phone.replace(/\D/g, '');
                  const whatsappPhone = digits.length === 10 ? `91${digits}` : digits;
                  const leadType = lead.type || (lead.date ? 'visit' : 'inquiry');
                  const visitDate = lead.date && lead.time ? new Date(`${lead.date}T${lead.time}:00+05:30`).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) : '';
                  const replyMessage = leadType === 'visit' ? `Hi ${lead.name}, this is Sam Realtor. I received your visit request${visitDate ? ` for ${visitDate}` : ''}. Let me confirm availability.` : `Hi ${lead.name}, this is Sam Realtor. I received your enquiry and will be happy to help.`;
                  return <article key={lead.id} className="rounded-xl border border-gray-700 bg-gray-900/50 p-4 sm:p-5">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-white">{lead.name}</h3><span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-cyan-200">{leadType === 'visit' ? 'Visit request' : 'Enquiry'}</span><span className="rounded-full bg-gray-700 px-2 py-0.5 text-[11px] capitalize text-gray-300">{lead.status}</span></div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300"><span><a href={`tel:${lead.phone}`} className="hover:text-cyan-300">{lead.phone}</a></span>{lead.email && <span><a href={`mailto:${lead.email}`} className="hover:text-cyan-300">{lead.email}</a></span>}{visitDate && <span>{visitDate} IST</span>}</div>
                        {(lead.propertyTitle || lead.propertyType || lead.budget || lead.location) && <p className="mt-2 text-sm text-gray-300">{[lead.propertyTitle, lead.propertyType, lead.budget && `Budget ${lead.budget}`, lead.location].filter(Boolean).join(' · ')}</p>}
                        {(lead.message || lead.note) && <p className="mt-2 whitespace-pre-line text-sm text-gray-400">{lead.message || lead.note}</p>}
                        <p className="mt-2 text-xs text-gray-500">Source: {lead.source || 'Website'} · Received {new Date(lead.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        {lead.notifications?.whatsapp && <p className={`mt-2 text-xs ${lead.notifications.whatsapp === 'sent' ? 'text-emerald-300' : lead.notifications.whatsapp === 'failed' ? 'text-amber-300' : 'text-gray-500'}`}>{lead.notifications.whatsapp === 'sent' ? 'WhatsApp notification sent' : lead.notifications.whatsapp === 'failed' ? 'WhatsApp notification failed' : 'WhatsApp notification not configured'}</p>}
                      </div>
                      <div className="flex shrink-0 flex-wrap items-center gap-2"><a href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(replyMessage)}`} target="_blank" rel="noreferrer" className="rounded-lg bg-emerald-600/20 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-600/30">WhatsApp lead</a><select aria-label={`Update ${lead.name} lead status`} value={lead.status} onChange={(event) => void updateLeadStatus(lead, event.target.value as Lead['status'])} className="rounded-lg border border-gray-600 bg-gray-900 px-3 py-2 text-xs text-white"><option value="new">New</option><option value="contacted">Contacted</option><option value="visit arranged">Visit arranged</option><option value="closed">Closed</option></select></div>
                    </div>
                  </article>;
                })}</div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-700 bg-gray-800/40 p-6 sm:p-8">
              <h2 className="mb-5 text-xl font-semibold">Listings ({properties.length})</h2>
              {loading ? <p className="text-gray-400">Loading listings…</p> : properties.length === 0 ? <p className="text-gray-400">No properties yet. Add your first listing above.</p> : (
                <div className="divide-y divide-gray-700">{properties.map((property) => <div key={property.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium">{property.title}</p><p className="text-sm text-gray-400">{property.location}, {property.city} · {formatPrice(property.price)}{property.video ? ' · Video' : ''}</p></div><div className="flex items-center gap-1"><button type="button" onClick={() => edit(property)} aria-label={`Edit ${property.title}`} className="rounded-lg p-2 text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300"><Pencil className="h-4 w-4" /></button><button type="button" onClick={() => void remove(property.id)} aria-label={`Delete ${property.title}`} className="rounded-lg p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-4 w-4" /></button></div></div>)}</div>
              )}
            </section>
            {message && <p role="status" className="mt-4 text-sm text-cyan-200">{message}</p>}
          </>
        )}
      </div>
    </main>
  );
};

export default AdminProperties;
