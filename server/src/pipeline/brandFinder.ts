import { Entity, EvidenceRecord, BrandCandidate, SponsorCategory } from '../types.js';
import { qlooClient } from '../qloo/client.js';

export interface BrandFinderResult {
  rawCandidates: BrandCandidate[];
  categories: SponsorCategory[];
  evidenceRecords: EvidenceRecord[];
}

export class BrandFinder {
  public async findBrands(
    resolvedEntities: Entity[],
    city: string | undefined,
    runId: string
  ): Promise<BrandFinderResult> {
    const evidenceRecords: EvidenceRecord[] = [];
    const validEntityIds = resolvedEntities
      .filter(e => e.resolved && e.qlooId)
      .map(e => e.qlooId as string);

    if (validEntityIds.length === 0) {
      return { rawCandidates: [], categories: [], evidenceRecords };
    }

    // Call Qloo Insights for Brands with explainability
    const resp = await qlooClient.getInsights({
      filterType: 'urn:entity:brand',
      signalEntities: validEntityIds,
      locationQuery: city,
      explainability: true,
      take: 40
    }, runId);
    evidenceRecords.push(resp.evidence);

    const candidates: BrandCandidate[] = [];
    const categoryCountMap = new Map<string, number>();

    for (const item of resp.data) {
      const cat = item.category || 'Consumer Brand';
      categoryCountMap.set(cat, (categoryCountMap.get(cat) || 0) + 1);

      // Explainability decomposition
      const explainabilityFactors: { inputEntityName: string; score: number }[] = [];
      if (item.query?.explainability) {
        for (const [entId, score] of Object.entries(item.query.explainability)) {
          const matchEnt = resolvedEntities.find(e => e.qlooId === entId);
          explainabilityFactors.push({
            inputEntityName: matchEnt?.name || entId,
            score: Number(score)
          });
        }
      }

      candidates.push({
        id: `brand-${item.id}`,
        qlooId: item.id,
        name: item.name,
        category: cat,
        rawAffinity: item.affinity,
        generalPopularity: item.popularity || 0.5,
        liftMultiple: 1.0, // calculated in Ranker
        isObvious: false,  // calculated in Ranker
        confidence: 'HIGH', // derived in Ranker
        status: 'VALIDATED',
        evidenceIds: [resp.evidence.id],
        keyAffinities: [cat],
        explainabilityFactors
      });
    }

    // Formulate top 5 sponsor categories
    const sortedCategories = Array.from(categoryCountMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const categories: SponsorCategory[] = sortedCategories.map(([catName, count], idx) => ({
      id: `cat-${idx + 1}`,
      name: catName,
      rationale: `Strong multi-entity taste cluster across ${count} distinct brand candidates in this category.`,
      brandCount: count,
      evidenceId: resp.evidence.id
    }));

    return { rawCandidates: candidates, categories, evidenceRecords };
  }
}

export const brandFinder = new BrandFinder();
