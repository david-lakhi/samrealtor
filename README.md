# Sam Realtor

## Local development

Run `npm run dev` to start the Vite site and local property API together.

- Website: http://localhost:5173/
- Admin sign-in: http://admin.localhost:5173/
- The local admin username and password are configured in `.env.local`.
- Property listings are stored in `data/properties.json`.
- Website enquiries and visit requests are stored in `data/leads.json` and managed from the signed-in admin CRM, which supports search, filters, and follow-up statuses.
- Uploaded images and videos are stored in the ignored `uploads/` folder (10 MB image / 100 MB video limit).

## Visit request notifications

The concierge saves every request first, then immediately tries any configured notification integrations. This is an event-driven webhook/API call; no cron job is needed. If a notification service is down or not configured, the lead remains available in the admin panel.

- Copy `.env.example` to `.env.local` and keep all credentials server-side.
- `LEAD_WEBHOOK_URL` can point to a private automation endpoint. If it checks a secret, set the same value in `LEAD_WEBHOOK_SECRET`; the server sends it as a bearer token.
- Direct WhatsApp notification requires a WhatsApp Business Cloud API sender, an access token, phone number ID, admin recipient number, the current Graph API version, and an approved template matching the seven variables documented in `.env.example`.
- Business-initiated WhatsApp notifications require the applicable approved template and recipient opt-in; see [WhatsApp messaging rules](https://www.twilio.com/docs/whatsapp/key-concepts).
- Do not put webhook or WhatsApp credentials in frontend code or commit `.env.local`.

The admin host is restricted to local development. Before deploying, configure the `admin` DNS subdomain, HTTPS, secure environment variables, a persistent production database and file storage, and production-grade authentication/session storage. The current JSON-file API is for local development; Vercel does not persist its local filesystem between function invocations.
