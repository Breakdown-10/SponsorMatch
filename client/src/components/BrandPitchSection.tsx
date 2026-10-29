import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  ExternalLink,
  DollarSign,
  ThumbsDown,
  ShieldCheck,
  TrendingUp,
  Users,
  Flame,
  Award,
  Mail
} from 'lucide-react';
import { BrandCandidate, BrandPitch, UserProfile } from '../types';
import { BrandLogo } from './BrandLogos';

interface BrandPitchSectionProps {
  brand: BrandCandidate;
  pitch?: BrandPitch;
  onInspectEvidence?: (evidenceId: string) => void;
  onRejectBrand?: (brand: BrandCandidate) => void;
  eventName?: string;
  userProfile?: UserProfile;
}

type SponsorshipTierKey = 'TITLE' | 'STAGE' | 'OFFICIAL' | 'VIP';

interface TierEconomics {
  label: string;
  badge: string;
  feeRange: string;
  reach: string;
  roi: string;
  footprint: string;
  description: string;
}

export const BrandPitchSection: React.FC<BrandPitchSectionProps> = ({
  brand,
  pitch,
  onInspectEvidence,
  onRejectBrand,
  eventName = 'This Event',
  userProfile,
}) => {
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SponsorshipTierKey>('OFFICIAL');

  const score = brand.matchScore || Math.round(brand.rawAffinity * 100);
  const lift = brand.liftMultiple || 1.25;

  // Dynamic Tier-based Economics Calculator
  const baseRate = Math.round(50 + lift * 25);
  const tiers: Record<SponsorshipTierKey, TierEconomics> = {
    TITLE: {
      label: 'Headline Presenter',
      badge: 'Tier 1 Exclusive',
      feeRange: `$${Math.round(baseRate * 2.8)},000 – $${Math.round(baseRate * 3.8)},000`,
      reach: '100% of Festival Attendees (120k+ Impressions)',
      roi: `${(3.6 + lift * 0.5).toFixed(1)}x Projected Media ROI`,
      footprint: 'Co-Branded Main Stage + Festival App Takeover + VIP Suite',
      description: 'Maximum visibility with category exclusivity and festival co-titling rights.'
    },
    STAGE: {
      label: 'Stage Naming Rights',
      badge: 'High Impact',
      feeRange: `$${Math.round(baseRate * 1.6)},000 – $${Math.round(baseRate * 2.2)},000`,
      reach: '65,000 – 85,000 Dedicated Fans',
      roi: `${(3.0 + lift * 0.4).toFixed(1)}x Projected Media ROI`,
      footprint: 'Dedicated Secondary Stage Takeover + Soundscape Installation',
      description: 'Dominant cultural ownership of a genre-defining performance space.'
    },
    OFFICIAL: {
      label: 'Official Category Partner',
      badge: 'Core Alignment',
      feeRange: pitch?.dealEconomics?.recommendedFeeRange || `$${baseRate},000 – $${Math.round(baseRate * 1.5)},000`,
      reach: pitch?.dealEconomics?.projectedTargetAttendees || '40,000 – 60,000 High-Affinity Fans',
      roi: pitch?.dealEconomics?.projectedRoiMultiple || `${(2.4 + lift * 0.4).toFixed(1)}x Media ROI`,
      footprint: 'Interactive Brand Hub + Concessions & Sampling Integration',
      description: 'Direct experiential touchpoint aligned with verified attendee affinities.'
    },
    VIP: {
      label: 'VIP & Artist Lounge',
      badge: 'Boutique Experiential',
      feeRange: `$${Math.round(baseRate * 0.7)},000 – $${Math.round(baseRate * 0.95)},000`,
      reach: '5,000 VIP Attendees, Creators & Headlining Artists',
      roi: `${(2.8 + lift * 0.3).toFixed(1)}x Projected Media ROI`,
      footprint: 'Curated Backstage Hospitality & Private Creator Sanctuary',
      description: 'Intimate engagement with tastemakers, influencers, and VIP patrons.'
    }
  };

  const activeEconomics = tiers[selectedTier];

  // Activations from pitch or defaults
  const activations = pitch?.activations && pitch.activations.length >= 3
    ? pitch.activations.slice(0, 3)
    : [
        {
          title: `Interactive ${brand.name} Cultural Space`,
          description: `A branded experiential takeover with emerging creators, ambient sound, and product sampling tailored for ${eventName}.`,
          footprint: '40x40 Experiential Zone',
          costTier: '$$$' as const,
          culturalRationale: 'Direct overlap with primary performer subculture.',
          linkedAffinities: brand.keyAffinities || ['Music', 'Lifestyle'],
          imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        },
        {
          title: 'Creator Lab & Live Studio',
          description: 'Interactive workshops and content studio for digital tastemakers, artists, and live broadcast capture.',
          footprint: '25x30 Modular Hub',
          costTier: '$$' as const,
          culturalRationale: 'Over-indexes among festival innovators and creative tech producers.',
          linkedAffinities: ['Creative Tech', 'Digital Art'],
          imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
        },
        {
          title: 'Eco-Hydration & Relaxation Sanctuary',
          description: 'Sustainable chill-out lounge with zero-waste refreshments, device charging, and ambient soundscapes.',
          footprint: '30x30 Shaded Pavilion',
          costTier: '$$' as const,
          culturalRationale: 'High affinity for sustainable lifestyle and mindful festival experiences.',
          linkedAffinities: ['Sustainability', 'Wellness'],
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        },
      ];

  const executiveSummary = pitch?.executiveSummary ||
    `${brand.name}'s identity resonates with this event's high-affinity audience, yielding a mathematical cultural lift of ${lift}x over general consumer baselines. Derived from Qloo's taste graph across music, lifestyle, and consumption behaviors, the partnership feels organic rather than commercial intrusion.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(executiveSummary);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleCopyEmail = () => {
    const footnotesText = pitch?.evidenceFootnotes && pitch.evidenceFootnotes.length > 0
      ? pitch.evidenceFootnotes.map((fn, i) => `[${i + 1}] ${fn.claim} (${fn.metric})`).join('\n')
      : `[1] Verified ${lift}x cultural affinity lift over national baseline via Qloo Taste Graph.`;

    const emailTemplate = `Subject: Strategic Partnership Proposal: ${eventName} x ${brand.name}

Dear ${brand.name} Brand & Partnerships Team,

I am writing regarding an evidence-backed partnership opportunity for ${eventName}.

Rather than relying on blunt demographic assumptions, our partnership intelligence platform (SponsorMatch AI, powered by Qloo's cultural taste graph) identified ${brand.name} as our #1 cultural resonance partner.

WHY THIS AUDIENCE IS YOUR AUDIENCE:
- Cultural Lift Multiple: ${lift}x over baseline consumer engagement
- Audience Match Score: ${score}/100 verified affinity
- Multi-Domain Affinities: ${brand.keyAffinities?.join(', ') || brand.category}

RECOMMENDED SPONSORSHIP PACKAGE (${activeEconomics.label.toUpperCase()}):
- Investment Tier: ${activeEconomics.feeRange}
- High-Affinity Target Reach: ${activeEconomics.reach}
- Projected Media ROI: ${activeEconomics.roi}
- Activation Footprint: ${activeEconomics.footprint}

PROPOSED ON-SITE ACTIVATIONS:
${activations.map((a, i) => `${i + 1}. ${a.title} (${a.costTier})\n   ${a.description}\n   Space: ${a.footprint}`).join('\n\n')}

VERIFIABLE EVIDENCE:
${footnotesText}

We would love to share the full Qloo evidence ledger and explore tailored activations with your team. Do you have 15 minutes this week for a brief conversation?

Best regards,
${userProfile?.name || 'Jamie Davenport'}
${userProfile?.title || 'Director of Strategic Sponsorships'}${userProfile?.organization ? ` | ${userProfile.organization}` : ` | ${eventName}`}
${userProfile?.email ? `Contact: ${userProfile.email}` : ''}`;

    navigator.clipboard.writeText(emailTemplate);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section className="space-y-5 pt-2">
      {/* Header & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
            <Sparkles className="w-3.5 h-3.5 fill-teal-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Partnership Pitch & Deal Economics
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Pitch Summary */}
          <button
            onClick={handleCopyPitch}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Copy executive summary"
          >
            {copiedPitch ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedPitch ? 'Copied' : 'Copy Pitch'}</span>
          </button>

          {/* Copy Full CMO Outreach Email */}
          <button
            onClick={handleCopyEmail}
            className="px-3 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            title="Copy complete ready-to-send CMO pitch letter"
          >
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Mail className="w-3.5 h-3.5 text-teal-400" />}
            <span>{copiedEmail ? 'Email Copied!' : 'Copy CMO Email'}</span>
          </button>

          {/* Download / Print 1-Pager */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/[0.08] text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Print or save PDF 1-pager"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Print 1-Pager</span>
          </button>

          {/* Reject / Feedback Button (Feature F10) */}
          {onRejectBrand && (
            <button
              onClick={() => onRejectBrand(brand)}
              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Add constraint or reject brand (re-ranks on existing evidence without extra quota)"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>Exclude Brand</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: Left Pitch Narrative (5 cols) & Right Activation Cards (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Pitch Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0d1424] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Brand Header */}
            <div className="flex items-center gap-3">
              <BrandLogo name={brand.name} size="md" className="shrink-0" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    {brand.name}
                  </h3>
                  {!brand.isObvious && lift >= 1.2 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Flame className="w-3 h-3 fill-amber-400" />
                      High Lift Gem
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#162138] text-indigo-300 border border-indigo-500/20">
                    {brand.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30 font-mono">
                    Match: {score}% • Lift: {lift}x
                  </span>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="text-xs font-bold text-teal-300/90 leading-snug">
              {pitch?.headline || `Connecting ${brand.name} with ${eventName}'s Culturally Aligned Audience`}
            </div>

            {/* Pitch Narrative */}
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {executiveSummary}
            </p>

            {/* Why This Audience */}
            {pitch?.whyThisAudience && (
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Verified Cultural Alignment
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {pitch.whyThisAudience}
                </p>
              </div>
            )}
          </div>

          {/* Verifiable Evidence Footnotes (Clickable) */}
          {pitch?.evidenceFootnotes && pitch.evidenceFootnotes.length > 0 && (
            <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verifiable Evidence Citations</span>
              </div>
              <div className="space-y-1">
                {pitch.evidenceFootnotes.slice(0, 2).map((fn, i) => (
                  <button
                    key={i}
                    onClick={() => onInspectEvidence && onInspectEvidence(fn.evidenceId)}
                    className="w-full text-left p-1.5 rounded-lg bg-[#090e1a] hover:bg-teal-500/10 border border-white/[0.04] hover:border-teal-500/30 text-[10px] text-slate-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">
                      [{i + 1}] {fn.claim} ({fn.metric})
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-teal-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Activation Concepts (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              On-Site Experiential Activations
            </h3>
            <span className="text-[10px] text-slate-500">
              Culturally grounded in attendee lifestyle
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {activations.map((concept, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1424] flex flex-col justify-end group shadow-lg min-h-[220px]"
              >
                {/* Photo Background */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${concept.imageUrl}')` }}
                />
                {/* Gradient shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/85 to-transparent" />

                {/* Content overlay */}
                <div className="relative z-10 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Tier {concept.costTier}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {concept.footprint}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white tracking-tight leading-snug group-hover:text-teal-300 transition-colors">
                    {concept.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-snug font-normal line-clamp-3">
                    {concept.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Sponsorship Economics & Valuation Tier (Posh Style) */}
      <div className="bg-[#0d1424] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Deal Economics & Tier Simulator
              </h3>
              <p className="text-[10px] text-slate-400">
                Interactive package valuation based on cultural lift and attendee reach
              </p>
            </div>
          </div>

          {/* Tier Pills Selector */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#090e1a] border border-white/[0.08]">
            {(Object.keys(tiers) as SponsorshipTierKey[]).map((tierKey) => (
              <button
                key={tierKey}
                onClick={() => setSelectedTier(tierKey)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedTier === tierKey
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tiers[tierKey].label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Recommended Fee */}
          <div className="p-3.5 rounded-xl bg-[#090e1a] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Asking Fee Range</span>
            </div>
            <div className="text-sm font-extrabold text-emerald-400 font-mono">
              {activeEconomics.feeRange}
            </div>
            <div className="text-[10px] text-slate-500">
              {activeEconomics.badge}
            </div>
          </div>

          {/* Card 2: Projected Reach */}
          <div className="p-3.5 rounded-xl bg-[#090e1a] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Users className="w-3 h-3 text-teal-400" />
              <span>Target Fan Reach</span>
            </div>
            <div className="text-sm font-extrabold text-white font-mono truncate">
              {activeEconomics.reach}
            </div>
            <div className="text-[10px] text-slate-500">
              Verified high-affinity crowd
            </div>
          </div>

          {/* Card 3: Cultural Resonance Lift */}
          <div className="p-3.5 rounded-xl bg-[#090e1a] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              <span>Resonance Multiplier</span>
            </div>
            <div className="text-sm font-extrabold text-cyan-400 font-mono">
              {lift}x Lift
            </div>
            <div className="text-[10px] text-slate-500">
              Over general baseline
            </div>
          </div>

          {/* Card 4: Projected Media ROI */}
          <div className="p-3.5 rounded-xl bg-[#090e1a] border border-white/[0.06] space-y-1">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Award className="w-3 h-3 text-amber-400" />
              <span>Projected ROI</span>
            </div>
            <div className="text-sm font-extrabold text-amber-400 font-mono">
              {activeEconomics.roi}
            </div>
            <div className="text-[10px] text-slate-500">
              Estimated media value
            </div>
          </div>
        </div>

        {/* Footprint description */}
        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-slate-400">
            <strong className="text-slate-200">Recommended Footprint:</strong> {activeEconomics.footprint}
          </span>
          <span className="text-[11px] text-teal-400 font-medium">
            {activeEconomics.description}
          </span>
        </div>
      </div>
    </section>
  );
};
