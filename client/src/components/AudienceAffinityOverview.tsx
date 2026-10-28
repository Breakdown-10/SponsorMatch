import React, { useMemo } from 'react';
import {
  Compass,
  Music,
  ShoppingBag,
  Coffee,
  Laptop,
  Plane,
  Zap,
  Activity,
  Sparkles,
  Flame
} from 'lucide-react';
import { TasteDomain, TasteAffinity, BrandCandidate } from '../types';

interface AudienceAffinityOverviewProps {
  tasteProfile?: Record<TasteDomain, TasteAffinity[]>;
  candidates?: BrandCandidate[];
  eventName?: string;
}

const CATEGORY_COLORS = [
  { color: '#14b8a6', gradient: 'from-teal-400 to-emerald-400', iconColor: 'text-teal-400' },
  { color: '#06b6d4', gradient: 'from-cyan-400 to-teal-400', iconColor: 'text-cyan-400' },
  { color: '#ec4899', gradient: 'from-pink-400 to-rose-400', iconColor: 'text-pink-400' },
  { color: '#3b82f6', gradient: 'from-blue-400 to-cyan-400', iconColor: 'text-blue-400' },
  { color: '#8b5cf6', gradient: 'from-purple-400 to-indigo-400', iconColor: 'text-purple-400' },
  { color: '#f59e0b', gradient: 'from-amber-400 to-yellow-400', iconColor: 'text-amber-400' },
];

function getCategoryIcon(cat: string) {
  const c = cat.toLowerCase();
  if (c.includes('music') || c.includes('audio') || c.includes('dj') || c.includes('sound')) return Music;
  if (c.includes('fashion') || c.includes('apparel') || c.includes('footwear') || c.includes('wear')) return ShoppingBag;
  if (c.includes('food') || c.includes('beverage') || c.includes('water') || c.includes('beer') || c.includes('drink') || c.includes('coffee')) return Coffee;
  if (c.includes('sport') || c.includes('endurance') || c.includes('athletics') || c.includes('fitness')) return Activity;
  if (c.includes('tech') || c.includes('wearable') || c.includes('software') || c.includes('audio tech')) return Laptop;
  if (c.includes('travel') || c.includes('airline') || c.includes('hotel') || c.includes('adventure')) return Plane;
  return Zap;
}

