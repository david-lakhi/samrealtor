import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bath, Bed, Car, Check, ChevronLeft, ChevronRight, Image as ImageIcon, MapPin, Video } from 'lucide-react';
import type { Property } from '../types/property';
import { formatPrice, getPropertyImages, getPropertyVideos } from '../types/property';

interface PropertyDetailsProps {
  property: Property;
  preview?: boolean;
}

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, preview = false }) => {
  const images = getPropertyImages(property);
  const videos = getPropertyVideos(property);
  const [activeImage, setActiveImage] = useState(0);
  const [activeMedia, setActiveMedia] = useState<'photos' | 'videos'>('photos');
  const touchStartX = useRef<number | null>(null);
  const propertyUrl = `${window.location.origin}/property/${encodeURIComponent(property.id)}`;
  const whatsappMessage = `Hi Sam, I'm interested in ${property.title || 'this property'}. Listing: ${propertyUrl}`;
  const whatsappUrl = `https://wa.me/918847024002?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    setActiveImage(0);
    setActiveMedia(images.length === 0 && videos.length > 0 ? 'videos' : 'photos');
  }, [property.id, images.length, videos.length]);

  const moveImage = (direction: number) => {
    setActiveImage((current) => (current + direction + images.length) % images.length);
  };

  return (
    <article className={`overflow-hidden rounded-2xl border border-gray-700 bg-gray-800/60 text-white ${preview ? '' : 'shadow-2xl shadow-black/20'}`}>
      {preview && <div className="border-b border-gray-700 px-5 py-4"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Live listing preview</p><p className="mt-1 text-sm text-gray-400">This is how the property details page will look.</p></div>}
      <div className={preview ? 'p-4' : 'p-5 sm:p-8 lg:p-10'}>
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">{property.propertyType || 'Property'}</span>
        </div>

        <div className={preview ? 'grid gap-5' : 'grid gap-8 lg:grid-cols-[1.2fr_0.8fr]'}>
          <div className="min-w-0">
            <div className="mb-3 flex gap-2 rounded-lg bg-gray-900/60 p-1" role="tablist" aria-label="Property media">
              <button type="button" role="tab" aria-selected={activeMedia === 'photos'} onClick={() => setActiveMedia('photos')} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeMedia === 'photos' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}><ImageIcon className="h-4 w-4" />Photos <span className="text-xs opacity-75">{images.length}</span></button>
              <button type="button" role="tab" aria-selected={activeMedia === 'videos'} onClick={() => setActiveMedia('videos')} className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeMedia === 'videos' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}><Video className="h-4 w-4" />Videos <span className="text-xs opacity-75">{videos.length}</span></button>
            </div>
            {activeMedia === 'photos' ? <>
              <div
                className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 via-slate-800 to-cyan-950 ${preview ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}
                onTouchStart={(event) => { touchStartX.current = event.changedTouches[0]?.clientX ?? null; }}
                onTouchEnd={(event) => {
                  if (touchStartX.current === null || images.length < 2) return;
                  const delta = event.changedTouches[0].clientX - touchStartX.current;
                  if (Math.abs(delta) > 45) moveImage(delta < 0 ? 1 : -1);
                  touchStartX.current = null;
                }}
              >
                {images[activeImage] ? <img className="absolute inset-0 h-full w-full object-cover" src={images[activeImage]} alt={`${property.title || 'Property'} photo ${activeImage + 1}`} /> : <div className="flex flex-col items-center gap-2 text-center text-gray-500"><ImageIcon className="h-8 w-8" /><span className="text-sm">No photos added yet</span><span className="text-xs">Upload property photos to preview them here.</span></div>}
                {images.length > 1 && <>
                  <button type="button" onClick={() => moveImage(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-gray-950/70 p-2 text-white shadow-lg backdrop-blur transition-colors hover:bg-cyan-500"><ChevronLeft className="h-5 w-5" /></button>
                  <button type="button" onClick={() => moveImage(1)} aria-label="Next photo" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-gray-950/70 p-2 text-white shadow-lg backdrop-blur transition-colors hover:bg-cyan-500"><ChevronRight className="h-5 w-5" /></button>
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-gray-950/70 px-2.5 py-2" aria-label={`Photo ${activeImage + 1} of ${images.length}`}>
                    {images.map((_, index) => <button key={index} type="button" onClick={() => setActiveImage(index)} aria-label={`Go to photo ${index + 1}`} aria-current={index === activeImage ? 'true' : undefined} className={`h-1.5 rounded-full transition-all ${index === activeImage ? 'w-5 bg-cyan-300' : 'w-1.5 bg-white/60 hover:bg-white'}`} />)}
                  </div>
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs text-white">{activeImage + 1} / {images.length}</span>
                </>}
              </div>
              {images.length > 1 && <div className="mt-3 grid grid-cols-5 gap-2">{images.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => setActiveImage(index)} aria-label={`Show photo ${index + 1}`} className={`aspect-square overflow-hidden rounded-lg border-2 ${index === activeImage ? 'border-cyan-400' : 'border-transparent opacity-70 hover:opacity-100'}`}><img src={src} alt="" className="h-full w-full object-cover" /></button>)}</div>}
            </> : videos.length > 0 ? <div className="space-y-3">{videos.map((src, index) => <video key={`${src}-${index}`} className={`w-full rounded-xl border border-gray-700 bg-black ${preview ? 'max-h-56' : 'max-h-[32rem]'}`} controls preload="metadata" src={src} aria-label={`${property.title || 'Property'} video ${index + 1}`}>Your browser does not support video playback.</video>)}</div> : <div className={`flex flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-gray-900 via-slate-800 to-cyan-950 text-center text-gray-500 ${preview ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}><Video className="h-8 w-8" /><span className="text-sm">No videos added yet</span><span className="text-xs">Upload a property video to preview it here.</span></div>}
          </div>

          <div className="flex flex-col">
            <h1 className={`${preview ? 'text-2xl' : 'text-3xl sm:text-4xl'} font-bold leading-tight`}>{property.title || 'Your property title'}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-400"><MapPin className="h-4 w-4 shrink-0 text-cyan-300" />{[property.location, property.city].filter(Boolean).join(', ') || 'Area, city'}</p>
            <p className={`${preview ? 'mt-5 text-2xl' : 'mt-7 text-3xl'} font-bold text-cyan-300`}>{formatPrice(property.price)}<span className="ml-2 text-sm font-normal text-gray-400">{property.area || 'Area'}</span></p>

            <div className={`mt-5 grid ${property.propertyType?.toLowerCase() === 'commercial' ? 'grid-cols-1' : 'grid-cols-3'} gap-2 rounded-xl border border-gray-700 bg-gray-900/40 p-3 text-center`}>
              {property.propertyType?.toLowerCase() !== 'commercial' && <>
                <div className="flex flex-col items-center gap-1 text-gray-300"><Bed className="h-4 w-4 text-cyan-300" /><span className="text-sm">{property.bedrooms || '—'} beds</span></div>
                <div className="flex flex-col items-center gap-1 text-gray-300"><Bath className="h-4 w-4 text-cyan-300" /><span className="text-sm">{property.bathrooms || '—'} baths</span></div>
              </>}
              <div className="flex flex-col items-center gap-1 text-gray-300"><Car className="h-4 w-4 text-cyan-300" /><span className="text-sm">{property.parking || '—'} parking</span></div>
            </div>

            {property.description && <section className="mt-6"><h2 className="mb-2 text-base font-semibold">About this property</h2><p className="whitespace-pre-line text-sm leading-relaxed text-gray-300">{property.description}</p></section>}
            {property.features?.length > 0 && <section className="mt-6"><h2 className="mb-3 text-base font-semibold">Highlights</h2><ul className="grid gap-2 sm:grid-cols-2">{property.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-gray-300"><Check className="h-4 w-4 shrink-0 text-emerald-400" />{feature}</li>)}</ul></section>}
            {!preview && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-semibold text-white transition-shadow hover:shadow-lg hover:shadow-green-500/20">Enquire on WhatsApp</a>}
          </div>
        </div>
      </div>
    </article>
  );
};

export const PropertyDetailsPage: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`/api/properties/${encodeURIComponent(propertyId)}`);
        if (!response.ok) throw new Error(response.status === 404 ? 'This property could not be found.' : 'Property details are unavailable.');
        setProperty(await response.json());
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Property details are unavailable.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [propertyId]);

  return <main className="min-h-screen bg-gray-900 px-4 py-8 text-white sm:px-6 lg:py-12"><div className="mx-auto max-w-6xl">{loading ? <p className="text-gray-400">Loading property…</p> : property ? <><a href="/#smart-finder" className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-cyan-300"><ArrowLeft className="h-4 w-4" />Back to search</a><PropertyDetails property={property} /></> : <div className="rounded-2xl border border-gray-700 bg-gray-800/40 p-8 text-center"><p className="mb-5 text-gray-300">{error || 'Property details are unavailable.'}</p><a href="/#smart-finder" className="text-cyan-300 hover:text-cyan-200">Back to search</a></div>}</div></main>;
};
