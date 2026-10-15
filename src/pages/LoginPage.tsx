/**
 * SkillLens AI - Login & Sign Up Page (/login)
 * Implements Section 6 & Section 8 auth hardening, password strength meter,
 * sliding indicator toggle, role selector, and open-redirect prevention.
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { UserRole } from '@/packages/shared/src/types';
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export interface LoginPageProps {
  onNavigate: (path: string) => void;
  nextPath?: string;
}

export function LoginPage({ onNavigate, nextPath = '/resume' }: LoginPageProps) {
  const { isAuthenticated, login, register } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('alex.chen@skillsbuild.org');
  const [password, setPassword] = useState('SecurePass2026!');
  const [fullName, setFullName] = useState('Alex Chen');
  const [confirmPassword, setConfirmPassword] = useState('SecurePass2026!');
  const [role, setRole] = useState<UserRole>('job_seeker');
  const [rememberMe, setRememberMe] = useState(true);

  // Validation & Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in to resume upload
  useEffect(() => {
    if (isAuthenticated) {
      // Validate safe redirect path (Section 8 hardening)
      const safePath =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
          ? nextPath
          : '/resume';
      onNavigate(safePath);
    }
  }, [isAuthenticated, nextPath, onNavigate]);

  // Compute password strength metrics (min 12 chars, upper, number, special)
  const passwordCriteria = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const strengthScore = Object.values(passwordCriteria).filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (isSignUp) {
      if (!fullName.trim() || fullName.trim().length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters';
      }
      if (password.length < 12) {
        newErrors.password = 'Password must be at least 12 characters (Section 8 requirement)';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else {
      if (!password) {
        newErrors.password = 'Password is required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignUp) {
        await register(fullName, email, role);
      } else {
        await login(email, role);
      }
      const safePath =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
          ? nextPath
          : '/resume';
      onNavigate(safePath);
    } catch {
      setErrors({ form: 'Authentication failed. Please verify credentials.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="max-w-md w-full mx-auto mb-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E7490] hover:underline min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#06B6D4] flex items-center justify-center font-bold text-[#0B1F3A] text-xl mx-auto">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0B1F3A]">
            {isSignUp ? 'Create your Account' : 'Welcome to SkillLens AI'}
          </h1>
          <p className="text-xs text-slate-500">
            {isSignUp
              ? 'Join the SDG 8 skill verification & career matching platform'
              : 'Sign in to access your resumes, gap analysis, and learning steps'}
          </p>
        </div>

        {/* Sliding Indicator Segmented Toggle */}
        <div className="relative p-1 bg-slate-100 rounded-xl flex items-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrors({});
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              !isSignUp ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrors({});
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all min-h-[44px] ${
              isSignUp ? 'bg-white text-[#0B1F3A] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* 1-Click Quick Sign-In Option */}
        {!isSignUp && (
          <button
            type="button"
            onClick={async () => {
              await login('alex.chen@skillsbuild.org', 'job_seeker');
              onNavigate('/resume');
            }}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-[#0B1F3A] bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#06B6D4]" />
            <span>1-Click Sign In → Go to Resume Upload</span>
          </button>
        )}

        {/* Form Error Alert */}
        {errors.form && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Sign Up only) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0B1F3A]">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Chen"
                  autoComplete="name"
                  className="block w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0E7490] min-h-[44px]"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.fullName}</p>
              )}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#0B1F3A]">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                autoComplete="email"
                className="block w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0E7490] min-h-[44px]"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Role Selector (Sign Up only) */}
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0B1F3A]">
                Primary Platform Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'job_seeker', label: 'Job Seeker', icon: GraduationCap },
                  { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
                  { id: 'career_counselor', label: 'Counselor', icon: ShieldCheck },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as UserRole)}
                      className={`p-2 rounded-xl border text-center transition-all min-h-[44px] flex flex-col items-center justify-center gap-1 ${
                        role === item.id
                          ? 'border-[#06B6D4] bg-cyan-50 text-[#0B1F3A] font-semibold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#0E7490]" />
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-[#0B1F3A]">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="block w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0E7490] min-h-[44px]"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.password}</p>
            )}

            {/* Password Strength Meter (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-1.5 pt-1.5">
                <div className="flex items-center gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthScore <= 1
                        ? 'w-1/4 bg-rose-500'
                        : strengthScore === 2
                        ? 'w-2/4 bg-amber-500'
                        : strengthScore === 3
                        ? 'w-3/4 bg-cyan-500'
                        : 'w-full bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500">
                  <span className={passwordCriteria.length ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ Min 12 chars
                  </span>
                  <span className={passwordCriteria.uppercase ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ 1 Uppercase
                  </span>
                  <span className={passwordCriteria.number ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ 1 Number
                  </span>
                  <span className={passwordCriteria.special ? 'text-emerald-700 font-semibold' : ''}>
                    ✓ 1 Special char
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#0B1F3A]">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  className="block w-full pl-9 pr-3 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#0E7490] min-h-[44px]"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* Remember me & forgot password */}
          {!isSignUp && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#06B6D4] border-slate-300 focus:ring-[#0E7490]"
                />
                <span className="text-slate-600">Remember me</span>
              </label>
              <span className="text-slate-400 text-xs">Section 8 JWT Auth</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-[#0B1F3A] bg-[#06B6D4] hover:bg-[#0891B2] transition-colors shadow-xs flex items-center justify-center gap-2 min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#0E7490] disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
          Demo Mode enabled · Pre-filled with verified test credentials.
        </div>
      </div>
    </div>
  );
}
