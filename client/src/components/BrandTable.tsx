import React, { useState } from 'react';
import { BrandCandidate, ConfidenceTier } from '../types';
import { Zap, ShieldCheck, Sparkles, Filter, Eye, ThumbsDown, Star } from 'lucide-react';

interface BrandTableProps {
  candidates: BrandCandidate[];
  selectedBrandId?: string;
  onSelectBrand: (brand: BrandCandidate) => void;
  onRejectBrand: (brand: BrandCandidate) => void;
}

export const BrandTable: React.FC<BrandTableProps> = ({
  candidates,
  selectedBrandId,
  onSelectBrand,
  onRejectBrand,
}) => {
  const nonObviousMatches = candidates.filter((c) => !c.isObvious && c.status === 'VALIDATED');
  const [filterType, setFilterType] = useState<'ALL' | 'NON_OBVIOUS' | 'OBVIOUS'>('NON_OBVIOUS');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback to ALL if current cohort has 0 non-obvious candidates
  const activeFilter = filterType === 'NON_OBVIOUS' && nonObviousMatches.length === 0 ? 'ALL' : filterType;

  const filtered = candidates.filter((brand) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        brand.name.toLowerCase().includes(q) ||
        brand.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Obvious vs Non-Obvious Filter
    if (activeFilter === 'NON_OBVIOUS') {
      return !brand.isObvious && brand.status === 'VALIDATED';
    }
    if (activeFilter === 'OBVIOUS') {
      return brand.isObvious;
    }
    return true;
  });

  const getConfidenceBadge = (confidence: ConfidenceTier) => {
    switch (confidence) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
            <ShieldCheck className="w-3 h-3" />
            HIGH CONF
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 font-mono">
            MED CONF
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20 font-mono">
            LOW CONF
          </span>
        );
    }
  };

  return (
    <div className="bg-[#101116] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4">
      {/* Header and Capsule Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Ranked Sponsor Matches ({filtered.length})
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-md">
              Lift Normalized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Log-scale popularity normalized against general brand fame to highlight genuine audience lift
          </p>
        </div>

        {/* Posh Capsule Segmented Filter Switch */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-[#0A0B10] border border-white/[0.08] text-xs">
            <button
              onClick={() => setFilterType('NON_OBVIOUS')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeFilter === 'NON_OBVIOUS'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Non-Obvious High-Lift ({candidates.filter((c) => !c.isObvious && c.status === 'VALIDATED').length})</span>
            </button>

            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Brands ({candidates.length})
            </button>

            <button
              onClick={() => setFilterType('OBVIOUS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === 'OBVIOUS'
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Obvious Staples ({candidates.filter((c) => c.isObvious).length})
            </button>
          </div>
        </div>
      </div>

      {/* Brand Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] bg-[#0A0B10]/70 text-slate-400 font-mono uppercase text-[10px]">
              <th className="py-3 px-3">#</th>
              <th className="py-3 px-3">Brand & Category</th>
              <th className="py-3 px-3">Cultural Lift Ratio</th>
              <th className="py-3 px-3">Raw Affinity</th>
              <th className="py-3 px-3">Omnipresence</th>
              <th className="py-3 px-3">Classification</th>
              <th className="py-3 px-3">Confidence</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map((brand, idx) => {
              const isSelected = selectedBrandId === brand.id;
              const isExcluded = brand.status === 'EXCLUDED';

              return (
                <tr
                  key={brand.id}
                  onClick={() => onSelectBrand(brand)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-950/25 hover:bg-cyan-950/35 border-l-2 border-l-cyan-400'
                      : isExcluded
                      ? 'bg-red-950/10 text-slate-500 hover:bg-red-950/20 opacity-50'
                      : 'hover:bg-[#14151E]'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Brand & Category */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span>{brand.name}</span>
                      {!brand.isObvious && brand.status === 'VALIDATED' && (
                        <Star className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{brand.category}</div>
                    {brand.statusReason && (
                      <div className="text-[10px] text-red-400 mt-0.5">{brand.statusReason}</div>
                    )}
                  </td>

                  {/* Lift Multiple */}
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1 font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <span>{brand.liftMultiple}x Lift</span>
                    </div>
                  </td>

                  {/* Raw Affinity */}
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-200">
                    {Math.round(brand.rawAffinity * 100)}%
                  </td>

                  {/* General Popularity */}
                  <td className="py-3.5 px-3 text-slate-400 font-mono">
                    {Math.round(brand.generalPopularity * 100)}%
                  </td>

                  {/* Classification */}
                  <td className="py-3.5 px-3">
                    {brand.isObvious ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                        Obvious Giant
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        Non-Obvious Fit
                      </span>
                    )}
                  </td>

                  {/* Confidence */}
                  <td className="py-3.5 px-3">{getConfidenceBadge(brand.confidence)}</td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectBrand(brand)}
                        className="px-3 py-1 text-[11px] font-black bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black rounded-lg flex items-center gap-1 shadow-glow-cyan transition-all"
                        title="View custom CMO pitch letter & activations"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Pitch</span>
                      </button>

                      <button
                        onClick={() => onRejectBrand(brand)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Reject brand (Triggers closed-loop re-ranking)"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No brand candidates match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
