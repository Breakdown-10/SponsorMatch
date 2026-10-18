export type PipelineStage =
  | 'PLANNING'
  | 'RESOLVING'
  | 'PROFILING'
  | 'FINDING_BRANDS'
  | 'RANKING'
  | 'VALIDATING'
  | 'WRITING'
  | 'AUDITING'
  | 'COMPLETED'
  | 'ABSTAINED'
  | 'FAILED';

export interface StageProgress {
  stage: PipelineStage;
  progress: number;
  message: string;
  activeCall?: string;
  timestamp: number;
}

export interface Entity {
  id: string;
  qlooId?: string;
  name: string;
  type: 'urn:entity:artist' | 'urn:entity:place' | 'urn:entity:brand' | 'urn:entity:movie' | 'urn:entity:person' | 'urn:entity:tv_show' | 'other';
  popularity?: number;
  disambiguationNeeded?: boolean;
  disambiguationOptions?: { qlooId: string; name: string; description?: string; popularity?: number }[];
  resolved: boolean;
}

export type TasteDomain = 'music' | 'dining' | 'fashion' | 'media';

export interface TasteAffinity {
  id: string;
  name: string;
  domain: TasteDomain;
  affinityScore: number;
  tags?: string[];
  evidenceId: string;
}

export interface SponsorCategory {
  id: string;
  name: string;
  rationale: string;
  brandCount: number;
  evidenceId: string;
}

export type ConfidenceTier = 'HIGH' | 'MEDIUM' | 'LOW';
export type ValidationStatus = 'VALIDATED' | 'EXCLUDED' | 'DOWNGRADED' | 'INSUFFICIENT_DATA';

export interface BrandCandidate {
  id: string;
  qlooId: string;
  name: string;
  category: string;
  rawAffinity: number;
  generalPopularity: number;
  liftMultiple: number;
  isObvious: boolean;
  confidence: ConfidenceTier;
  status: ValidationStatus;
  statusReason?: string;
  evidenceIds: string[];
  keyAffinities: string[];
  explainabilityFactors?: { inputEntityName: string; score: number }[];
}

export interface ActivationConcept {
  title: string;
  description: string;
  culturalRationale: string;
  footprint: string;
  costTier: '$' | '$$' | '$$$' | '$$$$';
  linkedAffinities: string[];
}

export interface EvidenceFootnote {
  claim: string;
  evidenceId: string;
  metric: string;
}

export interface DealEconomics {
  recommendedFeeRange: string;
  projectedTargetAttendees: string;
  resonanceLiftMultiplier: string;
  projectedRoiMultiple: string;
  suggestedPackage: string;
}

export interface BrandPitch {
  brandId: string;
  brandName: string;
  category: string;
  headline: string;
  executiveSummary: string;
  whyThisAudience: string;
  activations: ActivationConcept[];
  evidenceFootnotes: EvidenceFootnote[];
  dealEconomics?: DealEconomics;
}

export interface EvidenceRecord {
  id: string;
  runId: string;
  stage: PipelineStage;
  toolName: string;
  endpoint: string;
  redactedParams: Record<string, any>;
  resultSummary: string;
  resultCount: number;
  cacheHit: boolean;
  timestamp: string;
  rawSnippet?: any;
}

export interface BaselineBrandComparison {
  name: string;
  category: string;
  genericRationale: string;
  ungroundedClaims: string[];
}

export interface AgentBrandComparison {
  name: string;
  category: string;
  liftMultiple: number;
  evidenceCount: number;
  topAffinityAnchor: string;
}

export interface BaselineComparison {
  eventName: string;
  agentBrands: AgentBrandComparison[];
  baselineBrands: BaselineBrandComparison[];
  groundingRateAgent: number; // e.g. 100%
  groundingRateBaseline: number; // e.g. 0%
  analysisSummary: string;
}

export interface EventInput {
  eventName: string;
  entities: string[];
  venue?: string;
  city?: string;
  budgetTier?: 'BUDGET' | 'MID' | 'PREMIUM';
  excludedCategories?: string[];
  excludedBrands?: string[];
}

export interface RunState {
  id: string;
  input: EventInput;
  stage: PipelineStage;
  progress: number;
  statusMessage: string;
  resolvedEntities: Entity[];
  tasteProfile: Record<TasteDomain, TasteAffinity[]>;
  categories: SponsorCategory[];
  candidates: BrandCandidate[];
  pitches: Record<string, BrandPitch>;
  evidenceRecords: EvidenceRecord[];
  baselineComparison?: BaselineComparison;
  abstention?: {
    isAbstained: boolean;
    reason: string;
    diagnostic: string;
  };
  requestCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserFeedbackRequest {
  brandId: string;
  action: 'REJECT' | 'PIN';
  reason: string;
}
