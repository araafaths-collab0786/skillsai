/**
 * SkillLens AI - Gap Analysis & Learning Pathway Page (/gap-analysis)
 * Implements Section 6 & 7 Gap Analysis specs:
 * - Severity-sorted gap cards (High / Medium / Low)
 * - Transferable-skills panel via ESCO relations
 * - Learning-path timeline with animated "Projected Readiness" bar
 * - Interactive step completion simulation
 */
import React, { useState, useMemo } from 'react';
import { CURATED_JOB_ROLES } from '../services/jobsService';
import { computeGapAnalysis } from '../services/scoringEngine';
import { LearningTimeline } from '../components/LearningTimeline';
import { JobRole, ParsedResume, GapSeverity, GapItem } from '@/packages/shared/src/types';
import {
  AlertTriangle,
  Award,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export interface GapAnalysisPageProps {
  onNavigate: (path: string) => void;
  activeResume?: ParsedResume | null;
  selectedJob?: JobRole | null;
}

export function GapAnalysisPage({
  onNavigate,
  activeResume,
  selectedJob,
}: GapAnalysisPageProps) {
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);

  // Default active job
  const job = selectedJob || CURATED_JOB_ROLES[0];

  // Retrieve candidate skills
  const skills = useMemo(() => {
    try {
      const saved = localStorage.getItem('skilllens_active_resume');
      if (saved) {
        const parsed = JSON.parse(saved) as ParsedResume;
        return parsed.extractedSkills;
      }
    } catch {}
    return activeResume?.extractedSkills || [
      {
        id: 'ext-py',
        rawText: 'Python',
        matchedEscoSkill: {
          id: 'esco-py-005',
          uri: 'http://data.europa.eu/esco/skill/001',
          preferredLabel: 'Python Programming',
          altLabels: ['python'],
        },
        matchType: 'exact' as const,
        similarity: 1.0,
        s_i: 1.0,
        evidenceLevel: 'verified' as const,
        e_i: 1.0,
        sourceSnippet: 'Engineered predictive models in Python',
        section: 'experience' as const,
      },
      {
        id: 'ext-ml',
        rawText: 'Machine Learning',
        matchedEscoSkill: {
          id: 'esco-ml-001',
          uri: 'http://data.europa.eu/esco/skill/002',
          preferredLabel: 'Machine Learning',
          altLabels: ['ML'],
        },
        matchType: 'exact' as const,
        similarity: 1.0,
        s_i: 1.0,
        evidenceLevel: 'verified' as const,
        e_i: 1.0,
        sourceSnippet: 'Trained supervised ML models',
        section: 'experience' as const,
      },
      {
        id: 'ext-sql',
        rawText: 'SQL',
        matchedEscoSkill: {
          id: 'esco-sql-007',
          uri: 'http://data.europa.eu/esco/skill/008',
          preferredLabel: 'SQL & Database Management',
          altLabels: ['sql'],
        },
        matchType: 'exact' as const,
        similarity: 1.0,
        s_i: 1.0,
        evidenceLevel: 'demonstrated' as const,
        e_i: 0.85,
        sourceSnippet: 'Wrote relational SQL aggregation queries',
        section: 'experience' as const,
      },
    ];
  }, [activeResume]);

  // Compute gap analysis & top 3 projections
  const gapAnalysis = useMemo(() => {
    return computeGapAnalysis('res-active', job, skills);
  }, [job, skills]);

  const handleToggleStep = (stepId: string) => {
    setCompletedStepIds((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const getSeverityBadge = (severity: GapSeverity) => {
    switch (severity) {
      case 'high':
        return (
          <span className="text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
            High Severity Gap
          </span>
        );
      case 'medium':
        return (
          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
            Medium Severity Gap
          </span>
        );
      case 'low':
        return (
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            Low Severity Gap
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <button
            onClick={() => onNavigate('/match')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E7490] hover:underline mb-2 min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Job Match</span>
          </button>
          <div className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Gap Analysis & Learning Pathway
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A] mt-1">
            Target Role: {job.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Prioritized competency gaps and high-ROI learning milestones aligned with SDG 8.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-5 py-2.5 text-xs font-bold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2 self-start sm:self-auto min-h-[44px]"
        >
          <span>Save to Profile & Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Headline Metric Card: Current vs Projected Readiness */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-semibold uppercase">Current Fit</div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-mono tabular-nums">
            {gapAnalysis.currentReadiness}%
          </div>
          <p className="text-xs text-slate-500">
            Baseline Readiness Index based on verified evidence
          </p>
        </div>

        <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
          <div className="text-xs font-semibold text-[#0E7490] uppercase">
            Projected Fit (Top 3 Steps)
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#0E7490] font-mono tabular-nums">
            {gapAnalysis.projectedReadiness}%
          </div>
          <p className="text-xs text-emerald-700 font-semibold">
            +{gapAnalysis.projectedDeltaTotal}% Readiness potential
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
          <div className="font-bold text-[#0B1F3A]">Prioritization Formula:</div>
          <p className="font-mono text-[11px] text-[#0E7490]">
            Priority = ΔReadiness / Effort (Weeks)
          </p>
          <p className="text-[11px] text-slate-500">
            Ranks concrete milestones giving the maximum readiness leap per week of effort.
          </p>
        </div>
      </div>

      {/* LEARNING PATH TIMELINE (Responsive Horizontal on desktop / Vertical on mobile) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0B1F3A]">
            Recommended 3-Step Learning Pathway
          </h2>
          <span className="text-xs font-mono text-slate-500">
            Estimated Outcomes
          </span>
        </div>

        <LearningTimeline
          steps={gapAnalysis.topThreeSteps}
          currentReadiness={gapAnalysis.currentReadiness}
          projectedReadiness={gapAnalysis.projectedReadiness}
          completedStepIds={completedStepIds}
          onToggleStep={handleToggleStep}
        />
      </div>

      {/* SEVERITY-SORTED GAP CARDS & TRANSFERABLE SKILLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Severity-Sorted Gap Cards (1 col on mobile) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0B1F3A]">
              Detailed Gap Analysis by Severity ({gapAnalysis.gaps.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              High → Medium → Low
            </span>
          </div>

          <div className="space-y-3">
            {gapAnalysis.gaps.map((gap: GapItem) => (
              <div
                key={gap.skillId}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-[#0B1F3A]">{gap.skillName}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Requirement Weight: w={gap.weight}</span>
                      <span>·</span>
                      <span>Current score product: {gap.scoreProduct}</span>
                    </div>
                  </div>
                  <div>{getSeverityBadge(gap.severity)}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
                  <div className="font-semibold text-[#0B1F3A]">
                    Recommended Action: {gap.recommendedStep.title}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {gap.recommendedStep.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span>Provider: <strong>{gap.recommendedStep.provider}</strong></span>
                    <span>·</span>
                    <span>Effort: <strong>~{gap.recommendedStep.estimatedEffortWeeks} weeks</strong></span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">
                      +{gap.recommendedStep.projectedDeltaReadiness}% Score Delta
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Transferable-Skills Panel via ESCO Relations */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#06B6D4]" />
              <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
                Transferable Skills
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Discovered through ESCO competence taxonomy relationships. These accelerate your learning path but do not artificially substitute required skills:
            </p>

            {gapAnalysis.transferableSkills.length > 0 ? (
              <div className="space-y-2.5 pt-1">
                {gapAnalysis.transferableSkills.map((t: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                  >
                    <div className="font-bold text-[#0B1F3A]">
                      {t.candidateSkill} → {t.matchedJobSkill}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {t.relationNote}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                No direct ESCO relations identified for current profile.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
