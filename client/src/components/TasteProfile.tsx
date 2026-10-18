import React from 'react';
import { TasteDomain, TasteAffinity } from '../types';
import { Music, Utensils, Shirt, Film, Sparkles } from 'lucide-react';

interface TasteProfileProps {
  tasteProfile: Record<TasteDomain, TasteAffinity[]>;
}

const DOMAIN_CONFIG: Record<
  TasteDomain,
  { label: string; icon: React.ElementType; color: string; badgeBg: string }
> = {
  music: {
    label: 'Music & Sonic Identity',
    icon: Music,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  },
  dining: {
    label: 'Dining, Venues & Nightlife',
    icon: Utensils,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  },
  fashion: {
    label: 'Fashion & Aesthetic Style',
    icon: Shirt,
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  },
  media: {
    label: 'Media, Zines & Culture',
    icon: Film,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  },
};

export const TasteProfile: React.FC<TasteProfileProps> = ({ tasteProfile }) => {
  const domains: TasteDomain[] = ['music', 'dining', 'fashion', 'media'];
  const hasAffinities = domains.some((d) => tasteProfile[d] && tasteProfile[d].length > 0);

  if (!hasAffinities) return null;

  return (
    <div className="bg-[#101116] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-glow" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Cross-Domain Audience Taste Profile
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verified cultural affinities surfaced across Qloo’s entity taste graph (Aggregate Subculture Analysis)
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-lg self-start sm:self-auto">
          Qloo Multi-Hop Graph
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {domains.map((dom) => {
          const cfg = DOMAIN_CONFIG[dom];
          const affinities = tasteProfile[dom] || [];
          const Icon = cfg.icon;

          return (
            <div
              key={dom}
              className="bg-[#14151E] border border-white/[0.08] hover:border-cyan-500/30 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                    <h3 className="text-xs font-bold text-white">{cfg.label}</h3>
                  </div>
                </div>

                <div className="space-y-2.5 mt-3">
                  {affinities.slice(0, 4).map((aff, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 truncate max-w-[170px]" title={aff.name}>
                          {aff.name}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-cyan-400">
                          {Math.round(aff.affinityScore * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#0A0B10] h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
                          style={{ width: `${Math.round(aff.affinityScore * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {affinities.length === 0 && (
                <div className="text-[11px] text-slate-500 py-4 text-center italic">
                  Thin domain signals
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
