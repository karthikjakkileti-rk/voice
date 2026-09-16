'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Flame,
  ArrowRight,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  Award,
} from 'lucide-react';
import { Lead } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPhoneNumber } from '@/lib/utils';

interface AdmissionsLeadsCrmProps {
  leads: Lead[];
  totalLeadsInDb?: number;
  orgSlug: string;
}

export function AdmissionsLeadsCrm({
  leads,
  totalLeadsInDb,
  orgSlug,
}: AdmissionsLeadsCrmProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  // Status counts dynamically calculated from actual API lead records
  const highIntentLeads = leads.filter((l) => l.interest_level === 'high').length;

  const statusCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    if (lead.status) {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
    }
    return acc;
  }, {});

  const availableStatuses = Object.keys(statusCounts);

  const filteredLeads = leads.filter((lead) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'high_interest') return lead.interest_level === 'high';
    return lead.status === activeTab;
  });

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
      {/* CRM Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              ADMISSIONS LEADS CRM
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {totalLeadsInDb ? `${totalLeadsInDb} Prospects in Pipeline` : `${leads.length} Prospects`}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Student applicant pipeline, qualification ratings, and automated counselor handoffs.
          </p>
        </div>

        <Link href={`/${orgSlug}/leads`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <span>All Prospects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Dynamic CRM Pipeline Stage Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
            activeTab === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
              : 'bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          All ({leads.length})
        </button>

        {highIntentLeads > 0 && (
          <button
            onClick={() => setActiveTab('high_interest')}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg font-semibold transition-all shrink-0 ${
              activeTab === 'high_interest'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            <Flame className="w-3 h-3 fill-current" />
            <span>High Intent ({highIntentLeads})</span>
          </button>
        )}

        {availableStatuses.map((statusKey) => {
          const count = statusCounts[statusKey];
          const isSelected = activeTab === statusKey;
          return (
            <button
              key={statusKey}
              onClick={() => setActiveTab(statusKey)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all shrink-0 capitalize ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {statusKey.replace(/_/g, ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* CRM Student Prospects List */}
      {filteredLeads.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          No student prospects found under stage &quot;{activeTab}&quot;.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
          {filteredLeads.slice(0, 5).map((lead) => {
            const course = lead.course_interested || lead.interested_course || 'Admissions Inquiry';
            const isHigh = lead.interest_level === 'high';

            return (
              <div
                key={lead.id}
                className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs group"
              >
                {/* Candidate & Academic Profile */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-white text-xs truncate group-hover:text-indigo-600 transition-colors">
                      {lead.full_name || 'Prospective Student'}
                    </span>

                    {/* Interest Rating Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.2 rounded text-[10px] font-semibold uppercase ${
                        isHigh
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60'
                          : lead.interest_level === 'medium'
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/60'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {isHigh && <Flame className="w-2.5 h-2.5 fill-current" />}
                      <span>{lead.interest_level || 'General'} Intent</span>
                    </span>

                    {/* Stage Badge */}
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-mono border border-slate-200/60 dark:border-slate-700/60">
                      {lead.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Interested Course & Academic Qualifications */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-slate-500 text-[11px]">
                    <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 truncate">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{course}</span>
                    </span>

                    {lead.qualification && (
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <Award className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{lead.qualification}</span>
                      </span>
                    )}

                    {lead.preferred_batch && (
                      <span className="inline-flex items-center gap-1 font-mono text-slate-400">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>{lead.preferred_batch}</span>
                      </span>
                    )}

                    {lead.phone_number && (
                      <span className="font-mono text-slate-400 hidden md:inline">
                        {formatPhoneNumber(lead.phone_number)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action: Notes snippet & CRM File button */}
                <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
                  {lead.notes && (
                    <span className="text-[11px] text-slate-400 italic truncate max-w-[160px] hidden lg:inline">
                      &ldquo;{lead.notes}&rdquo;
                    </span>
                  )}

                  <Link href={`/${orgSlug}/leads`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7.5 text-xs font-semibold border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 shadow-2xs"
                    >
                      <span>CRM File</span>
                      <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