export const AudienceAffinityOverview: React.FC<AudienceAffinityOverviewProps> = ({
  candidates = [],
  eventName = 'This Event',
}) => {
  // Compute dynamic categories from candidates
  const { affinityBars, donutSegments } = useMemo(() => {
    // If no candidates, use sensible defaults
    if (candidates.length === 0) {
      return {
        affinityBars: [
          { name: 'Music & Audio', icon: Music, percent: '+62%', width: '85%', gradient: 'from-teal-400 to-emerald-400', iconColor: 'text-teal-400' },
          { name: 'Fashion & Apparel', icon: ShoppingBag, percent: '+48%', width: '72%', gradient: 'from-cyan-400 to-teal-400', iconColor: 'text-cyan-400' },
          { name: 'Food & Beverage', icon: Coffee, percent: '+42%', width: '64%', gradient: 'from-blue-400 to-cyan-400', iconColor: 'text-blue-400' },
          { name: 'Technology', icon: Laptop, percent: '+37%', width: '58%', gradient: 'from-indigo-400 to-blue-400', iconColor: 'text-indigo-400' },
          { name: 'Travel & Lifestyle', icon: Plane, percent: '+31%', width: '50%', gradient: 'from-purple-400 to-indigo-400', iconColor: 'text-purple-400' },
        ],
        donutSegments: [
          { label: 'Music & Audio', value: 28, color: '#14b8a6', dashArray: '123.1 316.7', dashOffset: '0' },
          { label: 'Fashion & Apparel', value: 22, color: '#06b6d4', dashArray: '96.7 343.1', dashOffset: '-123.1' },
          { label: 'Food & Beverage', value: 20, color: '#ec4899', dashArray: '87.9 351.9', dashOffset: '-219.8' },
          { label: 'Technology', value: 16, color: '#3b82f6', dashArray: '70.3 369.5', dashOffset: '-307.7' },
          { label: 'Travel & Lifestyle', value: 14, color: '#8b5cf6', dashArray: '61.5 378.3', dashOffset: '-378.0' },
        ]
      };
    }

    // Group candidates by main category
    const catMap: Record<string, { count: number; totalAffinity: number; totalLift: number }> = {};
    candidates.forEach((c) => {
      const fullCat = c.category || 'Other';
      const mainCat = fullCat.split('/')[0].split('&')[0].trim();
      if (!catMap[mainCat]) {
        catMap[mainCat] = { count: 0, totalAffinity: 0, totalLift: 0 };
      }
      catMap[mainCat].count += 1;
      catMap[mainCat].totalAffinity += c.rawAffinity || 0.75;
      catMap[mainCat].totalLift += c.liftMultiple || 1.2;
    });

    const sorted = Object.entries(catMap)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgAffinity: data.totalAffinity / data.count,
        avgLift: data.totalLift / data.count,
      }))
      .sort((a, b) => b.count !== a.count ? b.count - a.count : b.avgAffinity - a.avgAffinity)
      .slice(0, 5);

    const totalCount = sorted.reduce((acc, cur) => acc + cur.count, 0) || 1;
    const maxAffinity = Math.max(...sorted.map(s => s.avgAffinity), 0.95);

    // Circumference of SVG circle (r=70)
    const C = 2 * Math.PI * 70; // ~439.82

    let accumulatedOffset = 0;
    const segments = sorted.map((item, idx) => {
      const pct = Math.round((item.count / totalCount) * 100);
      const segmentLen = (pct / 100) * C;
      const theme = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
      const seg = {
        label: item.name,
        value: pct,
        color: theme.color,
        dashArray: `${segmentLen.toFixed(1)} ${(C - segmentLen).toFixed(1)}`,
        dashOffset: `-${accumulatedOffset.toFixed(1)}`,
      };
      accumulatedOffset += segmentLen;
      return seg;
    });

    const bars = sorted.map((item, idx) => {
      const theme = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
      const Icon = getCategoryIcon(item.name);
      const overindexPct = Math.round(Math.max(15, (item.avgLift - 0.75) * 60));
      const widthPct = Math.min(95, Math.max(45, Math.round((item.avgAffinity / maxAffinity) * 88)));

      return {
        name: item.name,
        icon: Icon,
        percent: `+${overindexPct}%`,
        width: `${widthPct}%`,
        gradient: theme.gradient,
        iconColor: theme.iconColor,
      };
    });

    return { affinityBars: bars, donutSegments: segments };
  }, [candidates]);

  return (
    <div className="bg-[#0d1424] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-5">
      {/* Card Header */}
      <div className="space-y-1 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Audience Affinity Overview
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          How attendees for <strong className="text-teal-300">{eventName}</strong> connect to brand categories (vs. general consumer baselines).
        </p>
      </div>

      {/* Grid: 2 Halves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Category Progress Bars (6 cols) */}
        <div className="lg:col-span-6 space-y-3.5">
          {affinityBars.map((bar, i) => {
            const Icon = bar.icon;
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                      <Icon className={`w-3.5 h-3.5 ${bar.iconColor}`} />
                    </div>
                    <span className="text-slate-200 font-medium">{bar.name}</span>
                  </div>
                  <span className="font-mono font-bold text-teal-300 text-xs">
                    {bar.percent}
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-[#141b2c] h-2 rounded-full overflow-hidden border border-white/[0.04]">
                  <div
                    className={`h-full bg-gradient-to-r ${bar.gradient} rounded-full transition-all duration-700`}
                    style={{ width: bar.width }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Donut Chart & Category Legend (6 cols) */}
        <div className="lg:col-span-6 border-t lg:border-t-0 lg:border-l border-white/[0.06] pt-4 lg:pt-0 lg:pl-6 space-y-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-white">Top Brand Categories</h3>
            <p className="text-[11px] text-slate-400">Derived from Qloo cultural affinities</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pt-1">
            {/* SVG Donut Chart with center label */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke="#141b2c"
                  strokeWidth="28"
                />
                {/* Colored Segments */}
                {donutSegments.map((seg, i) => (
                  <circle
                    key={i}
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="28"
                    strokeDasharray={seg.dashArray}
                    strokeDashoffset={seg.dashOffset}
                    className="transition-all duration-700 hover:opacity-85"
                  />
                ))}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  Top 5
                </span>
                <span className="text-xs font-extrabold text-white">
                  Categories
                </span>
              </div>
            </div>

            {/* Legend list on right */}
            <div className="space-y-1.5 w-full text-xs">
              {donutSegments.map((seg, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-slate-300 truncate max-w-[110px]">
                      {seg.label}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-400">
                    {seg.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
