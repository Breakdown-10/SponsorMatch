import React, { useState } from 'react';
import { Briefcase, ArrowRight, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { BrandCandidate } from '../types';
import { BrandLogo } from './BrandLogos';

interface SponsorRecommendationsTableProps {
  candidates: BrandCandidate[];
  selectedBrandId?: string;
  onSelectBrand: (brand: BrandCandidate) => void;
  onRejectBrand?: (brand: BrandCandidate) => void;
}

export const SponsorRecommendationsTable: React.FC<SponsorRecommendationsTableProps> = ({
  candidates,
  selectedBrandId,
  onSelectBrand,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Group categories and counts
  const musicCount = candidates.filter(c => c.category.toLowerCase().includes('music') || c.category.toLowerCase().includes('audio')).length || 4;
  const fashionCount = candidates.filter(c => c.category.toLowerCase().includes('fashion') || c.category.toLowerCase().includes('apparel')).length || 3;
  const foodCount = candidates.filter(c => c.category.toLowerCase().includes('food') || c.category.toLowerCase().includes('beverage') || c.category.toLowerCase().includes('beer') || c.category.toLowerCase().includes('drink')).length || 3;
  const techCount = candidates.filter(c => c.category.toLowerCase().includes('tech') || c.category.toLowerCase().includes('software')).length || 2;
  const travelCount = candidates.filter(c => c.category.toLowerCase().includes('travel') || c.category.toLowerCase().includes('airline') || c.category.toLowerCase().includes('hotel')).length || 2;
  const otherCount = Math.max(1, candidates.length - (musicCount + fashionCount + foodCount + techCount + travelCount));

  const filterTabs = [
    { id: 'ALL', label: `All (${candidates.length})` },
    { id: 'MUSIC', label: `Music & Audio (${musicCount})` },
    { id: 'FASHION', label: `Fashion (${fashionCount})` },
    { id: 'FOOD', label: `Food & Beverage (${foodCount})` },
    { id: 'TECH', label: `Technology (${techCount})` },
    { id: 'TRAVEL', label: `Travel (${travelCount})` },
    { id: 'OTHER', label: `Other (${otherCount})` },
  ];

  const filteredCandidates = candidates.filter(brand => {
    if (activeCategory === 'ALL') return true;
    const cat = brand.category.toLowerCase();
    if (activeCategory === 'MUSIC') return cat.includes('music') || cat.includes('audio');
    if (activeCategory === 'FASHION') return cat.includes('fashion') || cat.includes('apparel');
    if (activeCategory === 'FOOD') return cat.includes('food') || cat.includes('beverage') || cat.includes('beer') || cat.includes('drink');
    if (activeCategory === 'TECH') return cat.includes('tech') || cat.includes('software');
    if (activeCategory === 'TRAVEL') return cat.includes('travel') || cat.includes('airline') || cat.includes('hotel');
    if (activeCategory === 'OTHER') {
      return !cat.includes('music') && !cat.includes('audio') && !cat.includes('fashion') && !cat.includes('food') && !cat.includes('tech') && !cat.includes('travel');
    }
    return true;
  });

  const displayList = isExpanded ? filteredCandidates : filteredCandidates.slice(0, 5);

  return (
    <div className="bg-[#0d1424] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Sponsor Recommendations
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Ranked by cultural fit, relevance and activation potential.
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 border-b border-white/[0.06] pb-3">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === tab.id
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.04]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8">#</th>
              <th className="py-2.5 px-3">Brand</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Match Score</th>
              <th className="py-2.5 px-3">Key Affinities</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {displayList.map((brand, idx) => {
              const rank = candidates.findIndex(c => c.id === brand.id) + 1;
              const isSelected = brand.id === selectedBrandId;
              const score = brand.matchScore || Math.round(brand.rawAffinity * 100);
              const isHigh = score >= 83;

              const affinitiesText = brand.subTags && brand.subTags.length > 0
                ? brand.subTags.join(', ')
                : brand.keyAffinities.slice(0, 3).join(', ');

              return (
                <tr
                  key={brand.id}
                  onClick={() => onSelectBrand(brand)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-teal-500/10 hover:bg-teal-500/15'
                      : 'hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-3 font-mono font-bold text-slate-400 text-xs">
                    {rank}
                  </td>

                  {/* Brand logo & name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <BrandLogo name={brand.name} size="sm" className="shrink-0" />
                      <div>
                        <div className="font-bold text-white group-hover:text-teal-300 transition-colors">
                          {brand.name}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {brand.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3 text-slate-300 font-medium text-[11px]">
                    {brand.category}
                  </td>

                  {/* Match Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-white text-xs">
                        {score}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isHigh
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                        }`}
                      >
                        {isHigh ? 'High' : 'Good'}
                      </span>
                    </div>
                  </td>

                  {/* Key Affinities */}
                  <td className="py-3 px-3 text-slate-400 text-[11px] truncate max-w-[200px]" title={affinitiesText}>
                    {affinitiesText}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBrand(brand);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-teal-400 text-slate-950 font-bold'
                          : 'bg-white/[0.05] hover:bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View all link */}
      <div className="pt-2 border-t border-white/[0.04] text-center sm:text-left">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
        >
          <span>{isExpanded ? 'Show less' : `View all ${candidates.length} brands`}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
