'use client';

import React, { useState } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { useMembers } from '@/hooks/useMembers';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import {
  UserCheck,
  Plus,
  Shield,
  Mail,
  Calendar,
  CheckCircle2,
  Users,
  Building2,
  UserX,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { formatDateTime } from '@/lib/utils';

export default function TeamPage() {
  const { organizationId, currentOrganization, userRole } = useCurrentOrg();
  const { user } = useAuth();
  const { members, isLoading, isError, error, refetch } = useMembers(organizationId);
  const { success, error: toastError } = useToast();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('staff');
  const [isInviting, setIsInviting] = useState(false);

  const isAdmin = userRole === 'admin';

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setIsInviting(true);
    // Simulate / execute invite
    setTimeout(() => {
      success(`Invitation sent to ${inviteEmail} with ${inviteRole} permissions.`);
      setInviteEmail('');
      setInviteRole('staff');
      setIsInviting(false);
      setInviteModalOpen(false);
    }, 600);
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load Team Members"
        message={error instanceof Error ? error.message : 'Error retrieving organization membership roster'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Team & Access</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage admissions officers, academic counselors, and institution access permissions.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={() => setInviteModalOpen(true)} className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Invite Admissions Staff</span>
          </Button>
        )}
      </div>

      {/* Roster & Roles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Members Roster (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                    Admissions Roster
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Active staff members for {currentOrganization?.name || 'this institution'}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {members.length} Member{members.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              ) : members.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No staff members found for this institution.
                </div>
              ) : (
                members.map((member) => {
                  const role = member.role || 'staff';
                  const isCurrent = user?.id === member.user_id || user?.email === member.email;

                  return (
                    <div
                      key={member.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center shrink-0 border border-slate-700 shadow-sm">
                          {(member.full_name || member.email || 'M').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {member.full_name || member.email?.split('@')[0] || 'Staff Member'}
                            </p>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                                You
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.email || 'staff@institution.edu'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <Badge
                          variant={role === 'admin' ? 'primary' : role === 'staff' ? 'default' : 'outline'}
                          size="sm"
                          className="capitalize text-xs font-semibold px-2.5 py-0.5"
                        >
                          {role === 'admin' ? 'Administrator' : role === 'staff' ? 'Admissions Counselor' : 'Viewer'}
                        </Badge>
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          Joined {formatDateTime(member.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Permissions & Security Matrix (Right 1 col) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Role Permissions</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Access governance based on institutional hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Administrator</span>
                  <Badge variant="primary" size="sm">Full Access</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Configure AI agents, telephony DID lines, knowledge base documents, billing, and team management.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Admissions Counselor</span>
                  <Badge variant="default" size="sm">Operational</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Access Call Intelligence, prospect CRM, resolve follow-ups, and receive live SIP phone transfers.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Auditor / Viewer</span>
                  <Badge variant="outline" size="sm">Read-Only</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">
                  View telemetry dashboards, call reports, and student enrollment summaries without editing rights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invite Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen} title="Invite Admissions Team Member">
        <form onSubmit={handleInvite} className="space-y-4 my-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Staff Email Address
            </label>
            <Input
              type="email"
              placeholder="e.g. admissions.lead@institution.edu"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Assigned Role
            </label>
            <Select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              options={[
                { value: 'staff', label: 'Admissions Counselor (Staff)' },
                { value: 'admin', label: 'Administrator (Full Access)' },
                { value: 'viewer', label: 'Auditor / Viewer (Read-Only)' },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setInviteModalOpen(false)}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={isInviting}>
              {isInviting ? 'Sending Invite...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
