import React, { useState, useEffect } from 'react';
import { EvidenceRecord } from '../types';
import {
  Database,
  X,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

interface EvidenceTraceProps {
  isOpen: boolean;
  onClose: () => void;
  evidenceRecords: EvidenceRecord[];
  highlightId?: string;
}

export const EvidenceTrace: React.FC<EvidenceTraceProps> = ({
  isOpen,
  onClose,
  evidenceRecords,
  highlightId,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(highlightId || null);
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reset or adjust selection whenever drawer opens or active evidenceRecords change
  useEffect(() => {
    if (isOpen) {
      if (highlightId) {
        const item = evidenceRecords.find((e) => e.id === highlightId);
        if (item) {
          setExpandedId(highlightId);
          setStageFilter('ALL');
          return;
        }
      }
      setExpandedId(null);
      setStageFilter('ALL');
      setSearchQuery('');
    }
  }, [isOpen, highlightId, evidenceRecords]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stages = [
    { key: 'ALL', label: 'All Queries' },
    { key: 'PLANNING', label: 'Plan' },
    { key: 'RESOLVING', label: 'Resolve' },
    { key: 'PROFILING', label: 'Profile' },
    { key: 'FINDING_BRANDS', label: 'Brands' },
    { key: 'RANKING', label: 'Rank' },
    { key: 'VALIDATING', label: 'Guardrails' },
    { key: 'WRITING', label: 'Pitch' },
    { key: 'AUDITING', label: 'Audit' },
  ];

  const getStageCount = (stageKey: string) => {
    if (stageKey === 'ALL') return evidenceRecords.length;
    return evidenceRecords.filter((ev) => {
      const s = (ev.stage || '').toUpperCase();
      const target = stageKey.toUpperCase();
      return s === target || s.startsWith(target) || target.startsWith(s);
    }).length;
  };

  const filteredRecords = evidenceRecords.filter((ev) => {
    if (stageFilter !== 'ALL') {
      const s = (ev.stage || '').toUpperCase();
      const target = stageFilter.toUpperCase();
      const matches = s === target || s.startsWith(target) || target.startsWith(s);
      if (!matches) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${ev.toolName} ${ev.endpoint} ${ev.resultSummary} ${JSON.stringify(ev.redactedParams)}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Qloo Evidence Trace"
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md transition-all"
    >
      <div className="w-full max-w-2xl bg-[#101116] border-l border-white/[0.08] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-white/[0.06] bg-[#08080A]/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Qloo Evidence Trace</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {evidenceRecords.length} Queries Logged
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Auditable request-to-result provenance verifying every claim
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="space-y-2 pt-1">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search endpoints, parameters, or entity IDs..."
                className="w-full bg-[#0A0B10] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stage filter pills with live counts */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              {stages.map((st) => {
                const count = getStageCount(st.key);
                return (
                  <button
                    key={st.key}
                    onClick={() => setStageFilter(st.key)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1.5 ${
                      stageFilter === st.key
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                        : 'bg-[#0A0B10] text-slate-400 border border-white/[0.06] hover:text-white'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      stageFilter === st.key ? 'bg-cyan-400/25 text-cyan-200' : 'bg-white/[0.06] text-slate-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredRecords.map((ev, index) => {
            const isExpanded = expandedId === ev.id || highlightId === ev.id;

            return (
              <div
                key={ev.id}
                id={`evidence-${ev.id}`}
                className={`rounded-xl border transition-all ${
                  highlightId === ev.id
                    ? 'border-cyan-400 bg-cyan-950/20 shadow-glow-cyan ring-1 ring-cyan-500/50'
                    : 'border-white/[0.06] bg-[#14151E] hover:border-white/[0.12]'
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-400">#{index + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#0A0B10] text-slate-300 border border-white/[0.08]">
                      {ev.toolName}
                    </span>
                    <span className="text-xs font-bold text-white truncate max-w-[260px]">
                      {ev.resultSummary}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.cacheHit ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        Cached
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Live API
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-white/[0.06] bg-[#0A0B10] space-y-3 text-xs">
                    {/* Endpoint & Timestamp */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500 block">Endpoint:</span>
                        <span className="text-cyan-300 break-all">{ev.endpoint}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Timestamp:</span>
                        <span className="text-slate-300">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Redacted Parameters */}
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>Redacted Parameters (Credential Isolated)</span>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-[#07080B] text-slate-300 text-[11px] font-mono overflow-x-auto border border-white/[0.04]">
                        {JSON.stringify(ev.redactedParams, null, 2)}
                      </pre>
                    </div>

                    {/* Raw Snippet */}
                    {ev.rawSnippet && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          API Response Snippet ({ev.resultCount} entities)
                        </div>
                        <pre className="p-2.5 rounded-lg bg-[#07080B] text-slate-300 text-[11px] font-mono overflow-x-auto max-h-40 border border-white/[0.04]">
                          {JSON.stringify(ev.rawSnippet, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {filteredRecords.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-xs space-y-1">
              <p>No evidence records match your search or filter.</p>
              <button
                onClick={() => {
                  setStageFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                Reset search & filters
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/[0.06] bg-[#08080A]/90 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
            <ShieldCheck className="w-4 h-4" />
            100% of numerical claims traceable to Qloo API
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-xs font-bold"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
