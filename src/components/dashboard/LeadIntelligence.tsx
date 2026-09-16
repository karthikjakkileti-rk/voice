'use client';

import React from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Flame,
  GraduationCap,
  ArrowRight,
  Phone,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lead } from '@/types/api';
import { formatPhoneNumber } from '@/lib/utils';

interface LeadIntelligenceProps {
  leads: Lead[];
  orgSlug: string;
  totalLeadsInDb?: number;
}

export function LeadIntelligence({
  leads,
  orgSlug,
  totalLeadsInDb,
}: LeadIntelligenceProps) {
  // Counts strictly calculated from the returned page of leads
  const newLeads = leads.filter((l) => l.status === 'new').length;
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified').length;
  const contactedLeads = leads.filter((l) => l.status === 'contacted').length;
  
  // High interest strictly checked against interest_level field, not conflated with status
  const highInterestLeads = leads.filter((l) => l.interest_level === 'high').length;

  const pipelineStages = [
    {
      id: 'new',
      label: 'NEW INQUIRIES',
      sublabel: 'Fresh Inbound Leads',
      count: newLeads,
      color: 'bg-sky-500',
      textColor: 'text-sky-700 dark:text-sky-400',
      borderColor: 'border-sky-200 dark:border-sky-800',
      bgLight: 'bg-sky-50/70 dark:bg-sky-950/40',
      filter: 'new',
    },
    {
      id: 'qualified',
      label: 'QUALIFIED',
      sublabel: 'Eligibility Met',
      count: qualifiedLeads,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700 dark:text-indigo-400',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      bgLight: 'bg-indigo-50/70 dark:bg-indigo-950/40',
      filter: 'qualified',
    },
    {
      id: 'contacted',
      label: 'CONTACTED / FOLLOW-UP',
      sublabel: 'Counselor Reached Out',
      count: contactedLeads,
      color: 'bg-purple-500',
      textColor: 'text-purple-700 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-900/50',
      bgLight: 'bg-purple-50/70 dark:bg-purple-950/40',
      filter: 'contacted',
    },
    {
      id: 'high-interest',
      label: 'HIGH INTENT (INTEREST)',
      sublabel: 'High Interest Rating',
      count: highInterestLeads,
      color: 'bg-amber-500',
      textColor: 'text-amber-700 dark:text-amber-400',
      borderColor: 'border-amber-200 dark:border-amber-900/50',
      bgLight: 'bg-amber-50/70 dark:bg-amber-950/40',
      filter: 'all',
    },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Admissions Lead Intelligence
            </h3>
            <Badge variant="primary" size="sm" className="font-mono text-[10px]">
              {totalLeadsInDb ? `Batch: ${leads.length} of ${totalLeadsInDb} Total` : `Batch: ${leads.length} Leads`}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Qualification status and intent ratings for the current ingested candidate batch.
          </p>
        </div>

        <Link href={`/${orgSlug}/leads`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1 text-slate-700 dark:text-slate-300"
          >
            <span>Open Leads CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Visual Lead Pipeline Stages */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
          Current Batch Pipeline Distribution
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {pipelineStages.map((stage) => (
            <Link
              key={stage.id}
              href={`/${orgSlug}/leads${stage.filter !== 'all' ? `?status=${stage.filter}` : ''}`}
              className={`p-3.5 rounded-2xl border ${stage.borderColor} ${stage.bgLight} hover:scale-[1.02] transition-all flex flex-col justify-between space-y-2 group`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider ${stage.textColor}`}>
                  {stage.label}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
              </div>

              <div>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono block">
                  {stage.count}
                </span>
                <p className="text-[10px] text-slate-500 leading-snug">
                  {stage.sublabel}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Real Candidate Profiles Strip */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Recent Ingested Candidates
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Click to inspect candidate dossier
          </span>
        </div>

        {leads.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            No candidate leads captured yet. The voice counselor automatically extracts candidate contact info and program interest during calls.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {leads.slice(0, 4).map((lead) => {
              const course = lead.course_interested || lead.interested_course || null;
              const batch = lead.preferred_batch || lead.academic_year || null;

              return (
                <Link
                  key={lead.id}
                  href={`/${orgSlug}/leads/${lead.id}`}
                  className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-white dark:hover:bg-slate-900 transition-all flex flex-col justify-between space-y-3 group shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {lead.full_name || 'Prospective Student'}
                      </h4>
                      <p className="text-xs font-mono text-slate-500">
                        {formatPhoneNumber(lead.phone_number)}
                      </p>
                    </div>

                    {lead.interest_level === 'high' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                        <span>High Intent</span>
                      </span>
                    ) : (
                      <Badge variant="primary" size="sm" className="capitalize text-[10px]">
                        {lead.status}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/80 pt-2">
                    <div className="flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">
                        Program: <strong>{course || 'Not specified'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{batch ? `Batch: ${batch}` : 'Status: ' + lead.status}</span>
                      {lead.lead_score !== undefined && lead.lead_score !== null && (
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          Score: {lead.lead_score}/100
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
