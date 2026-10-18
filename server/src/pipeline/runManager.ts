import { v4 as uuidv4 } from 'uuid';
import {
  EventInput,
  RunState,
  StageProgress,
  UserFeedbackRequest,
  TasteDomain
} from '../types.js';
import { planner } from './planner.js';
import { resolver } from './resolver.js';
import { profiler } from './profiler.js';
import { brandFinder } from './brandFinder.js';
import { ranker } from './ranker.js';
import { validator } from './validator.js';
import { writer } from './writer.js';
import { auditor } from './auditor.js';
import { generateBaselineComparison } from '../baseline/llmBaseline.js';
import { qlooClient } from '../qloo/client.js';

export class RunManager {
  private runs: Map<string, RunState> = new Map();

  public getRun(runId: string): RunState | undefined {
    return this.runs.get(runId);
  }

  public getAllRuns(): RunState[] {
    return Array.from(this.runs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createRun(input: EventInput): RunState {
    const id = uuidv4();
    const runState: RunState = {
      id,
      input,
      stage: 'PLANNING',
      progress: 0,
      statusMessage: 'Initializing pipeline...',
      resolvedEntities: [],
      tasteProfile: {
        music: [],
        dining: [],
        fashion: [],
        media: []
      },
      categories: [],
      candidates: [],
      pitches: {},
      evidenceRecords: [],
      requestCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.runs.set(id, runState);
    return runState;
  }

  public async executePipeline(
    runId: string,
    onProgress?: (progress: StageProgress) => void
  ): Promise<RunState> {
    const run = this.runs.get(runId);
    if (!run) throw new Error(`Run ${runId} not found`);

    const updateStage = (
      stage: RunState['stage'],
      progress: number,
      message: string,
      activeCall?: string
    ) => {
      run.stage = stage;
      run.progress = progress;
      run.statusMessage = message;
      run.updatedAt = new Date().toISOString();
      if (onProgress) {
        onProgress({ stage, progress, message, activeCall, timestamp: Date.now() });
      }
    };

    try {
      // Stage 1: PLANNING
      updateStage('PLANNING', 10, 'Planning Qloo request budget and entity resolution strategy...', 'internal://planner');
      const plan = planner.plan(run.input, run.id);
      run.evidenceRecords.push(plan.evidence);

      // Stage 2: RESOLVING
      updateStage('RESOLVING', 25, `Resolving ${plan.entityQueries.length} entities in Qloo taste graph...`, 'GET /search');
      const resolveResult = await resolver.resolve(plan.entityQueries, run.id);
      run.resolvedEntities = resolveResult.entities;
      run.evidenceRecords.push(...resolveResult.evidenceRecords);

      const resolvedCount = run.resolvedEntities.filter(e => e.resolved).length;

      // Check if disambiguation is required
      if (resolveResult.hasDisambiguation) {
        updateStage('RESOLVING', 30, 'Disambiguation required for ambiguous lineup entity.');
        return run;
      }

      // Check if entities are completely unresolvable (trigger early abstention check)
      if (resolvedCount === 0 && plan.entityQueries.length > 0) {
        updateStage('ABSTAINED', 100, 'Agent visibly abstained: Lineup entities could not be resolved in Qloo.');
        run.abstention = {
          isAbstained: true,
          reason: 'Entity resolution failed: Entities not present in taste graph.',
          diagnostic: 'None of the provided entities matched verified records in Qloo. SponsorMatch declines to hallucinate matches.'
        };
        return run;
      }

      // Stage 3: PROFILING
      updateStage('PROFILING', 45, 'Building cross-domain taste profile (music, dining, fashion, media)...', 'GET /v2/insights');
      const profileResult = await profiler.profile(run.resolvedEntities, run.input.city, run.id);
      run.tasteProfile = profileResult.tasteProfile;
      run.evidenceRecords.push(...profileResult.evidenceRecords);

      // Stage 4: FINDING BRANDS
      updateStage('FINDING_BRANDS', 60, 'Discovering candidate brands and calculating explainability weights...', 'GET /v2/insights?filter.type=urn:entity:brand');
      const brandResult = await brandFinder.findBrands(run.resolvedEntities, run.input.city, run.id);
      run.categories = brandResult.categories;
      run.evidenceRecords.push(...brandResult.evidenceRecords);

      // Stage 5: RANKING
      updateStage('RANKING', 75, 'Applying log-scale popularity normalization and computing Lift scores...', 'internal://ranker');
      const rankResult = ranker.rank(brandResult.rawCandidates, resolvedCount, run.id);
      run.evidenceRecords.push(rankResult.evidence);

      // Stage 6: VALIDATING
      updateStage('VALIDATING', 85, 'Evaluating category exclusivity guardrails and budget fit...', 'internal://validator');
      const valResult = validator.validate(rankResult.rankedCandidates, run.input, resolvedCount, run.id);
      run.candidates = valResult.validatedCandidates;
      run.evidenceRecords.push(valResult.evidence);

      if (valResult.isAbstained) {
        updateStage('ABSTAINED', 100, valResult.abstentionReason || 'Abstained due to insufficient data.');
        run.abstention = {
          isAbstained: true,
          reason: valResult.abstentionReason || 'Insufficient data in taste graph.',
          diagnostic: valResult.abstentionDiagnostic || 'Confidence below threshold.'
        };
        return run;
      }

      // Stage 7: WRITING
      updateStage('WRITING', 92, 'Generating CMO partnership pitch decks and on-site activations...', 'internal://writer');
      const flatAffinities = Object.values(run.tasteProfile).flat();
      const writeResult = writer.writePitches(run.candidates, run.input, flatAffinities, run.id);
      run.evidenceRecords.push(writeResult.evidence);

      // Stage 8: AUDITING
      updateStage('AUDITING', 98, 'Auditing quantitative citations against verified evidence records...', 'internal://auditor');
      const auditResult = auditor.audit(writeResult.pitches, run.candidates, run.evidenceRecords, run.id);
      run.pitches = auditResult.auditedPitches;
      run.evidenceRecords.push(auditResult.evidence);

      // Baseline comparison (F8)
      run.baselineComparison = generateBaselineComparison(
        run.input.eventName,
        run.categories[0]?.name || 'Live Event',
        run.candidates
      );

      run.requestCount = qlooClient.getRequestCount();
      updateStage('COMPLETED', 100, 'SponsorMatch report successfully generated with 100% cited evidence.');

      return run;
    } catch (err: any) {
      console.error(`[Pipeline Error] Run ${runId}:`, err);
      updateStage('FAILED', 100, `Pipeline error: ${err.message}`);
      return run;
    }
  }

  /**
   * Closed-loop feedback (F10): Reject or pin a brand, re-rank without new Qloo calls
   */
  public applyFeedback(runId: string, feedback: UserFeedbackRequest): RunState {
    const run = this.runs.get(runId);
    if (!run) throw new Error(`Run ${runId} not found`);

    const targetBrand = run.candidates.find(c => c.id === feedback.brandId);
    if (!targetBrand) throw new Error(`Brand ${feedback.brandId} not found`);

    if (feedback.action === 'REJECT') {
      // Add brand to excluded list
      run.input.excludedBrands = [...(run.input.excludedBrands || []), targetBrand.name];

      // Re-validate existing candidates
      const resolvedCount = run.resolvedEntities.filter(e => e.resolved).length;
      const valResult = validator.validate(run.candidates, run.input, resolvedCount, run.id);
      run.candidates = valResult.validatedCandidates;
      run.evidenceRecords.push({
        id: `ev-feedback-${Date.now()}`,
        runId,
        stage: 'VALIDATING',
        toolName: 're_rank_feedback',
        endpoint: 'internal://feedback',
        redactedParams: { rejectedBrand: targetBrand.name, reason: feedback.reason },
        resultSummary: `Re-ranked candidates after rejecting "${targetBrand.name}" (${feedback.reason}). Zero extra Qloo calls.`,
        resultCount: run.candidates.filter(c => c.status === 'VALIDATED').length,
        cacheHit: true,
        timestamp: new Date().toISOString()
      });

      // Regenerate pitches for the newly promoted top brands
      const flatAffinities = Object.values(run.tasteProfile).flat();
      const writeResult = writer.writePitches(run.candidates, run.input, flatAffinities, run.id);
      const auditResult = auditor.audit(writeResult.pitches, run.candidates, run.evidenceRecords, run.id);
      run.pitches = auditResult.auditedPitches;

      run.statusMessage = `Re-ranked recommendations after applying constraint for ${targetBrand.name}.`;
      run.updatedAt = new Date().toISOString();
    }

    return run;
  }
}

export const runManager = new RunManager();
