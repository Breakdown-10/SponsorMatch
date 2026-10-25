import { BrandCandidate, ConfidenceTier, EvidenceRecord } from '../types.js';

export interface RankerResult {
  rankedCandidates: BrandCandidate[];
  evidence: EvidenceRecord;
}

export class Ranker {
  public rank(
    candidates: BrandCandidate[],
    resolvedEntityCount: number,
    runId: string
  ): RankerResult {
    const scored = candidates.map(c => {
      const rawAffinity = Math.max(0.01, Math.min(1.0, c.rawAffinity));
      const popularity = Math.max(0.05, Math.min(1.0, c.generalPopularity));

      // Mathematical log-scale popularity normalization
      // Lift = Raw Affinity / (Popularity ^ 0.50)
      const rawLift = rawAffinity / Math.pow(popularity, 0.50);
      const liftMultiple = Number(rawLift.toFixed(2));

      // Obvious vs. Non-Obvious classification
      // Obvious: Omnipresent mega-brands (popularity >= 0.95 and high raw affinity >= 0.90)
      // Non-obvious: Challenger and specialized brands whose audience alignment significantly outpaces raw popularity
      const isObvious = popularity >= 0.95 && rawAffinity >= 0.90;

      // Confidence tier determination
      let confidence: ConfidenceTier = 'MEDIUM';
      const factorCount = c.explainabilityFactors?.length || 0;

      if (resolvedEntityCount >= 2 && rawAffinity >= 0.75 && (factorCount >= 2 || liftMultiple >= 1.3)) {
        confidence = 'HIGH';
      } else if (rawAffinity < 0.60 || factorCount === 0) {
        confidence = 'LOW';
      }

      const matchScore = Math.round(rawAffinity * 100);

      return {
        ...c,
        liftMultiple,
        isObvious,
        confidence,
        status: 'VALIDATED' as const,
        matchScore
      };
    });

    // Primary sort: by matchScore descending
    scored.sort((a, b) => {
      return (b.matchScore || 0) - (a.matchScore || 0);
    });

    const nonObviousCount = scored.filter(s => !s.isObvious && s.liftMultiple >= 1.35).length;
    const obviousCount = scored.filter(s => s.isObvious).length;

    const evidence: EvidenceRecord = {
      id: `ev-rank-${Date.now()}`,
      runId,
      stage: 'RANKING',
      toolName: 'rank_shortlist',
      endpoint: 'internal://ranker',
      redactedParams: {
        totalCandidates: candidates.length,
        scoringMethod: 'log_scale_popularity_normalization',
        liftFormula: 'Affinity / (Popularity ^ 0.65)',
        entitySignalCount: resolvedEntityCount
      },
      resultSummary: `Ranked ${candidates.length} brands: ${nonObviousCount} non-obvious high-lift matches, ${obviousCount} obvious industry staples.`,
      resultCount: candidates.length,
      cacheHit: false,
      timestamp: new Date().toISOString()
    };

    return { rankedCandidates: scored, evidence };
  }
}

export const ranker = new Ranker();
