'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { dataProvider } from '@/services/data-provider';
import { useToast } from '@/context/toast-context';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingHeader } from '@/components/onboarding/OnboardingHeader';
import { OnboardingSidebar } from '@/components/onboarding/OnboardingSidebar';
import { StageWelcome } from '@/components/onboarding/StageWelcome';
import {
  StageInstitution,
  InstitutionFormData,
} from '@/components/onboarding/StageInstitution';
import {
  StageTeachAi,
  OnboardingDoc,
} from '@/components/onboarding/StageTeachAi';
import {
  StageAiCounselor,
  CounselorFormData,
} from '@/components/onboarding/StageAiCounselor';
import {
  StageConnectTest,
  TelephonyFormData,
} from '@/components/onboarding/StageConnectTest';
import { StageLaunch } from '@/components/onboarding/StageLaunch';
import { OnboardingAssistantModal } from '@/components/onboarding/OnboardingAssistantModal';

const INITIAL_INSTITUTION: InstitutionFormData = {
  name: 'Apex Engineering College',
  slug: 'apex-college',
  institutionType: 'college',
  city: 'Hyderabad',
  state: 'Telangana',
  contactPhone: '+91 98765 43210',
  websiteUrl: 'https://apex.edu.in',
};

const INITIAL_DOCS: OnboardingDoc[] = [
  {
    id: 'doc_1',
    title: 'Apex Admissions Handbook 2026-2027',
    category: 'admissions',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    status: 'ready',
  },
  {
    id: 'doc_2',
    title: 'Tuition Fee Schedules & Scholarships',
    category: 'fees',
    fileType: 'pdf',
    fileSize: '1.1 MB',
    status: 'ready',
  },
  {
    id: 'doc_3',
    title: 'B.Tech Specializations & Cutoff Matrix',
    category: 'courses',
    fileType: 'pdf',
    fileSize: '1.8 MB',
    status: 'ready',
  },
];

const INITIAL_COUNSELOR: CounselorFormData = {
  agentName: 'Maya — Senior Admission Counselor',
  voiceId: 'maya_indian_female_warm',
  welcomeMessage:
    'Hello! Welcome to Apex Engineering College Admissions. I am Maya, your AI admission counselor. We offer four-year B.Tech programs with 25% Merit scholarships. How can I assist with your course options today?',
  voiceSpeed: 1.0,
  language: 'en-IN',
};

const INITIAL_TELEPHONY: TelephonyFormData = {
  selectedDid: '040-459-01132',
  humanHandoffEnabled: true,
  humanHandoffNumber: '+91 98765 00001',
  humanHandoffCondition: 'on_request_or_unknown',
  testCompleted: false,
};

