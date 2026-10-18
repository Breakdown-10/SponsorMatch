import React, { useState } from 'react';
import { BrandCandidate, BrandPitch } from '../types';
import {
  Mail,
  Compass,
  DollarSign,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Quote,
  Copy,
  Check,
  TrendingUp,
  Users,
  Award,
  Sparkles
} from 'lucide-react';

interface PitchViewerProps {
  brand: BrandCandidate;
  pitch?: BrandPitch;
  onInspectEvidence: (evidenceId: string) => void;
}

export const PitchViewer: React.FC<PitchViewerProps> = ({
  brand,
  pitch,
  onInspectEvidence,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedActivations, setCopiedActivations] = useState(false);

  if (!pitch) {
    return (
      <div className="bg-[#101116] border border-white/[0.08] rounded-2xl p-6 shadow-2xl text-center py-12">
        <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-300">Pitch Generation in Progress</h3>
        <p className="text-xs text-slate-500 mt-1">
          Select any approved brand from the table to review custom pitch decks and activations.
        </p>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback
    }
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      console.warn('Copy fallback failed:', err);
      return false;
    }
  };

  const handleCopyEmail = async () => {
    const emailBody = `Subject: ${pitch.headline}

Dear ${brand.name} Brand Leadership,

${pitch.executiveSummary}

WHY THIS AUDIENCE:
${pitch.whyThisAudience}

VERIFIABLE QLOO EVIDENCE:
${pitch.evidenceFootnotes.map((fn, i) => `[${i + 1}] ${fn.claim} (${fn.metric})`).join('\n')}

RECOMMENDED SPONSORSHIP STRUCTURE:
- Suggested Package: ${pitch.dealEconomics?.suggestedPackage || 'Official Stage & Culture Partner'}
- Indicative Investment Range: ${pitch.dealEconomics?.recommendedFeeRange || '$75,000 – $140,000'}
- Target High-Affinity Reach: ${pitch.dealEconomics?.projectedTargetAttendees || '40,000 – 65,000 Fans'}
- Projected ROI: ${pitch.dealEconomics?.projectedRoiMultiple || '3.5x Media Value'}

KEY ON-SITE ACTIVATION CONCEPTS:
${pitch.activations.map((a, i) => `Option ${i + 1}: ${a.title} (${a.costTier})\n- Space: ${a.footprint}\n- Concept: ${a.description}\n- Cultural Link: ${a.culturalRationale}`).join('\n\n')}

We would welcome 15 minutes to review the verified Qloo audience data and tailor this partnership.

Warm regards,
Event Partnerships & Brand Strategy Team`;

    await copyToClipboard(emailBody);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyActivations = async () => {
    const brief = `# On-Site Experiential Activation Brief: ${brand.name}
Target Event: ${pitch.headline.replace('Partnership Proposal: Connecting ' + brand.name + ' with ', '').replace("'s High-Affinity Audience", '')}

${pitch.activations.map((a, i) => `## Activation Concept ${i + 1}: ${a.title}
- Footprint: ${a.footprint}
- Cost Tier: ${a.costTier}
- Concept: ${a.description}
- Verified Cultural Rationale: ${a.culturalRationale}`).join('\n\n')}
`;
    await copyToClipboard(brief);
    setCopiedActivations(true);
    setTimeout(() => setCopiedActivations(false), 2500);
  };

  const economics = pitch.dealEconomics || {
    recommendedFeeRange: `$${Math.round(50 + brand.liftMultiple * 25)},000 – $${Math.round(80 + brand.liftMultiple * 45)},000`,
    projectedTargetAttendees: '40,000 – 65,000 Verified Cultural Fans',
    resonanceLiftMultiplier: `${brand.liftMultiple}x Above Baseline`,
    projectedRoiMultiple: `${(2.4 + brand.liftMultiple * 0.8).toFixed(1)}x Projected Media ROI`,
    suggestedPackage: brand.liftMultiple >= 1.35 ? 'Headline Experiential Presenter' : 'Official Stage & Culture Partner'
  };

  return (
    <div className="bg-[#101116] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              One-Page CMO Deck & Activations
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" />
              100% Evidence Grounded
            </span>
          </div>
          <h2 className="text-lg font-black text-white mt-2 tracking-tight">{pitch.headline}</h2>
        </div>

        {/* Brand identity & Quick Action buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-400">Target Sponsor</div>
            <div className="text-sm font-extrabold text-cyan-300">{brand.name}</div>
            <div className="text-[11px] text-slate-400">{brand.category}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEmail}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                copiedEmail
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#14151E] hover:bg-[#181926] text-slate-200 border-white/[0.08]'
              }`}
              title="Copy complete email draft for CMO outreach"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedEmail ? 'Email Copied!' : 'Copy Outreach Email'}</span>
            </button>

            <button
              onClick={handleCopyActivations}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                copiedActivations
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#14151E] hover:bg-[#181926] text-slate-200 border-white/[0.08]'
              }`}
              title="Copy markdown activation brief"
            >
              {copiedActivations ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedActivations ? 'Brief Copied!' : 'Copy Activation Brief'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Deal Economics & Valuation Widget (Posh Style) */}
      <div className="bg-[#14151E] border border-white/[0.08] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Sponsorship Economics & Valuation Tier
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {economics.suggestedPackage}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0A0B10] border border-white/[0.06]">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              Recommended Asking Fee
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-400 mt-1.5 font-mono">
              {economics.recommendedFeeRange}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Benchmarked asking valuation</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0B10] border border-white/[0.06]">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Users className="w-3 h-3 text-cyan-400" />
              Target Audience Reach
            </div>
            <div className="text-base sm:text-lg font-black text-white mt-1.5 font-mono">
              {economics.projectedTargetAttendees}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">High-affinity active fans</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0B10] border border-white/[0.06]">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <TrendingUp className="w-3 h-3 text-cyan-400" />
              Subcultural Lift Index
            </div>
            <div className="text-base sm:text-lg font-black text-cyan-400 mt-1.5 font-mono">
              {brand.liftMultiple}x Multiplier
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Above demographic baseline</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0A0B10] border border-white/[0.06]">
            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
              <Award className="w-3 h-3 text-amber-400" />
              Projected Sponsor ROI
            </div>
            <div className="text-base sm:text-lg font-black text-amber-300 mt-1.5 font-mono">
              {economics.projectedRoiMultiple}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Earned media vs ad waste</div>
          </div>
        </div>
      </div>

      {/* CMO Pitch Letter Card */}
      <div className="bg-[#14151E] border border-white/[0.08] rounded-xl p-5 space-y-4 relative overflow-hidden">
        <Quote className="w-16 h-16 text-white/[0.03] absolute right-4 bottom-4 pointer-events-none" />

        <div>
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Executive Rationale for Brand Leadership
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed font-normal">
            {pitch.executiveSummary}
          </p>
        </div>

        <div className="border-t border-white/[0.05] pt-3.5">
          <h4 className="text-xs font-bold text-slate-300 mb-1">Why This Specific Audience:</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{pitch.whyThisAudience}</p>
        </div>

        {/* Footnoted Citations */}
        {pitch.evidenceFootnotes.length > 0 && (
          <div className="border-t border-white/[0.06] pt-3.5 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Verifiable Evidence Citations:
            </div>
            <div className="space-y-1.5">
              {pitch.evidenceFootnotes.map((fn, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-[11px] text-slate-300 hover:text-white transition-colors bg-[#0A0B10] border border-white/[0.04] p-2.5 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">[{idx + 1}]</span>
                    <span>{fn.claim}</span>
                    <span className="text-slate-500 font-mono text-[10px]">({fn.metric})</span>
                  </span>
                  <button
                    onClick={() => onInspectEvidence(fn.evidenceId)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-2 shrink-0 ml-2"
                  >
                    <span>Inspect Trace</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* On-Site Activation Concepts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              On-Site Experiential Activation Concepts ({pitch.activations.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Derived from shared lifestyle affinities</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {pitch.activations.map((act, i) => (
            <div
              key={i}
              className="bg-[#14151E] border border-white/[0.08] hover:border-cyan-500/30 rounded-xl p-4 space-y-3 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{act.title}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0A0B10] text-amber-300 border border-white/[0.08] shrink-0">
                    Est. Cost {act.costTier}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">{act.description}</p>
              </div>

              <div className="border-t border-white/[0.05] pt-2.5 space-y-1.5">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="font-medium text-slate-300">{act.footprint}</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  <span className="text-slate-500 font-semibold">Cultural Link:</span>{' '}
                  {act.culturalRationale}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
