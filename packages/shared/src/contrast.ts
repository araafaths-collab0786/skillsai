/**
 * SkillLens AI - Automated WCAG AA Contrast Verification Engine
 * Strictly validates Section 4 color pairings and reports compliant/failing pairs.
 */

export interface ColorRGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): ColorRGB {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB component
 */
function getComponentLuminance(val: number): number {
  const srgb = val / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

/**
 * Calculates relative luminance for a given hex color
 */
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const R = getComponentLuminance(r);
  const G = getComponentLuminance(g);
  const B = getComponentLuminance(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Calculates WCAG contrast ratio between foreground and background (range 1:1 to 21:1)
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): number {
  const l1 = getRelativeLuminance(fgHex);
  const l2 = getRelativeLuminance(bgHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

export interface ContrastCheckResult {
  pairingName: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagAANormal: boolean; // >= 4.5:1
  wcagAALarge: boolean;  // >= 3.0:1
  wcagAAA: boolean;      // >= 7.0:1
  approvedUsage: string;
  isCompliant: boolean;
  notes?: string;
}

/**
 * Validates the core palette defined in Section 4
 */
export function runPaletteContrastAudit(): ContrastCheckResult[] {
  const WHITE_MIST = '#F3F6F8';
  const DEEP_NAVY = '#0B1F3A';
  const CYAN_FILL = '#06B6D4';
  const CYAN_TEXT_PROPOSED = '#0E7490';
  const WHITE = '#FFFFFF';

  const pairings = [
    {
      name: 'Deep Navy on White Mist (Headings, Body, Labels)',
      fg: DEEP_NAVY,
      bg: WHITE_MIST,
      requiredMin: 4.5,
      usage: 'Standard text, headings, data labels, icons',
      expectPass: true,
    },
    {
      name: 'Deep Navy on Cyan Accent (Primary Buttons)',
      fg: DEEP_NAVY,
      bg: CYAN_FILL,
      requiredMin: 4.5,
      usage: 'Primary action buttons (never white text on cyan)',
      expectPass: true,
    },
    {
      name: 'Proposed Cyan Text #0E7490 on White Mist (Links, Small Accent)',
      fg: CYAN_TEXT_PROPOSED,
      bg: WHITE_MIST,
      requiredMin: 4.5,
      usage: 'Hyperlinks, small accent text, focus rings',
      expectPass: true,
    },
    {
      name: 'Cyan Accent #06B6D4 on White Mist (PROHIBITED FOR TEXT)',
      fg: CYAN_FILL,
      bg: WHITE_MIST,
      requiredMin: 4.5,
      usage: 'Strictly prohibited for text/essential borders; fills & gauges only',
      expectPass: false,
    },
    {
      name: 'White on Cyan Accent (PROHIBITED CONTRAST PITFALL)',
      fg: WHITE,
      bg: CYAN_FILL,
      requiredMin: 4.5,
      usage: 'Prohibited - fails WCAG AA (~2.4:1)',
      expectPass: false,
    },
    {
      name: 'Focus Ring #0E7490 on White Mist (Component Boundaries)',
      fg: CYAN_TEXT_PROPOSED,
      bg: WHITE_MIST,
      requiredMin: 3.0,
      usage: 'Focus indicator states (>= 3:1 required for UI controls)',
      expectPass: true,
    },
  ];

  return pairings.map((p) => {
    const ratio = calculateContrastRatio(p.fg, p.bg);
    const aaNormal = ratio >= 4.5;
    const aaLarge = ratio >= 3.0;
    const aaa = ratio >= 7.0;
    const passes = p.expectPass ? ratio >= p.requiredMin : ratio < p.requiredMin;

    return {
      pairingName: p.name,
      foreground: p.fg,
      background: p.bg,
      ratio,
      wcagAANormal: aaNormal,
      wcagAALarge: aaLarge,
      wcagAAA: aaa,
      approvedUsage: p.usage,
      isCompliant: passes,
      notes: p.expectPass
        ? `Ratio ${ratio}:1 satisfies WCAG requirement (>=${p.requiredMin}:1)`
        : `Ratio ${ratio}:1 correctly identified as failing for text. Prohibited from text use as specified.`,
    };
  });
}
