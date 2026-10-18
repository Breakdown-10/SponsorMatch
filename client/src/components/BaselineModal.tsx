import React from 'react';
import { BaselineComparison } from '../types';
import { Sparkles, X, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#101116] border border-white/[0.08] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.06] flex items-center justify-between bg-[#08080A]/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">With vs. Without Qloo Comparison</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
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
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Executive Value Banner */}
          <div className="p-4 rounded-2xl bg-[#14151E] border border-cyan-500/30 text-xs text-slate-200 leading-relaxed shadow-glow-cyan">
            <span className="font-bold text-cyan-300">Why an LLM alone fails:</span>{' '}
            {comparison?.analysisSummary ||
              'Without Qloo, LLMs guess brand fit using blunt demographic tropes (e.g. "Festival attendees are young, so pitch Red Bull and Nike"). SponsorMatch traverses the taste graph to discover high-lift challenger brands backed by real aggregate behavior.'}
          </div>

          {/* Two Columns Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1: SponsorMatch AI */}
            <div className="bg-[#14151E] border border-emerald-500/40 rounded-2xl p-5 space-y-4 relative overflow-hidden shadow-glow-emerald">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-glow" />
                  <h4 className="text-sm font-black text-white">SponsorMatch (With Qloo)</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  100% Grounded
                </span>
              </div>

              <div className="space-y-3">
                {(comparison?.agentBrands || []).slice(0, 3).map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#0A0B10] border border-white/[0.04] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{item.name}</span>
                      <span className="font-mono font-bold text-cyan-400 text-[11px]">
                        {item.liftMultiple}x Lift
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{item.category}</div>
                    <div className="text-[10px] text-slate-300 mt-1 flex items-center gap-1 font-mono">
                      <span className="text-emerald-400 font-bold">Anchor:</span> {item.topAffinityAnchor}
                      <span className="text-slate-500">({item.evidenceCount} verified citations)</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-emerald-300/90 font-medium">
                ✓ Non-obvious challenger brands discovered through cross-domain taste graph traversal.
              </div>
            </div>

            {/* Column 2: Plain LLM Baseline */}
            <div className="bg-[#14151E] border border-amber-500/40 rounded-2xl p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-black text-white">Plain LLM (No Qloo)</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  0% Grounded
                </span>
              </div>

              <div className="space-y-3">
                {(comparison?.baselineBrands || []).slice(0, 3).map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#0A0B10] border border-white/[0.04] space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{item.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">Obvious Staple</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{item.genericRationale}</div>
                    <div className="text-[10px] text-red-400 font-mono mt-1">
                      ⚠️ Ungrounded: {item.ungroundedClaims?.slice(0, 2).join('; ') || 'Generic assumptions'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-amber-400/90 font-medium">
                ✗ Stereotypical corporate sponsors with ungrounded metrics and high sponsorship clutter.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-[#08080A]/80 flex items-center justify-between text-xs text-slate-400">
          <span>Demonstrated proof of Qloo's differentiator for hackathon judging criteria</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-bold"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
