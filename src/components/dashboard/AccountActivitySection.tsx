'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ArrowRight,
  Clock,
  User,
  Key,
} from 'lucide-react';
import { DemoAuditLog } from '@/types/demo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/lib/utils';

interface AccountActivitySectionProps {
  auditLogs: DemoAuditLog[];
  orgSlug: string;
}

export function AccountActivitySection({
  auditLogs,
  orgSlug,
}: AccountActivitySectionProps) {
  return (
    <div className="rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Account Activity
          </h3>
        </div>

        <span className="text-[10px] font-medium text-slate-500">
          Security Log
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-1.5 text-xs">
        {auditLogs.length === 0 ? (
          <div className="p-3 text-center text-[11px] text-slate-400 bg-white/40 dark:bg-slate-950/40 rounded-lg">
            No administrative audit events recorded yet.
          </div>
        ) : (
          auditLogs.slice(0, 2).map((log) => (
            <div
              key={log.id}
              className="p-2 rounded-lg bg-white/40 dark:bg-slate-900/40 text-[11px] space-y-0.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate capitalize">
                  {log.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {formatTimeAgo(log.created_at)}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">
                By: {log.actor_name || 'Admin'} • {log.resource_type}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Subtle Link */}
      <div className="pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
        <Link
          href={`/${orgSlug}/settings`}
          className="flex items-center justify-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors py-1"
        >
          <span>View Security Logs</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
