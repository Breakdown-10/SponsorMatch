import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { HeroEventBanner } from './components/HeroEventBanner';
import { TopSponsorMatches } from './components/TopSponsorMatches';
import { AudienceAffinityOverview } from './components/AudienceAffinityOverview';
import { SponsorRecommendationsTable } from './components/SponsorRecommendationsTable';
import { SidebarWidgets } from './components/SidebarWidgets';
import { BrandPitchSection } from './components/BrandPitchSection';
import { FooterBanner } from './components/FooterBanner';
import { EvidenceTrace } from './components/EvidenceTrace';
import { BaselineModal } from './components/BaselineModal';
import { RejectModal } from './components/RejectModal';
import { CustomEventModal } from './components/CustomEventModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { exportRunToMarkdown } from './utils/export';
import {
  EventInput,
  RunState,
  SampleEventDefinition,
  BrandCandidate,
  UserProfile,
} from './types';
import {
  getStoredProfile,
  saveStoredProfile,
  resetStoredProfile,
  hasCompletedOnboarding,
  setOnboardingCompleted,
} from './utils/profileStorage';
import { ShieldAlert, CheckCircle2, Sparkles, X } from 'lucide-react';

export const App: React.FC = () => {
  const [samples, setSamples] = useState<SampleEventDefinition[]>([]);
  const [activeRun, setActiveRun] = useState<RunState | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals & Drawers
  const [isEvidenceOpen, setIsEvidenceOpen] = useState<boolean>(false);
  const [isBaselineOpen, setIsBaselineOpen] = useState<boolean>(false);
  const [isCustomEventOpen, setIsCustomEventOpen] = useState<boolean>(false);
  const [rejectingBrand, setRejectingBrand] = useState<BrandCandidate | null>(null);
  const [highlightEvidenceId, setHighlightEvidenceId] = useState<string | undefined>(undefined);

  // Customer Profile & Onboarding State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getStoredProfile());
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    saveStoredProfile(updated);
    triggerToast('Profile & preferences updated successfully!');
  };

  const handleResetProfile = () => {
    const defaultProfile = resetStoredProfile();
    setUserProfile(defaultProfile);
    triggerToast('Reset to default demo organizer profile.');
  };

  const handleCompleteOnboarding = (updated: UserProfile) => {
    setUserProfile(updated);
    saveStoredProfile(updated);
    setOnboardingCompleted(true);
    triggerToast(`Welcome to SponsorMatch AI, ${updated.name}!`);
  };

  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    setOnboardingCompleted(true);
  };

  // Check onboarding tour on initial visit
  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      const timer = setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch pre-warmed samples on mount
  useEffect(() => {
    fetch('/api/samples')
      .then((res) => res.json())
      .then((data: SampleEventDefinition[]) => {
        setSamples(data);
        // Default to Sónar Festival Barcelona 2026 to match target design!
        if (data.length > 0) {
          const defaultSample = data.find(s => s.id === 'sonar-barcelona') || data[0];
          loadSampleEvent(defaultSample);
        }
      })
      .catch((err) => console.error('Failed to load samples:', err));
  }, []);

  const loadSampleEvent = async (sample: SampleEventDefinition) => {
    setIsLoading(true);
    setHighlightEvidenceId(undefined);
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
    setHighlightEvidenceId(undefined);

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
            setIsCustomEventOpen(false);
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

  const selectedCandidate = activeRun?.candidates.find((c) => c.id === selectedBrandId) || activeRun?.candidates[0];
  const selectedPitch = selectedCandidate ? activeRun?.pitches[selectedCandidate.id] : undefined;

  return (
    <div className="min-h-screen flex bg-[#070b14] text-slate-100 font-sans selection:bg-teal-500/20 selection:text-teal-300">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        evidenceCount={activeRun?.evidenceRecords.length || 0}
        onOpenEvidence={() => {
          setHighlightEvidenceId(undefined);
          setIsEvidenceOpen(true);
        }}
        onOpenNewAnalysis={() => setIsCustomEventOpen(true)}
        onOpenBaseline={() => setIsBaselineOpen(true)}
        userProfile={userProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* 2. Main Content Scroll Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Sticky Top Navbar */}
        <TopNavbar
          samples={samples}
          onSelectSample={loadSampleEvent}
          currentEventName={activeRun?.input.eventName}
          onOpenNewAnalysis={() => setIsCustomEventOpen(true)}
          userProfile={userProfile}
          onOpenProfile={() => setIsProfileOpen(true)}
          onResetProfile={handleResetProfile}
        />

        {/* Page Inner Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1400px] w-full mx-auto">
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
            </div>
          )}

          {activeRun && (
            <>
              {/* Event Hero Concert Banner */}
              <HeroEventBanner
                run={activeRun}
                onBackToEvents={() => setIsCustomEventOpen(true)}
                onEditEvent={() => setIsCustomEventOpen(true)}
              />

              {/* Top Sponsor Matches Horizontal Cards */}
              <TopSponsorMatches
                candidates={activeRun.candidates}
                selectedBrandId={selectedBrandId}
                onSelectBrand={(brand) => setSelectedBrandId(brand.id)}
                onViewAllMatches={() => {
                  const el = document.getElementById('sponsor-recommendations-table');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />

              {/* Middle Section: Two Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (8 cols ~ 67% width) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Audience Affinity Overview */}
                  <AudienceAffinityOverview
                    tasteProfile={activeRun.tasteProfile}
                    candidates={activeRun.candidates}
                    eventName={activeRun.input.eventName}
                  />

                  {/* Sponsor Recommendations Table */}
                  <div id="sponsor-recommendations-table">
                    <SponsorRecommendationsTable
                      candidates={activeRun.candidates}
                      selectedBrandId={selectedBrandId}
                      onSelectBrand={(brand) => setSelectedBrandId(brand.id)}
                      onRejectBrand={(brand) => setRejectingBrand(brand)}
                    />
                  </div>
                </div>

                {/* Right Column (4 cols ~ 33% width) */}
                <div className="lg:col-span-4">
                  <SidebarWidgets
                    onOpenNewAnalysis={() => setIsCustomEventOpen(true)}
                    onOpenBaseline={() => setIsBaselineOpen(true)}
                    onOpenEvidence={() => {
                      setHighlightEvidenceId(undefined);
                      setIsEvidenceOpen(true);
                    }}
                    onExport={() => activeRun && exportRunToMarkdown(activeRun)}
                    isRunActive={Boolean(activeRun && activeRun.stage === 'COMPLETED')}
                    run={activeRun}
                  />
                </div>
              </div>

              {/* Bottom Section: Selected Brand Pitch & Activations */}
              {selectedCandidate && (
                <BrandPitchSection
                  brand={selectedCandidate}
                  pitch={selectedPitch}
                  onInspectEvidence={handleInspectEvidence}
                  onRejectBrand={(brand) => setRejectingBrand(brand)}
                  eventName={activeRun.input.eventName}
                  userProfile={userProfile}
                />
              )}

              {/* Bottom Footer Banner */}
              <FooterBanner
                onOpenEvidence={() => {
                  setHighlightEvidenceId(undefined);
                  setIsEvidenceOpen(true);
                }}
              />
            </>
          )}
        </main>
      </div>

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

      <CustomEventModal
        isOpen={isCustomEventOpen}
        onClose={() => setIsCustomEventOpen(false)}
        onSubmit={handleCustomSubmit}
        onSelectSample={loadSampleEvent}
        samples={samples}
        isLoading={isLoading}
        currentStage={activeRun?.stage}
        progress={activeRun?.progress}
        statusMessage={activeRun?.statusMessage}
        isAbstained={activeRun?.abstention?.isAbstained}
        defaultExclusions={userProfile.preferences.defaultExcludedCategories}
      />

      {/* Profile Customization Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
        onResetProfile={handleResetProfile}
      />

      {/* Customer Onboarding Wizard (One-time only for first-time users) */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
        currentProfile={userProfile}
        onSaveProfile={handleCompleteOnboarding}
        samples={samples}
        onSelectSample={loadSampleEvent}
      />

      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#0c1628] border border-teal-500/40 text-teal-300 text-xs font-bold shadow-2xl animate-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
