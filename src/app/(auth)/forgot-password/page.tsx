'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-indigo-500 selection:text-white relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">Edu-Voice AI</span>
      </Link>

      <Card className="w-full max-w-md bg-slate-900/90 border-slate-800 text-slate-100 shadow-2xl backdrop-blur-md">
        <CardHeader className="text-center pb-2 border-slate-800">
          <CardTitle className="text-xl font-bold text-white">Reset Account Password</CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Enter your institution email to receive password reset instructions.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-6">
          {submitted ? (
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-semibold text-sm text-white">Password Reset Link Sent</p>
              <p className="text-slate-300">
                If an account exists for <span className="font-mono text-emerald-300">{email}</span>, you will receive reset instructions shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="director@institution.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500"
              />

              <Button type="submit" variant="primary" className="w-full h-10 font-semibold" isLoading={isLoading}>
                Send Reset Link
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-slate-800 bg-slate-950/50 text-xs text-slate-400">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to sign in</span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
