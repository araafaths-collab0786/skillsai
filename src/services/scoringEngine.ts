/**
 * SkillLens AI - Mathematical Scoring & Gap Analysis Engine
 * Strictly enforces Section 7 rules, formulas, and calibration tables
 */
import {
  EvidenceLevel,
  EVIDENCE_MULTIPLIERS,
  GapSeverity,
  JobRole,
  MatchResult,
  GapAnalysisResult,
  SkillMatchBreakdown,
  LearningStep,
  GapItem,
  ExtractedSkill,
  JobSkillRequirement,
} from '@/packages/shared/src/types';
import { ESCO_TRANSFERABLE_RELATIONS, ESCO_SKILLS_DATABASE } from './escoService';

/**
 * Stepped Semantic Calibration Table (Section 7)
 * Maps sentence-transformers MiniLM cosine similarity to match strength s_i
 */
export function mapCosineToStrength(cosine: number, isExactAlias: boolean): number {
  if (isExactAlias) {
    return 1.0;
  }
  if (cosine >= 0.92) return 0.95;
  if (cosine >= 0.85) return 0.85;
  if (cosine >= 0.78) return 0.70;
  return 0.0; // Cosine < 0.78 treated as no match
}

/**
 * Calculates Readiness Index for a resume against a target job role
 */
export function computeMatchResult(
  resumeId: string,
  job: JobRole,
  extractedSkills: ExtractedSkill[]
): MatchResult {
  let weightedScoreSum = 0;
  let totalRequiredWeight = 0;

  const breakdowns: SkillMatchBreakdown[] = job.requiredSkills.map((req: JobSkillRequirement) => {
    totalRequiredWeight += req.weight;

    // Find candidate skill matching this requirement
    const matchedCandidateSkill = extractedSkills.find(
      (s) => s.matchedEscoSkill?.id === req.escoSkillId
    );

    let s_i = 0;
    let e_i = 0;
    let evidenceLevel: EvidenceLevel = 'absent';
    let isMissing = true;
    let snippet: string | undefined = undefined;

    if (matchedCandidateSkill) {
      isMissing = false;
      evidenceLevel = matchedCandidateSkill.evidenceLevel;
      e_i = EVIDENCE_MULTIPLIERS[evidenceLevel];
      s_i = mapCosineToStrength(
        matchedCandidateSkill.similarity,
        matchedCandidateSkill.matchType === 'exact'
      );
      snippet = matchedCandidateSkill.sourceSnippet;
    }

    // Determine transferable related skills (via ESCO relations)
    // NOTE: Section 7 rule: transferable skills do NOT count towards s_i for required skill!
    const relatedIds = ESCO_TRANSFERABLE_RELATIONS[req.escoSkillId] || [];
    const transferableMatches: string[] = [];
    extractedSkills.forEach((s) => {
      if (s.matchedEscoSkill && relatedIds.includes(s.matchedEscoSkill.id)) {
        transferableMatches.push(s.matchedEscoSkill.preferredLabel);
      }
    });

    // Skill contribution = s_i * e_i * w_i
    const contribution = s_i * e_i * req.weight;
    weightedScoreSum += contribution;

    return {
      skillId: req.escoSkillId,
      skillName: req.preferredLabel,
      weight: req.weight,
      s_i,
      e_i,
      contribution: Math.round(contribution * 100) / 100,
      isMissing,
      evidenceLevel,
      transferableMatches,
      sourceSnippet: snippet,
    };
  });

  // Readiness = 100 * (sum(s_i * e_i * w_i) / sum(w_i))
  const rawReadiness = totalRequiredWeight > 0 ? (100 * weightedScoreSum) / totalRequiredWeight : 0;
  const clampedReadiness = Math.min(100, Math.max(0, Math.round(rawReadiness)));

  return {
    resumeId,
    jobId: job.id,
    jobTitle: job.title,
    readinessIndex: clampedReadiness,
    skillBreakdowns: breakdowns,
    totalRequiredWeight,
    weightedScoreSum: Math.round(weightedScoreSum * 100) / 100,
    isCalibrated: false, // Flagged as uncalibrated baseline per Section 7
  };
}

/**
 * Categorizes gap severity per Section 7 rules
 */
export function determineGapSeverity(weight: number, scoreProduct: number): GapSeverity {
  // High: w_i = 3 and s_i * e_i < 0.5
  if (weight === 3 && scoreProduct < 0.5) {
    return 'high';
  }
  // Medium: w_i = 2 and s_i * e_i < 0.5, or w_i = 3 and 0.5 <= s_i * e_i < 0.85
  if ((weight === 2 && scoreProduct < 0.5) || (weight === 3 && scoreProduct >= 0.5 && scoreProduct < 0.85)) {
    return 'medium';
  }
  // Low: all other gaps with s_i * e_i < 1.0
  return 'low';
}

/**
 * Builds recommended learning steps and computes projected readiness
 */
