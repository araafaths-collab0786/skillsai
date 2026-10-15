/**
 * SkillLens AI - Design System Tokens & Viewport Matrix
 * Strict adherence to Section 4 & 4A Design Specifications
 */

export const COLOR_TOKENS = {
  // Primary page canvas
  whiteMist: '#F3F6F8',
  // Text only (headings, body, labels, text on Cyan buttons) - NEVER for backgrounds or borders
  deepNavy: '#0B1F3A',
  // Fills & accents only (buttons, progress bars, gauges, large icons) - NEVER for small text
  cyanAccent: '#06B6D4',
  // Proposed link & focus ring accent (contrast ~4.9:1 on White Mist, pending user approval)
  cyanTextProposed: '#0E7490',
  
  // Semantic status accents (must always be paired with text labels or icons)
  status: {
    success: '#15803D', // Green 700 (5.8:1 on White Mist)
    warning: '#B45309', // Amber 700 (5.1:1 on White Mist)
    danger: '#B91C1C',  // Red 700 (6.1:1 on White Mist)
    info: '#0E7490',    // Cyan text (4.9:1 on White Mist)
  },
  
  // Neutral structural borders and cards
  surface: {
    card: '#FFFFFF',
    border: '#E2E8F0', // 1px hairline border
    divider: 'rgba(11, 31, 58, 0.08)',
    hover: '#EDF2F7',
  }
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const TARGET_VIEWPORTS = [
  { id: 'phone-small', name: 'Small Phone (iPhone SE)', width: 375, height: 667, category: 'mobile' },
  { id: 'phone-large', name: 'Large Phone (Android Pixel)', width: 412, height: 915, category: 'mobile' },
  { id: 'phone-landscape', name: 'Phone Landscape', width: 667, height: 375, category: 'mobile-landscape' },
  { id: 'tablet', name: 'Tablet Portrait (iPad Mini/Air)', width: 768, height: 1024, category: 'tablet' },
  { id: 'laptop', name: 'Laptop Viewport', width: 1366, height: 768, category: 'desktop' },
  { id: 'desktop-hd', name: 'Desktop Full HD', width: 1920, height: 1080, category: 'desktop' },
] as const;

export const SPACING_GRID_BASE = 8; // 8px grid

export const TYPOGRAPHY_SCALE = {
  fontSans: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontMono: '"JetBrains Mono", monospace',
  heroDisplay: 'clamp(2.25rem, 5vw, 3.5rem)',
  h1: 'clamp(1.75rem, 3.5vw, 2.25rem)',
  h2: 'clamp(1.35rem, 2.5vw, 1.75rem)',
  h3: '1.25rem',
  body: '1rem', // 16px minimum on mobile to prevent iOS Safari auto-zoom
  bodySmall: '0.875rem', // 14px
  caption: '0.75rem', // 12px
} as const;

export const TRANSITION_CONFIG = {
  durationFast: '200ms',
  durationNormal: '250ms',
  durationSlow: '300ms',
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;
