'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  ShieldCheck,
  Settings,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Organization } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InstitutionOverviewProps {
  organization: Organization | null;
  orgSlug: string;
  isDemoMode?: boolean;
}

export function InstitutionOverview({
  organization,
  orgSlug,
  isDemoMode = false,
}: InstitutionOverviewProps) {
  const orgName = organization?.name || 'Your Institution';
  const instType = organization?.institution_type || 'Educational Institution';
  
  const addressParts = [
    organization?.address?.city,
    organization?.address?.state,
    organization?.address?.country,
  ].filter(Boolean);
  const formattedAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

  return (
    <header className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-6 py-4.5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Institution Identity */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black shrink-0">
              <Building2 className="w-5 h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  Admissions AI Operating System
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>{organization?.is_active !== false ? 'Active Institution' : 'Inactive'}</span>
                </span>
                {isDemoMode && (
                  <Badge variant="warning" size="sm" className="font-mono text-[9px] uppercase px-1.5 py-0">
                    Demo Mode
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate leading-tight">
                {orgName}
              </h1>
            </div>
          </div>

          {/* Institution Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5 pl-0.5">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>{instType}</span>
            </span>

            {formattedAddress && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedAddress}</span>
              </span>
            )}

            {organization?.website_url && (
              <a
                href={organization.website_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 hover:underline truncate max-w-[220px]"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{organization.website_url.replace(/^https?:\/\//, '')}</span>
              </a>
            )}

            {organization?.timezone && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{organization.timezone}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Primary Contact & Quick Action */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
          {(organization?.primary_contact_name || organization?.primary_contact_email) && (
            <div className="text-right hidden sm:block pr-3 border-r border-slate-200 dark:border-slate-800">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Primary Contact
              </p>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                {organization.primary_contact_name || 'Admissions Desk'}
              </p>
              {organization.primary_contact_email && (
                <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                  {organization.primary_contact_email}
                </p>
              )}
            </div>
          )}

          <Link href={`/${orgSlug}/settings`}>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 h-9 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Institution Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
