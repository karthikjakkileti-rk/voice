'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneForwarded,
  Sparkles,
  Phone,
  CheckCircle2,
  Users,
  ShieldCheck,
  Play,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { TestCallModal } from './TestCallModal';

export interface TelephonyFormData {
  selectedDid: string;
  humanHandoffEnabled: boolean;
  humanHandoffNumber: string;
  humanHandoffCondition: string;
  testCompleted: boolean;
}

interface StageConnectTestProps {
  data: TelephonyFormData;
  onChange: (updates: Partial<TelephonyFormData>) => void;
  agentName: string;
  welcomeMessage: string;
  errors?: Record<string, string>;
}

export function StageConnectTest({
  data,
  onChange,
  agentName,
  welcomeMessage,
  errors = {},
}: StageConnectTestProps) {
  const [testModalOpen, setTestModalOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Stage Title & Subtitle */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Stage 04 • Telephony Connectivity & Staff Handoff</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Connect your AI to the real world.
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl font-normal leading-relaxed">
          Assign a dedicated Indian phone line to your counselor, configure human staff escalation for complex scholarship queries, and verify voice readiness.
        </p>
      </div>

      {/* 3 Interactive Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CARD 1: Telephony Virtual Phone Line (DID) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-5 hover:border-indigo-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Virtual Phone Line (DID)</h3>
                  <p className="text-[11px] text-slate-500">Exotel Indian SIP Trunk</p>
                </div>
              </div>
              <Badge variant="success" size="sm" className="gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active</span>
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Select Inbound Phone Line
                </label>
                <Select
                  value={data.selectedDid}
                  onChange={(e) => onChange({ selectedDid: e.target.value })}
                  options={[
                    { value: '040-459-01132', label: '040-459-01132 (Hyderabad Trunk)' },
                    { value: '080-4736-1234', label: '080-4736-1234 (Bengaluru Trunk)' },
                  ]}
                />
              </div>

              {/* Number Card Highlight */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100/90 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                  Assigned Admissions Number
                </span>
                <span className="text-lg font-black text-indigo-950 font-mono block">
                  {data.selectedDid}
                </span>
                <p className="text-[11px] text-indigo-700 font-medium">
                  Unlimited concurrent student inquiry lines.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>TRAI Indian Telephony Compliant</span>
          </div>
        </div>

        {/* CARD 2: Human Staff Handoff Desk */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-5 hover:border-indigo-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <PhoneForwarded className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Human Counselor Handoff</h3>
                  <p className="text-[11px] text-slate-500">Live staff escalation desk</p>
                </div>
              </div>
              <Badge variant={data.humanHandoffEnabled ? 'primary' : 'neutral'} size="sm">
                {data.humanHandoffEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="space-y-3">
              {/* Enable Toggle Checkbox */}
              <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={data.humanHandoffEnabled}
                  onChange={(e) => onChange({ humanHandoffEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Enable transfer to senior admissions desk
                </span>
              </label>

              {data.humanHandoffEnabled && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  <Input
                    label="Escalation Desk Phone"
                    placeholder="+91 98765 00001"
                    value={data.humanHandoffNumber}
                    onChange={(e) => onChange({ humanHandoffNumber: e.target.value })}
                    error={errors.humanHandoffNumber}
                    helperText="Admissions director mobile or SIP extension"
                  />

                  <Select
                    label="Handoff Condition"
                    value={data.humanHandoffCondition}
                    onChange={(e) => onChange({ humanHandoffCondition: e.target.value })}
                    options={[
                      { value: 'on_request_or_unknown', label: 'On student request or complex query' },
                      { value: 'always', label: 'Always transfer after qualification' },
                      { value: 'never', label: 'Handle autonomously only' },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Transfers call with full context transcript</span>
          </div>
        </div>

        {/* CARD 3: Test Call Simulator */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-indigo-50/50 rounded-3xl border border-slate-200/90 p-6 shadow-lg shadow-slate-200/40 flex flex-col justify-between space-y-5 hover:border-indigo-300 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Voice Diagnostic Test</h3>
                  <p className="text-[11px] text-slate-500">Live speech synthesis verification</p>
                </div>
              </div>
              <Badge
                variant={data.testCompleted ? 'success' : 'neutral'}
                size="sm"
                className="gap-1 font-semibold"
              >
                {data.testCompleted ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </>
                ) : (
                  <span>Ready</span>
                )}
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Run an interactive test session with {agentName} to verify greeting playback, telephony trunk routing, and conversational readiness.
              </p>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Trunk Handshake:</span>
                  <span className="font-bold text-emerald-600">Ready</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Counselor Status:</span>
                  <span className="font-bold text-indigo-600">Online</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="button"
              variant={data.testCompleted ? 'outline' : 'primary'}
              onClick={() => setTestModalOpen(true)}
              className="w-full justify-center h-10 text-xs font-semibold gap-2 shadow-sm"
            >
              {data.testCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Re-test Call ({agentName})</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start Test Call</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Interactive Voice Test Call Modal */}
      <TestCallModal
        open={testModalOpen}
        onOpenChange={setTestModalOpen}
        agentName={agentName}
        welcomeMessage={welcomeMessage}
        didNumber={data.selectedDid}
        onTestComplete={() => onChange({ testCompleted: true })}
      />
    </div>
  );
}
