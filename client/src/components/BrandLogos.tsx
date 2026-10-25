import React, { useState } from 'react';

interface BrandLogoProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Brand domain lookup table for accurate icon retrieval from the web
const BRAND_DOMAINS: Record<string, string> = {
  'red bull': 'redbull.com',
  'spotify': 'spotify.com',
  'uniqlo': 'uniqlo.com',
  'heineken': 'heineken.com',
  'adobe': 'adobe.com',
  'pioneer dj': 'pioneerdj.com',
  'pioneer dj / alphatheta': 'pioneerdj.com',
  'alphatheta': 'alphatheta.com',
  'teenage engineering': 'teenage.engineering',
  'ableton': 'ableton.com',
  'patagonia': 'patagonia.com',
  'acne studios': 'acnestudios.com',
  'club-mate': 'club-mate.de',
  'oatly': 'oatly.com',
  'polestar': 'polestar.com',
  'vueling': 'vueling.com',
  'vueling airlines': 'vueling.com',
  'w hotels': 'marriott.com',
  'w hotels barcelona': 'marriott.com',
  'liquid death': 'liquiddeath.com',
  'topo chico': 'topochico.com',
  'aesop': 'aesop.com',
  'dr. martens': 'drmartens.com',
  'fender': 'fender.com',
  'subaru': 'subaru.com',
  'roland': 'roland.com',
  'stumptown': 'stumptowncoffee.com',
  'maurten': 'maurten.com',
  'on running': 'on.com',
  'whoop': 'whoop.com',
  'garmin': 'garmin.com',
  'coros': 'coros.com',
  'gatorade': 'gatorade.com',
  'nike': 'nike.com',
  'hyperice': 'hyperice.com',
  'nuun': 'nuunlife.com',
  'athletic brewing': 'athleticbrewing.com',
  'sonos': 'sonos.com',
  'sennheiser': 'sennheiser.com',
  'native instruments': 'native-instruments.com',
  'apple': 'apple.com',
  'bose': 'bose.com',
  'sony': 'sony.com',
  'marshall': 'marshall.com',
  'oakley': 'oakley.com',
  'ray-ban': 'ray-ban.com',
  'gucci': 'gucci.com',
  'prada': 'prada.com',
  'lululemon': 'lululemon.com',
  'arcteryx': 'arcteryx.com',
  'the north face': 'thenorthface.com',
  'salomon': 'salomon.com',
  'hoka': 'hoka.com',
  'asics': 'asics.com',
  'brooks': 'brooksrunning.com',
  'strava': 'strava.com',
};

export function resolveBrandDomain(brandName: string): string {
  const clean = (brandName || '').toLowerCase().trim();

  // 1. Direct dictionary match
  if (BRAND_DOMAINS[clean]) return BRAND_DOMAINS[clean];

  // 2. Substring match
  for (const [key, domain] of Object.entries(BRAND_DOMAINS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return domain;
    }
  }

  // 3. Dynamic generic derivation
  const stripped = clean
    .replace(/\b(inc|corp|corporation|co|company|ltd|llc|group|brand|brands|audio|wearables|recovery|electronics|instruments|software|apparel|beverage|drink|drinks|running)\b/gi, '')
    .trim()
    .replace(/[^a-z0-9]/g, '');

  return `${stripped || 'generic'}.com`;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ name, className = '', size = 'md' }) => {
  const [tier, setTier] = useState<number>(1);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const domain = resolveBrandDomain(name);

  // Sizing dimensions
  const containerDim = size === 'sm' ? 'w-8 h-8 rounded-xl' : size === 'lg' ? 'w-14 h-14 rounded-2xl' : 'w-12 h-12 rounded-2xl';
  const padding = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-2' : 'p-2';

  // Primary URL (unavatar.io fetches official SVG/PNG from clearbit, twitter, duckduckgo, etc.)
  const primaryUrl = `https://unavatar.io/${domain}?fallback=false`;
  // Secondary URL (Google 128px high-res favicon)
  const secondaryUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const currentSrc = tier === 1 ? primaryUrl : tier === 2 ? secondaryUrl : null;

  const handleImageError = () => {
    if (tier === 1) {
      setTier(2);
    } else {
      setTier(3); // Fallback to styled monogram
    }
  };

  // Monogram initials fallback
  const initials = (name || '')
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 bg-[#121929] border border-white/[0.09] shadow-sm overflow-hidden select-none ${containerDim} ${padding} ${className}`}
    >
      {currentSrc && (
        <img
          src={currentSrc}
          alt={name}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}

      {/* Fallback Monogram when image is loading or failed */}
      {(!imageLoaded || tier === 3) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a233a] to-[#0e1628] text-teal-400 font-extrabold text-xs">
          <span>{initials || '★'}</span>
        </div>
      )}
    </div>
  );
};
