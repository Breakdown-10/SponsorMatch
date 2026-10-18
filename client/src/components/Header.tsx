import React from 'react';
import { Target, ShieldCheck, Database, Layers, FileDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  evidenceCount: number;
  onOpenEvidence: () => void;
  onOpenBaseline: () => void;
  onExport: () => void;
  isRunActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  evidenceCount,
  onOpenEvidence,
  onOpenBaseline,
  onExport,
  isRunActive,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">SponsorMatch</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-brand-500/20 text-brand-300 border border-brand-500/30 rounded">
                AI Agent
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Powered by Qloo Taste Graph</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-medium">100% Grounded</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* With / Without Qloo Comparison Button */}
          <button
            onClick={onOpenBaseline}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-700/50 transition-all shadow-sm"
            title="Side-by-side comparison: Qloo-grounded SponsorMatch vs. Plain LLM Hallucinated Baseline"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>With vs. Without Qloo</span>
          </button>

          {/* Evidence Trace Drawer Button */}
          <button
            onClick={onOpenEvidence}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all shadow-sm"
            title="Inspect redacted Qloo requests, raw affinities, and explainability weights"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Evidence Trace</span>
            {evidenceCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {evidenceCount}
              </span>
            )}
          </button>

          {/* Export Report */}
          <button
            onClick={onExport}
            disabled={!isRunActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
              isRunActive
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
                : 'bg-slate-800/40 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
          >
            <FileDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Deck</span>
          </button>
        </div>
      </div>
    </header>
  );
};
