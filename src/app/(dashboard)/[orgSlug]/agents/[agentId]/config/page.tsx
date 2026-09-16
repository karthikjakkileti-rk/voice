'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentOrg } from '@/context/tenant-context';
import { useAgent } from '@/hooks/useAgents';
import { useToast } from '@/context/toast-context';
import {
  Bot,
  ArrowLeft,
  Save,
  Volume2,
  Mic,
  PhoneForwarded,
  Clock,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { VoiceSelectorModal } from '@/components/agents/VoiceSelectorModal';

export default function AgentConfigPage() {
  const params = useParams();
  const router = useRouter();
  const { organizationId, orgSlug, userRole } = useCurrentOrg();
  const agentId = (params?.agentId as string) || '';

  const { agent, isLoading, isError, error, refetch, updateConfig, isUpdating } =
    useAgent(organizationId, agentId);
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('prompt');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // Form State
  const [systemPrompt, setSystemPrompt] = useState('');
  const [voiceId, setVoiceId] = useState('maya_indian_female_warm');
  const [language, setLanguage] = useState('en-IN');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [temperature, setTemperature] = useState(0.65);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [maxDurationSeconds, setMaxDurationSeconds] = useState(600);
  const [bargeIn, setBargeIn] = useState(true);

  // Handoff State
  const [handoffEnabled, setHandoffEnabled] = useState(true);
  const [handoffNumber, setHandoffNumber] = useState('+919876500001');
  const [handoffCondition, setHandoffCondition] = useState('on_request_or_unknown');

  // Operating Hours State
  const [hoursEnabled, setHoursEnabled] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('19:00');

  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (agent) {
      setSystemPrompt(agent.system_prompt || '');
      setVoiceId(agent.speech_config?.voice_id || 'maya_indian_female_warm');
      setLanguage(agent.speech_config?.primary_language || agent.speech_config?.language || 'en-IN');
      setVoiceSpeed(agent.speech_config?.voice_speed || 1.0);
      setTemperature(agent.speech_config?.temperature || 0.65);
      setWelcomeMessage(agent.speech_config?.welcome_message || '');
      setMaxDurationSeconds(agent.speech_config?.max_call_duration_seconds || agent.speech_config?.max_duration_seconds || 600);
      setBargeIn(agent.speech_config?.allow_barge_in ?? true);

      if (agent.handoff_config) {
        setHandoffEnabled(agent.handoff_config.human_handoff_enabled ?? true);
        setHandoffNumber(agent.handoff_config.human_handoff_number || '+919876500001');
        setHandoffCondition(agent.handoff_config.human_handoff_condition || 'on_request_or_unknown');
      }

      if (agent.operating_hours) {
        setHoursEnabled(agent.operating_hours.enabled);
        setStartTime(agent.operating_hours.start_time);
        setEndTime(agent.operating_hours.end_time);
      }
    }
  }, [agent]);

  const handleSave = async () => {
    if (!isAdmin) {
      toastError('Permission denied: Only administrators can update agent configuration.');
      return;
    }

    try {
      await updateConfig({
        system_prompt: systemPrompt,
        voice_id: voiceId,
        language,
        voice_speed: voiceSpeed,
        temperature,
        welcome_message: welcomeMessage,
        max_duration_seconds: maxDurationSeconds,
        allow_barge_in: bargeIn,
        human_handoff_enabled: handoffEnabled,
        human_handoff_number: handoffNumber,
        human_handoff_condition: handoffCondition,
      });
      success('Agent configuration saved and synced with FastAPI backend.');
    } catch (err: any) {
      toastError(err.message || 'Failed to save configuration');
    }
  };

  const insertVariable = (variable: string) => {
    setSystemPrompt((prev) => `${prev}\n- ${variable}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (isError || !agent) {
    return (
      <ErrorState
        title="Agent Not Found"
        message={error instanceof Error ? error.message : `Agent '${agentId}' could not be loaded.`}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/${orgSlug}/agents`}>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {agent.name}
              </h1>
              <Badge variant={agent.is_active ? 'success' : 'neutral'} size="sm">
                {agent.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure speech parameters, system prompt instructions, and SIP escalation rules.
            </p>
          </div>
        </div>

        {isAdmin ? (
          <Button onClick={handleSave} isLoading={isUpdating} className="gap-2 shadow-md shrink-0">
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </Button>
        ) : (
          <Badge variant="warning" size="md">
            <Shield className="w-3.5 h-3.5 mr-1" />
            <span>Read-Only (Counselor Role)</span>
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'prompt', label: 'System Prompt & Instructions', icon: <Bot className="w-4 h-4" /> },
          { id: 'speech', label: 'Voice & Speech Config', icon: <Volume2 className="w-4 h-4" /> },
          { id: 'handoff', label: 'Human Handoff & Transfer', icon: <PhoneForwarded className="w-4 h-4" /> },
          { id: 'schedule', label: 'Operating Hours', icon: <Clock className="w-4 h-4" /> },
        ]}
      />

      {/* TAB 1: System Prompt */}
      {activeTab === 'prompt' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <Card className="p-6 space-y-4">
            <div>
              <CardTitle className="text-base">Counselor Directive & System Prompt</CardTitle>
              <CardDescription>
                Define the agent&apos;s persona, tone, guidelines, and behavioral boundaries during student inquiries.
              </CardDescription>
            </div>

            {/* Prompt Helper Variable Chips */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Insert Knowledge Variable Chips:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '{institution_name}',
                  '{courses_offered}',
                  '{btech_tuition_fees}',
                  '{merit_scholarships}',
                  '{hostel_accommodation_fees}',
                  '{eligibility_criteria_60_pcm}',
                  '{counselor_callback_request}',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => insertVariable(chip)}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              rows={14}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              disabled={!isAdmin}
              className="font-mono text-xs leading-relaxed"
              placeholder="You are Maya, senior admissions counselor..."
            />
          </Card>
        </div>
      )}

      {/* TAB 2: Voice & Speech Config */}
      {activeTab === 'speech' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <Card className="p-6 space-y-5">
            <div>
              <CardTitle className="text-base">Voice Personality Profile</CardTitle>
              <CardDescription>Select and preview the natural voice used by this agent.</CardDescription>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Selected Voice</p>
                  <p className="text-base font-bold text-slate-900 dark:text-white capitalize mt-0.5">
                    {voiceId.replace(/_/g, ' ')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceModalOpen(true)}
                  disabled={!isAdmin}
                  className="gap-1.5 text-xs bg-white dark:bg-slate-900"
                >
                  <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Change Voice</span>
                </Button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Natural Indian-English cadence with fluent bilingual Hindi / Hinglish comprehension.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Speaking Rate / Speed</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{voiceSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                  disabled={!isAdmin}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Model Temperature</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  disabled={!isAdmin}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <div>
              <CardTitle className="text-base">Telephony Greeting & Duration</CardTitle>
              <CardDescription>Initial prompt and maximum call safety boundaries.</CardDescription>
            </div>

            <div className="space-y-4">
              <Textarea
                label="Welcome Greeting Message"
                rows={4}
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                disabled={!isAdmin}
                helperText="Spoken as soon as caller connects to the virtual number."
              />

              <Input
                label="Max Call Duration (Seconds)"
                type="number"
                value={maxDurationSeconds}
                onChange={(e) => setMaxDurationSeconds(parseInt(e.target.value) || 600)}
                disabled={!isAdmin}
                helperText="Standard recommendation: 600 seconds (10 minutes)."
              />

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                <Switch
                  checked={bargeIn}
                  onCheckedChange={setBargeIn}
                  disabled={!isAdmin}
                  label="Allow Caller Barge-in"
                  description="Stops agent speaking immediately when caller begins asking a question."
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: Human Handoff */}
      {activeTab === 'handoff' && (
        <div className="max-w-2xl space-y-6 animate-in fade-in duration-150">
          <Card className="p-6 space-y-5">
            <div>
              <CardTitle className="text-base">Live Counselor Escalation (SIP Transfer)</CardTitle>
              <CardDescription>
                Transfer live phone calls from the AI agent directly to a human staff counselor or dean.
              </CardDescription>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <Switch
                checked={handoffEnabled}
                onCheckedChange={setHandoffEnabled}
                disabled={!isAdmin}
                label="Enable Human Escalation"
                description="Allows AI to initiate a live bridge call to your admissions office."
              />
            </div>

            {handoffEnabled && (
              <div className="space-y-4 pt-2">
                <Input
                  label="Counselor Transfer Phone Number"
                  placeholder="+91 98765 00001"
                  value={handoffNumber}
                  onChange={(e) => setHandoffNumber(e.target.value)}
                  disabled={!isAdmin}
                  helperText="Enter full E.164 phone number of senior counselor or landline."
                />

                <Select
                  label="Handoff Trigger Condition"
                  value={handoffCondition}
                  onChange={(e) => setHandoffCondition(e.target.value)}
                  disabled={!isAdmin}
                  options={[
                    { value: 'on_request_or_unknown', label: 'On Student Request or Unknown Inquiry (Recommended)' },
                    { value: 'always', label: 'Always Transfer After Gathering Name & Percent' },
                    { value: 'never', label: 'Never Transfer (Full AI Resolution Only)' },
                  ]}
                />
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: Operating Hours */}
      {activeTab === 'schedule' && (
        <div className="max-w-2xl space-y-6 animate-in fade-in duration-150">
          <Card className="p-6 space-y-5">
            <div>
              <CardTitle className="text-base">Operating Schedule</CardTitle>
              <CardDescription>Configure when Maya answers incoming calls on the virtual DID.</CardDescription>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
              <Switch
                checked={hoursEnabled}
                onCheckedChange={setHoursEnabled}
                disabled={!isAdmin}
                label="Enforce Operating Hours"
                description="When disabled, AI counselor accepts inquiries 24 hours / 7 days a week."
              />
            </div>

            {hoursEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={!isAdmin}
                />
                <Input
                  label="End Time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Voice Selector Modal */}
      <VoiceSelectorModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
        selectedVoiceId={voiceId}
        onSelectVoice={(id) => setVoiceId(id)}
      />
    </div>
  );
}
