/**
 * SkillLens AI - CornerCropOverlay Component
 * Renders draggable 4-point convex quadrilateral with >= 44x44px touch targets
 * Works seamlessly with touch and mouse events on mobile and desktop
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface CornerPoint {
  x: number;
  y: number;
}

export interface CornerCropOverlayProps {
  imageSrc: string;
  initialCorners?: CornerPoint[];
  onChange?: (corners: CornerPoint[]) => void;
}

export function CornerCropOverlay({
  imageSrc,
  initialCorners,
  onChange,
}: CornerCropOverlayProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Normalized coordinates (0 to 100%)
  const [corners, setCorners] = useState<CornerPoint[]>(() => {
    return (
      initialCorners || [
        { x: 10, y: 10 }, // Top Left
        { x: 90, y: 10 }, // Top Right
        { x: 90, y: 90 }, // Bottom Right
        { x: 10, y: 90 }, // Bottom Left
      ]
    );
  });

  const [activeHandleIndex, setActiveHandleIndex] = useState<number | null>(null);

  const handlePointerDown = (index: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setActiveHandleIndex(index);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (activeHandleIndex === null || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const rawX = ((e.clientX - rect.left) / rect.width) * 100;
      const rawY = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(0, Math.min(100, Math.round(rawX)));
      const clampedY = Math.max(0, Math.min(100, Math.round(rawY)));

      setCorners((prev) => {
        const next = [...prev];
        next[activeHandleIndex] = { x: clampedX, y: clampedY };
        if (onChange) onChange(next);
        return next;
      });
    },
    [activeHandleIndex, onChange]
  );

  const handlePointerUp = (e: React.PointerEvent) => {
    if (activeHandleIndex !== null) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setActiveHandleIndex(null);
    }
  };

  const polygonPoints = corners.map((p) => `${p.x}%,${p.y}%`).join(' ');

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-xl border border-slate-300 bg-slate-900 select-none touch-none"
    >
      {/* Background Document Image */}
      <img
        src={imageSrc}
        alt="Captured document perspective view"
        className="w-full h-auto object-contain max-h-[500px] pointer-events-none opacity-85"
      />

      {/* SVG Quadrilateral Polygon Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <polygon
          points={corners.map((p) => `${p.x}% ${p.y}%`).join(' ')}
          fill="rgba(6, 182, 212, 0.18)"
          stroke="#06B6D4"
          strokeWidth="2.5"
          strokeDasharray="4 2"
        />
      </svg>

      {/* 4 Draggable Handles with >= 44x44px touch targets */}
      {corners.map((p, idx) => (
        <div
          key={idx}
          onPointerDown={handlePointerDown(idx)}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute z-20 w-11 h-11 flex items-center justify-center cursor-grab active:cursor-grabbing focus:outline-none"
          role="button"
          tabIndex={0}
          aria-label={`Adjust document corner handle ${idx + 1}`}
        >
          {/* Inner visible ring */}
          <div className="w-5 h-5 rounded-full bg-[#06B6D4] border-2 border-[#0B1F3A] shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>
      ))}

      {/* Guidance overlay pill */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-lg border border-slate-700 pointer-events-none whitespace-nowrap">
        Drag corners to align with document boundaries
      </div>
    </div>
  );
}
