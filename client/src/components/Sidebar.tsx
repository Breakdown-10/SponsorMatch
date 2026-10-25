import React from 'react';
import {
  Home,
  Sparkles,
  Bookmark,
  Target,
  FileSearch,
  Settings,
  Layers,
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  evidenceCount: number;
  onOpenEvidence: () => void;
  onOpenNewAnalysis: () => void;
  onOpenBaseline: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  evidenceCount,
  onOpenEvidence,
  onOpenNewAnalysis,
  onOpenBaseline,
}) => {
  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-white/[0.07] flex flex-col justify-between shrink-0 select-none min-h-screen sticky top-0 h-screen z-30">
      {/* Top Brand Identity */}
      <div>
        <div className="p-5 pb-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.35)] shrink-0">
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  SponsorMatch
                </span>
                <span className="text-base font-extrabold text-teal-400 font-sans">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-tight">
                Cultural Intelligence for Better Partnerships
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {/* Home */}
          <button
            onClick={() => onSelectTab('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'home'
                ? 'bg-[#143e3b] text-teal-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] border border-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-teal-400' : 'text-slate-400'}`} />
            <span>Home</span>
          </button>

          {/* New Analysis */}
          <button
            onClick={onOpenNewAnalysis}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
          >
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>New Analysis</span>
          </button>

          {/* Saved Events */}
          <button
            onClick={() => onSelectTab('saved-events')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'saved-events'
                ? 'bg-[#143e3b] text-teal-300 border border-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Bookmark className="w-4 h-4 text-slate-400" />
            <span>Saved Events</span>
          </button>

          {/* Sponsor Matches */}
          <button
            onClick={() => {
              onSelectTab('matches');
              const el = document.getElementById('sponsor-matches-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'matches'
                ? 'bg-[#143e3b] text-teal-300 border border-teal-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <Target className="w-4 h-4 text-slate-400" />
            <span>Sponsor Matches</span>
          </button>

          {/* Evidence Trace */}
          <button
            onClick={onOpenEvidence}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3">
              <FileSearch className="w-4 h-4 text-cyan-400" />
              <span>Evidence Trace</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {evidenceCount}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenBaseline}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Bottom Powered by Qloo */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="p-3 rounded-2xl bg-[#0e1628]/80 border border-white/[0.05] flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-200">
              Powered by Qloo
            </span>
            <p className="text-[10px] text-slate-400 leading-tight">
              Real cultural connections. Verified data. Better matches.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
