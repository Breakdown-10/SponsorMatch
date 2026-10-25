import React from 'react';
import {
  Compass,
  Music,
  ShoppingBag,
  Coffee,
  Laptop,
  Plane,
  Sparkles
} from 'lucide-react';
import { TasteDomain, TasteAffinity } from '../types';

interface AudienceAffinityOverviewProps {
  tasteProfile?: Record<TasteDomain, TasteAffinity[]>;
}

export const AudienceAffinityOverview: React.FC<AudienceAffinityOverviewProps> = () => {
  // 5 Category Affinity bars
  const affinityBars = [
    {
      name: 'Music & Audio',
      icon: Music,
      percent: '+62%',
      width: '85%',
      gradient: 'from-teal-400 to-emerald-400',
      iconColor: 'text-teal-400',
    },
    {
      name: 'Fashion & Apparel',
      icon: ShoppingBag,
      percent: '+48%',
      width: '72%',
      gradient: 'from-cyan-400 to-teal-400',
      iconColor: 'text-cyan-400',
    },
    {
      name: 'Food & Beverage',
      icon: Coffee,
      percent: '+42%',
      width: '64%',
      gradient: 'from-blue-400 to-cyan-400',
      iconColor: 'text-blue-400',
    },
    {
      name: 'Technology',
      icon: Laptop,
      percent: '+37%',
      width: '58%',
      gradient: 'from-indigo-400 to-blue-400',
      iconColor: 'text-indigo-400',
    },
    {
      name: 'Travel & Lifestyle',
      icon: Plane,
      percent: '+31%',
      width: '50%',
      gradient: 'from-purple-400 to-indigo-400',
      iconColor: 'text-purple-400',
    },
  ];

  // Donut chart segments
  const donutSegments = [
    { label: 'Music & Audio', value: 24, color: '#14b8a6', dashArray: '150.8 477.5', dashOffset: '0' },
    { label: 'Fashion & Apparel', value: 18, color: '#06b6d4', dashArray: '113.1 515.2', dashOffset: '-150.8' },
    { label: 'Food & Beverage', value: 16, color: '#ec4899', dashArray: '100.5 527.8', dashOffset: '-263.9' },
    { label: 'Technology', value: 14, color: '#3b82f6', dashArray: '87.9 540.4', dashOffset: '-364.4' },
    { label: 'Travel & Lifestyle', value: 12, color: '#8b5cf6', dashArray: '75.4 552.9', dashOffset: '-452.3' },
    { label: 'Other', value: 16, color: '#64748b', dashArray: '100.5 527.8', dashOffset: '-527.7' },
  ];

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
          How your audience connects to brand categories (vs. general population).
        </p>
      </div>

      {/* Grid: 2 Halves */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: 5 Category Progress Bars (7 cols) */}
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
                  <span className="font-mono font-bold text-slate-200 text-xs">
                    {bar.percent}
                  </span>
                </div>

                {/* Progress track */}
                <div className="w-full bg-[#141b2c] h-2 rounded-full overflow-hidden border border-white/[0.04]">
                  <div
                    className={`h-full bg-gradient-to-r ${bar.gradient} rounded-full`}
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
            <p className="text-[11px] text-slate-400">Based on Qloo cultural affinities</p>
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
                    className="transition-all hover:opacity-85"
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
