'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Check,
} from 'lucide-react';
import { DemoFollowupTask } from '@/types/demo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatTimeAgo } from '@/lib/utils';
import { useFollowups } from '@/hooks/useFollowups';

interface FollowupCenterProps {
  followups: DemoFollowupTask[];
  orgSlug: string;
  organizationId: string | null;
}

export function FollowupCenter({
  followups,
  orgSlug,
  organizationId,
}: FollowupCenterProps) {
  const now = Date.now();
  const { completeFollowup } = useFollowups(organizationId);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const pending = followups.filter((f) => f.status === 'pending');
  const overdue = pending.filter(
    (f) => f.scheduled_at && new Date(f.scheduled_at).getTime() < now
  );
  const upcoming = pending.filter(
    (f) => f.scheduled_at && new Date(f.scheduled_at).getTime() >= now
  );
  const completed = followups.filter((f) => f.status === 'completed');

  const getFollowupIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      case 'campus_visit':
        return <MapPin className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Phone className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const handleComplete = async (taskId: string) => {
    try {
      setCompletingId(taskId);
      await completeFollowup({
        followupId: taskId,
        outcome: 'Counselor contacted student and addressed admission query',
      });
    } catch (e) {
      console.error(e);
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
              FOLLOW-UP QUEUE
            </h2>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">{pending.length} Pending</span>
          </div>
          <p className="text-xs text-slate-500 font-normal mt-0.5">
            Counselor callbacks, WhatsApp messages, and scheduled campus tours.
          </p>
        </div>

        <Link href={`/${orgSlug}/leads`}>
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold gap-1.5 h-8 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            <span>All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      {/* Triage Numbers Row */}
      <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
        <div
          className={`p-2.5 rounded-xl border ${
            overdue.length > 0
              ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200/80 text-rose-800 dark:text-rose-300'
              : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/70 dark:border-slate-800 text-slate-600'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block">Overdue</span>
          <span className="text-xl font-black font-mono mt-0.5 block">{overdue.length}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-300">
          <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Upcoming</span>
          <span className="text-xl font-black text-slate-900 dark:text-white font-mono mt-0.5 block">
            {upcoming.length}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800 text-slate-600 dark:text-slate-300">
          <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Done</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">
            {completed.length}
          </span>
        </div>
      </div>

      {/* Follow-up Tasks Queue */}
      {followups.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
          No scheduled follow-up tasks currently in queue.
        </div>
      ) : (
        <div className="space-y-2">
          {followups.slice(0, 4).map((task) => {
            const isPending = task.status === 'pending';
            const isOverdue =
              isPending && task.scheduled_at && new Date(task.scheduled_at).getTime() < now;

            return (
              <div
                key={task.id}
                className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                  isOverdue
                    ? 'bg-slate-50/70 dark:bg-slate-950/60 border-rose-200/80 dark:border-rose-900/50'
                    : isPending
                    ? 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200/70 dark:border-slate-800'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60'
                }`}
              >
                {/* Task Details */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7.5 h-7.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
                    {getFollowupIcon(task.followup_type)}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate">
                        {task.lead_name || 'Prospective Student'}
                      </span>
                      {isOverdue && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60">
                          OVERDUE
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {task.assigned_to_name || 'Counselor Desk'}
                      {task.scheduled_at && ` • Due ${formatTimeAgo(task.scheduled_at)}`}
                    </p>

                    {task.notes && (
                      <p className="text-[11px] text-slate-400 italic truncate max-w-xs">
                        &ldquo;{task.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action: Inline Done or Completed Status */}
                <div className="shrink-0">
                  {isPending ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={completingId === task.id}
                      onClick={() => handleComplete(task.id)}
                      className="h-7 text-[11px] font-semibold border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors px-2.5"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      <span>{completingId === task.id ? '...' : 'Done'}</span>
                    </Button>
                  ) : (
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
