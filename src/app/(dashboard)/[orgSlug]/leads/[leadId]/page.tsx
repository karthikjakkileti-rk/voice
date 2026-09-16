'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCurrentOrg } from '@/context/tenant-context';
import { useLead } from '@/hooks/useLeads';
import { useToast } from '@/context/toast-context';
import { LeadStatus, InterestLevel } from '@/types/api';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Save,
  Clock,
  Sparkles,
  CheckCircle2,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { formatPhoneNumber, formatDateTime, getLeadStatusBadgeClass } from '@/lib/utils';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { organizationId, orgSlug, userRole } = useCurrentOrg();
  const leadId = (params?.leadId as string) || '';

  const { lead, isLoading, isError, error, refetch, updateLead, isUpdating } =
    useLead(organizationId, leadId);
  const { success, error: toastError } = useToast();

  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [interest, setInterest] = useState<InterestLevel>('high');
  const [leadScore, setLeadScore] = useState(75);

  const isStaff = userRole === 'admin' || userRole === 'staff';

  useEffect(() => {
    if (lead) {
      setNotes(lead.notes || '');
      setStatus(lead.status);
      setInterest(lead.interest_level);
      setLeadScore(lead.lead_score || 75);
    }
  }, [lead]);

  const handleSaveNotes = async () => {
    if (!isStaff) {
      toastError('Permission denied: Only counselors and admins can edit lead notes.');
      return;
    }

    try {
      await updateLead({
        notes,
        status,
        interest_level: interest,
        lead_score: leadScore,
      });
      success('Lead details and counselor notes updated successfully.');
    } catch (err: any) {
      toastError(err.message || 'Failed to update lead');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <ErrorState
        title="Lead Record Not Found"
        message={error instanceof Error ? error.message : `Lead '${leadId}' could not be loaded.`}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/${orgSlug}/leads`}>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {lead.full_name || 'Prospect Profile'}
              </h1>
              <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-semibold capitalize ${getLeadStatusBadgeClass(lead.status)}`}>
                {lead.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Lead ID: <span className="font-mono text-slate-700 dark:text-slate-300">{lead.id}</span> • Registered: {formatDateTime(lead.created_at)}
            </p>
          </div>
        </div>

        {isStaff && (
          <Button onClick={handleSaveNotes} isLoading={isUpdating} className="gap-2 shadow-md shrink-0">
            <Save className="w-4 h-4" />
            <span>Save Counselor Notes</span>
          </Button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Academic Interest */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-md">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{lead.full_name || 'Prospect'}</h3>
                <p className="text-xs text-slate-500">Academic Session 2026-2027</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-mono font-medium">{formatPhoneNumber(lead.phone_number)}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{lead.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span className="font-medium">{lead.course_interested || lead.interested_course || 'B.Tech CSE'}</span>
              </div>
              {lead.qualification && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 block mb-0.5">Prior Qualification & Score:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{lead.qualification}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Lead Scoring Meter */}
          <Card className="p-6 space-y-4">
            <CardTitle className="text-sm font-bold">Admission Intent Score</CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-500">Calculated Score</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold text-base">{leadScore}/100</span>
              </div>
              <Progress value={leadScore} max={100} />
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Adjust Intent Score
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={leadScore}
                onChange={(e) => setLeadScore(parseInt(e.target.value))}
                disabled={!isStaff}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </Card>
        </div>

        {/* Right Column: Counselor Notes & Stage Management */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-5">
            <div>
              <CardTitle className="text-base">Counselor Case Management</CardTitle>
              <CardDescription>
                Record discussion outcomes, fee negotiation notes, scholarship eligibility, and next steps.
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Admission Stage"
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                disabled={!isStaff}
                options={[
                  { value: 'new', label: 'New Inquiry' },
                  { value: 'contacted', label: 'Contacted / In Discussion' },
                  { value: 'qualified', label: 'Qualified Prospect' },
                  { value: 'highly_interested', label: 'Highly Interested' },
                  { value: 'admitted', label: 'Admitted / Enrolled' },
                  { value: 'lost', label: 'Closed / Lost' },
                ]}
              />

              <Select
                label="Interest Priority"
                value={interest}
                onChange={(e) => setInterest(e.target.value as InterestLevel)}
                disabled={!isStaff}
                options={[
                  { value: 'high', label: 'High Priority' },
                  { value: 'medium', label: 'Medium Priority' },
                  { value: 'low', label: 'Low Priority' },
                ]}
              />
            </div>

            <Textarea
              label="Counselor Notes & Remarks"
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!isStaff}
              placeholder="Candidate is interested in B.Tech CSE. Scored 92% in 12th PCM. Father requested hostel tour this weekend..."
            />
          </Card>

          {/* Connected Voice Calls */}
          <Card className="p-6 space-y-3">
            <CardTitle className="text-base">Connected AI Call Records</CardTitle>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-indigo-600" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Total Calls: {lead.total_calls || 1}</p>
                  <p className="text-slate-500">Last conversation: {formatDateTime(lead.last_call_at || lead.created_at)}</p>
                </div>
              </div>
              {lead.source_call_id && (
                <Link href={`/${orgSlug}/calls/${lead.source_call_id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    View Recording & Transcript
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
