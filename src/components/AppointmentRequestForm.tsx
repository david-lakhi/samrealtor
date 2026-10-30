import React, { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, Loader2, X } from 'lucide-react';
import type { Property } from '../types/property';

interface AppointmentRequestFormProps {
  properties: Property[];
  initialPropertyId?: string;
  onClose?: () => void;
  onSuccess: () => void;
}

const inputClass = 'mt-1 w-full rounded-lg border border-gray-600 bg-gray-950/70 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20';

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const AppointmentRequestForm: React.FC<AppointmentRequestFormProps> = ({ properties, initialPropertyId = '', onClose, onSuccess }) => {
  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', propertyId: initialPropertyId, location: '', note: '', consent: false, website: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const property = useMemo(() => properties.find((item) => item.id === form.propertyId), [properties, form.propertyId]);

  const update = (field: string, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'visit', source: 'AI concierge' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not send your request. Please try WhatsApp instead.');
      onSuccess();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not send your request. Please try WhatsApp instead.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="relative mt-3 rounded-xl border border-cyan-500/30 bg-gray-900/90 p-4 sm:p-5">
      {onClose && <button type="button" onClick={onClose} aria-label="Close appointment form" className="absolute right-3 top-3 rounded-lg p-1 text-gray-400 hover:bg-gray-700 hover:text-white"><X className="h-4 w-4" /></button>}
      <div className="mb-4 flex items-center gap-2 pr-6"><CalendarDays className="h-5 w-5 text-cyan-300" /><div><h4 className="font-semibold text-white">Request a property visit</h4><p className="text-xs text-gray-400">Sam will contact you to confirm the time.</p></div></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-gray-300">Your name *<input className={inputClass} autoComplete="name" maxLength={100} required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Full name" /></label>
        <label className="text-xs text-gray-300">Phone number *<input className={inputClass} type="tel" autoComplete="tel" inputMode="tel" maxLength={20} required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+91 98765 43210" /></label>
        <label className="text-xs text-gray-300">Preferred date *<input className={inputClass} type="date" min={today()} required value={form.date} onChange={(event) => update('date', event.target.value)} /></label>
        <label className="text-xs text-gray-300">Preferred time *<input className={inputClass} type="time" required value={form.time} onChange={(event) => update('time', event.target.value)} /></label>
        <label className="text-xs text-gray-300 sm:col-span-2">Property of interest
          <select className={inputClass} value={form.propertyId} onChange={(event) => {
            const selected = properties.find((item) => item.id === event.target.value);
            setForm((current) => ({ ...current, propertyId: event.target.value, location: current.location || (selected ? `${selected.location}, ${selected.city}` : '') }));
          }}>
            <option value="">I’m still exploring / not sure yet</option>
            {properties.map((item) => <option key={item.id} value={item.id}>{item.title} — {item.location}, {item.city}</option>)}
          </select>
        </label>
        <label className="text-xs text-gray-300 sm:col-span-2">Meeting location or preferred area *<input className={inputClass} maxLength={200} required value={form.location} onChange={(event) => update('location', event.target.value)} placeholder={property ? `${property.location}, ${property.city}` : 'e.g. Sector 67, Mohali or a nearby landmark'} /></label>
        <label className="text-xs text-gray-300 sm:col-span-2">Anything Sam should know?<textarea className={inputClass} rows={2} maxLength={1200} value={form.note} onChange={(event) => update('note', event.target.value)} placeholder="Optional details or questions" /></label>
        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update('website', event.target.value)} /></label></div>
        <label className="flex items-start gap-2 text-xs leading-relaxed text-gray-400 sm:col-span-2"><input className="mt-0.5 accent-cyan-400" type="checkbox" required checked={form.consent} onChange={(event) => update('consent', event.target.checked)} /><span>I agree that Sam Realtor may contact me about this visit request using the phone number I provided. *</span></label>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}
      <button type="submit" disabled={saving} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60">{saving ? <><Loader2 className="h-4 w-4 animate-spin" />Sending request…</> : <><CheckCircle2 className="h-4 w-4" />Request visit</>}</button>
      <p className="mt-2 text-center text-[11px] text-gray-500">This is a request, not a confirmed booking. All times are local to Tricity (IST).</p>
    </form>
  );
};

export default AppointmentRequestForm;
