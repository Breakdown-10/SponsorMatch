import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers
} from 'lucide-react';
import { BrandCandidate, BrandPitch } from '../types';
import { BrandLogo } from './BrandLogos';

interface BrandPitchSectionProps {
  brand: BrandCandidate;
  pitch?: BrandPitch;
  onInspectEvidence?: (evidenceId: string) => void;
}

export const BrandPitchSection: React.FC<BrandPitchSectionProps> = ({
  brand,
  pitch,
}) => {
  const [copied, setCopied] = useState(false);

  const score = brand.matchScore || Math.round(brand.rawAffinity * 100);

  const handleCopy = () => {
    const text = pitch?.executiveSummary ||
      `Red Bull's focus on music, extreme sports and youth culture aligns perfectly with Sónar's innovative and forward-thinking audience. The brand's values of creativity, performance and community make it a natural fit for this event.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Activations from pitch or defaults
  const activations = pitch?.activations && pitch.activations.length >= 3
    ? pitch.activations.slice(0, 3)
    : [
        {
          title: `Interactive ${brand.name} Music Stage`,
          description: 'A branded stage takeover with emerging artists and immersive light installations.',
          imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        },
        {
          title: 'Creator Lab',
          description: 'Workshops and content creation space for digital artists and producers.',
          imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
        },
        {
          title: 'Sustainable Energy Lounge',
          description: 'Zero-waste lounge with refreshments, charging stations and artist meetups.',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
        },
      ];

  const executiveSummary = pitch?.executiveSummary ||
    `${brand.name}'s focus on youth culture and creative innovation aligns directly with this event's high-affinity audience. Supported by multi-domain taste signals from Qloo, the brand's presence is perceived as organic rather than invasive.`;

  return (
    <section className="space-y-4 pt-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
          <Sparkles className="w-3.5 h-3.5 fill-teal-400" />
        </div>
        <h2 className="text-base font-bold text-white tracking-tight">
          Your Selected Brand Pitch
        </h2>
      </div>

      {/* Grid: Left Pitch Card (5 cols) & Right Activation Cards (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Pitch Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0d1424] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* Brand Header */}
            <div className="flex items-center gap-3">
              <BrandLogo name={brand.name} size="md" className="shrink-0" />
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight">
                  {brand.name}
                </h3>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#162138] text-indigo-300 border border-indigo-500/20">
                    {brand.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
                    #1 Match • {score}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Pitch Narrative */}
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {executiveSummary}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Pitch</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Right Activation Concepts (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Activation Concepts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {activations.map((concept, i) => {
              const bgImg = concept.imageUrl || (
                i === 0
                  ? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
                  : i === 1
                  ? 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80'
                  : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
              );

              return (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0d1424] flex flex-col justify-end group shadow-lg min-h-[220px]"
                >
                  {/* Photo Background */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${bgImg}')` }}
                  />
                  {/* Gradient shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/80 to-transparent" />

                  {/* Content overlay */}
                  <div className="relative z-10 p-4 space-y-1.5">
                    <h4 className="text-xs font-bold text-white tracking-tight leading-snug group-hover:text-teal-300 transition-colors">
                      {concept.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 leading-snug font-normal line-clamp-3">
                      {concept.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
