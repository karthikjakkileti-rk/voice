'use client';

import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  ArrowRight,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DemoFollowupTask } from '@/types/demo';
import { formatTimeAgo } from '@/lib/utils';

interface FollowupQueueProps {
  followups: DemoFollowupTask[];
  orgSlug: string;
}

export function FollowupQueue({ followups, orgSlug }: FollowupQueueProps) {
  const now = Date.now();

  const pendingFollowups = followups.filter((f) => f.status === 'pending');
  
  // Overdue strictly requires: scheduled_at < current time AND status === 'pending'
  const overdueFollowups = followups.filter(
    (f) => f.status === 'pending' && f.scheduled_at && new Date(f.scheduled_at).getTime() < now
  );

  const getFollowupIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-emerald-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'campus_visit':
        return <MapPin className="w-4 h-4 text-amber-600" />;
      default:
        return <Phone className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Admissions Follow-up Queue
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-normal leading-snug">
            Scheduled callbacks, WhatsApp outreach & campus tours.
          </p>
        </div>

        <Badge variant="primary" size="sm" className="font-mono text-[10px] shrink-0">
          {pendingFollowups.length} Open
          {overdueFollowups.length > 0 && ` (${overdueFollowups.length} Late)`}
        </Badge>
      </div>

      {/* Queue Items */}
      {followups.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
          No candidate follow-up tasks currently scheduled.
        </div>
      ) : (
        <div className="space-y-2.5">
          {followups.slice(0, 4).map((task) => {
            const isPending = task.status === 'pending';
            const isOverdue =
              isPending && task.scheduled_at && new Date(task.scheduled_at).getTime() < now;

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-colors flex flex-col gap-2 text-xs ${
                  isOverdue
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/80 dark:border-rose-900/50'
                    : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                      {getFollowupIcon(task.followup_type)}
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white truncate block">
                      {task.lead_name || 'Candidate Follow-up'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                      {task.followup_type.replace(/_/g, ' ')}
                    </span>
                    {isOverdue && (
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        OVERDUE
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {task.notes || 'Scheduled follow-up task'}
                  {task.assigned_to_name && ` • Staff: ${task.assigned_to_name}`}
                </p>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatTimeAgo(task.scheduled_at)}
                  </span>
                  <Link href={`/${orgSlug}/leads`}>
                    <Button
                      variant={isPending ? 'primary' : 'outline'}
                      size="sm"
                      className="h-7 text-xs font-bold px-3 rounded-lg"
                    >
                      {isPending ? 'Execute Task' : 'Completed'}
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
