import React, { useEffect, useRef, useState } from 'react';
import { Bot, Calendar, CheckCircle2, FileText, MessageCircle, Phone, Send, User } from 'lucide-react';
import type { Property } from '../types/property';
import { formatPrice, getPropertyImages } from '../types/property';
import AppointmentRequestForm from './AppointmentRequestForm';

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  time: Date;
  properties?: Property[];
  showBooking?: boolean;
};

const whatsappNumber = '918847024002';
const quickActions = [
  { icon: Calendar, label: 'Plan a visit', prompt: 'I would like to arrange a visit' },
  { icon: FileText, label: 'Buying process', prompt: 'What should I know about the buying process?' },
  { icon: Phone, label: 'Talk to Sam', prompt: 'I would like to speak with Sam' },
  { icon: MessageCircle, label: 'Find a property', prompt: 'Help me find a property' },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const includesAny = (value: string, words: string[]) => words.some((word) => value.includes(word));

function extractBudget(message: string): number | null {
  const normalized = message.toLowerCase().replace(/,/g, '');
  const unitMatches = [...normalized.matchAll(/(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|lacs?|k)\b/g)];
  const unitMatch = unitMatches[unitMatches.length - 1];
  const explicitMatch = normalized.match(/(?:under|below|upto|up to|budget(?: of)?|within|less than|max(?:imum)?|around|about)\s*(?:₹|rs\.?\s*)?(\d+(?:\.\d+)?)/);
  const currencyMatch = normalized.match(/(?:₹|rs\.?\s*)(\d+(?:\.\d+)?)/);
  const match = unitMatch || explicitMatch || currencyMatch;
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = unitMatch?.[2];
  if (unit && /crore|cr/.test(unit)) return amount * 10_000_000;
  if (unit && /lakh|lac/.test(unit)) return amount * 100_000;
  if (unit === 'k') return amount * 1_000;
  if (amount >= 100_000) return amount;
  return null;
}

function findProperties(message: string, properties: Property[]): Property[] {
  const query = normalize(message);
  const locations = [...new Set(properties.flatMap((property) => [property.city, property.location]).filter(Boolean))];
  const location = locations.find((place) => query.includes(normalize(place)));
  const namedProperty = properties.find((property) => normalize(property.title).length > 3 && query.includes(normalize(property.title)));
  const budget = extractBudget(message);
  const roomMatch = query.match(/\b([1-9])\s*(?:bhk|bed(?:room)?s?)\b/);
  const bedrooms = roomMatch ? Number(roomMatch[1]) : null;
  const type = includesAny(query, ['farmhouse', 'farm house']) ? 'farmhouse'
    : includesAny(query, ['apartment', 'flat']) ? 'apartment'
      : includesAny(query, ['villa']) ? 'villa'
        : includesAny(query, ['plot', 'land']) ? 'plot'
          : includesAny(query, ['commercial', 'shop', 'office', 'showroom', 'warehouse']) ? 'commercial'
            : includesAny(query, ['builder floor', 'floor']) ? 'floor' : null;

  return properties.filter((property) => {
    const searchable = normalize([property.title, property.location, property.city, property.propertyType, property.description, ...(property.features || [])].join(' '));
    const locationMatches = !location || searchable.includes(normalize(location));
    const budgetMatches = !budget || property.price <= budget;
    const roomMatches = bedrooms === null || property.bedrooms >= bedrooms;
    let typeMatches = true;
    if (type === 'farmhouse') typeMatches = searchable.includes('farmhouse') || searchable.includes('farm house');
    else if (type === 'apartment') typeMatches = /apartment|flat/.test(searchable);
    else if (type === 'villa') typeMatches = searchable.includes('villa');
    else if (type === 'plot') typeMatches = /plot|land/.test(searchable);
    else if (type === 'commercial') typeMatches = searchable.includes('commercial') || /shop|office|showroom|warehouse/.test(searchable);
    else if (type === 'floor') typeMatches = searchable.includes('floor');
    return (!namedProperty || property.id === namedProperty.id) && locationMatches && budgetMatches && roomMatches && typeMatches;
  }).sort((a, b) => a.price - b.price).slice(0, 3);
}

function makeReply(message: string, properties: Property[], turn: number): { text: string; matches?: Property[]; showBooking?: boolean } {
  const query = normalize(message);
  const matches = findProperties(message, properties);
  const rotation = turn % 3;
  const greeting = ['Hi there!', 'Sure, I can help with that.', 'Let’s see what I can find.'][rotation];

  if (includesAny(query, ['hello', 'hi', 'hey', 'good morning', 'good evening'])) {
    return { text: ['Hello! Are you looking to buy, or would you like help with a particular listing?', 'Hi! Tell me the area, budget, or kind of property you have in mind and I’ll look through the current listings.', 'Hey! I can help you explore available properties around Tricity. What are you looking for?'][rotation] };
  }
  if (includesAny(query, ['thank', 'thanks', 'great', 'perfect'])) {
    return { text: ['You’re welcome. Want me to check another area or budget?', 'Happy to help! I can also find a few alternatives if you tell me what matters most.', 'Anytime. If you’d like, share your preferred location and budget and I’ll narrow it down.'][rotation] };
  }
  if (includesAny(query, ['call sam', 'speak with sam', 'talk to sam', 'contact sam', 'phone'])) {
    return { text: 'Of course. You can message Sam directly on WhatsApp and include what you’re looking for. He can confirm availability and arrange a call.', matches: [] };
  }
  if (includesAny(query, ['visit', 'viewing', 'see the property', 'schedule', 'appointment'])) {
    return { text: matches.length
      ? `Absolutely${matches.length === 1 ? `—I’ve selected ${matches[0].title} for you` : ', I found a few possible listings'}. Add your contact details and preferred time below. Sam will confirm availability with you.`
      : 'Sure. Share your details and preferred date, time, and meeting location below. Sam will contact you to confirm the visit.', matches, showBooking: true };
  }
  if (includesAny(query, ['document', 'paperwork', 'registry', 'legal', 'agreement', 'loan'])) {
    return { text: 'For a purchase, buyers commonly review the title chain, ownership and encumbrance records, approved plans, tax or dues receipts, and the sale agreement. The exact checks depend on the property, so please have a local property lawyer verify the documents before paying or signing. I can connect you with Sam for the listing details.' };
  }
  if (includesAny(query, ['negotiate', 'discount', 'final price', 'less price', 'offer'])) {
    return { text: matches.length
      ? `The listed price${matches.length === 1 ? ` for ${matches[0].title} is ${formatPrice(matches[0].price)}` : ` starts at ${formatPrice(matches[0].price)}`}. I can’t promise a discount, but Sam can check with the seller and discuss your offer.`
      : 'I can’t promise a discount or quote an unlisted price. Share the property and your offer with Sam and he can check with the seller.', matches };
  }
  if (includesAny(query, ['how many', 'available', 'listings', 'properties', 'options', 'show me', 'find', 'looking for', 'search'])) {
    if (matches.length) {
      const intro = matches.length === 1
        ? `${greeting} I found a listing that fits what you described.`
        : `${greeting} Here ${matches.length === 1 ? 'is' : 'are'} ${matches.length} current listing${matches.length === 1 ? '' : 's'} that look like a good fit.`;
      return { text: `${intro} Want to know more about one, or should I adjust the area or budget?`, matches };
    }
    if (properties.length === 0) return { text: 'I can search the live listings, but they aren’t available right now. Please try again in a little while, or message Sam on WhatsApp and he can help directly.' };
    return { text: `I couldn’t find a current listing matching all of those preferences. We have ${properties.length} listing${properties.length === 1 ? '' : 's'} in the catalogue right now. Try widening the budget or changing the area, and I’ll check again.` };
  }
  if (matches.length && (extractBudget(message) || /\b[1-9]\s*(?:bhk|bed(?:room)?s?)\b/.test(query))) {
    return { text: `${greeting} Based on that, these current listings may suit you. I’ve sorted them from lower to higher price.`, matches };
  }
  if (includesAny(query, ['price', 'cost', 'rate', 'budget', 'lakh', 'crore', '₹', 'rupee'])) {
    if (matches.length) return { text: `${greeting} I found ${matches.length} matching listing${matches.length === 1 ? '' : 's'}. Here are the listed prices; Sam can confirm current availability.`, matches };
    return { text: 'Tell me your maximum budget and preferred area—something like “2 BHK in Mohali under 80 lakhs”—and I’ll look for matching listings.' };
  }
  if (matches.length) return { text: `${greeting} I found a few listings related to that. Take a look, and tell me what you’d like to compare.`, matches };
  return { text: ['I can help with current listings, prices, locations, and arranging a visit. What area and budget should I search?', 'Tell me a little more—perhaps the city, property type, or budget—and I’ll check the available listings.', 'I can look through Sam’s live listings for you. For example, try “apartment in Zirakpur under 70 lakhs”.'][rotation] };
}

const AIConcierge: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesReady, setPropertiesReady] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, role: 'assistant', text: 'Hi, I’m Sam’s property concierge. Tell me your preferred area, budget, or property type and I’ll check the current listings. I can also help you get in touch with Sam.', time: new Date() }]);
  const [inputMessage, setInputMessage] = useState('');
  const [replying, setReplying] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef(0);

  useEffect(() => {
    let active = true;
    fetch('/api/properties')
      .then((response) => {
        if (!response.ok) throw new Error('Listings unavailable');
        return response.json() as Promise<Property[]>;
      })
      .then((result) => { if (active) setProperties(Array.isArray(result) ? result : []); })
      .catch(() => { if (active) setProperties([]); })
      .finally(() => { if (active) setPropertiesReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, replying]);

  const sendMessage = (text = inputMessage) => {
    const question = text.trim();
    if (!question || replying) return;
    const now = new Date();
    const userMessage: ChatMessage = { id: now.getTime(), role: 'user', text: question, time: now };
    setMessages((current) => [...current, userMessage]);
    setInputMessage('');
    setReplying(true);
    window.setTimeout(() => {
      turnRef.current += 1;
      const reply = makeReply(question, properties, turnRef.current);
      setMessages((current) => [...current, { id: Date.now(), role: 'assistant', text: reply.text, time: new Date(), properties: reply.matches?.length ? reply.matches : undefined }]);
      setReplying(false);
    }, 400 + Math.floor(Math.random() * 450));
  };

  const whatsappLink = (property?: Property) => {
    const link = property ? `${window.location.origin}/property/${encodeURIComponent(property.id)}` : window.location.href;
    const text = property ? `Hi Sam, I'm interested in ${property.title}. Listing: ${link}` : `Hi Sam, I was chatting with the property concierge and would like to know more. ${link}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-6 text-4xl font-bold sm:text-5xl"><span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Property Concierge</span></h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-300">Explore Sam’s current listings, get helpful answers, and connect directly when you’re ready.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-cyan-500/30 bg-gray-800/40 backdrop-blur-md">
            <div className="border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"><Bot className="h-6 w-6 text-white" /></div>
                <div><h3 className="text-lg font-semibold text-white">Sam’s Property Concierge</h3><div className="flex items-center gap-2"><div className={`h-2 w-2 rounded-full ${propertiesReady ? 'bg-green-400' : 'animate-pulse bg-amber-400'}`} /><span className={`text-sm ${propertiesReady ? 'text-green-400' : 'text-amber-300'}`}>{propertiesReady ? `${properties.length} live listing${properties.length === 1 ? '' : 's'} connected` : 'Checking current listings…'}</span></div></div>
              </div>
            </div>

            <div className="h-96 space-y-4 overflow-y-auto p-5 sm:p-6" aria-live="polite">
              {messages.map((message) => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex max-w-[92%] items-start gap-3 sm:max-w-[85%]">
                  {message.role === 'assistant' && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"><Bot className="h-4 w-4 text-white" /></div>}
                  <div className="min-w-0">
                    <div className={`rounded-2xl p-4 ${message.role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-gray-700/60 text-gray-100'}`}><p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p><p className="mt-2 text-xs opacity-60">{message.time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p></div>
                    {message.properties && <div className="mt-3 space-y-2">{message.properties.map((property) => {
                      const image = getPropertyImages(property)[0];
                      return <div key={property.id} className="overflow-hidden rounded-xl border border-gray-600/70 bg-gray-900/80">
                        <div className="flex gap-3 p-3">{image ? <img src={image} alt="" className="h-20 w-24 shrink-0 rounded-lg object-cover" /> : <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-cyan-300"><MessageCircle className="h-6 w-6" /></div>}
                          <div className="min-w-0 flex-1"><p className="truncate font-semibold text-white">{property.title}</p><p className="truncate text-xs text-gray-400">{property.location}, {property.city}</p><p className="mt-1 text-sm font-semibold text-cyan-300">{formatPrice(property.price)}</p><p className="text-xs text-gray-400">{property.area}{property.propertyType?.toLowerCase() !== 'commercial' && property.bedrooms ? ` · ${property.bedrooms} BHK` : ''}</p></div>
                        </div>
                        <div className="flex border-t border-gray-700"><a href={`/property/${encodeURIComponent(property.id)}`} className="flex-1 px-3 py-2 text-center text-xs font-medium text-cyan-300 hover:bg-cyan-500/10">View listing</a><a href={whatsappLink(property)} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-1 border-l border-gray-700 px-3 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-500/10">Ask Sam on WhatsApp</a></div>
                      </div>;
                    })}</div>}
                    {message.showBooking && <AppointmentRequestForm properties={properties} initialPropertyId={message.properties?.length === 1 ? message.properties[0].id : ''} onSuccess={() => {
                      setMessages((current) => [...current.map((item) => item.id === message.id ? { ...item, showBooking: false } : item), { id: Date.now(), role: 'assistant', text: 'Your visit request is with Sam. He’ll contact you on the number you provided to confirm the time.', time: new Date() }]);
                    }} />}
                  </div>
                  {message.role === 'user' && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600"><User className="h-4 w-4 text-white" /></div>}
                </div>
              </div>)}
              {replying && <div className="flex items-center gap-3 text-sm text-gray-400"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700"><Bot className="h-4 w-4 text-cyan-300" /></div><span className="animate-pulse">Checking the listings…</span></div>}
              <div ref={messageEndRef} />
            </div>

            <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="border-t border-cyan-500/30 p-4 sm:p-6">
              <div className="flex gap-3"><input aria-label="Your message" value={inputMessage} onChange={(event) => setInputMessage(event.target.value)} placeholder="Try ‘2 BHK in Mohali under 80 lakhs’" className="min-w-0 flex-1 rounded-xl border border-gray-600/50 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" /><button type="submit" disabled={!inputMessage.trim() || replying} aria-label="Send message" className="rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 p-3 text-white transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-5 w-5" /></button></div>
            </form>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-gray-800/40 p-6 backdrop-blur-md"><h3 className="mb-4 text-lg font-semibold text-white">Start with a question</h3><div className="space-y-3">{quickActions.map(({ icon: Icon, label, prompt }) => <button key={label} type="button" disabled={replying} onClick={() => sendMessage(prompt)} className="group flex w-full items-center gap-3 rounded-lg bg-gray-700/30 p-3 text-left transition-colors hover:bg-cyan-500/20 disabled:opacity-50"><Icon className="h-5 w-5 text-cyan-400 group-hover:text-cyan-300" /><span className="text-gray-300 group-hover:text-white">{label}</span></button>)}</div></div>
          <div className="rounded-2xl border border-cyan-500/30 bg-gray-800/40 p-6 backdrop-blur-md"><h3 className="mb-4 text-lg font-semibold text-white">What I can help with</h3><div className="space-y-4">{['Search live property listings', 'Compare price, area & location', 'Share general buying checklists', 'Connect you with Sam directly'].map((item) => <div key={item} className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" /><span className="text-sm text-gray-300">{item}</span></div>)}</div></div>
          <div className="rounded-2xl border border-cyan-500/30 bg-gray-800/40 p-6 backdrop-blur-md"><h3 className="mb-3 text-lg font-semibold text-white">Need a person?</h3><p className="mb-4 text-sm text-gray-400">Sam can confirm availability, answer listing-specific questions, and arrange a visit.</p><a href={whatsappLink()} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-500"><MessageCircle className="h-4 w-4" /> Message Sam on WhatsApp</a></div>
        </aside>
      </div>
    </div>
  );
};

export default AIConcierge;
