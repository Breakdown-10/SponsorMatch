import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EventForm } from './components/EventForm';
import { StageTracker } from './components/StageTracker';
import { TasteProfile } from './components/TasteProfile';
import { BrandTable } from './components/BrandTable';
import { PitchViewer } from './components/PitchViewer';
import { EvidenceTrace } from './components/EvidenceTrace';
import { BaselineModal } from './components/BaselineModal';
import { RejectModal } from './components/RejectModal';
import { EventHeroKPI } from './components/EventHeroKPI';
import { exportRunToMarkdown } from './utils/export';
import {
  EventInput,
  RunState,
  SampleEventDefinition,
  BrandCandidate,
} from './types';
import {
  ShieldAlert,
  Sparkles,
  Database,
  ArrowRight,
  RefreshCw,
  Info,
} from 'lucide-react';

export const App: React.FC = () => {
  const [samples, setSamples] = useState<SampleEventDefinition[]>([]);
  const [activeRun, setActiveRun] = useState<RunState | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modals & Drawers
  const [isEvidenceOpen, setIsEvidenceOpen] = useState<boolean>(false);
  const [isBaselineOpen, setIsBaselineOpen] = useState<boolean>(false);
  const [rejectingBrand, setRejectingBrand] = useState<BrandCandidate | null>(null);
  const [highlightEvidenceId, setHighlightEvidenceId] = useState<string | undefined>(undefined);

  // Fetch pre-warmed samples on mount
  useEffect(() => {
    fetch('/api/samples')
      .then((res) => res.json())
      .then((data: SampleEventDefinition[]) => {
        setSamples(data);
        // Automatically pre-load the first sample event for immediate judge exploration!
        if (data.length > 0) {
          loadSampleEvent(data[0]);
        }
      })
      .catch((err) => console.error('Failed to load samples:', err));
  }, []);

  const loadSampleEvent = async (sample: SampleEventDefinition) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/runs/sample-${sample.id}`);
      if (res.ok) {
        const run: RunState = await res.json();
        setActiveRun(run);
        const topApproved = run.candidates.find((c) => c.status === 'VALIDATED');
        if (topApproved) setSelectedBrandId(topApproved.id);
      }
    } catch (err) {
      console.error('Failed to load sample run:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomSubmit = async (input: EventInput) => {
    setIsLoading(true);
    setActiveRun(null);

    try {
      // 1. Create Run
      const createRes = await fetch('/api/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const initialRun: RunState = await createRes.json();
      setActiveRun(initialRun);

      // 2. Open SSE stream
      const eventSource = new EventSource(`/api/runs/${initialRun.id}/stream`);

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.run) {
            setActiveRun(payload.run);
            const topApproved = payload.run.candidates.find((c: BrandCandidate) => c.status === 'VALIDATED');
            if (topApproved) setSelectedBrandId(topApproved.id);
          }
          if (payload.type === 'COMPLETED' || payload.type === 'ERROR') {
            eventSource.close();
            setIsLoading(false);
          }
        } catch (e) {
          console.error('Error parsing SSE:', e);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsLoading(false);
      };

      // 3. Trigger execution
      await fetch(`/api/runs/${initialRun.id}/execute`, { method: 'POST' });
    } catch (err) {
      console.error('Error executing custom run:', err);
      setIsLoading(false);
    }
  };

  const handleRejectBrand = async (brandId: string, reason: string) => {
    if (!activeRun) return;
    try {
      const res = await fetch(`/api/runs/${activeRun.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, action: 'REJECT', reason }),
      });
      if (res.ok) {
        const updated: RunState = await res.json();
        setActiveRun(updated);
        // If rejected brand was selected, switch selection to next validated brand
        if (selectedBrandId === brandId) {
          const nextValid = updated.candidates.find((c) => c.status === 'VALIDATED');
          if (nextValid) setSelectedBrandId(nextValid.id);
        }
      }
    } catch (err) {
      console.error('Feedback failed:', err);
    }
  };

  const handleInspectEvidence = (evidenceId: string) => {
    setHighlightEvidenceId(evidenceId);
    setIsEvidenceOpen(true);
  };

  const selectedCandidate = activeRun?.candidates.find((c) => c.id === selectedBrandId);
  const selectedPitch = selectedBrandId ? activeRun?.pitches[selectedBrandId] : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#08080A] text-slate-100 font-sans pb-20 selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Header */}
      <Header
        evidenceCount={activeRun?.evidenceRecords.length || 0}
        onOpenEvidence={() => {
          setHighlightEvidenceId(undefined);
          setIsEvidenceOpen(true);
        }}
        onOpenBaseline={() => setIsBaselineOpen(true)}
        onExport={() => activeRun && exportRunToMarkdown(activeRun)}
        isRunActive={Boolean(activeRun && activeRun.stage === 'COMPLETED')}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 flex-1 w-full">
        {/* Hero Value Statement */}
        <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Qloo Agentic AI Hackathon Entry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover Non-Obvious Event Sponsors Backed by Verified Taste Data
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Move past generic demographic decks. SponsorMatch traverses Qloo’s multi-hop taste graph across
            music, dining, fashion, and lifestyle to identify high-lift sponsor matches with 100% auditable evidence.
          </p>
        </div>

        {/* Input Form & Sample Event Presets */}
        <EventForm
          onSubmit={handleCustomSubmit}
          onSelectSample={loadSampleEvent}
          samples={samples}
          isLoading={isLoading}
        />

        {/* Live Pipeline Tracker */}
        {activeRun && (
          <StageTracker
            currentStage={activeRun.stage}
            progress={activeRun.progress}
            statusMessage={activeRun.statusMessage}
            activeCall={activeRun.stage === 'FINDING_BRANDS' ? 'GET /v2/insights (urn:entity:brand)' : undefined}
            isAbstained={activeRun.abstention?.isAbstained}
          />
        )}

        {/* Honest Abstention Banner (Feature F6) */}
        {activeRun?.abstention?.isAbstained && (
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-600/50 shadow-xl space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2.5 text-amber-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-amber-200">
                Agent Visibly Abstained: Insufficient Verified Signals
              </h3>
            </div>
            <p className="text-xs text-amber-300 leading-relaxed font-normal">
              {activeRun.abstention.reason}
            </p>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-800/40 text-[11px] font-mono text-slate-300">
              <span className="text-amber-400 font-bold">Diagnostic:</span> {activeRun.abstention.diagnostic}
            </div>
            <p className="text-[11px] text-slate-400">
              Per PRD Section 7 & Hackathon Grounding Rules: SponsorMatch declines to invent hallucinated sponsor
              matches when data in the taste graph is thin.
            </p>
          </div>
        )}

        {/* Active Results Display */}
        {activeRun && !activeRun.abstention?.isAbstained && activeRun.candidates.length > 0 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Posh Event Header & High-Contrast 4-Up KPI Grid */}
            <EventHeroKPI
              run={activeRun}
              topCandidate={selectedCandidate || activeRun.candidates[0]}
              onOpenEvidence={() => {
                setHighlightEvidenceId(undefined);
                setIsEvidenceOpen(true);
              }}
              onOpenBaseline={() => setIsBaselineOpen(true)}
            />

            {/* Cross-Domain Audience Taste Profile */}
            <TasteProfile tasteProfile={activeRun.tasteProfile} />

            {/* Brand Candidates Table */}
            <BrandTable
              candidates={activeRun.candidates}
              selectedBrandId={selectedBrandId}
              onSelectBrand={(brand) => setSelectedBrandId(brand.id)}
              onRejectBrand={(brand) => setRejectingBrand(brand)}
            />

            {/* Selected Brand Pitch & On-Site Activations */}
            {selectedCandidate && (
              <PitchViewer
                brand={selectedCandidate}
                pitch={selectedPitch}
                onInspectEvidence={handleInspectEvidence}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <EvidenceTrace
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        evidenceRecords={activeRun?.evidenceRecords || []}
        highlightId={highlightEvidenceId}
      />

      <BaselineModal
        isOpen={isBaselineOpen}
        onClose={() => setIsBaselineOpen(false)}
        comparison={activeRun?.baselineComparison}
      />

      <RejectModal
        isOpen={Boolean(rejectingBrand)}
        onClose={() => setRejectingBrand(null)}
        brand={rejectingBrand || undefined}
        onConfirmReject={handleRejectBrand}
      />
    </div>
  );
};
