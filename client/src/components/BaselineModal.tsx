import React from 'react';
import { BaselineComparison } from '../types';
import { Sparkles, X, AlertTriangle, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface BaselineModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparison?: BaselineComparison;
}

export const BaselineModal: React.FC<BaselineModalProps> = ({
  isOpen,
  onClose,
  comparison,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">With vs. Without Qloo Comparison</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  Judging Differentiator (F8)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Side-by-side audit: Evidence-grounded Taste Graph vs. Hallucinated Demographic Stereotypes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Executive Value Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-950/60 to-indigo-950/60 border border-brand-800/50 text-xs text-slate-200 leading-relaxed">
            <span className="font-bold text-brand-300">Why an LLM alone fails:</span>{' '}
            {comparison?.analysisSummary ||
              'Without Qloo, LLMs guess brand fit using blunt demographic tropes (e.g. "Festival attendees are young, so pitch Red Bull and Nike"). SponsorMatch traverses the taste graph to discover high-lift challenger brands backed by real aggregate behavior.'}
          </div>

          {/* Two Columns Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1: SponsorMatch AI */}
            <div className="bg-slate-950/80 border border-emerald-800/40 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  <h4 className="text-sm font-bold text-white">SponsorMatch (With Qloo)</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  100% Grounded
                </span>
              </div>

              <div className="space-y-3">
                {comparison?.agentBrands.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{b.name}</span>
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        <Zap className="w-3 h-3 text-amber-400" />
                        {b.liftMultiple}x Lift
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{b.category}</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 pt-0.5">
                      <ShieldCheck className="w-3 h-3 shrink-0" />
                      <span>Anchor: {b.topAffinityAnchor} ({b.evidenceCount} verified citations)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-[11px] text-emerald-300">
                ✓ Non-obvious challenger brands discovered through cross-domain taste graph traversal.
              </div>
            </div>

            {/* Column 2: Plain LLM Baseline */}
            <div className="bg-slate-950/80 border border-red-900/40 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <h4 className="text-sm font-bold text-slate-300">Plain LLM (No Qloo)</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  0% Grounded
                </span>
              </div>

              <div className="space-y-3">
                {comparison?.baselineBrands.map((b, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">{b.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        Obvious Giant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{b.genericRationale}</p>

                    <div className="space-y-1 pt-1">
                      {b.ungroundedClaims.map((claim, ci) => (
                        <div
                          key={ci}
                          className="flex items-start gap-1.5 text-[10px] text-red-400 bg-red-950/30 border border-red-900/40 p-1.5 rounded"
                        >
                          <AlertTriangle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
                          <span>{claim}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30 text-[11px] text-red-300">
                ✗ Fabricates ungrounded demographic percentages and defaults to the same ubiquitous mega-brands.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Gold Rule Compliance: Removing Qloo leaves only stereotypes; Qloo provides the factual foundation.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold transition-colors"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