export function computeGapAnalysis(
  resumeId: string,
  job: JobRole,
  extractedSkills: ExtractedSkill[]
): GapAnalysisResult {
  const matchResult = computeMatchResult(resumeId, job, extractedSkills);
  const gaps: GapItem[] = [];
  const allProposedSteps: LearningStep[] = [];
  const transferableList: Array<{ candidateSkill: string; matchedJobSkill: string; relationNote: string }> = [];

  matchResult.skillBreakdowns.forEach((breakdown: SkillMatchBreakdown, idx: number) => {
    const scoreProduct = breakdown.s_i * breakdown.e_i;

    // Check for transferable relations
    if (breakdown.transferableMatches && breakdown.transferableMatches.length > 0) {
      breakdown.transferableMatches.forEach((rel: string) => {
        transferableList.push({
          candidateSkill: rel,
          matchedJobSkill: breakdown.skillName,
          relationNote: `Candidate possesses foundational competence in ${rel}, accelerating acquisition of ${breakdown.skillName}.`,
        });
      });
    }

    // If gap exists (scoreProduct < 1.0)
    if (scoreProduct < 1.0) {
      const severity = determineGapSeverity(breakdown.weight, scoreProduct);

      // Determine recommended learning step & target evidence upgrade
      let stepType: 'course' | 'project' | 'certification' = 'course';
      let targetEvidence: EvidenceLevel = 'demonstrated';
      let estimatedWeeks = 3;
      let title = `Complete Hands-on Project: ${breakdown.skillName}`;
      let provider = 'IBM SkillsBuild';
      let url = 'https://skillsbuild.org';
      let desc = `Build and deploy a documented capstone artifact demonstrating ${breakdown.skillName}.`;
      let upgradeRequirement = 'Deploy public GitHub repository URL demonstrating implementation.';

      if (breakdown.evidenceLevel === 'absent') {
        stepType = 'course';
        targetEvidence = 'demonstrated';
        estimatedWeeks = 4;
        title = `Foundations Course: ${breakdown.skillName}`;
        provider = 'IBM SkillsBuild / Coursera';
        url = 'https://skillsbuild.org';
        desc = `Guided curriculum covering core concepts and hands-on laboratory exercises in ${breakdown.skillName}.`;
        upgradeRequirement = 'Upload verified completion certificate credential ID.';
      } else if (breakdown.evidenceLevel === 'claimed') {
        stepType = 'project';
        targetEvidence = 'demonstrated';
        estimatedWeeks = 2;
        title = `Applied Portfolio Project in ${breakdown.skillName}`;
        provider = 'Open Source / GitHub';
        url = 'https://github.com';
        desc = `Implement a practical project with concrete quantified metrics (e.g. throughput, benchmark).`;
        upgradeRequirement = 'Public repository with README stating quantified outcomes.';
      } else if (breakdown.evidenceLevel === 'demonstrated') {
        stepType = 'certification';
        targetEvidence = 'verified';
        estimatedWeeks = 3;
        title = `Industry Credential: ${breakdown.skillName} Specialist`;
        provider = 'Linux Foundation / IBM Credential';
        url = 'https://credly.com';
        desc = `Formal examination to validate competencies and award a verifiable digital badge.`;
        upgradeRequirement = 'Verifiable Credly/Accredible badge ID.';
      }

      // Compute Delta Readiness for this upgrade
      const currentContribution = breakdown.contribution;
      const targetE_i = EVIDENCE_MULTIPLIERS[targetEvidence];
      const targetS_i = 1.0; // Target is full mastery
      const upgradedContribution = targetS_i * targetE_i * breakdown.weight;
      const deltaContribution = upgradedContribution - currentContribution;
      const deltaReadiness = Math.round(((100 * deltaContribution) / matchResult.totalRequiredWeight) * 10) / 10;

      const learningStep: LearningStep = {
        id: `step-${breakdown.skillId}-${idx}`,
        title,
        type: stepType,
        targetSkillId: breakdown.skillId,
        targetSkillName: breakdown.skillName,
        initialEvidence: breakdown.evidenceLevel,
        targetEvidence,
        estimatedEffortWeeks: estimatedWeeks,
        projectedDeltaReadiness: deltaReadiness,
        priorityRank: 0,
        provider,
        url,
        description: desc,
        upgradeRequirement,
      };

      allProposedSteps.push(learningStep);

      gaps.push({
        skillId: breakdown.skillId,
        skillName: breakdown.skillName,
        severity,
        weight: breakdown.weight,
        s_i: breakdown.s_i,
        e_i: breakdown.e_i,
        scoreProduct: Math.round(scoreProduct * 100) / 100,
        closestTransferableSkills: breakdown.transferableMatches || [],
        recommendedStep: learningStep,
      });
    }
  });

  // Sort gaps by severity: High -> Medium -> Low
  const severityOrder: Record<GapSeverity, number> = { high: 0, medium: 1, low: 2 };
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Rank steps by projected gain (Delta Readiness) / estimated effort weeks
  allProposedSteps.sort((a, b) => {
    const ratioA = a.projectedDeltaReadiness / (a.estimatedEffortWeeks || 1);
    const ratioB = b.projectedDeltaReadiness / (b.estimatedEffortWeeks || 1);
    return ratioB - ratioA;
  });

  // Assign priority ranks to top 3 steps
  const topThreeSteps = allProposedSteps.slice(0, 3).map((s, i) => ({
    ...s,
    priorityRank: i + 1,
  }));

  // Recompute Projected Readiness applying ONLY the top 3 upgrades
  let totalProjectedDelta = 0;
  topThreeSteps.forEach((s) => {
    totalProjectedDelta += s.projectedDeltaReadiness;
  });

  const projectedReadiness = Math.min(
    100,
    Math.round(matchResult.readinessIndex + totalProjectedDelta)
  );

  return {
    resumeId,
    jobId: job.id,
    jobTitle: job.title,
    currentReadiness: matchResult.readinessIndex,
    projectedReadiness,
    projectedDeltaTotal: Math.round(totalProjectedDelta * 10) / 10,
    gaps,
    transferableSkills: transferableList,
    topThreeSteps,
    projectionDisclaimer:
      'Estimated. Assumes the recommended steps are completed and verification artifacts are validated. Does not guarantee hiring outcomes.',
  };
}
