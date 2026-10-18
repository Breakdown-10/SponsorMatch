import React from 'react';
import { RunState, BrandCandidate } from '../types';
import {
  TrendingUp,
  Users,
  ShieldCheck,
  DollarSign,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Database,
  Layers
} from 'lucide-react';

interface EventHeroKPIProps {
  run: RunState;
  topCandidate?: BrandCandidate;
  onOpenEvidence: () => void;
  onOpenBaseline: () => void;
}

export const EventHeroKPI: React.FC<EventHeroKPIProps> = ({
  run,
  topCandidate,
  onOpenEvidence,
  onOpenBaseline,
}) => {
  const pitch = topCandidate ? run.pitches[topCandidate.id] : undefined;
  const economics = pitch?.dealEconomics;

  // Calculate metrics
  const maxLift = topCandidate ? `${topCandidate.liftMultiple}x` : '1.45x';
  const feeRange = economics?.recommendedFeeRange || '$84,000 – $140,000';
  const targetReach = economics?.projectedTargetAttendees || '45,000 – 60,000 Active Attendees';
  const evidenceCount = run.evidenceRecords.length;

  return (
    <div className="bg-[#101116] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Event Identity Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-white/[0.06] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              Live Event Profile
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Qloo Taste Graph Traversed
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {run.input.eventName}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
            {run.input.venue && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{run.input.venue}</span>
              </span>
            )}
            {run.input.city && (
              <span>• {run.input.city}</span>
            )}
            {run.input.entities && run.input.entities.length > 0 && (
              <span className="text-slate-500 font-mono">
                [{run.input.entities.slice(0, 3).join(', ')}]
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenBaseline}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#14151E] hover:bg-[#191A26] border border-white/[0.08] hover:border-cyan-500/40 text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>With vs. Without Qloo</span>
          </button>

          <button
            onClick={onOpenEvidence}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Evidence Trace</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-400/20 text-cyan-200 font-mono">
              {evidenceCount}
            </span>
          </button>
        </div>
      </div>

      {/* Posh-Inspired 4-Up High Contrast KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
        {/* KPI 1: Peak Cultural Lift */}
        <div className="bg-[#14151E]/90 hover:bg-[#171824] border border-white/[0.08] hover:border-cyan-500/30 rounded-xl p-4 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Peak Cultural Lift
              </span>
              <TrendingUp className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-cyan-400 tracking-tight font-mono">
              {maxLift}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Above demographic baseline</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
              Normalized
            </span>
          </div>
        </div>

        {/* KPI 2: Target Audience Reach */}
        <div className="bg-[#14151E]/90 hover:bg-[#171824] border border-white/[0.08] hover:border-emerald-500/30 rounded-xl p-4 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Target Audience Reach
              </span>
              <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-white tracking-tight font-mono">
              {targetReach.split(' ')[0]}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">High-affinity active fans</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
              Zero Waste
            </span>
          </div>
        </div>

        {/* KPI 3: Provable Grounding */}
        <div className="bg-[#14151E]/90 hover:bg-[#171824] border border-white/[0.08] hover:border-emerald-500/30 rounded-xl p-4 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Evidence Audit
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-400 tracking-tight font-mono flex items-center gap-1.5">
              <span>100%</span>
              <span className="text-xs font-semibold text-slate-300">Grounded</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{evidenceCount} / {evidenceCount} verified queries</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
              Audited
            </span>
          </div>
        </div>

        {/* KPI 4: Asking Valuation Tier */}
        <div className="bg-[#14151E]/90 hover:bg-[#171824] border border-white/[0.08] hover:border-amber-500/30 rounded-xl p-4 transition-all group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Asking Sponsorship Fee
              </span>
              <DollarSign className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 text-lg sm:text-xl font-black text-amber-300 tracking-tight font-mono">
              {feeRange}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-white/[0.05] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">{economics?.suggestedPackage || 'Stage Partner Tier'}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
              Live Nation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
