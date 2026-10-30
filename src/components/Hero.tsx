import React, { useState } from 'react';
import { Phone, MessageCircle, Search, MapPin, Bed, Bath, ArrowRight } from 'lucide-react';

const PHONE_DISPLAY = '+91 88470 24002';
const PHONE_TEL = '+918847024002';
const WHATSAPP_NUMBER = '918847024002';

const locationLabels: Record<string, string> = {
  chandigarh: 'Chandigarh',
  mohali: 'Mohali',
  zirakpur: 'Zirakpur',
  panchkula: 'Panchkula',
};

const budgetLabels: Record<string, string> = {
  '50-70': '₹50–70 Lakh',
  '70-100': '₹70 Lakh–1 Cr',
  '100+': '₹1 Cr+',
};

const featuredListing = {
  title: '3 BHK with garden view',
  location: 'Sector 17, Chandigarh',
  price: '₹85 Lakh',
  bedrooms: 3,
  bathrooms: 2,
  area: '1,450 sq ft',
  image:
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const openWhatsApp = (message: string) => {
  window.open(
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
    '_blank',
    'noopener,noreferrer'
  );
};

const Hero: React.FC = () => {
  const [location, setLocation] = useState('');
  const [bhk, setBhk] = useState('');
  const [budget, setBudget] = useState('');
  const [note, setNote] = useState('');

  const buildEnquiry = (propertyTitle?: string) => {
    const details: string[] = [];
    if (propertyTitle) details.push(propertyTitle);
    if (bhk) details.push(`${bhk} BHK`);
    if (location && locationLabels[location]) details.push(`in ${locationLabels[location]}`);
    if (budget && budgetLabels[budget]) details.push(`budget ${budgetLabels[budget]}`);
    if (note.trim()) details.push(note.trim());

    if (details.length === 0) {
      return "Hi Sam, I'm looking for a home in Chandigarh / Mohali / Zirakpur / Panchkula. Could you help?";
    }

    return `Hi Sam, I'm looking for ${details.join(', ')}. Could you help?`;
  };

  const handleFindHomes = (e: React.FormEvent) => {
    e.preventDefault();
    document.getElementById('smart-finder')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.08) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div className="absolute top-24 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-16 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
              Tricity real estate
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-5">
              <span className="text-white">Find your next home in </span>
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                Chandigarh, Mohali, Zirakpur & Panchkula
              </span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed max-w-xl mb-8">
              15+ years helping families buy, sell, and invest — with clear advice,
              local knowledge, and a reply on WhatsApp. Not a pitch. A home.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              {['15+ years in Tricity', 'Homes, plots & commercial', 'Direct on WhatsApp'].map(
                (item) => (
                  <span
                    key={item}
                    className="text-sm text-gray-200 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            <form
              onSubmit={handleFindHomes}
              className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 mb-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <label className="sr-only" htmlFor="hero-location">
                  Location
                </label>
                <select
                  id="hero-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-900/70 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="">Location</option>
                  <option value="chandigarh">Chandigarh</option>
                  <option value="mohali">Mohali</option>
                  <option value="zirakpur">Zirakpur</option>
                  <option value="panchkula">Panchkula</option>
                </select>

                <label className="sr-only" htmlFor="hero-bhk">
                  BHK
                </label>
                <select
                  id="hero-bhk"
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full bg-gray-900/70 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="">BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                </select>

                <label className="sr-only" htmlFor="hero-budget">
                  Budget
                </label>
                <select
                  id="hero-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-gray-900/70 border border-gray-600/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="">Budget</option>
                  <option value="50-70">₹50–70 Lakh</option>
                  <option value="70-100">₹70 Lakh–1 Cr</option>
                  <option value="100+">₹1 Cr+</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Or describe it — e.g. 3 BHK near IT Park, Mohali"
                  className="flex-1 bg-gray-900/70 border border-gray-600/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 whitespace-nowrap"
                >
                  <Search className="w-4 h-4" />
                  Browse homes
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => openWhatsApp(buildEnquiry())}
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Sam
              </button>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-cyan-400/60 text-white px-6 py-3.5 rounded-xl font-semibold transition-colors duration-300"
              >
                <Phone className="w-5 h-5 text-cyan-400" />
                Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="lg:pl-4">
            <article className="bg-gray-800/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
              <div className="relative">
                <img
                  src={featuredListing.image}
                  alt={featuredListing.title}
                  className="w-full h-64 sm:h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                <span className="absolute top-4 left-4 bg-white/90 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
                <span className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {featuredListing.price}
                </span>
              </div>

              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">{featuredListing.title}</h2>
                <p className="flex items-center text-gray-400 text-sm mb-4">
                  <MapPin className="w-4 h-4 mr-1.5 text-cyan-400" />
                  {featuredListing.location}
                </p>

                <div className="flex items-center gap-5 text-gray-300 text-sm mb-6">
                  <span className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4" />
                    {featuredListing.bedrooms} Beds
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4" />
                    {featuredListing.bathrooms} Baths
                  </span>
                  <span>{featuredListing.area}</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openWhatsApp(
                      `Hi Sam, I'm interested in the ${featuredListing.title} in ${featuredListing.location} (${featuredListing.price}).`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 bg-white text-gray-900 hover:bg-cyan-50 py-3 rounded-xl font-semibold transition-colors duration-300"
                >
                  Enquire on WhatsApp
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
