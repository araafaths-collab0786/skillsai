/**
 * SkillLens AI - StackedSkillCard Component
 * Responsive replacement for desktop data tables on mobile viewports
 * Displays labeled fields for s_i, e_i, w_i and skill contribution without horizontal scrolling
 */
import React, { useState } from 'react';
import { SkillMatchBreakdown, EvidenceLevel } from '@/packages/shared/src/types';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, Link, Shield } from 'lucide-react';

export interface StackedSkillCardProps {
  breakdown: SkillMatchBreakdown;
}

export function StackedSkillCard({ breakdown }: StackedSkillCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getEvidenceBadge = (level: EvidenceLevel) => {
    switch (level) {
      case 'verified':
        return (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-600" /> Verified (1.0)
          </span>
        );
      case 'demonstrated':
        return (
          <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
            Demonstrated (0.85)
          </span>
        );
      case 'claimed':
        return (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Claimed (0.6)
          </span>
        );
      case 'absent':
        return (
          <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Missing (0.0)
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-3 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-bold text-[#0B1F3A] leading-snug">
            {breakdown.skillName}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500">Weight: w = {breakdown.weight}</span>
            <span>·</span>
            {getEvidenceBadge(breakdown.evidenceLevel)}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xs text-slate-400 font-semibold uppercase">Score Pts</div>
          <div className="text-base font-bold text-[#0B1F3A] font-mono tabular-nums">
            {breakdown.contribution.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Labeled metric grid (s_i, e_i, product) */}
      <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg text-xs font-mono">
        <div>
          <div className="text-slate-400 text-[10px]">Match (s_i)</div>
          <div className="font-bold text-[#0B1F3A]">{(breakdown.s_i * 100).toFixed(0)}%</div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px]">Evidence (e_i)</div>
          <div className="font-bold text-[#0B1F3A]">{breakdown.e_i.toFixed(2)}</div>
        </div>
        <div>
          <div className="text-slate-400 text-[10px]">Product</div>
          <div className="font-bold text-[#0E7490]">
            {(breakdown.s_i * breakdown.e_i).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Expandable Evidence Snippet & Transferable relations */}
      {(breakdown.sourceSnippet || (breakdown.transferableMatches && breakdown.transferableMatches.length > 0)) && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full pt-1 text-xs text-[#0E7490] font-semibold flex items-center justify-between min-h-[44px]"
          >
            <span>{isExpanded ? 'Hide Evidence Details' : 'View Evidenced Snippet'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="p-3 mt-1 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              {breakdown.sourceSnippet && (
                <div>
                  <div className="font-semibold text-slate-600 text-[10px] uppercase">
                    Resume Snippet:
                  </div>
                  <p className="text-slate-700 italic mt-0.5">"{breakdown.sourceSnippet}"</p>
                </div>
              )}
              {breakdown.transferableMatches && breakdown.transferableMatches.length > 0 && (
                <div>
                  <div className="font-semibold text-slate-600 text-[10px] uppercase">
                    Transferable Skills Found:
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {breakdown.transferableMatches.map((t: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-cyan-50 border border-cyan-200 text-[#0E7490] text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
