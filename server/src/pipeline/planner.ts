import { EventInput, EvidenceRecord } from '../types.js';
import { CONFIG } from '../config.js';

export interface PlanResult {
  requestBudget: number;
  entityQueries: { query: string; type: string }[];
  tasteDomains: string[];
  evidence: EvidenceRecord;
}

export class Planner {
  public plan(input: EventInput, runId: string): PlanResult {
    const entityQueries: { query: string; type: string }[] = [];

    // 1. Lineup / performer entities
    for (const ent of input.entities) {
      if (ent.trim()) {
        entityQueries.push({ query: ent.trim(), type: 'urn:entity:artist' });
      }
    }

    // 2. Venue entity
    if (input.venue && input.venue.trim()) {
      entityQueries.push({ query: input.venue.trim(), type: 'urn:entity:place' });
    }

    // Allocate request budget based on hackathon guidelines (max 8 calls per run)
    const requestBudget = Math.min(
      CONFIG.MAX_QLOO_CALLS_PER_RUN,
      Math.max(3, entityQueries.length + 3)
    );

    const evidence: EvidenceRecord = {
      id: `ev-plan-${Date.now()}`,
      runId,
      stage: 'PLANNING',
      toolName: 'plan_run',
      endpoint: 'internal://planner',
      redactedParams: {
        eventName: input.eventName,
        entityCount: entityQueries.length,
        city: input.city || 'unspecified',
        budgetCap: requestBudget
      },
      resultSummary: `Planned ${entityQueries.length} entity resolutions and cross-domain brand discovery within a ${requestBudget}-request quota budget.`,
      resultCount: entityQueries.length,
      cacheHit: false,
      timestamp: new Date().toISOString()
    };

    return {
      requestBudget,
      entityQueries,
      tasteDomains: ['dining', 'music', 'fashion', 'media'],
      evidence
    };
  }
}

export const planner = new Planner();
