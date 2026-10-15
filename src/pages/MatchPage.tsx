/**
 * SkillLens AI - Job Match Page (/match)
 * Implements Section 6 Match specs:
 * - Searchable job selector with category filter chips
 * - Animated radial score gauge (Readiness Index 0-100)
 * - Skill-by-skill breakdown: reflows from wide data table to StackedSkillCard on phones
 * - Clear navigation to /gap-analysis
 */
import React, { useState, useMemo } from 'react';
import { CURATED_JOB_ROLES, JOB_CATEGORIES } from '../services/jobsService';
import { computeMatchResult } from '../services/scoringEngine';
import { RadialScoreGauge } from '../components/RadialScoreGauge';
import { StackedSkillCard } from '../components/StackedSkillCard';
import { JobRole, ParsedResume, SkillMatchBreakdown } from '@/packages/shared/src/types';
import {
  Search,
  Filter,
  ArrowRight,
  Briefcase,
  Award,
  ShieldCheck,
  ChevronRight,
  Info,
  CheckCircle2,
} from 'lucide-react';

export interface MatchPageProps {
  onNavigate: (path: string) => void;
  activeResume?: ParsedResume | null;
  onSelectJob?: (job: JobRole) => void;
}

export function MatchPage({ onNavigate, activeResume, onSelectJob }: MatchPageProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('All Sectors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>(CURATED_JOB_ROLES[0].id);

  // Fallback default skills if no resume has been uploaded yet in session
  const fallbackSkills = useMemo(() => {
    try {
      const saved = localStorage.getItem('skilllens_active_resume');
      if (saved) {
        const parsed = JSON.parse(saved) as ParsedResume;
        return parsed.extractedSkills;
      }
    } catch {}
    return (
      activeResume?.extractedSkills || [
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
      ]
    );
  }, [activeResume]);

  // Filter jobs by category and search text
  const filteredJobs = useMemo(() => {
    return CURATED_JOB_ROLES.filter((job) => {
      const matchesCategory =
        selectedCategoryId === 'All Sectors' || job.category === selectedCategoryId;
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategoryId, searchQuery]);

  const activeJob = useMemo(() => {
    return (
      CURATED_JOB_ROLES.find((j) => j.id === selectedJobId) || CURATED_JOB_ROLES[0]
    );
  }, [selectedJobId]);

  // Compute mathematical readiness result
  const matchResult = useMemo(() => {
    return computeMatchResult('res-active', activeJob, fallbackSkills);
  }, [activeJob, fallbackSkills]);

  const handleSelectRole = (job: JobRole) => {
    setSelectedJobId(job.id);
    if (onSelectJob) {
      onSelectJob(job);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
            Role Evaluation Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A] mt-1">
            Target Job Matching & Readiness
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Evaluate your evidence-based skill profile against 20+ SDG 8-aligned career opportunities.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/gap-analysis')}
          className="px-5 py-2.5 text-xs font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-all shadow-xs flex items-center gap-2 self-start sm:self-auto min-h-[44px]"
        >
          <span>View Gap Pathway</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar & Category Filter Chips (Horizontally scrollable on phones) */}
      <div className="space-y-3">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search roles by title or competence..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E8F0] rounded-xl text-xs sm:text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0E7490] min-h-[44px]"
          />
        </div>

        {/* Category Chips: horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {JOB_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategoryId(category)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors min-h-[44px] flex items-center ${
                selectedCategoryId === category
                  ? 'bg-[#0B1F3A] text-white'
                  : 'bg-white border border-[#E2E8F0] text-slate-600 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Job Selector (Left) & Readiness Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Job Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available Roles ({filteredJobs.length})
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredJobs.map((job) => {
              const isSelected = job.id === activeJob.id;
              return (
                <div
                  key={job.id}
                  onClick={() => handleSelectRole(job)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 ${
                    isSelected
                      ? 'bg-white border-[#06B6D4] shadow-xs'
                      : 'bg-white border-[#E2E8F0] hover:border-slate-300'
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#0E7490]">
                      {job.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {job.requiredSkills.length} required
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0B1F3A]">{job.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {job.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Role Match Score & Skills Table */}
        <div className="lg:col-span-7 space-y-6">
          {/* Headline Card with Radial Score Gauge */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono font-bold text-[#0E7490] px-2.5 py-1 rounded bg-cyan-50 border border-cyan-200">
                {activeJob.sdgGoal} · {activeJob.sdgTarget}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B1F3A] mt-2">
                {activeJob.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md">
                {activeJob.description}
              </p>
            </div>

            <div className="shrink-0">
              <RadialScoreGauge
                score={matchResult.readinessIndex}
                size={160}
                label="Readiness"
                sublabel="Clamped [0–100] mathematical sum"
              />
            </div>
          </div>

          {/* Skill Breakdown: Wide Table on Desktop / Stacked Cards on Mobile */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider">
                Skill-by-Skill Evidence Breakdown
              </h3>
              <span className="text-xs font-mono text-slate-500">
                Formula: s_i × e_i × w_i
              </span>
            </div>

            {/* Mobile View: Stacked Cards (Section 4A & Section 6) */}
            <div className="block md:hidden space-y-3">
              {matchResult.skillBreakdowns.map((b: SkillMatchBreakdown) => (
                <StackedSkillCard key={b.skillId} breakdown={b} />
              ))}
            </div>

            {/* Desktop View: Wide Data Table */}
            <div className="hidden md:block bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Required Competence</th>
                    <th className="py-3 px-3 text-center">Weight (w)</th>
                    <th className="py-3 px-3 text-center">Match (s_i)</th>
                    <th className="py-3 px-3 text-center">Evidence (e_i)</th>
                    <th className="py-3 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {matchResult.skillBreakdowns.map((b: SkillMatchBreakdown) => (
                    <tr key={b.skillId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-[#0B1F3A]">
                        <div>{b.skillName}</div>
                        {b.sourceSnippet && (
                          <div className="text-[11px] text-slate-500 italic font-sans truncate max-w-xs">
                            "{b.sourceSnippet}"
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center tabular-nums">w={b.weight}</td>
                      <td className="py-3 px-3 text-center tabular-nums">
                        {(b.s_i * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-3 text-center tabular-nums">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            b.evidenceLevel === 'verified'
                              ? 'bg-emerald-50 text-emerald-800'
                              : b.evidenceLevel === 'demonstrated'
                              ? 'bg-cyan-50 text-cyan-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {b.e_i.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-[#0B1F3A] tabular-nums">
                        {b.contribution.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Nice-to-have skills note (shown separately without weight in score) */}
            {activeJob.niceToHaveSkills.length > 0 && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>
                  <strong>Nice-to-Have Skills:</strong>{' '}
                  {activeJob.niceToHaveSkills.map((s: any) => s.preferredLabel).join(', ')}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Zero weight in score
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
