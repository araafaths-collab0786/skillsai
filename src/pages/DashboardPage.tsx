/**
 * SkillLens AI - Candidate Dashboard (/dashboard)
 * Implements Section 6 Dashboard specs:
 * - Time-of-day greeting with candidate's full name
 * - Latest Readiness Index with animated counter
 * - Top 3 gaps summary
 * - Active learning steps with interactive checkboxes
 * - Recent resume submissions with status (synced, pending, processing, needs review)
 * - Deletion of submissions and empty states
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { CURATED_JOB_ROLES } from '../services/jobsService';
import { computeMatchResult, computeGapAnalysis } from '../services/scoringEngine';
import {
  TrendingUp,
  AlertTriangle,
  Award,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good morning');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [resumes, setResumes] = useState<Array<{ id: string; name: string; date: string; status: string; intake: string }>>([
    {
      id: 'res-001',
      name: 'Alex_Chen_ML_Resume_v2.pdf',
      date: 'Today, 10:14 AM',
      status: 'synced',
      intake: 'PDF Upload',
    },
    {
      id: 'res-002',
      name: 'Hardcopy_Trade_Cert_Scan.jpg',
      date: 'Yesterday, 3:45 PM',
      status: 'needs_review',
      intake: 'Camera Scan',
    },
  ]);

  // Compute time-of-day greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Compute demo gap analysis for headline role
  const targetJob = CURATED_JOB_ROLES[0];
  const demoSkills = [
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

  const gapAnalysis = computeGapAnalysis('res-001', targetJob, demoSkills);

  const handleDeleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleToggleStep = (id: string) => {
    setCompletedSteps((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Time-of-day greeting header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Candidate Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A] mt-1">
            {greeting}, {user?.fullName || 'Candidate'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track your verified skills, bridge target competency gaps, and upgrade your career readiness.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/resume')}
          className="px-5 py-2.5 text-xs font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto min-h-[44px]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>New Resume Intake</span>
        </button>
      </div>

      {/* Primary KPI Grid (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Latest Readiness Score */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Readiness Index
            </span>
            <TrendingUp className="w-4 h-4 text-[#06B6D4]" />
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-[#0B1F3A] font-mono tabular-nums">
              {gapAnalysis.currentReadiness}%
            </span>
            <span className="text-xs text-emerald-700 font-semibold">
              +{gapAnalysis.projectedDeltaTotal}% projected
            </span>
          </div>

          <div className="text-xs text-slate-600">
            Target Role: <strong>{targetJob.title}</strong>
          </div>

          <button
            onClick={() => onNavigate('/match')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#0B1F3A] bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <span>Change Target Job Role</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Top 3 Critical Gaps */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Top Priority Skill Gaps
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>

          <div className="space-y-2">
            {gapAnalysis.gaps.slice(0, 3).map((gap: any) => (
              <div
                key={gap.skillId}
                className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg"
              >
                <span className="font-semibold text-[#0B1F3A]">{gap.skillName}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    gap.severity === 'high'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {gap.severity}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('/gap-analysis')}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-[#0B1F3A] bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <span>Review Full Gap Pathway</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: SDG 8 Target Alignment */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              UN SDG 8 Milestone
            </span>
            <Award className="w-4 h-4 text-[#0E7490]" />
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono font-bold text-[#0E7490]">
              TARGET 8.5 & 8.6
            </div>
            <div className="text-sm font-bold text-[#0B1F3A]">
              Decent Work & Skills Recognition
            </div>
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Your profile transforms self-described claims into checkable ESCO-aligned evidence.
            </p>
          </div>

          <div className="p-2.5 bg-cyan-50 rounded-lg text-[11px] text-[#0E7490] font-medium border border-cyan-200">
            Next milestone: Complete public repo upgrade for Docker.
          </div>
        </div>
      </div>

      {/* Active Learning Steps Section */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B1F3A]">
            Active Learning Milestones (IBM SkillsBuild)
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {completedSteps.length} of {gapAnalysis.topThreeSteps.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gapAnalysis.topThreeSteps.map((step: any) => {
            const isDone = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                onClick={() => handleToggleStep(step.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
                role="checkbox"
                aria-checked={isDone}
                tabIndex={0}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-[#0E7490]">
                      Step {step.priorityRank}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      +{step.projectedDeltaReadiness}%
                    </span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {step.provider} · ~{step.estimatedEffortWeeks} weeks
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    {isDone ? 'Completed' : 'Click to complete'}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Submissions with Status Badges & Deletion (Section 6 & 8) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B1F3A]">
            Recent Resume Submissions
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            30-Day Auto Retention
          </span>
        </div>

        {resumes.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {resumes.map((res) => (
              <div
                key={res.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 text-[#0E7490]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-[#0B1F3A]">
                      {res.name}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{res.intake}</span>
                      <span>·</span>
                      <span>{res.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded ${
                      res.status === 'synced'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {res.status === 'synced' ? 'Synced & Scored' : 'Needs Review'}
                  </span>
                  <button
                    onClick={() => handleDeleteResume(res.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
                    title="Delete resume submission"
                    aria-label={`Delete resume ${res.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center space-y-3">
            <p className="text-xs text-slate-500">
              No active resume documents uploaded yet.
            </p>
            <button
              onClick={() => onNavigate('/resume')}
              className="px-4 py-2 text-xs font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-colors min-h-[44px]"
            >
              Upload Your First Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
