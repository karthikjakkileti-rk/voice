'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { OrganizationMember } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TeamAndAccessSectionProps {
  members: OrganizationMember[];
  orgSlug: string;
}

export function TeamAndAccessSection({
  members,
  orgSlug,
}: TeamAndAccessSectionProps) {
  const adminCount = members.filter((m) => m.role === 'admin').length;
  const staffCount = members.filter((m) => m.role === 'staff').length;
  const memberCount = members.filter((m) => m.role === 'member').length;

  return (
    <div className="rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Team & Access
          </h3>
        </div>

        <span className="text-[10px] font-medium text-slate-500">
          {members.length} Members
        </span>
      </div>

      {/* Role Counts */}
      <div className="grid grid-cols-3 gap-1.5 text-center text-[11px] text-slate-500">
        <div className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Admins</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{adminCount}</span>
        </div>

        <div className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Staff</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{staffCount}</span>
        </div>

        <div className="p-1.5 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/60">
          <span className="text-[9px] uppercase font-bold text-slate-400 block">Members</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{memberCount}</span>
        </div>
      </div>

      {/* Member Roster preview */}
      <div className="space-y-1">
        {members.slice(0, 2).map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-1.5 rounded-md bg-white/40 dark:bg-slate-900/40 text-[11px]"
          >
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
              {member.full_name || member.email}
            </span>
            <span className="text-[9px] font-mono text-slate-400 uppercase capitalize">
              {member.role}
            </span>
          </div>
        ))}
      </div>

      {/* Subtle Link */}
      <div className="pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
        <Link
          href={`/${orgSlug}/settings`}
          className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors py-1"
        >
          <span>Manage Team & Access</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
