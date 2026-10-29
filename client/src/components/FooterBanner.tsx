import React from 'react';
import sponsorMatchIcon from '../assets/SponsorMatchAI_icon.jpg';
import { Sparkles, FileSearch, ArrowRight } from 'lucide-react';

interface FooterBannerProps {
  onOpenEvidence: () => void;
}

export const FooterBanner: React.FC<FooterBannerProps> = ({ onOpenEvidence }) => {
  return (
    <footer className="mt-12 bg-[#090d1a] border border-white/[0.08] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 shadow-xl">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl overflow-hidden border border-teal-500/30 shrink-0 bg-[#080d1a] shadow-sm">
          <img src={sponsorMatchIcon} alt="SponsorMatch AI" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-xs font-bold text-white">
            SponsorMatch <span className="text-teal-400">AI</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Cultural intelligence for better partnerships.
          </div>
        </div>
      </div>

      {/* Center Powered by Qloo */}
      <div className="flex items-center gap-2 text-center">
        <span className="text-slate-400">Powered by</span>
        <span className="text-white font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Qloo
        </span>
        <span className="hidden sm:inline text-slate-500">•</span>
        <span className="hidden sm:inline text-slate-400 text-[11px]">Real entities. Real connections.</span>
      </div>

      {/* Right Evidence Trace CTA */}
      <button
        onClick={onOpenEvidence}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-xs font-semibold group"
      >
        <FileSearch className="w-4 h-4 text-cyan-400" />
        <span>Evidence Trace — See all sources and data points</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
      </button>
    </footer>
  );
};
