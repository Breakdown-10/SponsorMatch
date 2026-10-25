import React from 'react';

interface BrandLogoProps {
  name: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ name, className = '', size = 'md' }) => {
  const n = (name || '').toLowerCase();
  
  const dim = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';
  const imgDim = size === 'sm' ? 24 : size === 'lg' ? 56 : 40;

  // 1. Red Bull
  if (n.includes('red bull')) {
    return (
      <div className={`flex items-center justify-center ${dim} ${className}`}>
        <svg viewBox="0 0 100 60" className="w-full h-full">
          {/* Yellow sun in center */}
          <circle cx="50" cy="30" r="16" fill="#FBBF24" />
          {/* Left Charging Bull */}
          <path
            d="M 15,35 Q 24,18 36,24 Q 45,28 48,34 Q 40,36 34,40 Q 22,44 15,35 Z"
            fill="#DC2626"
          />
          <path d="M 45,22 Q 48,16 43,14 Q 40,18 43,24 Z" fill="#FBBF24" />
          {/* Right Charging Bull */}
          <path
            d="M 85,35 Q 76,18 64,24 Q 55,28 52,34 Q 60,36 66,40 Q 78,44 85,35 Z"
            fill="#DC2626"
          />
          <path d="M 55,22 Q 52,16 57,14 Q 60,18 57,24 Z" fill="#FBBF24" />
        </svg>
      </div>
    );
  }

  // 2. Spotify
  if (n.includes('spotify')) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-[#1DB954] p-1.5 ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" fill="white" className="w-full h-full">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.306c-.217.356-.677.469-1.033.252-2.83-1.728-6.393-2.119-10.589-1.162-.406.093-.812-.162-.905-.568-.093-.406.162-.812.568-.905 4.582-1.047 8.527-.604 11.707 1.35.356.217.469.677.252 1.033zm1.467-3.262c-.274.444-.855.586-1.299.312-3.239-1.99-8.176-2.566-12.006-1.403-.5.152-1.031-.133-1.183-.633-.152-.5.133-1.031.633-1.183 4.382-1.33 9.816-.689 13.543 1.605.444.274.586.855.312 1.299zm.126-3.41c-3.885-2.307-10.29-2.52-14.004-1.392-.596.181-1.228-.157-1.409-.753-.181-.596.157-1.228.753-1.409 4.267-1.295 11.336-1.047 15.807 1.608.536.318.712 1.011.394 1.547-.318.536-1.011.712-1.541.399z" />
        </svg>
      </div>
    );
  }

  // 3. Uniqlo
  if (n.includes('uniqlo')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-[#E60012] text-white font-extrabold tracking-tighter ${dim} ${className}`}>
        <div className="flex flex-col text-[10px] leading-[9px] text-center font-mono font-black">
          <span>UNI</span>
          <span>QLO</span>
        </div>
      </div>
    );
  }

  // 4. Heineken
  if (n.includes('heineken')) {
    return (
      <div className={`flex items-center justify-center rounded-full bg-[#007A33] border border-emerald-400/30 p-1 ${dim} ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <polygon points="12,2 15,9 22,9 16.5,14 18.5,21 12,17 5.5,21 7.5,14 2,9 9,9" fill="#DC2626" />
        </svg>
      </div>
    );
  }

  // 5. Adobe
  if (n.includes('adobe')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-[#FA0F00] p-1.5 ${dim} ${className}`}>
        <svg viewBox="0 0 30 26" fill="white" className="w-full h-full">
          <polygon points="19,0 30,0 30,26" />
          <polygon points="11,0 0,0 0,26" />
          <polygon points="15,9 21,26 17,26 15,20 11,20" />
        </svg>
      </div>
    );
  }

  // 6. Pioneer DJ
  if (n.includes('pioneer')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-black border border-white/20 p-1 text-white font-black text-[9px] font-mono ${dim} ${className}`}>
        DJ
      </div>
    );
  }

  // 7. Teenage Engineering
  if (n.includes('teenage')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-neutral-900 border border-neutral-700 p-1 text-neutral-200 font-mono font-bold text-[9px] ${dim} ${className}`}>
        <span className="text-orange-500 mr-0.5">•</span>te
      </div>
    );
  }

  // 8. Patagonia
  if (n.includes('patagonia')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-indigo-950 border border-indigo-500/30 text-cyan-400 font-serif italic font-bold text-[10px] ${dim} ${className}`}>
        pat
      </div>
    );
  }

  // 9. Club-Mate
  if (n.includes('club-mate') || n.includes('mate')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-amber-950/80 border border-amber-600/40 text-amber-300 font-bold text-[10px] ${dim} ${className}`}>
        CM
      </div>
    );
  }

  // 10. Polestar
  if (n.includes('polestar')) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-white font-bold text-xs ${dim} ${className}`}>
        ✦
      </div>
    );
  }

  // Generic stylish monogram fallback
  const initials = name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 text-teal-400 font-bold text-xs shadow-sm ${dim} ${className}`}
    >
      {initials || '★'}
    </div>
  );
};
