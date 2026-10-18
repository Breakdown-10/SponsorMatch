import { BrandCandidate, EventInput, EvidenceRecord } from '../types.js';

export interface ValidatorResult {
  validatedCandidates: BrandCandidate[];
  isAbstained: boolean;
  abstentionReason?: string;
  abstentionDiagnostic?: string;
  evidence: EvidenceRecord;
}

export class Validator {
  public validate(
    candidates: BrandCandidate[],
    input: EventInput,
    resolvedEntityCount: number,
    runId: string
  ): ValidatorResult {
    // 1. Abstention check: Data Sufficiency
    if (resolvedEntityCount === 0 || candidates.length === 0) {
      const abstentionEvidence: EvidenceRecord = {
        id: `ev-val-${Date.now()}`,
        runId,
        stage: 'VALIDATING',
        toolName: 'validate_guardrails',
        endpoint: 'internal://validator',
        redactedParams: {
          resolvedEntityCount,
          candidateCount: candidates.length,
          decision: 'ABSTAIN'
        },
        resultSummary: 'Agent visibly abstained: Insufficient Qloo taste signals to ground recommendations.',
        resultCount: 0,
        cacheHit: false,
        timestamp: new Date().toISOString()
      };

      return {
        validatedCandidates: [],
        isAbstained: true,
        abstentionReason: 'Insufficient verified data in Qloo taste graph for the requested lineup.',
        abstentionDiagnostic: `Resolved ${resolvedEntityCount} entities. Minimum threshold for defensible sponsorship match is 1 verified cultural entity. SponsorMatch abstains rather than inventing ungrounded matches.`,
        evidence: abstentionEvidence
      };
    }

    const excludedCategories = (input.excludedCategories || []).map(c => c.toLowerCase());
    const excludedBrands = (input.excludedBrands || []).map(b => b.toLowerCase());

    let excludedCount = 0;

    const validated = candidates.map(c => {
      const catLower = c.category.toLowerCase();
      const nameLower = c.name.toLowerCase();

      // Check Category Exclusivity
      const matchedExcludedCat = excludedCategories.find(ex => catLower.includes(ex) || ex.includes(catLower));
      if (matchedExcludedCat) {
        excludedCount++;
        return {
          ...c,
          status: 'EXCLUDED' as const,
          statusReason: `Excluded by sponsor category exclusivity constraint: "${matchedExcludedCat}"`
        };
      }

      // Check Specific Brand Exclusions
      const matchedExcludedBrand = excludedBrands.find(ex => nameLower.includes(ex) || ex.includes(nameLower));
      if (matchedExcludedBrand) {
        excludedCount++;
        return {
          ...c,
          status: 'EXCLUDED' as const,
          statusReason: `Excluded by organizer constraint: "${matchedExcludedBrand}" already contracted or restricted`
        };
      }

      // Check Budget Fit
      if (input.budgetTier === 'BUDGET' && c.generalPopularity > 0.85) {
        return {
          ...c,
          status: 'DOWNGRADED' as const,
          statusReason: 'High tier sponsorship fee may exceed local budget tier'
        };
      }

      return c;
    });

    const activeCount = validated.filter(c => c.status === 'VALIDATED').length;

    const evidence: EvidenceRecord = {
      id: `ev-val-${Date.now()}`,
      runId,
      stage: 'VALIDATING',
      toolName: 'validate_guardrails',
      endpoint: 'internal://validator',
      redactedParams: {
        totalEvaluated: candidates.length,
        excludedCategories: input.excludedCategories || [],
        excludedBrands: input.excludedBrands || [],
        budgetTier: input.budgetTier || 'default'
      },
      resultSummary: `Validated ${candidates.length} brands: ${activeCount} approved, ${excludedCount} excluded by guardrails.`,
      resultCount: activeCount,
      cacheHit: false,
      timestamp: new Date().toISOString()
    };

    return {
      validatedCandidates: validated,
      isAbstained: false,
      evidence
    };
  }
}

export const validator = new Validator();
