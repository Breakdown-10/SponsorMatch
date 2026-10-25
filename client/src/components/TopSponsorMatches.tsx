import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BrandCandidate } from '../types';
import { BrandLogo } from './BrandLogos';

interface TopSponsorMatchesProps {
  candidates: BrandCandidate[];
  selectedBrandId?: string;
  onSelectBrand: (brand: BrandCandidate) => void;
  onViewAllMatches?: () => void;
}

export const TopSponsorMatches: React.FC<TopSponsorMatchesProps> = ({
  candidates,
  selectedBrandId,
  onSelectBrand,
  onViewAllMatches,
}) => {
  // Take top 5 candidates
  const top5 = candidates.slice(0, 5);

  return (
    <section id="sponsor-matches-section" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
              <Sparkles className="w-3.5 h-3.5 fill-teal-400" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Top Sponsor Matches
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            AI-powered recommendations based on cultural affinities from Qloo.
          </p>
        </div>

        <button
          onClick={onViewAllMatches}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors self-start sm:self-auto"
        >
          <span>View All Matches</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 5 Horizontal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {top5.map((brand, idx) => {
          const rank = idx + 1;
          const isSelected = brand.id === selectedBrandId || (!selectedBrandId && idx === 0);
          const score = brand.matchScore || Math.round(brand.rawAffinity * 100);

          // Sub-tags fallback
          const subTags = brand.subTags && brand.subTags.length > 0
            ? brand.subTags
            : brand.keyAffinities.slice(0, 3);

          const tagline = brand.tagline || (
            brand.name.toLowerCase().includes('red bull')
              ? 'Powering the next generation of cultural innovators.'
              : brand.name.toLowerCase().includes('spotify')
              ? 'Bring your sound to life — beyond the stage.'
              : brand.name.toLowerCase().includes('uniqlo')
              ? 'Style meets culture, on and off the stage.'
              : brand.name.toLowerCase().includes('heineken')
              ? 'Good music. Great moments. Together.'
              : brand.name.toLowerCase().includes('adobe')
              ? 'Empowering creators, shaping what\'s next.'
              : `High cultural alignment with ${brand.category}.`
          );

          return (
            <div
              key={brand.id}
              onClick={() => onSelectBrand(brand)}
              className={`relative rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none ${
                isSelected
                  ? 'bg-[#0e1628] border-2 border-amber-400/90 shadow-[0_0_22px_rgba(251,191,36,0.18)] ring-1 ring-amber-400/40'
                  : 'bg-[#0d1424] border border-white/[0.08] hover:border-teal-500/40 hover:bg-[#11192e]'
              }`}
            >
              {/* Top Row: Rank Badge */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    rank === 1
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'
                  }`}
                >
                  #{rank}
                </span>
              </div>

              {/* Center Brand Identity */}
              <div className="flex flex-col items-center text-center space-y-2 my-1">
                <BrandLogo name={brand.name} size="md" className="shrink-0" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {brand.name}
                </h3>

                {/* Match Score */}
                <div className="flex items-center justify-between w-full px-1 text-xs pt-1 border-t border-white/[0.05]">
                  <span className="text-[11px] text-slate-400 font-medium">Match Score</span>
                  <span className="font-mono font-bold text-white text-xs">
                    <span className="text-sm">{score}</span>
                    <span className="text-slate-400 font-normal">/100</span>
                  </span>
                </div>

                {/* Category Pill */}
                <div className="w-full">
                  <span className="inline-block w-full truncate px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#162138] text-indigo-300 border border-indigo-500/20">
                    {brand.category}
                  </span>
                </div>

                {/* Sub-tags */}
                <div className="flex flex-wrap justify-center gap-1 w-full pt-0.5">
                  {subTags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/[0.04] text-slate-300 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Tagline / Value Proposition */}
                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 min-h-[2rem] pt-1 text-center font-normal">
                  {tagline}
                </p>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-3 mt-1 border-t border-white/[0.05]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBrand(brand);
                  }}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
                      : 'bg-white/[0.03] hover:bg-teal-500/10 text-slate-300 hover:text-teal-300 border border-white/[0.08] hover:border-teal-500/30'
                  }`}
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
