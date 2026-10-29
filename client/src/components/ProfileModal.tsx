import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Sliders,
  Shield,
  Sparkles,
  Building,
  Mail,
  DollarSign,
  RotateCcw,
  Check,
  Compass,
  AlertTriangle,
  HelpCircle,
  Bell,
  Eye
} from 'lucide-react';
import { UserProfile, CustomerRole } from '../types';
import { AVATAR_COLOR_OPTIONS, ROLE_DETAILS, computeInitials } from '../utils/profileStorage';
import sponsorMatchIcon from '../assets/SponsorMatchAI_icon.jpg';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetProfile: () => void;
}

const COMMON_EXCLUSIONS = [
  'Tobacco & Vaping',
  'Hard Spirits / Liquor',
  'Gambling & Sports Betting',
  'Fast Fashion',
  'Crypto & Web3',
  'Energy Drinks',
  'Fast Food / QSR',
  'Automotive',
  'Defense / Firearms'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onResetProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'strategy' | 'preferences'>('identity');

  // Form state
  const [name, setName] = useState<string>(currentProfile.name);
  const [title, setTitle] = useState<string>(currentProfile.title);
  const [organization, setOrganization] = useState<string>(currentProfile.organization);
  const [email, setEmail] = useState<string>(currentProfile.email);
  const [role, setRole] = useState<CustomerRole>(currentProfile.role);
  const [avatarColor, setAvatarColor] = useState<string>(currentProfile.avatarColor);

  // Strategy & Preferences state
  const [discoveryStrategy, setDiscoveryStrategy] = useState<'challenger_heavy' | 'balanced' | 'prestige_luxury'>(
    currentProfile.preferences.discoveryStrategy
  );
  const [targetDealSize, setTargetDealSize] = useState<string>(currentProfile.preferences.targetDealSize);
  const [defaultCurrency, setDefaultCurrency] = useState<string>(currentProfile.preferences.defaultCurrency);
  const [pitchTone, setPitchTone] = useState<'executive' | 'creative_subculture' | 'experiential'>(
    currentProfile.preferences.pitchTone
  );
  const [excludedCategories, setExcludedCategories] = useState<string[]>(
    currentProfile.preferences.defaultExcludedCategories || []
  );
  const [customExclusionInput, setCustomExclusionInput] = useState<string>('');

  // Diagnostics toggles
  const [showConfidenceScores, setShowConfidenceScores] = useState<boolean>(
    currentProfile.preferences.showConfidenceScores
  );
  const [autoExpandHighLift, setAutoExpandHighLift] = useState<boolean>(
    currentProfile.preferences.autoExpandHighLift
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(
    currentProfile.preferences.notificationsEnabled
  );

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentProfile.name);
      setTitle(currentProfile.title);
      setOrganization(currentProfile.organization);
      setEmail(currentProfile.email);
      setRole(currentProfile.role);
      setAvatarColor(currentProfile.avatarColor);
      setDiscoveryStrategy(currentProfile.preferences.discoveryStrategy);
      setTargetDealSize(currentProfile.preferences.targetDealSize);
      setDefaultCurrency(currentProfile.preferences.defaultCurrency);
      setPitchTone(currentProfile.preferences.pitchTone);
      setExcludedCategories(currentProfile.preferences.defaultExcludedCategories || []);
      setShowConfidenceScores(currentProfile.preferences.showConfidenceScores);
      setAutoExpandHighLift(currentProfile.preferences.autoExpandHighLift);
      setNotificationsEnabled(currentProfile.preferences.notificationsEnabled);
      setSavedSuccess(false);
    }
  }, [isOpen, currentProfile]);

  if (!isOpen) return null;

  const handleAddCustomExclusion = () => {
    const trimmed = customExclusionInput.trim();
    if (trimmed && !excludedCategories.includes(trimmed)) {
      setExcludedCategories([...excludedCategories, trimmed]);
      setCustomExclusionInput('');
    }
  };

  const handleRemoveExclusion = (cat: string) => {
    setExcludedCategories(excludedCategories.filter((c) => c !== cat));
  };

  const togglePresetExclusion = (cat: string) => {
    if (excludedCategories.includes(cat)) {
      handleRemoveExclusion(cat);
    } else {
      setExcludedCategories([...excludedCategories, cat]);
    }
  };

  const handleSave = () => {
    const updated: UserProfile = {
      ...currentProfile,
      name: name.trim() || 'Jamie Davenport',
      title: title.trim() || 'Director of Strategic Sponsorships',
      organization: organization.trim() || 'Vanguard Live & Festivals',
      email: email.trim() || 'jamie.d@vanguardlive.com',
      role,
      avatarColor,
      avatarInitials: computeInitials(name || 'Jamie Davenport'),
      preferences: {
        discoveryStrategy,
        targetDealSize,
        defaultCurrency,
        pitchTone,
        defaultExcludedCategories: excludedCategories,
        showConfidenceScores,
        autoExpandHighLift,
        notificationsEnabled,
      },
    };

    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const activeColorObj = AVATAR_COLOR_OPTIONS.find((c) => c.id === avatarColor) || AVATAR_COLOR_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0c1322] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-white/[0.08] bg-[#090e1c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-teal-500/40 shrink-0 bg-[#080d1a] shadow-sm">
              <img src={sponsorMatchIcon} alt="SponsorMatch AI" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Customer Profile & Preferences
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
                  Customization
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalize your event sponsorship workflows, pitch deck signatures & guardrails
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/[0.07] bg-[#080d1a] px-6">
          <button
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'identity'
                ? 'border-teal-400 text-teal-300 bg-teal-500/[0.04]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Identity</span>
          </button>

          <button
            onClick={() => setActiveTab('strategy')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'strategy'
                ? 'border-teal-400 text-teal-300 bg-teal-500/[0.04]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Sponsorship Strategy</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'preferences'
                ? 'border-teal-400 text-teal-300 bg-teal-500/[0.04]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AI & System Preferences</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: IDENTITY */}
          {activeTab === 'identity' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Persona selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Customer Role & Persona
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(Object.keys(ROLE_DETAILS) as CustomerRole[]).map((r) => {
                    const item = ROLE_DETAILS[r];
                    const isSelected = role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-teal-500/10 border-teal-500/60 shadow-sm'
                            : 'bg-[#0f172a]/60 border-white/[0.06] hover:border-white/20 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg">{item.icon}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-teal-400 stroke-[3]" />}
                        </div>
                        <div className="text-xs font-bold text-white">{item.label}</div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{item.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Details & Avatar */}
              <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${activeColorObj.gradient} flex items-center justify-center text-sm font-black text-slate-950 border border-white/20 shadow-md`}
                    >
                      {computeInitials(name || 'Jamie Davenport')}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {name || 'Jamie Davenport'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {title || 'Director of Strategic Sponsorships'}
                      </div>
                    </div>
                  </div>

                  {/* Color selector */}
                  <div className="flex items-center gap-1.5">
                    {AVATAR_COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAvatarColor(c.id)}
                        className={`w-6 h-6 rounded-full bg-gradient-to-tr ${c.gradient} transition-transform ${
                          avatarColor === c.id ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                      Full Name
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
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Director of Strategic Partnerships"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 mb-1 block">
                      Organization / Company
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
                      Contact Email
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
              </div>
            </div>
          )}

          {/* TAB 2: STRATEGY */}
          {activeTab === 'strategy' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Discovery Strategy */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Target Brand Discovery Strategy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDiscoveryStrategy('challenger_heavy')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      discoveryStrategy === 'challenger_heavy'
                        ? 'bg-teal-500/15 border-teal-500/70 shadow-sm'
                        : 'bg-[#0f172a]/60 border-white/[0.07] text-slate-300'
                    }`}
                  >
                    <div className="text-base mb-1">🚀</div>
                    <div className="text-xs font-bold text-white mb-0.5">High-Lift Challenger</div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Focus on non-obvious cult brands with high mathematical lift over national averages.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscoveryStrategy('balanced')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      discoveryStrategy === 'balanced'
                        ? 'bg-cyan-500/15 border-cyan-500/70 shadow-sm'
                        : 'bg-[#0f172a]/60 border-white/[0.07] text-slate-300'
                    }`}
                  >
                    <div className="text-base mb-1">⚖️</div>
                    <div className="text-xs font-bold text-white mb-0.5">Balanced Mix</div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Balanced mix of high-budget enterprise sponsors and subculture challenger brands.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDiscoveryStrategy('prestige_luxury')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      discoveryStrategy === 'prestige_luxury'
                        ? 'bg-purple-500/15 border-purple-500/70 shadow-sm'
                        : 'bg-[#0f172a]/60 border-white/[0.07] text-slate-300'
                    }`}
                  >
                    <div className="text-base mb-1">💎</div>
                    <div className="text-xs font-bold text-white mb-0.5">Prestige & Luxury</div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Emphasizes high-HHI demographic anchors, luxury lifestyle, and fine spirits.
                    </p>
                  </button>
                </div>
              </div>

              {/* Deal Size, Currency, and Tone */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Target Deal Size
                  </label>
                  <select
                    value={targetDealSize}
                    onChange={(e) => setTargetDealSize(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500/50"
                  >
                    <option value="$25,000 - $50,000">$25k - $50k</option>
                    <option value="$50,000 - $150,000">$50k - $150k</option>
                    <option value="$150,000 - $350,000">$150k - $350k</option>
                    <option value="$350,000+">$350k+</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Default Currency
                  </label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500/50"
                  >
                    <option value="$">USD ($)</option>
                    <option value="€">EUR (€)</option>
                    <option value="£">GBP (£)</option>
                    <option value="C$">CAD (C$)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Pitch Letter Tone
                  </label>
                  <select
                    value={pitchTone}
                    onChange={(e) => setPitchTone(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-500/50"
                  >
                    <option value="executive">Executive CMO</option>
                    <option value="creative_subculture">Subcultural</option>
                    <option value="experiential">Experiential</option>
                  </select>
                </div>
              </div>

              {/* Excluded Sponsor Categories */}
              <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-teal-400" />
                    Default Excluded & Protected Categories
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {excludedCategories.length} active
                  </span>
                </div>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {excludedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExclusion(cat)}
                        className="hover:text-white"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  {excludedCategories.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No exclusions set.</span>
                  )}
                </div>

                {/* Add Custom Category Input */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={customExclusionInput}
                    onChange={(e) => setCustomExclusionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomExclusion();
                      }
                    }}
                    placeholder="Add custom exclusion (e.g. Fintech, Soft Drinks)..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#090d1a] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomExclusion}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-bold text-slate-200 border border-white/10 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Presets Quick Toggles */}
                <div className="pt-2 border-t border-white/[0.05]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                    Common Presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_EXCLUSIONS.map((preset) => {
                      const active = excludedCategories.includes(preset);
                      return (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => togglePresetExclusion(preset)}
                          className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all ${
                            active
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                              : 'bg-white/[0.02] text-slate-400 border-white/[0.05] hover:text-white'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {preset}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI & SYSTEM PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-[#0e1628] border border-white/[0.06] space-y-4">
                <div className="text-xs font-bold text-slate-200 pb-2 border-b border-white/[0.06]">
                  Display & AI Grounding Preferences
                </div>

                {/* Confidence Scores Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">Show Qloo Confidence & Lift Badges</div>
                    <div className="text-[11px] text-slate-400">
                      Display mathematical lift multiplier and evidence count badges on all brand cards.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showConfidenceScores}
                    onChange={(e) => setShowConfidenceScores(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 accent-teal-500 bg-[#090d1a] border-white/20"
                  />
                </label>

                {/* Auto Expand High Lift Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">Auto-Expand High-Lift Affinities</div>
                    <div className="text-[11px] text-slate-400">
                      Automatically highlight cross-domain affinity anchors in audience taste breakdowns.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoExpandHighLift}
                    onChange={(e) => setAutoExpandHighLift(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 accent-teal-500 bg-[#090d1a] border-white/20"
                  />
                </label>

                {/* Notifications Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-white">Enable Real-Time Pipeline Notifications</div>
                    <div className="text-[11px] text-slate-400">
                      Show audio/visual notifications when background Qloo pipeline runs finish.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 accent-teal-500 bg-[#090d1a] border-white/20"
                  />
                </label>
              </div>

              {/* Reset to Demo Profile */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-rose-300">Reset to Default Demo Profile</div>
                  <div className="text-[11px] text-slate-400">
                    Clears local customizations and restores the initial sample organizer profile.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onResetProfile();
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-white/[0.07] bg-[#090e1c] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              savedSuccess
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.35)]'
            }`}
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
