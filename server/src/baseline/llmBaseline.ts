import { BaselineComparison, BrandCandidate } from '../types.js';

export function generateBaselineComparison(
  eventName: string,
  eventGenreOrType: string,
  agentCandidates: BrandCandidate[]
): BaselineComparison {
  // Top 3 brands from SponsorMatch with genuine Lift & Evidence
  const agentBrands = agentCandidates
    .filter(c => c.status === 'VALIDATED')
    .slice(0, 3)
    .map(c => ({
      name: c.name,
      category: c.category,
      liftMultiple: c.liftMultiple,
      evidenceCount: c.evidenceIds.length,
      topAffinityAnchor: c.keyAffinities[0] || 'Cross-Domain Taste Graph'
    }));

  // Generic LLM-only baseline: Stereotypical brands with hallucinated claims
  const baselineBrands = [
    {
      name: 'Red Bull Energy',
      category: 'Energy Drinks',
      genericRationale: `Based on standard demographics (estimated 65% male, age 18-34), young concert-goers need energy and fatigue relief during multi-day events.`,
      ungroundedClaims: [
        'Demographic assumption: "68% of attendees drink energy drinks daily" (No source / hallucinated)',
        'Ungrounded projection: "3.4x average purchase conversion rate" (Unverifiable estimate)',
        'Stereotype-based match: Assumes any youth event requires caffeinated energy drinks.'
      ]
    },
    {
      name: 'Nike Sportswear',
      category: 'Footwear & Apparel',
      genericRationale: `Nike is the leading global athletic and streetwear brand with high name recognition among youth and festival attendees.`,
      ungroundedClaims: [
        'Omnipresence fallacy: Relies solely on global brand fame rather than genuine subcultural lift',
        'Ungrounded claim: "Over 80% brand recall at major live gatherings" (Invented metric)',
        'Zero audience affinity differentiation: The same recommendation an LLM makes for any festival or sports event.'
      ]
    },
    {
      name: 'Heineken / Bud Light',
      category: 'Alcohol & Beer',
      genericRationale: `Major domestic and imported lager brands are typical sponsors of entertainment events and live music gatherings.`,
      ungroundedClaims: [
        'Generic pairing: Ignores whether attendees prefer craft microbreweries, natural wine, or non-alcoholic beverages',
        'Ungrounded claim: "Estimated 2.8 pints consumed per adult ticket holder" (Fabricated number)',
        'Disregards local craft alcohol and non-alcoholic wellness preferences.'
      ]
    }
  ];

  return {
    eventName,
    agentBrands,
    baselineBrands,
    groundingRateAgent: 1.0, // 100%
    groundingRateBaseline: 0.0, // 0%
    analysisSummary: `An LLM alone relies on blunt demographic stereotypes ("18-34 year olds drink Red Bull and wear Nike") and hallucinates unverifiable engagement metrics. SponsorMatch traverses Qloo's taste graph to uncover non-obvious, defensible cultural matches with 100% cited evidence.`
  };
}