export default function OnboardingPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();

  // Stage 0: Welcome Screen; Stages 1-5: The 5 Approved Setup Stages
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [maxReachedStage, setMaxReachedStage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [assistantModalOpen, setAssistantModalOpen] = useState<boolean>(false);

  // Form States across stages
  const [institutionData, setInstitutionData] = useState<InstitutionFormData>(INITIAL_INSTITUTION);
  const [documents, setDocuments] = useState<OnboardingDoc[]>(INITIAL_DOCS);
  const [counselorData, setCounselorData] = useState<CounselorFormData>(INITIAL_COUNSELOR);
  const [telephonyData, setTelephonyData] = useState<TelephonyFormData>(INITIAL_TELEPHONY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Local sync indicator feedback
  const triggerSaveFeedback = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 500);
  };

  const handleUpdateInstitution = (updates: Partial<InstitutionFormData>) => {
    setInstitutionData((prev) => ({ ...prev, ...updates }));
    triggerSaveFeedback();
  };

  const handleAddDocument = (doc: OnboardingDoc) => {
    setDocuments((prev) => [doc, ...prev]);
    triggerSaveFeedback();
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    triggerSaveFeedback();
  };

  const handleUpdateCounselor = (updates: Partial<CounselorFormData>) => {
    setCounselorData((prev) => ({ ...prev, ...updates }));
    triggerSaveFeedback();
  };

  const handleUpdateTelephony = (updates: Partial<TelephonyFormData>) => {
    setTelephonyData((prev) => ({ ...prev, ...updates }));
    triggerSaveFeedback();
  };

  // Stage Validation Logic
  const validateCurrentStage = (): boolean => {
    const errs: Record<string, string> = {};

    if (currentStage === 1) {
      if (!institutionData.name.trim()) errs.name = 'Institution name is required.';
      if (!institutionData.slug.trim()) errs.slug = 'URL slug is required.';
      if (!institutionData.city.trim()) errs.city = 'City is required.';
      if (!institutionData.state.trim()) errs.state = 'State is required.';
      if (!institutionData.contactPhone.trim()) errs.contactPhone = 'Primary contact phone is required.';
    } else if (currentStage === 2) {
      if (documents.length === 0) {
        toastError('Please keep at least 1 document in your knowledge base.');
        return false;
      }
    } else if (currentStage === 3) {
      if (!counselorData.agentName.trim()) errs.agentName = 'Counselor name is required.';
      if (!counselorData.welcomeMessage.trim()) errs.welcomeMessage = 'Welcome greeting cannot be empty.';
    } else if (currentStage === 4) {
      if (telephonyData.humanHandoffEnabled && !telephonyData.humanHandoffNumber.trim()) {
        errs.humanHandoffNumber = 'Escalation staff phone number is required when handoff is enabled.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStage()) return;

    if (currentStage < 5) {
      const nextStage = currentStage + 1;
      setCurrentStage(nextStage);
      setMaxReachedStage((prev) => Math.max(prev, nextStage));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStage === 1) {
      setCurrentStage(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Stage 5: Final Real Production Deployment
  const handleLaunch = async () => {
    setIsLoading(true);
    try {
      // 1. Create Organization
      const newOrg = await dataProvider.createOrganization({
        name: institutionData.name,
        slug: institutionData.slug,
        institution_type: institutionData.institutionType,
        primary_contact_phone: institutionData.contactPhone,
        website_url: institutionData.websiteUrl || undefined,
        address: {
          city: institutionData.city,
          state: institutionData.state,
          country: 'India',
          pincode: '500081',
        },
      });

      // 2. Create AI Agent
      const newAgent = await dataProvider.createAgent(newOrg.id, {
        name: counselorData.agentName,
        description: `Autonomous admission telephony counselor for ${institutionData.name}.`,
      });

      // 3. Update Agent Speech & Handoff Configuration
      await dataProvider.updateAgentConfig(newOrg.id, newAgent.id, {
        voice_id: counselorData.voiceId,
        language: counselorData.language,
        voice_speed: counselorData.voiceSpeed,
        welcome_message: counselorData.welcomeMessage,
        human_handoff_enabled: telephonyData.humanHandoffEnabled,
        human_handoff_number: telephonyData.humanHandoffNumber,
        human_handoff_condition: telephonyData.humanHandoffCondition,
      });

      // 4. Ingest and Upload Knowledge Base Documents
      for (const doc of documents) {
        await dataProvider.uploadKnowledgeDoc(newOrg.id, {
          title: doc.title,
          category: doc.category,
          file_type: doc.fileType,
          file: doc.file,
        });
      }

      success(`🎉 ${institutionData.name} AI communication portal deployed!`);
      router.push(`/${newOrg.slug}`);
    } catch (err: any) {
      toastError(err.message || 'Failed to complete onboarding deployment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If on Stage 0 (Welcome Screen), render full welcoming atmosphere
  if (currentStage === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between p-4 sm:p-8 font-sans antialiased selection:bg-indigo-600 selection:text-white">
        <OnboardingHeader currentStage={0} isSaving={false} />
        <main className="flex-1 flex items-center justify-center p-4">
          <StageWelcome onStart={() => setCurrentStage(1)} />
        </main>
        <footer className="text-center py-4 text-xs text-slate-400">
          Edu-Voice AI • Next-Gen Autonomous Admissions Telephony Platform
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* 1. Clean Top Header */}
      <OnboardingHeader currentStage={currentStage} isSaving={isSaving} />

      {/* 2. Mobile Compact Stage Progress Bar */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="text-indigo-600 uppercase tracking-wider text-[10px]">
            Stage 0{currentStage} of 05
          </span>
          <span className="text-slate-500 font-medium">
            {currentStage === 1 && 'Institution'}
            {currentStage === 2 && 'Teach Your AI'}
            {currentStage === 3 && 'AI Counselor'}
            {currentStage === 4 && 'Connect & Test'}
            {currentStage === 5 && 'Launch'}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300"
            style={{ width: `${(currentStage / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* 3. Main Body Container (Left Sidebar + Large Main Workspace) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        {/* Left Desktop Sidebar Stepper */}
        <OnboardingSidebar
          currentStage={currentStage}
          onSelectStage={(stageNum) => {
            if (stageNum <= maxReachedStage) {
              setCurrentStage(stageNum);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          maxReachedStage={maxReachedStage}
        />

        {/* Right Main Stage Workspace */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 flex flex-col justify-between space-y-10 min-w-0">
          <div className="min-w-0">
            {/* STAGE 1: Institution */}
            {currentStage === 1 && (
              <StageInstitution
                data={institutionData}
                onChange={handleUpdateInstitution}
                errors={errors}
              />
            )}

            {/* STAGE 2: Teach Your AI */}
            {currentStage === 2 && (
              <StageTeachAi
                documents={documents}
                onAddDocument={handleAddDocument}
                onRemoveDocument={handleRemoveDocument}
              />
            )}

            {/* STAGE 3: AI Counselor */}
            {currentStage === 3 && (
              <StageAiCounselor
                data={counselorData}
                onChange={handleUpdateCounselor}
                institutionName={institutionData.name}
                errors={errors}
              />
            )}

            {/* STAGE 4: Connect & Test */}
            {currentStage === 4 && (
              <StageConnectTest
                data={telephonyData}
                onChange={handleUpdateTelephony}
                agentName={counselorData.agentName}
                welcomeMessage={counselorData.welcomeMessage}
                errors={errors}
              />
            )}

            {/* STAGE 5: Launch */}
            {currentStage === 5 && (
              <StageLaunch
                institutionData={institutionData}
                documents={documents}
                counselorData={counselorData}
                telephonyData={telephonyData}
                onLaunch={handleLaunch}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Bottom Stage Navigation Controls */}
          {currentStage < 5 && (
            <div className="pt-6 border-t border-slate-200/90 flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                className="h-11 px-5 text-xs font-semibold gap-2 border-slate-200 hover:bg-slate-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                className="h-11 px-7 text-xs font-bold gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-0.5"
              >
                <span>Continue to Stage 0{currentStage + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* 4. Floating Contextual Setup Assistant Trigger (Bottom-Left) */}
      <aside aria-label="Setup guidance" className="fixed bottom-4 left-4 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setAssistantModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-lg shadow-indigo-950/5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="w-5 h-5 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span>Maya: Need Help?</span>
        </button>
      </aside>

      {/* Contextual Setup Assistant Modal */}
      <OnboardingAssistantModal
        open={assistantModalOpen}
        onOpenChange={setAssistantModalOpen}
        currentStage={currentStage}
      />
    </div>
  );
}
