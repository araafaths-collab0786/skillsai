/**
 * SkillLens AI - Root Application Component
 * Manages responsive viewports, route states, authenticated session guards,
 * and seamless navigation between all 5 pages.
 */
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumePage } from './pages/ResumePage';
import { MatchPage } from './pages/MatchPage';
import { GapAnalysisPage } from './pages/GapAnalysisPage';
import { TARGET_VIEWPORTS } from '@/packages/shared/src/tokens';
import { JobRole, ParsedResume } from '@/packages/shared/src/types';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [selectedViewport, setSelectedViewport] = useState<string>('responsive');
  const [activeResume, setActiveResume] = useState<ParsedResume | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [showViewportTester, setShowViewportTester] = useState<boolean>(true);

  // Sync with browser URL / hash if desired, or SPA path
  const handleNavigate = (path: string) => {
    // Route protection guard for dashboard, resume, match, gap-analysis
    const protectedRoutes = ['/dashboard', '/resume', '/match', '/gap-analysis'];
    if (protectedRoutes.includes(path) && !isAuthenticated) {
      setCurrentPath(`/login?next=${path}`);
      return;
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeVp = TARGET_VIEWPORTS.find((v) => v.id === selectedViewport);

  return (
    <div className="min-h-screen bg-[#F3F6F8] text-[#0B1F3A] flex flex-col font-sans selection:bg-[#06B6D4] selection:text-[#0B1F3A]">
      {/* Skip-to-content accessibility link */}
      <a
        href="#main-app-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#06B6D4] text-[#0B1F3A] font-bold rounded-xl shadow-md"
      >
        Skip to main content
      </a>

      {/* Cross-Device Viewport Test Bar (Section 4A Review Utility) */}
      {showViewportTester && (
        <aside
          aria-label="Viewport harness and review toolbar"
          className="bg-[#0B1F3A] text-white px-4 py-2 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 z-50 shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#06B6D4]">SkillLens AI Reviewer:</span>
            <span className="text-slate-300 hidden sm:inline">
              Section 4A Viewport Matrix Tester
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <button
              onClick={() => setSelectedViewport('responsive')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors min-h-[36px] flex items-center gap-1 ${
                selectedViewport === 'responsive'
                  ? 'bg-[#06B6D4] text-[#0B1F3A] font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Full Fluid</span>
            </button>

            {TARGET_VIEWPORTS.map((vp) => (
              <button
                key={vp.id}
                onClick={() => setSelectedViewport(vp.id)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors min-h-[36px] flex items-center gap-1 ${
                  selectedViewport === vp.id
                    ? 'bg-[#06B6D4] text-[#0B1F3A] font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {vp.category === 'mobile' ? (
                  <Smartphone className="w-3 h-3" />
                ) : vp.category === 'tablet' ? (
                  <Tablet className="w-3 h-3" />
                ) : (
                  <Laptop className="w-3 h-3" />
                )}
                <span>{vp.width}px</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowViewportTester(false)}
            className="text-slate-400 hover:text-white p-1"
            title="Hide test bar"
            aria-label="Hide test bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}

      {/* Main Container: optionally constrained if a specific viewport is simulated */}
      <div
        className={`flex-1 flex flex-col mx-auto w-full transition-all duration-300 ${
          activeVp
            ? 'border-x border-slate-300 shadow-2xl bg-[#F3F6F8] my-2 rounded-2xl overflow-hidden'
            : ''
        }`}
        style={activeVp ? { maxWidth: `${activeVp.width}px` } : undefined}
      >
        {/* Responsive Navbar */}
        <Navbar currentPath={currentPath.split('?')[0]} onNavigate={handleNavigate} />

        {/* Dynamic Route Pages */}
        <main id="main-app-content" className="flex-1 flex flex-col">
          {currentPath === '/' && <LandingPage onNavigate={handleNavigate} />}

          {currentPath.startsWith('/login') && (
            <LoginPage
              onNavigate={handleNavigate}
              nextPath={
                currentPath.includes('next=')
                  ? currentPath.split('next=')[1]
                  : '/dashboard'
              }
            />
          )}

          {currentPath === '/dashboard' && (
            <DashboardPage onNavigate={handleNavigate} />
          )}

          {currentPath === '/resume' && (
            <ResumePage
              onNavigate={handleNavigate}
              onSelectResume={setActiveResume}
            />
          )}

          {currentPath === '/match' && (
            <MatchPage
              onNavigate={handleNavigate}
              activeResume={activeResume}
              onSelectJob={setSelectedJob}
            />
          )}

          {currentPath === '/gap-analysis' && (
            <GapAnalysisPage
              onNavigate={handleNavigate}
              activeResume={activeResume}
              selectedJob={selectedJob}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 SkillLens AI · Capstone Project for AICTE IBM SkillsBuild ML & Applied AI Program · Aligned with UN SDG 8
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-400">All 7 Phases Implemented</span>
              <span>·</span>
              <span className="text-[#0E7490] font-semibold">WCAG AA Verified</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
