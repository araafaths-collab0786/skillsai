/**
 * SkillLens AI - Landing Page (/)
 * Strictly public, NO login fields as mandated in Section 6.
 * Features 3-zone Top Bar Contract, animated 0->78% illustrative card, 6-card feature grid,
 * 4-step workflow, and comprehensive UN SDG 8 impact section.
 */
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Camera,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  Compass,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';

export interface LandingPageProps {
  onNavigate: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  // Animated preview score counter (0 -> 78%)
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const target = 78;
      const stepTime = 20;
      const increment = 2;
      const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedScore(target);
          clearInterval(counter);
        } else {
          setAnimatedScore(start);
        }
      }, stepTime);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: 'Evidence-Weighted Skills',
      description:
        'Moves beyond unverified claims. A skill counts fully only with checkable evidence (resolving public repos or certified IDs).',
      icon: <ShieldCheck className="w-5 h-5 text-[#06B6D4]" />,
    },
    {
      title: 'OpenCV Hardcopy Capture',
      description:
        'Live viewfinder with page detection and 4-point corner rectification for candidates with physical printed credentials.',
      icon: <Camera className="w-5 h-5 text-[#06B6D4]" />,
    },
    {
      title: 'ESCO Taxonomy Normalization',
      description:
        'Maps skills to standard European classifications so acronyms like "k8s" and "ML" are instantly recognized and weighted.',
      icon: <Compass className="w-5 h-5 text-[#06B6D4]" />,
    },
    {
      title: 'Readiness Index (0–100)',
      description:
        'Explainable match score based on semantic fit, evidence level, and job role weighting, with clear mathematical formulas.',
      icon: <TrendingUp className="w-5 h-5 text-[#06B6D4]" />,
    },
    {
      title: 'Learning Path Projections',
      description:
        'Identifies the top 3 high-ROI milestones separating you from your target role, with projected score gains upon completion.',
      icon: <Award className="w-5 h-5 text-[#06B6D4]" />,
    },
    {
      title: 'Offline-First Resilience',
      description:
        'Capture and queue document scans without connectivity using local IndexedDB, automatically syncing once back online.',
      icon: <Zap className="w-5 h-5 text-[#06B6D4]" />,
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Upload or Scan',
      desc: 'Submit a digital PDF resume or snap physical documents using the OpenCV camera guide.',
    },
    {
      step: '02',
      title: 'Screen & Extract',
      desc: 'Automated 6-step screening flags blur, Moiré patterns, and normalizes skills via ESCO.',
    },
    {
      step: '03',
      title: 'Match Role',
      desc: 'Evaluate fit across 20+ SDG 8-aligned jobs with evidence multipliers and semantic scoring.',
    },
    {
      step: '04',
      title: 'Bridge the Gap',
      desc: 'Follow prioritized learning milestones with projected readiness gains to reach job readiness.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-8">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#0E7490] tracking-wide">
              <span>UN SDG 8 INITIATIVE</span>
              <span>·</span>
              <span>AICTE IBM SKILLSBUILD 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B1F3A] leading-tight">
              Turn your skills into proof.{' '}
              <span className="text-[#0E7490]">Close the gap</span> to your next job.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Millions of qualified job seekers, rural youth, and career switchers are overlooked by hiring systems because their skills are unverified or printed on paper. SkillLens AI standardizes credentials, screens quality, and charts an evidence-based roadmap to employment.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/login')}
                className="px-6 py-3.5 text-base font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] focus-visible:outline-2 focus-visible:outline-[#0E7490]"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                href="#how-it-works"
                className="px-5 py-3 text-sm font-semibold text-[#0B1F3A] bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center min-h-[44px]"
              >
                See How It Works
              </a>
            </div>

            <div className="flex items-center gap-6 pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero ATS Keyword Traps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Camera & Hardcopy Intake</span>
              </div>
            </div>
          </div>

          {/* Right Column: Animated Match Card (stacks on mobile) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Target Role Match
                  </div>
                  <div className="text-base font-bold text-[#0B1F3A] mt-0.5">
                    Junior Machine Learning Engineer
                  </div>
                </div>
                <div className="text-xs font-mono font-semibold px-2 py-1 rounded bg-cyan-50 text-[#0E7490] border border-cyan-200">
                  SDG 8.5
                </div>
              </div>

              {/* Animated Readiness Gauge Box */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Readiness Index</div>
                  <div className="text-3xl font-bold text-[#0B1F3A] font-mono tabular-nums mt-0.5">
                    {animatedScore}%
                  </div>
                  <div className="text-xs text-emerald-700 font-medium mt-1">
                    +18% projected after 3 steps
                  </div>
                </div>

                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-[#06B6D4] flex items-center justify-center font-bold text-[#0B1F3A] text-sm font-mono">
                  {animatedScore}
                </div>
              </div>

              {/* Sample Evidence Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Skill Evidence Normalization
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#0B1F3A]">Python</span>{' '}
                    <span className="text-slate-400">(ESCO-001)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified (1.0)
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#0B1F3A]">Machine Learning</span>{' '}
                    <span className="text-slate-400">("ML")</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified (1.0)
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#0B1F3A]">Kubernetes</span>{' '}
                    <span className="text-slate-400">("k8s")</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Claimed (0.6)
                  </span>
                </div>
              </div>

              {/* Illustrative Example Label */}
              <div className="text-center pt-1 border-t border-slate-100">
                <span className="text-[11px] font-mono text-slate-400">
                  Illustrative example · Real-time mathematical scoring
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0E7490]">
            The 4-Step Pipeline
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]">
            From Invisible Skills to Actionable Career Pathways
          </h2>
          <p className="text-sm text-slate-600">
            Engineered with OpenCV vision processing and ESCO semantic normalization.
          </p>
        </div>

        {/* Steps: Horizontal on tablet/desktop, Vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.step}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 space-y-3 shadow-xs relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-extrabold text-[#06B6D4] font-mono">
                  {step.step}
                </span>
                {idx < 3 && (
                  <ArrowRight className="hidden md:block w-4 h-4 text-slate-300" />
                )}
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A]">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES GRID SECTION (1 col mobile, 2 col tablet, 3 col desktop) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#0E7490]">
            Core Platform Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]">
            Built to Eliminate Algorithmic Bias in Employment
          </h2>
          <p className="text-sm text-slate-600">
            Grounding claims in evidence while empowering applicants with concrete learning roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-3 shadow-xs hover:border-[#06B6D4]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-[#0B1F3A]">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SDG 8 IMPACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
                Sustainable Development Goal 8
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A] mt-1">
                Decent Work and Economic Growth
              </h2>
            </div>
            <a
              href="https://sdgs.un.org/goals/goal8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E7490] hover:underline"
            >
              <span>UN SDG 8 Official Indicators</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            SkillLens AI directly advances United Nations SDG 8 targets by democratizing credential verification and removing non-merit digital barriers for marginalized job seekers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-[#0E7490]">TARGET 8.5</div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">
                Full and Productive Employment for All
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Empowering first-generation university graduates and vocational workers to translate tacit, hard-earned trade skills into validated, recruiter-visible competencies with equal compensation opportunity.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-[#0E7490]">TARGET 8.6</div>
              <h3 className="text-sm font-bold text-[#0B1F3A]">
                Substantially Reduce Youth Not in Employment or Training
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equipping disconnected youth with actionable gap analyses and direct learning paths through IBM SkillsBuild to rapidly bridge skill shortages in emerging IT, healthcare, and logistics sectors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B1F3A] text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to discover your true job readiness?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Upload your resume or snap your hardcopy credentials to receive an instant, evidence-weighted skill gap report.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('/login')}
              className="px-8 py-3.5 text-base font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 min-h-[44px]"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
