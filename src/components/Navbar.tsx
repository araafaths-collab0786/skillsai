/**
 * SkillLens AI - Responsive Top Navigation Bar
 * Follows the 3-Zone Top Bar Contract and includes mobile focus-trapped drawer
 */
import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, UserCheck, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';

export interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Monitor scroll for subtle shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trap focus and handle escape key for drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen]);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Dashboard', path: '/dashboard', authRequired: true },
    { label: 'Intake Resume', path: '/resume', authRequired: true },
    { label: 'Job Match', path: '/match', authRequired: true },
    { label: 'Gap Analysis', path: '/gap-analysis', authRequired: true },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setIsDrawerOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E8F0] transition-shadow duration-200 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element, whitespace-nowrap) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-[#0E7490] rounded-lg p-1"
            aria-label="SkillLens AI Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#06B6D4] flex items-center justify-center font-bold text-[#0B1F3A] text-lg shrink-0">
              S
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0B1F3A] whitespace-nowrap">
              SkillLens AI
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop lg and up) */}
        <nav
          className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => {
            if (link.authRequired && !isAuthenticated) return null;
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`transition-colors whitespace-nowrap py-1 relative min-h-[44px] flex items-center ${
                  isActive
                    ? 'text-[#0B1F3A] font-semibold'
                    : 'hover:text-[#0B1F3A] text-slate-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-1 left-0 right-0 h-0.5 bg-[#06B6D4] rounded-full"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleLinkClick('/dashboard')}
                className="flex items-center gap-2 text-xs font-semibold text-[#0B1F3A] bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition-colors min-h-[44px]"
              >
                <UserCheck className="w-4 h-4 text-[#0E7490]" />
                <span>{user?.fullName || 'My Account'}</span>
              </button>
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleLinkClick('/login')}
              className="px-5 py-2.5 text-sm font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] rounded-xl transition-all shadow-xs hover:shadow whitespace-nowrap shrink-0 min-h-[44px] min-w-[44px] flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-[#0E7490]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hamburger Toggle (below lg) */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#0E7490]"
            aria-expanded={isDrawerOpen}
            aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
          >
            {isDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Full-Height Slide-in Mobile Drawer (below lg) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div
            ref={drawerRef}
            className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Drawer"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#06B6D4] flex items-center justify-center font-bold text-[#0B1F3A] text-sm">
                    S
                  </div>
                  <span className="font-bold text-lg text-[#0B1F3A]">SkillLens AI</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  if (link.authRequired && !isAuthenticated) return null;
                  const isActive = currentPath === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleLinkClick(link.path)}
                      className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-colors min-h-[44px] flex items-center justify-between ${
                        isActive
                          ? 'bg-slate-100 text-[#0B1F3A] font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="font-semibold text-[#0B1F3A]">{user?.fullName}</div>
                    <div className="text-slate-500 truncate">{user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsDrawerOpen(false);
                      onNavigate('/');
                    }}
                    className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors min-h-[44px] flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] transition-colors min-h-[44px] flex items-center justify-center gap-2"
                >
                  <span>Sign In / Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
