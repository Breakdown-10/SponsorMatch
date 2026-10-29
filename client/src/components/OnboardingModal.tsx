import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Building,
  User,
  Shield,
  Layers,
  Compass,
  ArrowRight,
  Sliders,
  DollarSign,
  Award,
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';
import { UserProfile, CustomerRole, SampleEventDefinition } from '../types';
import { AVATAR_COLOR_OPTIONS, ROLE_DETAILS, computeInitials } from '../utils/profileStorage';
import sponsorMatchIcon from '../assets/SponsorMatchAI_icon.jpg';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  samples: SampleEventDefinition[];
  onSelectSample?: (sample: SampleEventDefinition) => void;
}

const PRESET_EXCLUSIONS = [
  'Tobacco & Vaping',
  'Hard Spirits / Liquor',
  'Gambling & Sports Betting',
  'Fast Fashion',
  'Crypto & Web3',
  'Energy Drinks',
  'Fast Food / QSR',
  'Automotive'
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  samples,
  onSelectSample,
}) => {
  const [step, setStep] = useState<number>(1);
  const [role, setRole] = useState<CustomerRole>(currentProfile.role || 'organizer');
  const [name, setName] = useState<string>(currentProfile.name || '');
  const [title, setTitle] = useState<string>(currentProfile.title || '');
  const [organization, setOrganization] = useState<string>(currentProfile.organization || '');
  const [email, setEmail] = useState<string>(currentProfile.email || '');
  const [avatarColor, setAvatarColor] = useState<string>(currentProfile.avatarColor || 'teal');

  // Strategy & Preferences
  const [discoveryStrategy, setDiscoveryStrategy] = useState<'challenger_heavy' | 'balanced' | 'prestige_luxury'>(
    currentProfile.preferences?.discoveryStrategy || 'challenger_heavy'
  );
  const [targetDealSize, setTargetDealSize] = useState<string>(
    currentProfile.preferences?.targetDealSize || '$50,000 - $150,000'
  );
  const [defaultCurrency, setDefaultCurrency] = useState<string>(
    currentProfile.preferences?.defaultCurrency || '$'
  );
  const [excludedCategories, setExcludedCategories] = useState<string[]>(
    currentProfile.preferences?.defaultExcludedCategories || ['Tobacco & Vaping', 'Hard Spirits / Liquor']
  );
  const [pitchTone, setPitchTone] = useState<'executive' | 'creative_subculture' | 'experiential'>(
    currentProfile.preferences?.pitchTone || 'executive'
  );
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sonar-barcelona');

  if (!isOpen) return null;

  const toggleExclusion = (cat: string) => {
    setExcludedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleFinish = () => {
    const updatedProfile: UserProfile = {
      ...currentProfile,
      name: name.trim() || 'Jamie Davenport',
      title: title.trim() || 'Director of Strategic Sponsorships',
      organization: organization.trim() || 'Vanguard Live & Festivals',
      email: email.trim() || 'jamie.d@vanguardlive.com',
      role,
      avatarColor,
      avatarInitials: computeInitials(name || 'Jamie Davenport'),
      preferences: {
        ...currentProfile.preferences,
        discoveryStrategy,
        targetDealSize,
        defaultCurrency,
        defaultExcludedCategories: excludedCategories,
        pitchTone,
      },
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString(),
    };

    onSaveProfile(updatedProfile);

    // If user picked a pre-warmed sample, load it
    if (onSelectSample && selectedSampleId) {
      const targetSample = samples.find((s) => s.id === selectedSampleId);
      if (targetSample) {
        onSelectSample(targetSample);
      }
    }

    onClose();
  };

  const activeColorObj = AVATAR_COLOR_OPTIONS.find((c) => c.id === avatarColor) || AVATAR_COLOR_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1120] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-teal-500 to-transparent" />

        {/* Modal Top Bar */}
        <div className="p-5 sm:p-6 border-b border-white/[0.07] bg-[#090e1c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-teal-500/40 shrink-0 bg-[#080d1a] shadow-sm">
              <img src={sponsorMatchIcon} alt="SponsorMatch AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Welcome to SponsorMatch AI
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  First-Time Setup
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Setup your customer profile and sponsorship discovery preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Skip onboarding"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-6 py-3 bg-[#080d1a] border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 text-xs font-semibold">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 ${step === 1 ? 'text-teal-400 font-bold' : step > 1 ? 'text-slate-300' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-teal-500 text-slate-950 font-black' : step > 1 ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-slate-400'}`}>
                {step > 1 ? '✓' : '1'}
              </span>
              <span>1. Your Role & Identity</span>
            </button>

            <span className="text-slate-600">/</span>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 ${step === 2 ? 'text-teal-400 font-bold' : step > 2 ? 'text-slate-300' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-teal-500 text-slate-950 font-black' : step > 2 ? 'bg-teal-500/20 text-teal-400' : 'bg-white/10 text-slate-400'}`}>
                {step > 2 ? '✓' : '2'}
              </span>
              <span>2. Sponsorship Strategy</span>
            </button>

            <span className="text-slate-600">/</span>

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 ${step === 3 ? 'text-teal-400 font-bold' : 'text-slate-500'}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-teal-500 text-slate-950 font-black' : 'bg-white/10 text-slate-400'}`}>
                3
              </span>
              <span>3. Tour & Launch</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Step {step} of 3
          </span>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* STEP 1: IDENTITY & ROLE */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Persona Selector Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Select Your Primary Workflow Role
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(ROLE_DETAILS) as CustomerRole[]).map((r) => {
                    const item = ROLE_DETAILS[r];
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-teal-500/10 border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                            : 'bg-[#0f172a]/60 border-white/[0.07] hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">{item.icon}</span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center text-slate-950 text-xs font-bold">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-white mb-0.5">{item.label}</div>
                        <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Identity Form Fields */}
              <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <span className="text-xs font-bold text-slate-200">Personal & Organization Details</span>
                  {/* Live Avatar Preview */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">Avatar Preview:</span>
                    <div
                      className={`w-7 h-7 rounded-full bg-gradient-to-tr ${activeColorObj.gradient} flex items-center justify-center text-[10px] font-bold text-slate-950 border border-white/30`}
                    >
                      {computeInitials(name || 'Jamie Davenport')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jamie Davenport"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                      Job Title / Role
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Director of Strategic Sponsorships"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                      Organization / Festival Name
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Vanguard Live & Festivals"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. jamie.d@vanguardlive.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                </div>

                {/* Avatar Color Scheme */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                    Choose Avatar Color Theme
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {AVATAR_COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAvatarColor(c.id)}
                        className={`h-7 px-3 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border transition-all ${
                          avatarColor === c.id
                            ? 'bg-white/10 text-white border-teal-400 shadow-sm'
                            : 'bg-white/[0.03] text-slate-400 border-white/[0.06] hover:text-white'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full bg-gradient-to-tr ${c.gradient}`} />
                        <span>{c.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SPONSORSHIP STRATEGY & GUARDRAILS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Strategy Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Brand Discovery Strategy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setDiscoveryStrategy('challenger_heavy')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      discoveryStrategy === 'challenger_heavy'
                        ? 'bg-teal-500/15 border-teal-500/70 shadow-[0_0_15px_rgba(20,184,166,0.25)]'
                        : 'bg-[#0f172a]/60 border-white/[0.07] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-base mb-1">🚀</div>
                    <div className="text-xs font-bold text-white mb-0.5">High-Lift Challenger</div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Prioritizes non-obvious brands with massive cultural lift for your crowd over national behemoths.
                    </p>
                    <span className="inline-block mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
                      Recommended
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscoveryStrategy('balanced')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      discoveryStrategy === 'balanced'
                        ? 'bg-cyan-500/15 border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'bg-[#0f172a]/60 border-white/[0.07] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-base mb-1">⚖️</div>
                    <div className="text-xs font-bold text-white mb-0.5">Balanced Portfolio</div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Equal balance between high-budget anchor sponsors and niche high-affinity challenger activations.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscoveryStrategy('prestige_luxury')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      discoveryStrategy === 'prestige_luxury'
                        ? 'bg-purple-500/15 border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                        : 'bg-[#0f172a]/60 border-white/[0.07] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="text-base mb-1">💎</div>
                    <div className="text-xs font-bold text-white mb-0.5">Prestige & Luxury</div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Emphasizes high-HHI lifestyle, artisan dining, and elevated fashion affinity anchors.
                    </p>
                  </button>
                </div>
              </div>

              {/* Deal Size & Currency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-2">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-teal-400" />
                    Target Sponsorship Fee Tier
                  </label>
                  <select
                    value={targetDealSize}
                    onChange={(e) => setTargetDealSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500/50"
                  >
                    <option value="$25,000 - $50,000">$25,000 - $50,000 (Emerging / Boutique)</option>
                    <option value="$50,000 - $150,000">$50,000 - $150,000 (Mid-Tier Festival)</option>
                    <option value="$150,000 - $350,000">$150,000 - $350,000 (Major Mainstage)</option>
                    <option value="$350,000+">$350,000+ (Headlining Enterprise)</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-2">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-teal-400" />
                    Preferred Currency & Pitch Tone
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={defaultCurrency}
                      onChange={(e) => setDefaultCurrency(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500/50"
                    >
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                      <option value="£">GBP (£)</option>
                      <option value="C$">CAD (C$)</option>
                    </select>

                    <select
                      value={pitchTone}
                      onChange={(e) => setPitchTone(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500/50"
                    >
                      <option value="executive">Executive CMO</option>
                      <option value="creative_subculture">Subcultural</option>
                      <option value="experiential">Experiential</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category Exclusions Guardrails */}
              <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-400" />
                    Default Excluded / Protected Sponsor Categories
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {excludedCategories.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Click to toggle categories you already have locked contracts with or want strictly excluded:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_EXCLUSIONS.map((cat) => {
                    const isExcluded = excludedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleExclusion(cat)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          isExcluded
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                            : 'bg-white/[0.04] text-slate-400 border border-white/[0.07] hover:text-white'
                        }`}
                      >
                        <span>{isExcluded ? '✕' : '+'}</span>
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PLATFORM TOUR & INSTANT LAUNCH */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* How SponsorMatch AI Works Tour */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    How SponsorMatch AI Grounds Every Recommendation
                  </label>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    100% Grounded
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-white/[0.08] space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-black">
                      1
                    </div>
                    <div className="text-xs font-bold text-white">Taste Graph Traversal</div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Traverses real entity affinities across music, fashion, dining, and media via Qloo APIs.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-white/[0.08] space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-black">
                      2
                    </div>
                    <div className="text-xs font-bold text-white">Log-Scale Lift Engine</div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Normalizes against national popularity to highlight challenger brands with genuine affinity lift.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-white/[0.08] space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-black">
                      3
                    </div>
                    <div className="text-xs font-bold text-white">Evidence Trace & Deck</div>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      Generates turnkey CMO pitch decks with clickable footnote evidence records for every single claim.
                    </p>
                  </div>
                </div>
              </div>

              {/* Immediate Event Preset Selector */}
              <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    Select Pre-Warmed Event To Launch Immediately
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
                    Instant sub-second load
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {samples.slice(0, 4).map((sample) => {
                    const isSelected = selectedSampleId === sample.id;
                    return (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => setSelectedSampleId(sample.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-teal-500/15 border-teal-500/60 shadow-[0_0_12px_rgba(20,184,166,0.25)]'
                            : 'bg-[#090d1a] border-white/[0.06] hover:border-white/20 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                          <span>{sample.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 stroke-[3]" />}
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{sample.tagline}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-white/[0.07] bg-[#090e1c] flex items-center justify-between">
          <div>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-300 transition-all"
              >
                Skip for now
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_0_20px_rgba(20,184,166,0.35)] transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Launch SponsorMatch AI</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
