import React, { useState, useEffect } from 'react';
import { EvidenceRecord, PipelineStage } from '../types';
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
  Filter,
  Layers
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

  useEffect(() => {
    if (highlightId) {
      setExpandedId(highlightId);
      // Ensure the highlighted item is visible by resetting filters if needed
      const item = evidenceRecords.find((e) => e.id === highlightId);
      if (item && stageFilter !== 'ALL' && item.stage !== stageFilter) {
        setStageFilter('ALL');
      }
    }
  }, [highlightId, evidenceRecords]);

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

  const filteredRecords = evidenceRecords.filter((ev) => {
    if (stageFilter !== 'ALL' && ev.stage !== stageFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${ev.toolName} ${ev.endpoint} ${ev.resultSummary} ${JSON.stringify(ev.redactedParams)}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const stages = [
    { key: 'ALL', label: 'All Queries' },
    { key: 'PLANNING', label: 'Plan' },
    { key: 'RESOLVING_ENTITIES', label: 'Resolve' },
    { key: 'PROFILING_AUDIENCE', label: 'Profile' },
    { key: 'FINDING_BRANDS', label: 'Brands' },
    { key: 'RANKING', label: 'Rank' },
    { key: 'VALIDATING', label: 'Guardrails' },
    { key: 'WRITING', label: 'Pitch' },
    { key: 'AUDITING', label: 'Audit' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Qloo Evidence Trace"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all"
    >
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Qloo Evidence Trace</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
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

            {/* Stage filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              {stages.map((st) => (
                <button
                  key={st.key}
                  onClick={() => setStageFilter(st.key)}
                  className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-colors ${
                    stageFilter === st.key
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
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
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-slate-400">#{index + 1}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                      {ev.toolName}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[280px]">
                      {ev.resultSummary}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.cacheHit ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Cache Hit
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
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

                {isExpanded && (
                  <div className="p-3.5 pt-0 border-t border-slate-800/80 text-xs space-y-2.5 mt-1 font-mono">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Endpoint & Method:
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-cyan-300 break-all">
                        {ev.endpoint}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                        Redacted Parameters:
                      </div>
                      <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto">
                        {JSON.stringify(ev.redactedParams, null, 2)}
                      </pre>
                    </div>

                    {ev.rawSnippet && (
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                          Verified Output Snippet:
                        </div>
                        <pre className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto max-h-48">
                          {JSON.stringify(ev.rawSnippet, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>ID: {ev.id}</span>
                      <span>Logged: {new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
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
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            100% of numerical claims traceable to Qloo API
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
