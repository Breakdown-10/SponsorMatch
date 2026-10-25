import React, { useState } from 'react';
import { Search, Bell, Sparkles, ChevronDown } from 'lucide-react';
import { SampleEventDefinition } from '../types';

interface TopNavbarProps {
  samples: SampleEventDefinition[];
  onSelectSample: (sample: SampleEventDefinition) => void;
  currentEventName?: string;
  onOpenNewAnalysis: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  samples,
  onSelectSample,
  currentEventName,
  onOpenNewAnalysis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredSamples = samples.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#0a0f1d]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left empty spacer or quick breadcrumb */}
      <div className="w-12 lg:w-48" />

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
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          title="Notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-2 right-2 animate-pulse" />
        </button>

        {/* User Avatar Chip */}
        <div className="flex items-center gap-3 pl-2 border-l border-white/[0.07]">
          <div className="w-8 h-8 rounded-full bg-[#3b4974] flex items-center justify-center text-xs font-bold text-white border border-white/20">
            JD
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <div className="text-xs font-bold text-white">Jamie D.</div>
            <div className="text-[10px] text-slate-400">Event Organizer</div>
          </div>
        </div>
      </div>
    </header>
  );
};
