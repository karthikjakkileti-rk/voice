'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  ArrowRight,
  Server,
  Cpu,
  User,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { PhoneNumber, Agent } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TelephonyCenterProps {
  phoneNumbers: PhoneNumber[];
  agents: Agent[];
  orgSlug: string;
}

export function TelephonyCenter({
  phoneNumbers,
  agents,
  orgSlug,
}: TelephonyCenterProps) {
  const activeLines = phoneNumbers.filter((p) => p.status === 'active').length;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              TELEPHONY ROUTING
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">{phoneNumbers.length} Provisioned Lines</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Dedicated campus telephone lines connected directly to admissions AI counselors.
          </p>
        </div>

        <Link href={`/${orgSlug}/telephony`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <span>Manage Lines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Conceptual Routing Architecture Pipeline: PHONE LINE -> AI AGENT -> STUDENT */}
      <div className="p-3 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
          Inbound Admissions Call Architecture
        </span>
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] shadow-2xs flex-1 justify-center">
            <Radio className="w-3.5 h-3.5 text-indigo-500" />
            <span className="font-semibold text-slate-900 dark:text-white">PHONE LINE</span>
          </div>

          <span className="text-slate-400 font-bold">→</span>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] shadow-2xs flex-1 justify-center">
            <Cpu className="w-3.5 h-3.5 text-sky-500" />
            <span className="font-semibold text-slate-900 dark:text-white">AI AGENT</span>
          </div>

          <span className="text-slate-400 font-bold">→</span>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] shadow-2xs flex-1 justify-center">
            <User className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-slate-900 dark:text-white">STUDENT</span>
          </div>
        </div>
      </div>

      {/* Phone Numbers List */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block px-0.5">
          Assigned Lines ({phoneNumbers.length})
        </span>

        {phoneNumbers.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            No virtual phone numbers provisioned yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
            {phoneNumbers.map((phone) => {
              const assignedAgent =
                phone.assigned_agent?.name ||
                agents.find((a) => a.id === phone.assignment?.agent_id)?.name ||
                null;

              const isActive = phone.status === 'active';

              return (
                <div
                  key={phone.id}
                  className="p-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                        {phone.display_number || phone.phone_number}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{isActive ? 'Active Line' : phone.status}</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      Assigned Counselor:{' '}
                      {assignedAgent ? (
                        <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{assignedAgent}</strong>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">Unassigned (Calls not routed)</span>
                      )}
                    </p>
                  </div>

                  <Link href={`/${orgSlug}/telephony`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-2"
                    >
                      <span>Route</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
