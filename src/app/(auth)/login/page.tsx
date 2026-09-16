'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { Sparkles, ArrowRight, Lock, Mail, ShieldAlert, Bot, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      success('Signed in successfully.');
      router.push('/apex-college');
    } catch (err: any) {
      const msg = err.message || 'Invalid email or password credentials.';
      setAuthError(msg);
      toastError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: 'admin' | 'counselor') => {
    setIsLoading(true);
    try {
      const demoEmail =
        role === 'admin' ? 'director@apexcollege.edu.in' : 'counselor.vikram@apexcollege.edu.in';
      await signIn(demoEmail, 'password123');
      success(`Signed in as ${role === 'admin' ? 'Institution Director (Admin)' : 'Lead Counselor (Staff)'}`);
      router.push('/apex-college');
    } catch (err: any) {
      toastError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 selection:bg-indigo-500 selection:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative">
      {/* Soft background ambient gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-50/60 via-blue-50/30 to-transparent pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-2 relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Edu-Voice AI</span>
        </Link>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
          <span className="hidden sm:inline-block">Need a new institution setup?</span>
          <Link href="/onboarding">
            <Button variant="primary" size="sm" className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5">
              <span>Start Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md w-full mx-auto my-auto py-8 relative z-10">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1 pb-2">
            <h1 className="text-2xl font-bold text-slate-900">Sign in to Institution Portal</h1>
            <p className="text-xs text-slate-500">
              Access your admission counselors, live calls, and leads.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address</span>
              </label>
              <Input
                type="email"
                placeholder="director@institution.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium text-[11px]">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white placeholder:text-slate-400"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 font-semibold mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          {/* Quick Demo Login Preset Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick One-Click Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin('admin')}
                disabled={isLoading}
                className="border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 h-9 font-medium"
              >
                Director (Admin)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDemoLogin('counselor')}
                disabled={isLoading}
                className="border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 h-9 font-medium"
              >
                Counselor (Staff)
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an institution registered?{' '}
            <Link href="/onboarding" className="font-bold text-indigo-600 hover:text-indigo-700 ml-1">
              Start Onboarding
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-4 text-center text-xs text-slate-400 relative z-10">
        © 2026 Edu-Voice AI. Autonomous Admission Telephony Platform.
      </footer>
    </div>
  );
}
