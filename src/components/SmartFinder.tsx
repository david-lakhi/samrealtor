import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, MapPin, Bed, Bath, Car, Images, Play, X } from 'lucide-react';
import type { Property } from '../types/property';
import { formatPrice, getPropertyImages, getPropertyVideos } from '../types/property';
import { PropertyDetails } from './PropertyDetails';

const suggestions = ['3 bedroom home in Mohali', 'Apartment in Chandigarh', 'Villa with garden', 'Investment plot'];

const PropertyModal: React.FC<{ property: Property; onClose: () => void }> = ({ property, onClose }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="property-dialog fixed inset-0 m-auto max-h-[92vh] w-[min(96vw,1100px)] max-w-none overflow-y-auto rounded-2xl border-0 bg-transparent p-0 text-white shadow-2xl"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="relative">
        <button type="button" onClick={onClose} aria-label="Close property details" className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-gray-950/80 p-2 text-white backdrop-blur transition-colors hover:bg-cyan-500"><X className="h-5 w-5" /></button>
        <PropertyDetails property={property} />
      </div>
    </dialog>
  );
};

const SmartFinder: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ location: '', budget: '', bedrooms: '', propertyType: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      const match = window.location.pathname.match(/^\/property\/([^/]+)\/?$/);
      if (window.history.state?.propertyModal && match) {
        const property = properties.find((item) => item.id === decodeURIComponent(match[1]));
        setSelectedProperty(property || null);
      } else {
        setSelectedProperty(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [properties]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error('Property service is unavailable.');
        setProperties(await response.json());
      } catch {
        setError('Could not load listings. Please check that the property backend is running.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return properties.filter((property) => {
      const searchable = [property.title, property.location, property.city, property.propertyType, property.description, ...property.features].join(' ').toLowerCase();
      const textMatch = terms.every((term) => searchable.includes(term));
      const cityMatch = !filters.location || property.city.toLowerCase() === filters.location;
      const budgetMatch = !filters.budget || (
        filters.budget === '50-70' ? property.price >= 5_000_000 && property.price < 7_000_000 :
          filters.budget === '70-100' ? property.price >= 7_000_000 && property.price < 10_000_000 : property.price >= 10_000_000
      );
      const bedroomMatch = !filters.bedrooms || property.bedrooms >= Number(filters.bedrooms);
      const typeMatch = !filters.propertyType || property.propertyType.toLowerCase() === filters.propertyType;
      return textMatch && cityMatch && budgetMatch && bedroomMatch && typeMatch;
    });
  }, [properties, query, filters]);

  const updateFilter = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));

  const openDetails = (event: React.MouseEvent<HTMLAnchorElement>, property: Property) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState({ propertyModal: true }, '', `/property/${encodeURIComponent(property.id)}`);
    setSelectedProperty(property);
  };

  const closeDetails = () => {
    if (window.history.state?.propertyModal) window.history.back();
    else setSelectedProperty(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <h2 className="mb-6 text-4xl font-bold sm:text-5xl"><span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">AI Smart Property Finder</span></h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-300">Search current listings from the property backend by area, budget, home type, or the features you want.</p>
      </div>

      <div className="mb-10 rounded-2xl border border-cyan-500/30 bg-gray-800/40 p-6 backdrop-blur-md sm:p-8">
        <label htmlFor="property-search" className="mb-2 block text-sm font-medium text-gray-300">Describe the property you want</label>
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-400" />
            <input id="property-search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') event.preventDefault(); }} type="search" placeholder="e.g. 3 bedroom home in Mohali with garden" className="w-full rounded-xl border border-gray-600/50 bg-gray-900/60 py-4 pl-12 pr-4 text-white placeholder-gray-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" />
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-gray-400">Try:</span>
          {suggestions.map((suggestion) => <button key={suggestion} onClick={() => setQuery(suggestion)} className="rounded-full bg-gray-700/60 px-3 py-1.5 text-xs text-cyan-300 transition-colors hover:bg-cyan-500/20">{suggestion}</button>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <select aria-label="Filter by city" value={filters.location} onChange={(event) => updateFilter('location', event.target.value)} className="rounded-lg border border-gray-600/50 bg-gray-900/60 px-3 py-3 text-sm text-white"><option value="">All cities</option>{['Chandigarh', 'Mohali', 'Zirakpur', 'Panchkula'].map((city) => <option key={city} value={city.toLowerCase()}>{city}</option>)}</select>
          <select aria-label="Filter by budget" value={filters.budget} onChange={(event) => updateFilter('budget', event.target.value)} className="rounded-lg border border-gray-600/50 bg-gray-900/60 px-3 py-3 text-sm text-white"><option value="">Any budget</option><option value="50-70">₹50–70 lakh</option><option value="70-100">₹70 lakh–1 crore</option><option value="100+">₹1 crore+</option></select>
          <select aria-label="Minimum bedrooms" value={filters.bedrooms} onChange={(event) => updateFilter('bedrooms', event.target.value)} className="rounded-lg border border-gray-600/50 bg-gray-900/60 px-3 py-3 text-sm text-white"><option value="">Any bedrooms</option>{[1, 2, 3, 4].map((count) => <option key={count} value={count}> {count}+ bedrooms</option>)}</select>
          <select aria-label="Property type" value={filters.propertyType} onChange={(event) => updateFilter('propertyType', event.target.value)} className="rounded-lg border border-gray-600/50 bg-gray-900/60 px-3 py-3 text-sm text-white"><option value="">Any property type</option>{['Apartment', 'Independent house', 'Villa', 'Plot', 'Commercial'].map((type) => <option key={type} value={type.toLowerCase()}>{type}</option>)}</select>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between text-sm text-gray-400"><span>{loading ? 'Loading listings…' : `${results.length} ${results.length === 1 ? 'property' : 'properties'} found`}</span><span>Listings added by your admin</span></div>
      {error && <p role="alert" className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{error}</p>}
      {!loading && !error && results.length === 0 && <div className="rounded-2xl border border-gray-700 bg-gray-800/30 p-12 text-center"><h3 className="mb-2 text-xl font-semibold text-white">No matching properties yet</h3><p className="text-gray-400">Please check back soon.</p></div>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {results.map((property) => {
          const images = getPropertyImages(property);
          const videos = getPropertyVideos(property);
          return (
            <article key={property.id} className="group overflow-hidden rounded-2xl border border-gray-600/30 bg-gray-800/40 transition-all hover:border-cyan-400/50">
              <a href={`/property/${encodeURIComponent(property.id)}`} onClick={(event) => openDetails(event, property)} className="block">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-800 to-cyan-950">
                  {images[0] && <img src={images[0]} alt={property.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
                  <span className="absolute left-4 top-4 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-cyan-200">{property.propertyType}</span>
                  {(images.length > 1 || videos.length > 0) && <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-gray-900/80 px-3 py-1 text-xs text-white">{images.length > 1 && <span className="flex items-center gap-1"><Images className="h-3.5 w-3.5" />{images.length}</span>}{videos.length > 0 && <span className="flex items-center gap-1"><Play className="h-3.5 w-3.5" />{videos.length}</span>}</span>}
                </div>
              </a>
              <div className="p-6">
                <a href={`/property/${encodeURIComponent(property.id)}`} onClick={(event) => openDetails(event, property)} className="hover:text-cyan-300"><h3 className="mb-2 text-xl font-semibold text-white">{property.title}</h3></a>
                <div className="mb-3 flex items-center text-gray-400"><MapPin className="mr-1 h-4 w-4" /><span className="text-sm">{property.location}, {property.city}</span></div>
                <div className="mb-4 flex items-center justify-between"><span className="text-2xl font-bold text-cyan-400">{formatPrice(property.price)}</span><span className="text-sm text-gray-400">{property.area}</span></div>
                <div className="mb-4 flex items-center gap-4 text-gray-300">{property.propertyType?.toLowerCase() !== 'commercial' && <><span className="flex items-center gap-1"><Bed className="h-4 w-4" />{property.bedrooms}</span><span className="flex items-center gap-1"><Bath className="h-4 w-4" />{property.bathrooms}</span></>}<span className="flex items-center gap-1"><Car className="h-4 w-4" />{property.parking}</span></div>
                {(property.features || []).length > 0 && <div className="mb-4 flex flex-wrap gap-2">{property.features.map((feature) => <span key={feature} className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">{feature}</span>)}</div>}
                <a href={`/property/${encodeURIComponent(property.id)}`} onClick={(event) => openDetails(event, property)} className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/70 py-2.5 text-cyan-300 transition-colors hover:bg-cyan-400/10">View property details</a>
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-8 text-center text-xs text-gray-500">Search matches listing text and filters directly; AI model integration is not connected yet.</div>
      {selectedProperty && <PropertyModal property={selectedProperty} onClose={closeDetails} />}
    </div>
  );
};

export default SmartFinder;
