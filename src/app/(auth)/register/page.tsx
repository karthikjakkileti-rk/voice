'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Building2, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { success, error: toastError } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);

    try {
      await signUp(email, password, fullName);
      success('Account created successfully. Welcome!');
      router.push('/onboarding');
    } catch (err: any) {
      const msg = err.message || 'Registration failed.';
      setAuthError(msg);
      toastError(msg);
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
          <span className="hidden sm:inline-block">Already have an account?</span>
          <Link href="/login">
            <Button variant="outline" size="sm" className="text-xs font-semibold border-slate-300 hover:bg-slate-100">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto my-auto py-8 grid lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Side: Value proposition */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Telephony for Education</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Create your account & build your AI team
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Equip your institution with 24/7 autonomous voice counseling, instant lead qualification, and Exotel-connected admissions telephony.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              'Autonomous admission phone line with instant voice answers',
              'Grounded strictly in your official prospectus & fee sheets',
              'Warm human staff transfer & automated WhatsApp CRM follow-ups',
            ].map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/80">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>Or jump directly to Onboarding Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Side: Clean White Registration Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Get Started</h2>
              <p className="text-xs text-slate-500">
                Set up your institutional administrator credentials.
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
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name</span>
                </label>
                <Input
                  placeholder="Dr. Ramesh Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Work Email</span>
                </label>
                <Input
                  type="email"
                  placeholder="admissions@institution.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
                <Input
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-slate-50 border-slate-200 text-slate-900 focus:bg-white placeholder:text-slate-400"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11 font-semibold mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 gap-2"
                isLoading={isLoading}
              >
                <span>Continue to Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Instant free setup</span>
              <span className="text-slate-300">•</span>
              <span>Exotel ready</span>
              <span className="text-slate-300">•</span>
              <span>No card required</span>
            </div>
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
