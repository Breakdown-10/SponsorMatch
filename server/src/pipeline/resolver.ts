import { Entity, EvidenceRecord } from '../types.js';
import { qlooClient } from '../qloo/client.js';

export interface ResolveResult {
  entities: Entity[];
  evidenceRecords: EvidenceRecord[];
  hasDisambiguation: boolean;
}

export class Resolver {
  public async resolve(
    queries: { query: string; type: string }[],
    runId: string
  ): Promise<ResolveResult> {
    const entities: Entity[] = [];
    const evidenceRecords: EvidenceRecord[] = [];
    let hasDisambiguation = false;

    for (const q of queries) {
      const resp = await qlooClient.searchEntities(q.query, [q.type], runId, 5);
      evidenceRecords.push(resp.evidence);

      if (resp.data.length === 0) {
        // Unresolved entity
        entities.push({
          id: `unres-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: q.query,
          type: q.type as any,
          resolved: false,
          disambiguationNeeded: false
        });
        continue;
      }

      const topCandidate = resp.data[0];
      const isExactMatch = topCandidate && topCandidate.name.toLowerCase() === q.query.toLowerCase().trim();

      if (resp.data.length > 1 && !isExactMatch) {
        const top1 = resp.data[0];
        const top2 = resp.data[1];
        const pop1 = top1.popularity || 0.5;
        const pop2 = top2.popularity || 0.5;

        // If candidates share the same primary name or user input is ambiguous
        const isNameSimilar = top1.name.toLowerCase().includes(q.query.toLowerCase()) && 
                              top2.name.toLowerCase().includes(q.query.toLowerCase());

        if (isNameSimilar && Math.abs(pop1 - pop2) < 0.15) {
          hasDisambiguation = true;
          entities.push({
            id: `ambig-${top1.id}`,
            qlooId: top1.id,
            name: q.query,
            type: top1.type as any,
            popularity: pop1,
            disambiguationNeeded: true,
            disambiguationOptions: resp.data.slice(0, 3).map(d => ({
              qlooId: d.id,
              name: d.name,
              description: d.description,
              popularity: d.popularity
            })),
            resolved: false
          });
          continue;
        }
      }

      // Resolved successfully to top candidate
      const matched = resp.data[0];
      entities.push({
        id: `ent-${matched.id}`,
        qlooId: matched.id,
        name: matched.name,
        type: matched.type as any,
        popularity: matched.popularity || 0.6,
        resolved: true,
        disambiguationNeeded: false
      });
    }

    return { entities, evidenceRecords, hasDisambiguation };
  }
}

export const resolver = new Resolver();
