'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">Edu-Voice AI</span>
            </Link>

            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Autonomous AI admission counselors for Indian colleges, universities, and coaching institutes. Delivering 24/7 empathetic student voice support.
            </p>

            <div className="pt-2 text-[11px] text-slate-400">
              © {new Date().getFullYear()} Edu-Voice AI Inc. All rights reserved.
            </div>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Product</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/apex-college/agents" className="hover:text-indigo-600 transition-colors">
                  AI Counselors
                </Link>
              </li>
              <li>
                <Link href="/apex-college/calls" className="hover:text-indigo-600 transition-colors">
                  Call Intelligence
                </Link>
              </li>
              <li>
                <Link href="/apex-college/leads" className="hover:text-indigo-600 transition-colors">
                  Leads CRM
                </Link>
              </li>
              <li>
                <Link href="/apex-college/knowledge" className="hover:text-indigo-600 transition-colors">
                  Knowledge Base RAG
                </Link>
              </li>
              <li>
                <Link href="/apex-college/analytics" className="hover:text-indigo-600 transition-colors">
                  Telemetry Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Solutions</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a href="#features" className="hover:text-indigo-600 transition-colors">
                  Admissions Desks
                </a>
              </li>
              <li>
                <a href="#counselor" className="hover:text-indigo-600 transition-colors">
                  24/7 Enquiry Hotlines
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
                  Higher Education
                </a>
              </li>
              <li>
                <a href="#calculator" className="hover:text-indigo-600 transition-colors">
                  Coaching & Institutes
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Security */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Security & Legal</h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <span className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  Data Privacy
                </span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  Tenant Isolation
                </span>
              </li>
              <li>
                <span className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  Exotel Compliance
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="pt-8 mt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>Designed for the Indian higher education ecosystem.</p>
          <p className="flex items-center gap-1">
            Built with precision for seamless admissions telephony.
          </p>
        </div>
      </div>
    </footer>
  );
}
