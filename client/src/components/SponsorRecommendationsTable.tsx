import React, { useState, useMemo } from 'react';
import { Briefcase, ArrowRight, Eye, ChevronDown, ChevronUp, ThumbsDown, Flame, Crown, Sparkles } from 'lucide-react';
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
  onRejectBrand,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'NON_OBVIOUS' | 'OBVIOUS'>('ALL');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Dynamically group categories and counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    candidates.forEach((c) => {
      const cat = c.category || 'Other';
      const mainCat = cat.split('/')[0].split('&')[0].trim();
      counts[mainCat] = (counts[mainCat] || 0) + 1;
    });
    return counts;
  }, [candidates]);

  const nonObviousCount = useMemo(
    () => candidates.filter((c) => !c.isObvious && c.liftMultiple >= 1.2).length,
    [candidates]
  );
  const obviousCount = useMemo(
    () => candidates.filter((c) => c.isObvious).length,
    [candidates]
  );

  // Filter tabs dynamically based on top candidate categories
  const filterTabs = useMemo(() => {
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        id: name.toUpperCase(),
        label: `${name} (${count})`,
        matchKey: name.toLowerCase(),
      }));

    return [
      { id: 'ALL', label: `All (${candidates.length})`, matchKey: '' },
      ...topCategories,
    ];
  }, [categoryCounts, candidates.length]);

  const filteredCandidates = useMemo(() => {
    return candidates.filter((brand) => {
      // Category filter
      if (activeCategory !== 'ALL') {
        const cat = brand.category.toLowerCase();
        const activeTab = filterTabs.find((t) => t.id === activeCategory);
        if (activeTab && activeTab.matchKey && !cat.includes(activeTab.matchKey)) {
          return false;
        }
      }

      // Tier filter (Obvious vs Non-Obvious High-Lift)
      if (tierFilter === 'NON_OBVIOUS') {
        return !brand.isObvious && brand.liftMultiple >= 1.2;
      }
      if (tierFilter === 'OBVIOUS') {
        return brand.isObvious;
      }

      return true;
    });
  }, [candidates, activeCategory, tierFilter, filterTabs]);

  const displayList = isExpanded ? filteredCandidates : filteredCandidates.slice(0, 5);

  return (
    <div className="bg-[#0d1424] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header & Tier Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
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
            Evidence-grounded via Qloo taste graph • Ranked by cultural lift and audience alignment.
          </p>
        </div>

        {/* Tier Mode Selector (F8 / Non-Obvious High-Lift Filter) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#090e1a] border border-white/[0.08]">
          <button
            onClick={() => setTierFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              tierFilter === 'ALL'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({candidates.length})
          </button>
          <button
            onClick={() => setTierFilter('NON_OBVIOUS')}
            title="Brands with high audience lift (>1.20x) that plain LLMs miss"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              tierFilter === 'NON_OBVIOUS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-amber'
                : 'text-amber-400/80 hover:text-amber-300 hover:bg-white/[0.04]'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Non-Obvious Gems ({nonObviousCount})</span>
          </button>
          <button
            onClick={() => setTierFilter('OBVIOUS')}
            title="Omnipresent global mega-brands"
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              tierFilter === 'OBVIOUS'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-blue-400" />
            <span>Category Giants ({obviousCount})</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
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
              <th className="py-2.5 px-3">Affinity & Lift</th>
              <th className="py-2.5 px-3">Key Taste Anchors</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {displayList.map((brand) => {
              const rank = candidates.findIndex((c) => c.id === brand.id) + 1;
              const isSelected = brand.id === selectedBrandId;
              const score = brand.matchScore || Math.round(brand.rawAffinity * 100);
              const isHigh = score >= 83;
              const isHighLift = !brand.isObvious && brand.liftMultiple >= 1.2;

              const affinitiesText =
                brand.subTags && brand.subTags.length > 0
                  ? brand.subTags.join(', ')
                  : brand.keyAffinities?.slice(0, 3).join(', ') || 'High cross-domain resonance';

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
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white group-hover:text-teal-300 transition-colors">
                            {brand.name}
                          </span>
                          {isHighLift && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              High Lift
                            </span>
                          )}
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

                  {/* Affinity & Lift */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-white text-xs">
                          {score}%
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isHigh
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-teal-500/15 text-teal-400 border border-teal-500/30'
                          }`}
                        >
                          {isHigh ? 'High' : 'Good'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <span className="text-cyan-400 font-bold">{brand.liftMultiple}x</span>
                        <span>Lift</span>
                        {brand.isObvious ? (
                          <span className="text-[9px] text-slate-500">• Giant</span>
                        ) : isHighLift ? (
                          <span className="text-[9px] text-amber-400 font-bold">• Gem</span>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  {/* Key Affinities */}
                  <td
                    className="py-3 px-3 text-slate-400 text-[11px] truncate max-w-[200px]"
                    title={affinitiesText}
                  >
                    {affinitiesText}
                  </td>

                  {/* Actions: View Pitch + Reject / Feedback (F10) */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
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
                        View Pitch
                      </button>
                      {onRejectBrand && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRejectBrand(brand);
                          }}
                          title="Reject or add exclusivity constraint (Feature F10)"
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
          <span>
            {isExpanded
              ? 'Show less'
              : `View all ${filteredCandidates.length} ${
                  tierFilter !== 'ALL' ? 'filtered ' : ''
                }brands`}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
