'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentOrg } from '@/context/tenant-context';
import { useFollowups } from '@/hooks/useFollowups';
import { useToast } from '@/context/toast-context';
import { DemoFollowupTask } from '@/types/demo';
import {
  CalendarClock,
  Phone,
  MessageSquare,
  Mail,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Search,
  User,
  Check,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FilterBar } from '@/components/shared/filter-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { formatDateTime, formatTimeAgo } from '@/lib/utils';

export default function FollowupsPage() {
  const { organizationId, orgSlug, userRole } = useCurrentOrg();
  const { followups, isLoading, isError, error, refetch, completeFollowup } = useFollowups(organizationId);
  const { success, error: toastError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Complete Dialog state
  const [selectedTask, setSelectedTask] = useState<DemoFollowupTask | null>(null);
  const [outcomeNote, setOutcomeNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStaff = userRole === 'admin' || userRole === 'staff';

  const filteredTasks = followups.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (typeFilter !== 'all' && task.followup_type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = (task.lead_name || '').toLowerCase();
      const notes = (task.notes || '').toLowerCase();
      const counselor = (task.assigned_to_name || '').toLowerCase();
      if (!name.includes(q) && !notes.includes(q) && !counselor.includes(q)) return false;
    }
    return true;
  });

  const pendingCount = followups.filter((t) => t.status === 'pending').length;
  const completedCount = followups.filter((t) => t.status === 'completed').length;

  const handleOpenCompleteDialog = (task: DemoFollowupTask) => {
    setSelectedTask(task);
    setOutcomeNote('');
  };

  const handleCompleteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setIsSubmitting(true);
    try {
      await completeFollowup({
        followupId: selectedTask.id,
        outcome: outcomeNote.trim() || 'Follow-up successfully resolved by counselor.',
      });
      success(`Follow-up with ${selectedTask.lead_name || 'student'} marked as completed.`);
      setSelectedTask(null);
      setOutcomeNote('');
    } catch (err: any) {
      toastError(err.message || 'Failed to complete follow-up task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'phone_call':
        return <Phone className="w-4 h-4 text-sky-500" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-indigo-500" />;
      case 'campus_visit':
        return <Building2 className="w-4 h-4 text-amber-500" />;
      default:
        return <CalendarClock className="w-4 h-4 text-slate-500" />;
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load Follow-up tasks"
        message={error instanceof Error ? error.message : 'Error retrieving follow-up records'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Admissions Follow-up Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage counselor callbacks, campus tour visits, and prospective student follow-up actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300">
            {pendingCount} Pending Triage
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            {completedCount} Completed
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search applicant name, counselor, or notes..."
        onFilterChange={(key, value) => {
          if (key === 'status') setStatusFilter(value);
          if (key === 'type') setTypeFilter(value);
        }}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setTypeFilter('all');
        }}
        filters={[
          {
            key: 'status',
            label: 'Status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
              { value: 'rescheduled', label: 'Rescheduled' },
            ],
          },
          {
            key: 'type',
            label: 'Task Type',
            value: typeFilter,
            options: [
              { value: 'all', label: 'All Types' },
              { value: 'phone_call', label: 'Phone Call' },
              { value: 'campus_visit', label: 'Campus Visit' },
              { value: 'whatsapp', label: 'WhatsApp' },
              { value: 'email', label: 'Email' },
            ],
          },
        ]}
      />

      {/* Task List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl w-full" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No follow-up tasks match your filters"
          description="All prospective student callbacks and appointments have been addressed."
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isPending = task.status === 'pending';

            return (
              <Card
                key={task.id}
                className={`p-4 transition-all hover:shadow-md ${
                  isCompleted ? 'opacity-75 bg-slate-50/60 dark:bg-slate-900/40' : 'bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                      {getTypeIcon(task.followup_type)}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/${orgSlug}/leads/${task.lead_id}`}
                          className="font-bold text-sm text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                        >
                          <span>{task.lead_name || 'Prospective Student'}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </Link>
                        <Badge
                          variant={isCompleted ? 'success' : isPending ? 'warning' : 'outline'}
                          size="sm"
                          className="capitalize text-[10px]"
                        >
                          {task.status}
                        </Badge>
                        <span className="text-[11px] text-slate-400 capitalize px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                          {task.followup_type.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {task.notes || 'Admission counselor follow-up regarding program details and fee structure.'}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Scheduled: {formatDateTime(task.scheduled_at)}</span>
                        </span>
                        {task.assigned_to_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Counselor: {task.assigned_to_name}</span>
                          </span>
                        )}
                        {task.outcome && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Outcome: {task.outcome}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Link href={`/${orgSlug}/leads/${task.lead_id}`}>
                      <Button variant="outline" size="sm" className="text-xs gap-1.5">
                        <span>View Lead</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>

                    {isPending && isStaff && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenCompleteDialog(task)}
                        className="text-xs gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Complete Task Dialog */}
      <Dialog
        open={Boolean(selectedTask)}
        onOpenChange={(open) => !open && setSelectedTask(null)}
        title="Resolve Admissions Follow-up Task"
      >
        {selectedTask && (
          <form onSubmit={handleCompleteTask} className="space-y-4 my-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">
                Applicant: {selectedTask.lead_name || 'Prospective Student'}
              </p>
              <p className="text-slate-500">
                Action: {selectedTask.followup_type.replace('_', ' ')} • Scheduled:{' '}
                {formatDateTime(selectedTask.scheduled_at)}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resolution Outcome Note
              </label>
              <Textarea
                placeholder="e.g. Student attended counseling session. Sent brochure and scheduled campus tour for Saturday."
                value={outcomeNote}
                onChange={(e) => setOutcomeNote(e.target.value)}
                rows={3}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedTask(null)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                {isSubmitting ? 'Resolving...' : 'Confirm Resolution'}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
