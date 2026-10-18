import React from 'react';
import { TasteDomain, TasteAffinity } from '../types';
import { Music, Utensils, Shirt, Film } from 'lucide-react';

interface TasteProfileProps {
  tasteProfile: Record<TasteDomain, TasteAffinity[]>;
}

const DOMAIN_CONFIG: Record<
  TasteDomain,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  music: {
    label: 'Music & Sonic Identity',
    icon: Music,
    color: 'text-violet-400',
    bg: 'bg-violet-950/30',
    border: 'border-violet-800/40',
  },
  dining: {
    label: 'Dining, Venues & Nightlife',
    icon: Utensils,
    color: 'text-amber-400',
    bg: 'bg-amber-950/30',
    border: 'border-amber-800/40',
  },
  fashion: {
    label: 'Fashion & Aesthetic Style',
    icon: Shirt,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/30',
    border: 'border-emerald-800/40',
  },
  media: {
    label: 'Media, Zines & Culture',
    icon: Film,
    color: 'text-sky-400',
    bg: 'bg-sky-950/30',
    border: 'border-sky-800/40',
  },
};

export const TasteProfile: React.FC<TasteProfileProps> = ({ tasteProfile }) => {
  const domains: TasteDomain[] = ['music', 'dining', 'fashion', 'media'];
  const hasAffinities = domains.some((d) => tasteProfile[d] && tasteProfile[d].length > 0);

  if (!hasAffinities) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-100">Cross-Domain Audience Taste Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified cultural affinities surfaced across Qloo’s entity taste graph (Aggregate Subculture Analysis)
          </p>
        </div>
        <span className="text-[11px] font-semibold px-2 py-0.5 bg-brand-500/10 text-brand-300 border border-brand-500/30 rounded-lg">
          Qloo Multi-Hop Graph
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {domains.map((domain) => {
          const cfg = DOMAIN_CONFIG[domain];
          const Icon = cfg.icon;
          const affinities = tasteProfile[domain] || [];

          return (
            <div
              key={domain}
              className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border} space-y-3 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg bg-slate-900/60 ${cfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-200">{cfg.label}</h3>
                </div>

                <div className="space-y-2 mt-3">
                  {affinities.slice(0, 4).map((aff) => {
                    const scorePct = Math.round(aff.affinityScore * 100);
                    return (
                      <div key={aff.id} className="text-xs">
                        <div className="flex justify-between items-center text-slate-300 mb-1">
                          <span className="truncate pr-2 font-medium">{aff.name}</span>
                          <span className="font-mono text-[11px] font-bold text-slate-400 shrink-0">
                            {scorePct}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-950/80 rounded-full h-1 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-indigo-400 rounded-full"
                            style={{ width: `${scorePct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {affinities.length === 0 && (
                <div className="text-[11px] text-slate-500 italic py-2">
                  Inferring lifestyle signals...
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
