/**
 * SkillLens AI - Learning Path Timeline Component
 * Responsive: Horizontal layout on tablets & desktops, vertical layout on mobile
 * Features animated Projected Readiness bar and mandatory estimation disclaimer
 */
import React from 'react';
import { LearningStep } from '@/packages/shared/src/types';
import { BookOpen, FolderGit2, Award, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';

export interface LearningTimelineProps {
  steps: LearningStep[];
  currentReadiness: number;
  projectedReadiness: number;
  completedStepIds?: string[];
  onToggleStep?: (id: string) => void;
}

export function LearningTimeline({
  steps,
  currentReadiness,
  projectedReadiness,
  completedStepIds = [],
  onToggleStep,
}: LearningTimelineProps) {
  const getStepIcon = (type: LearningStep['type']) => {
    switch (type) {
      case 'course':
        return <BookOpen className="w-4 h-4 text-[#0E7490]" />;
      case 'project':
        return <FolderGit2 className="w-4 h-4 text-[#0E7490]" />;
      case 'certification':
        return <Award className="w-4 h-4 text-[#0E7490]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Projected Readiness Progress Bar */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="space-y-0.5">
            <div className="text-xs font-bold uppercase tracking-wider text-[#0E7490]">
              Projected Outcome
            </div>
            <div className="text-sm font-bold text-[#0B1F3A]">
              Estimated Readiness Gain: {currentReadiness}% →{' '}
              <span className="text-[#0E7490]">{projectedReadiness}%</span>{' '}
              <span className="text-emerald-700 font-semibold font-mono">
                (+{Math.max(0, projectedReadiness - currentReadiness)}%)
              </span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500 bg-white px-2.5 py-1 rounded border border-slate-200 self-start sm:self-auto">
            Top 3 High-ROI Steps
          </div>
        </div>

        {/* Dual Progress Bar */}
        <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
          {/* Projected progress (lighter cyan) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#06B6D4]/40 rounded-full transition-all duration-700"
            style={{ width: `${projectedReadiness}%` }}
          />
          {/* Current baseline progress (vibrant cyan) */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-[#06B6D4] rounded-full transition-all duration-500"
            style={{ width: `${currentReadiness}%` }}
          />
        </div>

        {/* Mandatory Disclaimer from Section 7 */}
        <p className="text-[11px] text-slate-500 italic leading-relaxed">
          * Estimated. Assumes the steps are completed and verification artifacts (credentials/public repositories) are validated. Does not guarantee hiring outcomes.
        </p>
      </div>

      {/* Timeline Steps: Switches from Vertical (Phone) to Horizontal Grid (Tablet/Desktop) */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
          Recommended Action Milestones
        </div>

        {/* Grid: 1 col on mobile, 3 cols on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, idx) => {
            const isCompleted = completedStepIds.includes(step.id);
            return (
              <div
                key={step.id}
                className={`rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between space-y-3 ${
                  isCompleted
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-[#E2E8F0] shadow-xs hover:border-[#06B6D4]/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-[#0B1F3A]">
                      Step {idx + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +{step.projectedDeltaReadiness}% Readiness
                    </span>
                  </div>

                  <div className="flex items-start gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                      {getStepIcon(step.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B1F3A] leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {step.provider} · {step.targetSkillName}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {step.description}
                  </p>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-[11px] text-slate-700 border border-slate-200">
                    <strong>Evidence Upgrade:</strong> {step.initialEvidence} →{' '}
                    <span className="font-semibold text-[#0E7490]">{step.targetEvidence}</span>
                    <p className="text-slate-500 mt-1">{step.upgradeRequirement}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{step.estimatedEffortWeeks} weeks</span>
                  </div>

                  {onToggleStep && (
                    <button
                      onClick={() => onToggleStep(step.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors min-h-[44px] flex items-center gap-1.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-[#0B1F3A]'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
