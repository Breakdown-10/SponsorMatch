import React, { useState } from 'react';
import { BrandCandidate, ConfidenceTier } from '../types';
import { Zap, ShieldCheck, Sparkles, Filter, Eye, Ban, ThumbsDown, Star } from 'lucide-react';

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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            HIGH CONF
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            MED CONF
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/20 text-slate-400 border border-slate-500/30">
            LOW CONF
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-100">
              Ranked Sponsor Matches ({filtered.length})
            </h2>
            <span className="text-[10px] font-semibold px-2 py-0.5 bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded-md">
              Lift Normalized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Log-scale popularity normalized against general brand fame to highlight genuine audience lift
          </p>
        </div>

        {/* Filter Switch */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterType('NON_OBVIOUS')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeFilter === 'NON_OBVIOUS'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Non-Obvious High-Lift ({candidates.filter((c) => !c.isObvious && c.status === 'VALIDATED').length})</span>
            </button>

            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Brands ({candidates.length})
            </button>

            <button
              onClick={() => setFilterType('OBVIOUS')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === 'OBVIOUS'
                  ? 'bg-slate-800 text-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
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
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
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
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((brand, idx) => {
              const isSelected = selectedBrandId === brand.id;
              const isExcluded = brand.status === 'EXCLUDED';

              return (
                <tr
                  key={brand.id}
                  onClick={() => onSelectBrand(brand)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-brand-950/50 hover:bg-brand-950/70 border-l-2 border-brand-500'
                      : isExcluded
                      ? 'bg-red-950/10 text-slate-500 hover:bg-red-950/20 opacity-60'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Brand & Category */}
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-slate-100 group-hover:text-brand-300 transition-colors flex items-center gap-1.5">
                      <span>{brand.name}</span>
                      {!brand.isObvious && brand.status === 'VALIDATED' && (
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{brand.category}</div>
                    {brand.statusReason && (
                      <div className="text-[10px] text-red-400 mt-0.5">{brand.statusReason}</div>
                    )}
                  </td>

                  {/* Lift Multiple */}
                  <td className="py-3.5 px-3">
                    <div className="inline-flex items-center gap-1 font-mono font-extrabold text-xs px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{brand.liftMultiple}x Lift</span>
                    </div>
                  </td>

                  {/* Raw Affinity */}
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-300">
                    {Math.round(brand.rawAffinity * 100)}%
                  </td>

                  {/* General Popularity */}
                  <td className="py-3.5 px-3 text-slate-400 font-mono">
                    {Math.round(brand.generalPopularity * 100)}%
                  </td>

                  {/* Classification */}
                  <td className="py-3.5 px-3">
                    {brand.isObvious ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        Obvious Giant
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
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
                        className="px-2.5 py-1 text-[11px] font-semibold bg-brand-600/80 hover:bg-brand-600 text-white rounded-lg flex items-center gap-1 shadow-sm transition-colors"
                        title="View custom CMO pitch letter & activations"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Pitch</span>
                      </button>

                      <button
                        onClick={() => onRejectBrand(brand)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
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
