/**
 * SkillLens AI - Shared TypeScript Types & Contracts
 * Aligned with SDG 8: Decent Work & Economic Growth
 */

export type EvidenceLevel = 'absent' | 'claimed' | 'demonstrated' | 'verified';

export type EvidenceNumeric = 0 | 1 | 2 | 3;

export const EVIDENCE_MULTIPLIERS: Record<EvidenceLevel, number> = {
  verified: 1.0,
  demonstrated: 0.85,
  claimed: 0.6,
  absent: 0.0,
};

export const EVIDENCE_LEVEL_DESCRIPTIONS: Record<
  EvidenceLevel,
  { label: string; establishes: string; doesNotEstablish: string }
> = {
  verified: {
    label: 'Verified (Level 3)',
    establishes: 'Supported by checkable artifact (resolving public repository URL or valid certificate credential ID).',
    doesNotEstablish: 'Does not prove the document is authentic or that the individual performed the work unassisted.',
  },
  demonstrated: {
    label: 'Demonstrated (Level 2)',
    establishes: 'Self-described project or work experience entry with concrete, quantified outcomes (e.g., latency reduction, revenue impact).',
    doesNotEstablish: 'Self-reported; not independently checked or validated against third-party systems.',
  },
  claimed: {
    label: 'Claimed (Level 1)',
    establishes: 'Skill keyword listed in skills section or bullet item without quantified outcome or artifact link.',
    doesNotEstablish: 'Self-described keyword listing only; no proof of proficiency or application context.',
  },
  absent: {
    label: 'Absent (Level 0)',
    establishes: 'No evidence or mention found in the analyzed document.',
    doesNotEstablish: 'Does not preclude candidate possessing unlisted capabilities.',
  },
};

export type IntakeMethod = 'pdf_upload' | 'camera_capture';

export type VerificationStepStatus = 'passed' | 'warning' | 'failed';

export interface VerificationMetric {
  [key: string]: number | string | boolean | undefined;
}

export interface ScreeningStepResult {
  step: 'quality_check' | 'document_detect' | 'perspective' | 'enhance' | 'authenticity' | 'ocr';
  status: VerificationStepStatus;
  flags: string[];
  metrics: VerificationMetric;
  timestamp: string;
}

export interface ScreeningReport {
  overallStatus: 'passed' | 'needs_human_review' | 'rejected_unreadable' | 'rejected_not_resume';
  isResume: boolean;
  rejectionReason?: string;
  steps: ScreeningStepResult[];
  qualityFlags: string[];
  riskFlags: string[];
  passedCheckCount: number;
  totalCheckCount: number;
  disclaimer: string;
}

export interface ESCOSkill {
  id: string;
  uri: string;
  preferredLabel: string;
  altLabels: string[];
  category?: string;
  description?: string;
}

export interface ExtractedSkill {
  id: string;
  rawText: string;
  matchedEscoSkill?: ESCOSkill;
  matchType: 'exact' | 'semantic' | 'none';
  similarity: number;
  s_i: number;
  evidenceLevel: EvidenceLevel;
  e_i: number;
  sourceSnippet: string;
  section: 'experience' | 'projects' | 'education' | 'certifications' | 'skills' | 'summary';
  artifactUrl?: string;
  credentialId?: string;
}

export interface ParsedResume {
  id: string;
  submissionId: string;
  intakeMethod: IntakeMethod;
  extractedSkills: ExtractedSkill[];
  rawTextPreview: string;
  sectionsDetected: string[];
  pageCount?: number;
  createdAt: string;
}

export interface JobSkillRequirement {
  escoSkillId: string;
  preferredLabel: string;
  weight: 1 | 2 | 3;
  isNiceToHave: boolean;
  category?: string;
}

export interface JobRole {
  id: string;
  title: string;
  category: string;
  sdgGoal: 'SDG 8';
  sdgTarget: string;
  description: string;
  requiredSkills: JobSkillRequirement[];
  niceToHaveSkills: JobSkillRequirement[];
}

export interface SkillMatchBreakdown {
  skillId: string;
  skillName: string;
  weight: number;
  s_i: number;
  e_i: number;
  contribution: number;
  isMissing: boolean;
  evidenceLevel: EvidenceLevel;
  transferableMatches?: string[];
  sourceSnippet?: string;
}

export interface MatchResult {
  resumeId: string;
  jobId: string;
  jobTitle: string;
  readinessIndex: number;
  skillBreakdowns: SkillMatchBreakdown[];
  totalRequiredWeight: number;
  weightedScoreSum: number;
  isCalibrated: boolean;
}

export type GapSeverity = 'high' | 'medium' | 'low';

export interface LearningStep {
  id: string;
  title: string;
  type: 'course' | 'project' | 'certification';
  targetSkillId: string;
  targetSkillName: string;
  initialEvidence: EvidenceLevel;
  targetEvidence: EvidenceLevel;
  estimatedEffortWeeks: number;
  projectedDeltaReadiness: number;
  priorityRank: number;
  provider: string;
  url: string;
  description: string;
  upgradeRequirement: string;
}

export interface GapItem {
  skillId: string;
  skillName: string;
  severity: GapSeverity;
  weight: number;
  s_i: number;
  e_i: number;
  scoreProduct: number;
  closestTransferableSkills: string[];
  recommendedStep: LearningStep;
}

export interface GapAnalysisResult {
  resumeId: string;
  jobId: string;
  jobTitle: string;
  currentReadiness: number;
  projectedReadiness: number;
  projectedDeltaTotal: number;
  gaps: GapItem[];
  transferableSkills: Array<{
    candidateSkill: string;
    matchedJobSkill: string;
    relationNote: string;
  }>;
  topThreeSteps: LearningStep[];
  projectionDisclaimer: string;
}

export type UserRole = 'job_seeker' | 'recruiter' | 'career_counselor';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  meta: {
    timestamp: string;
    version: string;
    requestId?: string;
  };
}

export type QueueItemState = 'captured' | 'queued' | 'uploading' | 'synced' | 'failed';

export interface OfflineQueueItem {
  id: string;
  submissionId: string;
  intakeMethod: IntakeMethod;
  blobDataUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  cropCorners?: Array<{ x: number; y: number }>;
  timestamp: number;
  state: QueueItemState;
  retryCount: number;
  errorMessage?: string;
  syncedResumeId?: string;
}
