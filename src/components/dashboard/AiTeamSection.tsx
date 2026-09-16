'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Plus,
  Phone,
  Settings2,
  ExternalLink,
  Volume2,
  Languages,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Agent, PhoneNumber } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AiTeamSectionProps {
  agents: Agent[];
  phoneNumbers: PhoneNumber[];
  orgSlug: string;
}

export function AiTeamSection({ agents, phoneNumbers, orgSlug }: AiTeamSectionProps) {
  // Operational Health Metrics
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.is_active).length;
  const inactiveAgents = totalAgents - activeAgents;

  const agentsWithPhone = agents.filter((a) => {
    return (
      phoneNumbers.some(
        (p) => p.assigned_agent?.id === a.id || p.assignment?.agent_id === a.id
      ) || Boolean(a.assigned_phone_number)
    );
  }).length;

  const agentsWithoutPhone = totalAgents - agentsWithPhone;

  return (
    <section aria-label="AI Communication Team" className="space-y-3.5">
      {/* Section Header with integrated workforce telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              AI COMMUNICATION TEAM
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{activeAgents} Active</span>
              </span>
              {inactiveAgents > 0 && (
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span>{inactiveAgents} Inactive</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-500">
                <Phone className="w-3 h-3 text-indigo-500" />
                <span>{agentsWithPhone} Connected Line{agentsWithPhone === 1 ? '' : 's'}</span>
              </span>
              {agentsWithoutPhone > 0 && (
                <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{agentsWithoutPhone} Unassigned</span>
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Autonomous AI counselors fielding admissions calls, answering course queries, and scheduling campus visits.
          </p>
        </div>

        <Link href={`/${orgSlug}/agents`}>
          <Button
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy AI Counselor</span>
          </Button>
        </Link>
      </div>

      {/* AI Employee Cards Grid */}
      {agents.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
          <Bot className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">No AI Counselors Deployed Yet</p>
          <p>Create and configure your first voice counselor to begin fielding admissions inquiries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => {
            const speechConfig = agent.speech_config || agent.config;
            const handoffConfig = agent.handoff_config || agent.config;
            
            const primaryLanguage = speechConfig?.language || speechConfig?.primary_language || 'en-IN';
            const supportedLangs = speechConfig?.supported_languages || [primaryLanguage];
            const voiceId = speechConfig?.voice_id || 'default_voice';
            const speed = speechConfig?.voice_speed ?? 1.0;

            const assignedPhone = phoneNumbers.find(
              (p) => p.assigned_agent?.id === agent.id || p.assignment?.agent_id === agent.id
            );
            const displayPhone = assignedPhone?.display_number || assignedPhone?.phone_number || agent.assigned_phone_number || null;

            const isHandoffEnabled = handoffConfig?.human_handoff_enabled ?? false;
            const needsSetup = !displayPhone || !speechConfig?.voice_id;

            return (
              <div
                key={agent.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 flex flex-col justify-between space-y-3.5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xs transition-all duration-150 group"
              >
                <div className="space-y-3">
                  {/* Identity & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                        {agent.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                            {agent.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 truncate capitalize font-medium">
                          {agent.agent_type ? agent.agent_type.replace(/_/g, ' ') : 'Admissions Counselor'}
                        </p>
                      </div>
                    </div>

                    {/* Subtle status indicator */}
                    <div className="shrink-0 text-right">
                      {agent.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>● Active</span>
                        </span>
                      ) : needsSetup ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>⚠ Needs setup</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          <span>○ Offline / Inactive</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Persona description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {agent.description || 'Configured AI voice counselor specialized in admissions advising.'}
                  </p>

                  {/* Voice & Phone Configuration */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 px-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-indigo-500" />
                        Voice & Lang
                      </span>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate capitalize">
                        {voiceId.replace(/_/g, ' ')}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate font-mono">
                        {supportedLangs.join(', ')}
                      </p>
                    </div>

                    <div className="space-y-0.5 min-w-0 pl-2 border-l border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-sky-500" />
                        Phone Line
                      </span>
                      {displayPhone ? (
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate">
                          {displayPhone}
                        </p>
                      ) : (
                        <p className="text-xs text-amber-600 dark:text-amber-400 font-medium truncate">
                          Unassigned
                        </p>
                      )}
                      <p className="text-[10px] text-slate-500 truncate">
                        {isHandoffEnabled ? 'Staff transfer enabled' : 'Direct answering'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Link href={`/${orgSlug}/agents`} className="block w-full">
                    <Button
                      variant={agent.is_active ? 'outline' : needsSetup ? 'primary' : 'outline'}
                      size="sm"
                      className={`w-full text-xs font-semibold h-8.5 justify-center gap-1.5 transition-colors ${
                        agent.is_active
                          ? 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          : needsSetup
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <span>{agent.is_active ? 'Manage Counselor' : needsSetup ? 'Complete Setup' : 'Activate Counselor'}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
