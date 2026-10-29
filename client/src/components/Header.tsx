import React from 'react';
import sponsorMatchIcon from '../assets/SponsorMatchAI_icon.jpg';
import { Target, ShieldCheck, Database, FileDown, Sparkles } from 'lucide-react';

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
    <header className="border-b border-white/[0.08] bg-[#08080A]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-cyan-500/40 shadow-glow-cyan shrink-0 bg-[#080d1a]">
            <img src={sponsorMatchIcon} alt="SponsorMatch AI" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">SponsorMatch</span>
              <span className="px-1.5 py-0.5 text-[9px] font-black tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-md">
                AGENT
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Qloo Taste Graph</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-glow" />
              <span className="text-emerald-400 font-semibold">100% Grounded</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* With / Without Qloo Comparison Button */}
          <button
            onClick={onOpenBaseline}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#14151E] hover:bg-[#191A26] text-cyan-300 border border-cyan-500/30 transition-all shadow-sm"
            title="Side-by-side comparison: Qloo-grounded SponsorMatch vs. Plain LLM Hallucinated Baseline"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">With vs. Without Qloo</span>
            <span className="sm:hidden">Baseline</span>
          </button>

          {/* Evidence Trace Drawer Button */}
          <button
            onClick={onOpenEvidence}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-[#14151E] hover:bg-[#191A26] text-slate-200 border border-white/[0.08] hover:border-cyan-500/40 transition-all shadow-sm"
            title="Inspect redacted Qloo requests, raw affinities, and explainability weights"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Evidence Trace</span>
            {evidenceCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {evidenceCount}
              </span>
            )}
          </button>

          {/* Export Report */}
          <button
            onClick={onExport}
            disabled={!isRunActive}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all border ${
              isRunActive
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 text-emerald-300 border-emerald-500/30 cursor-pointer shadow-sm'
                : 'bg-white/[0.02] text-slate-600 border-white/[0.04] cursor-not-allowed'
            }`}
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export Deck</span>
          </button>
        </div>
      </div>
    </header>
  );
};
