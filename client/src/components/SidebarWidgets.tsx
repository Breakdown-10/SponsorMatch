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
  Compass
} from 'lucide-react';

interface SidebarWidgetsProps {
  onOpenNewAnalysis: () => void;
  onOpenBaseline: () => void;
  onOpenEvidence: () => void;
  onExport: () => void;
  isRunActive: boolean;
}

export const SidebarWidgets: React.FC<SidebarWidgetsProps> = ({
  onOpenNewAnalysis,
  onOpenBaseline,
  onOpenEvidence,
  onExport,
  isRunActive,
}) => {
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
                  Compare with LLM
                </div>
                <div className="text-[10px] text-slate-400">
                  See the difference Qloo makes
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
                  Explore the data behind matches
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
                  Export Report
                </div>
                <div className="text-[10px] text-slate-400">
                  Download PDF or share link
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
          Every recommendation is backed by Qloo data. Explore the cultural connections, affinities and source entities that make each brand a fit.
        </p>

        <button
          onClick={onOpenEvidence}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors pt-1"
        >
          <span>View Evidence Trace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Key Insights */}
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
          {/* Insight 1 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Shirt className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Music-driven audience shows strong affinity for sustainable fashion brands (<span className="text-amber-400 font-bold">+48%</span>).
            </p>
          </div>

          {/* Insight 2 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Wine className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Electronic music fans are <span className="text-emerald-400 font-bold">2.3x</span> more likely to engage with alternative beverage brands.
            </p>
          </div>

          {/* Insight 3 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Barcelona location increases travel and lifestyle brand affinity (<span className="text-purple-400 font-bold">+31%</span>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
