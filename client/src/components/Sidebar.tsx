import React from 'react';
import sponsorMatchIcon from '../assets/SponsorMatchAI_icon.jpg';
import {
  Home,
  Sparkles,
  Bookmark,
  Target,
  FileSearch,
  Settings,
  Layers,
  ChevronRight,
  Database,
  ShieldCheck,
  User
} from 'lucide-react';
import { UserProfile } from '../types';
import { AVATAR_COLOR_OPTIONS } from '../utils/profileStorage';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  evidenceCount: number;
  onOpenEvidence: () => void;
  onOpenNewAnalysis: () => void;
  onOpenBaseline: () => void;
  userProfile?: UserProfile;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  evidenceCount,
  onOpenEvidence,
  onOpenNewAnalysis,
  onOpenBaseline,
  userProfile,
  onOpenProfile,
}) => {
  const activeColorObj =
    AVATAR_COLOR_OPTIONS.find((c) => c.id === userProfile?.avatarColor) || AVATAR_COLOR_OPTIONS[0];

  return (
    <aside className="w-64 bg-[#0a0f1d] border-r border-white/[0.07] flex flex-col justify-between shrink-0 select-none min-h-screen sticky top-0 h-screen z-30">
      {/* Top Brand Identity & Nav */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 pb-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(20,184,166,0.35)] shrink-0 border border-teal-500/30 bg-[#080d1a]">
              <img
                src={sponsorMatchIcon}
                alt="SponsorMatch AI"
                className="w-full h-full object-cover"
              />
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

          {/* With vs. Without Qloo Comparison */}
          <button
            onClick={onOpenBaseline}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
            title="Side-by-side audit: Evidence-grounded Taste Graph vs. Hallucinated Demographic Stereotypes"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>With vs. Without Qloo</span>
            </div>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              F8
            </span>
          </button>

          <div className="pt-2 pb-1">
            <div className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Customer Workflows
            </div>
          </div>

          {/* Profile & Preferences */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Profile & Settings</span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Area: Customer Profile Snippet & Powered by Qloo */}
      <div className="p-3 border-t border-white/[0.06] space-y-2.5">
        {/* Customer Profile Snippet */}
        {userProfile && onOpenProfile && (
          <button
            onClick={onOpenProfile}
            className="w-full p-2.5 rounded-2xl bg-[#0e1628]/80 hover:bg-[#121c32] border border-white/[0.06] hover:border-teal-500/30 flex items-center justify-between text-left transition-all group"
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${activeColorObj.gradient} flex items-center justify-center text-[10px] font-black text-slate-950 shrink-0 border border-white/20`}
              >
                {userProfile.avatarInitials || 'JD'}
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors truncate">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {userProfile.organization}
                </div>
              </div>
            </div>
            <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-300 transition-colors shrink-0" />
          </button>
        )}

        {/* Powered by Qloo */}
        <div className="p-2.5 rounded-xl bg-[#090d1a] border border-white/[0.04] flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="text-[10px] text-slate-400">
            Powered by <strong className="text-white">Qloo Taste Graph</strong>
          </span>
        </div>
      </div>
    </aside>
  );
};
