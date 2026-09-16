'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhoneNumber, Agent } from '@/types/api';

interface TelephonyHealthProps {
  phoneNumbers: PhoneNumber[];
  agents: Agent[];
  orgSlug: string;
}

export function TelephonyHealth({
  phoneNumbers,
  agents,
  orgSlug,
}: TelephonyHealthProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-sky-600 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Inbound Telephony Lines
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-normal leading-snug">
            Virtual DID lines, telephony providers, and agent routing assignments.
          </p>
        </div>

        <Badge variant="primary" size="sm" className="font-mono text-[10px] shrink-0">
          {phoneNumbers.length} Lines
        </Badge>
      </div>

      {/* Phone Numbers List */}
      {phoneNumbers.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          No virtual phone lines assigned. Assign a virtual DID number to begin receiving candidate calls.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {phoneNumbers.map((phone) => {
            const isConnected = phone.status === 'active';
            const assignedAgent =
              phone.assigned_agent?.name ||
              agents.find((a) => a.id === phone.assignment?.agent_id)?.name ||
              'Unassigned';

            return (
              <div
                key={phone.id}
                className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3 hover:border-sky-300 dark:hover:border-sky-700 transition-all shadow-2xs"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Virtual DID Line
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white font-mono block">
                      {phone.display_number || phone.phone_number}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Provider: <strong>{phone.provider || 'SIP Gateway'}</strong>
                      {phone.country_code ? ` • Country: ${phone.country_code}` : ''}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isConnected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span>{isConnected ? 'Active' : phone.status}</span>
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Routing to:</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 truncate max-w-[150px]">
                    {assignedAgent}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
