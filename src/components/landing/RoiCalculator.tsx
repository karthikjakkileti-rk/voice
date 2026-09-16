'use client';

import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { RevealOnScroll } from './RevealOnScroll';

export function RoiCalculator() {
  const [monthlyInquiries, setMonthlyInquiries] = useState(1500);
  const [counselorCost, setCounselorCost] = useState(35000);

  // Estimated ROI Calculations
  const estimatedHoursSaved = Math.round((monthlyInquiries * 4.5) / 60);
  const estimatedCounselorsNeeded = Math.max(1, Math.round(monthlyInquiries / 400));
  const estimatedMonthlyCostSaved = Math.round(estimatedCounselorsNeeded * counselorCost * 0.7);
  const estimatedRoiPercent = Math.min(450, Math.round((estimatedMonthlyCostSaved / (monthlyInquiries * 8)) * 100));

  return (
    <section id="roi-calculator" className="relative py-24 bg-white/90 backdrop-blur-xs border-b border-slate-200/80 scroll-mt-24 z-10">
      {/* Backwards compatibility anchor for #calculator */}
      <span id="calculator" className="relative -top-28 block invisible pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RevealOnScroll delayMs={0}>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Admissions Operational Efficiency
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Estimated Admissions Savings Calculator
            </h2>
            <p className="text-base text-slate-600 font-normal">
              Calculate estimated operational savings based on your monthly student enquiry volume.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100}>
          <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200/90 bg-slate-50/50 p-6 sm:p-10 shadow-xl space-y-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Sliders */}
              <div className="lg:col-span-7 space-y-6">
                {/* Slider 1: Monthly Calls */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-700">Monthly Inbound Call Enquiries</span>
                    <span className="text-indigo-600 font-mono font-bold text-base px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100">
                      {monthlyInquiries.toLocaleString()} calls
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="10000"
                    step="100"
                    value={monthlyInquiries}
                    onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>200 calls/mo</span>
                    <span>10,000 calls/mo</span>
                  </div>
                </div>

                {/* Slider 2: Counselor Salary */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-700">Avg Counselor Salary (₹ / Month)</span>
                    <span className="text-indigo-600 font-mono font-bold text-base px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100">
                      ₹{counselorCost.toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="20000"
                    max="80000"
                    step="5000"
                    value={counselorCost}
                    onChange={(e) => setCounselorCost(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>₹20,000/mo</span>
                    <span>₹80,000/mo</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs text-slate-500 flex items-start gap-2.5 shadow-2xs">
                  <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    *Note: Output represents estimated savings calculated from user-entered assumptions and does not constitute billing or financial guarantees.
                  </span>
                </div>
              </div>

              {/* Right Column: Highlighted Output Card */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-indigo-900 text-white space-y-5 shadow-lg shadow-indigo-900/15 hover:scale-[1.01] transition-transform duration-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 block">
                    Estimated Monthly Savings
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block tracking-tight">
                    ₹{estimatedMonthlyCostSaved.toLocaleString()}
                  </span>
                  <span className="text-xs text-indigo-200 mt-1 block">per academic admissions cycle</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-indigo-800">
                  <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800">
                    <span className="text-[10px] font-semibold text-indigo-300 block">Hours Saved</span>
                    <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                      {estimatedHoursSaved} hrs/mo
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800">
                    <span className="text-[10px] font-semibold text-indigo-300 block">Estimated ROI</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono mt-0.5 block">
                      ~{estimatedRoiPercent}%
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/80 text-[11px] text-indigo-200">
                  <span>Equivalent to <strong>{estimatedCounselorsNeeded} full-time admission desk staff</strong> working 24/7.</span>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
