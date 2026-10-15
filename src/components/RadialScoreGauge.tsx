/**
 * SkillLens AI - Animated Radial Score Gauge
 * Renders Readiness Index (0-100) with responsive SVG geometry and tabular figures
 */
import React, { useEffect, useState } from 'react';

export interface RadialScoreGaugeProps {
  score: number; // 0 to 100
  size?: number; // default responsive or 160-200
  label?: string;
  sublabel?: string;
}

export function RadialScoreGauge({
  score,
  size = 180,
  label = 'Readiness Index',
  sublabel,
}: RadialScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 800; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (score - start) * eased);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#06B6D4"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1F3A] font-mono tabular-nums">
            {animatedScore}%
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
            {label}
          </span>
        </div>
      </div>
      {sublabel && (
        <p className="text-xs text-slate-500 text-center mt-2 max-w-[200px] leading-relaxed">
          {sublabel}
        </p>
      )}
    </div>
  );
}
