'use client';

import React from 'react';
import { ScrollProgress } from '@/components/landing/ScrollProgress';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { InteractiveEducationBackground } from '@/components/landing/InteractiveEducationBackground';
import { KnowledgeStarGame } from '@/components/landing/KnowledgeStarGame';
import { HeroSection } from '@/components/landing/HeroSection';
import { TrustMetrics } from '@/components/landing/TrustMetrics';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { VoiceCounselorSection } from '@/components/landing/VoiceCounselorSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { DashboardShowcase } from '@/components/landing/DashboardShowcase';
import { KnowledgeSection } from '@/components/landing/KnowledgeSection';
import { CallIntelligenceSection } from '@/components/landing/CallIntelligenceSection';
import { RoiCalculator } from '@/components/landing/RoiCalculator';
import { FinalCta } from '@/components/landing/FinalCta';
import { LandingFooter } from '@/components/landing/LandingFooter';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-indigo-600 selection:text-white font-sans antialiased scroll-smooth">
      {/* 1. Page Scroll Progress Indicator (Thin 2px bar at top) */}
      <ScrollProgress />

      {/* 2. Interactive Future Campus Education & AI Atmospheric Background */}
      <InteractiveEducationBackground />

      {/* 3. Catch the Knowledge Stars ⭐ Mini-Game Easter Egg */}
      <KnowledgeStarGame />

      {/* 4. Smart Section-Aware Floating Navigation Header */}
      <LandingNavbar />

      {/* 5. Main Landing Content Sections */}
      <main className="flex-1 relative z-10">
        <HeroSection />
        <TrustMetrics />
        <FeatureGrid />
        <VoiceCounselorSection />
        <HowItWorks />
        <DashboardShowcase />
        <KnowledgeSection />
        <CallIntelligenceSection />
        <RoiCalculator />
        <FinalCta />
      </main>

      {/* 6. Enterprise SaaS Footer */}
      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
}
