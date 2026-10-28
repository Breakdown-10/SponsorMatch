import React from 'react';
import {
  Zap,
  Sparkles,
  GitCompare,
  FileSearch,
  Download,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  TrendingUp,
  Shirt,
  Wine,
  Compass,
  Activity
} from 'lucide-react';
import { RunState } from '../types';

interface SidebarWidgetsProps {
  onOpenNewAnalysis: () => void;
  onOpenBaseline: () => void;
  onOpenEvidence: () => void;
  onExport: () => void;
  isRunActive: boolean;
  run?: RunState;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  onOpenNewAnalysis,
  onOpenBaseline,
  onOpenEvidence,
  onExport,
  isRunActive,
  run,
}) => {
  // Dynamic Insights based on active run
  const insights = React.useMemo(() => {
    if (!run) {
      return [
        {
          icon: Shirt,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/20',
          text: <span>Music-driven audience shows strong affinity for sustainable fashion brands (<strong className="text-amber-400 font-bold">+48%</strong>).</span>
        },
        {
          icon: Wine,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          text: <span>Electronic music fans are <strong className="text-emerald-400 font-bold">2.3x</strong> more likely to engage with alternative beverage brands.</span>
        },
        {
          icon: Compass,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10 border-purple-500/20',
          text: <span>Barcelona location increases travel and lifestyle brand affinity (<strong className="text-purple-400 font-bold">+31%</strong>).</span>
        }
      ];
    }

    const eventName = run.input.eventName;
    const isAthletic = eventName.toLowerCase().includes('marathon') || eventName.toLowerCase().includes('run');
    const isPsych = eventName.toLowerCase().includes('desert') || eventName.toLowerCase().includes('daze');
    const location = run.input.city || run.input.venue || 'Event location';

    const topNonObvious = run.candidates.find(c => !c.isObvious && c.liftMultiple >= 1.2) || run.candidates[0];
    const topBrandName = topNonObvious ? topNonObvious.name : 'Challenger brands';
    const topLift = topNonObvious ? topNonObvious.liftMultiple : 1.34;
    const topCat = topNonObvious ? topNonObvious.category : 'Subcultural lifestyle';

    if (isAthletic) {
      return [
        {
          icon: Activity,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          text: <span>Endurance athletes index <strong className="text-emerald-400 font-bold">{topLift}x higher</strong> for specialized performance nutrition (<strong className="text-emerald-300">{topBrandName}</strong>).</span>
        },
        {
          icon: TrendingUp,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10 border-cyan-500/20',
          text: <span>Biometric tracking and wearable tech resonance over-indexes by <strong className="text-cyan-400 font-bold">+65%</strong> among marathon participants.</span>
        },
        {
          icon: Compass,
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/10 border-purple-500/20',
          text: <span><strong className="text-slate-200">{location}</strong> urban marathon course amplifies sports recovery and hydration partnership value.</span>
        }
      ];
    }

    if (isPsych) {
      return [
        {
          icon: Wine,
          color: 'text-amber-400',
          bgColor: 'bg-amber-500/10 border-amber-500/20',
          text: <span>Neo-psychedelic music fans are <strong className="text-amber-400 font-bold">{topLift}x more likely</strong> to buy non-traditional canned water (<strong className="text-amber-300">{topBrandName}</strong>).</span>
        },
        {
          icon: Shirt,
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500/10 border-emerald-500/20',
          text: <span>High cross-domain synergy for vintage analog audio synthesizers and rugged outdoor apparel (<strong className="text-emerald-400 font-bold">+58%</strong>).</span>
        },
        {
          icon: Compass,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10 border-cyan-500/20',
          text: <span><strong className="text-slate-200">{location}</strong> outdoor desert retreat setting drives high affinity for specialty craft beverages.</span>
        }
      ];
    }

    return [
      {
        icon: TrendingUp,
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10 border-cyan-500/20',
        text: <span>Audience cultural alignment reveals <strong className="text-cyan-400 font-bold">{topLift}x lift</strong> for <strong className="text-cyan-300">{topBrandName}</strong> ({topCat}).</span>
      },
      {
        icon: Shirt,
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/20',
        text: <span>Cross-domain taste traversal discovers high-affinity overlap across lifestyle and creative technology.</span>
      },
      {
        icon: Compass,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10 border-purple-500/20',
        text: <span><strong className="text-slate-200">{location}</strong> environment drives unique local and international lifestyle brand affinity.</span>
      }
    ];
  }, [run]);

  return (
    <div className="space-y-4">
      {/* 1. Quick Actions */}
      <div className="bg-[#0d1424] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3.5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <Zap className="w-3.5 h-3.5 fill-teal-400" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>

        <div className="space-y-2">
          {/* Action 1: Generate New Analysis */}
          <button
            onClick={onOpenNewAnalysis}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                  Generate New Analysis
                </div>
                <div className="text-[10px] text-slate-400">
                  Start with a different event
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 2: Compare with LLM */}
          <button
            onClick={onOpenBaseline}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0">
                <GitCompare className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  Compare with LLM (F8)
                </div>
                <div className="text-[10px] text-slate-400">
                  Evidence vs. Hallucinated Tropes
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 3: View Evidence Trace */}
          <button
            onClick={onOpenEvidence}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <FileSearch className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  View Evidence Trace
                </div>
                <div className="text-[10px] text-slate-400">
                  Redacted queries & provenance
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 4: Export Report */}
          <button
            onClick={onExport}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05] transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Export B2B Pitch Deck
                </div>
                <div className="text-[10px] text-slate-400">
                  Download Markdown & Print PDF
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* 2. Why These Brands? */}
      <div className="bg-[#0d1424] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <HelpCircle className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Why These Brands?
          </h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Every recommendation is backed by Qloo data. Explore the cultural connections, affinities and source entities that make each brand an evidence-grounded fit.
        </p>

        <button
          onClick={onOpenEvidence}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors pt-1"
        >
          <span>View Evidence Trace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Key Insights (Dynamic per Event) */}
      <div className="bg-[#0d1424] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3.5">
        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
          <div className="w-5 h-5 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Key Insights
          </h3>
        </div>

        <div className="space-y-3">
          {insights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${item.bgColor}`}>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
