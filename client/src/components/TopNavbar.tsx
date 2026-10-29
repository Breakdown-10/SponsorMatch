import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  User,
  Sliders,
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react';
import { SampleEventDefinition, UserProfile } from '../types';
import { AVATAR_COLOR_OPTIONS, ROLE_DETAILS } from '../utils/profileStorage';

interface TopNavbarProps {
  samples: SampleEventDefinition[];
  onSelectSample: (sample: SampleEventDefinition) => void;
  currentEventName?: string;
  onOpenNewAnalysis: () => void;
  userProfile: UserProfile;
  onOpenProfile: () => void;
  onResetProfile: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  samples,
  onSelectSample,
  currentEventName,
  onOpenNewAnalysis,
  userProfile,
  onOpenProfile,
  onResetProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const filteredSamples = samples.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeColorObj =
    AVATAR_COLOR_OPTIONS.find((c) => c.id === userProfile.avatarColor) || AVATAR_COLOR_OPTIONS[0];

  const roleInfo = ROLE_DETAILS[userProfile.role] || ROLE_DETAILS.organizer;

  const strategyLabel =
    userProfile.preferences.discoveryStrategy === 'challenger_heavy'
      ? 'Challenger Focus'
      : userProfile.preferences.discoveryStrategy === 'prestige_luxury'
      ? 'Prestige & Luxury'
      : 'Balanced Mix';

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#0a0f1d]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left Quick Status / Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 w-48">
        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <span className="text-xs font-mono font-bold text-slate-300 truncate">
          {currentEventName || 'SponsorMatch AI'}
        </span>
      </div>

      {/* Center Search Bar */}
      <div className="relative w-full max-w-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events, artists, venues..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0e1628] border border-white/[0.08] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
          />
        </div>

        {/* Dropdown search results */}
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d1424] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Pre-Warmed Events (Sub-second load)
              </div>
              {filteredSamples.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    setIsDropdownOpen(false);
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    sample.name === currentEventName
                      ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30'
                      : 'hover:bg-white/[0.05] text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-white">{sample.name}</div>
                    <div className="text-[11px] text-slate-400">{sample.tagline}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Instant
                  </span>
                </button>
              ))}

              <div className="border-t border-white/[0.06] pt-1">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenNewAnalysis();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-bold text-teal-400 hover:bg-teal-500/10 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze custom event...</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right User & Notifications */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            title="System & Pipeline Notifications"
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute top-2 right-2 animate-pulse" />
          </button>

          {isNotificationOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d1424] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                  <span className="text-xs font-bold text-white">Notifications & Signals</span>
                  <span className="text-[10px] font-mono text-teal-400">Live</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#090d1a] border border-white/[0.05] space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Qloo Grounding Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    100% of generated pitch claims are verified against raw entity taste queries.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#090d1a] border border-white/[0.05] space-y-1">
                  <div className="text-xs font-bold text-white">Profile Customization Enabled</div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    Signed in as <span className="text-teal-300 font-semibold">{userProfile.name}</span> ({userProfile.organization}).
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Avatar Chip & Profile Dropdown */}
        <div className="relative pl-1 border-l border-white/[0.07]">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-white/[0.05] transition-all group"
            title="Customer Profile & Settings"
          >
            <div
              className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeColorObj.gradient} flex items-center justify-center text-xs font-black text-slate-950 border border-white/30 shadow-[0_0_10px_rgba(20,184,166,0.25)] shrink-0`}
            >
              {userProfile.avatarInitials || 'JD'}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors truncate max-w-[120px]">
                {userProfile.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                {userProfile.organization || roleInfo.label}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300 transition-colors" />
          </button>

          {/* User Profile Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-[#0c1322] border border-white/10 rounded-2xl shadow-2xl p-2.5 z-50 space-y-2 animate-in fade-in duration-150">
                {/* User Summary Card */}
                <div className="p-3 rounded-xl bg-[#080d1a] border border-white/[0.06] space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${activeColorObj.gradient} flex items-center justify-center text-xs font-black text-slate-950 border border-white/30 shrink-0`}
                    >
                      {userProfile.avatarInitials || 'JD'}
                    </div>
                    <div className="leading-tight overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">
                        {userProfile.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {userProfile.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] text-[10px]">
                    <span className="text-slate-400">{userProfile.organization}</span>
                    <span className="px-1.5 py-0.2 rounded bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30">
                      {roleInfo.label.split(' ')[0]}
                    </span>
                  </div>

                  {/* Active Strategy Badge */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                    <span>{strategyLabel}</span>
                    <span>{userProfile.preferences.defaultCurrency} Currency</span>
                  </div>
                </div>

                {/* Navigation & Action Links */}
                <div className="space-y-0.5">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors text-left"
                  >
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>Customize Profile & Strategy</span>
                  </button>

                  <div className="border-t border-white/[0.06] my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onResetProfile();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Default Profile</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
