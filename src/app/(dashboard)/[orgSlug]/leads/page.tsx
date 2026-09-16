'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentOrg } from '@/context/tenant-context';
import { useLeads } from '@/hooks/useLeads';
import { useToast } from '@/context/toast-context';
import { Lead, LeadStatus, InterestLevel } from '@/types/api';
import {
  Users,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Trash2,
  Edit,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FilterBar } from '@/components/shared/filter-bar';
import { Pagination } from '@/components/shared/pagination';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { formatPhoneNumber, formatTimeAgo, getLeadStatusBadgeClass } from '@/lib/utils';

export default function LeadsPage() {
  const { organizationId, orgSlug, userRole } = useCurrentOrg();
  const { success, error: toastError } = useToast();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');

  const {
    leads,
    meta,
    isLoading,
    isError,
    error,
    refetch,
    createLead,
    isCreating,
    updateLead,
    deleteLead,
  } = useLeads(organizationId, {
    page,
    page_size: 15,
    search: searchQuery,
    status: statusFilter,
    interest_level: interestFilter,
  });

  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('B.Tech Computer Science');
  const [qualification, setQualification] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [interest, setInterest] = useState<InterestLevel>('high');
  const [notes, setNotes] = useState('');

  const isAdmin = userRole === 'admin';
  const isStaff = userRole === 'admin' || userRole === 'staff';

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLead({
        full_name: fullName,
        phone_number: phone,
        email,
        course_interested: course,
        interested_course: course,
        qualification,
        status,
        interest_level: interest,
        notes,
      });
      success(`Lead '${fullName}' registered successfully.`);
      setCreateModalOpen(false);
      // Reset
      setFullName('');
      setPhone('');
      setEmail('');
      setQualification('');
      setNotes('');
    } catch (err: any) {
      toastError(err.message || 'Failed to register lead');
    }
  };

  const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      await updateLead({ leadId, data: { status: newStatus } });
      success('Lead status updated.');
    } catch (err: any) {
      toastError(err.message || 'Failed to update lead status');
    }
  };

  const confirmDelete = (lead: Lead) => {
    if (!isAdmin) {
      toastError('Permission denied: Only administrators can delete lead records.');
      return;
    }
    setLeadToDelete(lead);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    try {
      await deleteLead(leadToDelete.id);
      success(`Lead '${leadToDelete.full_name}' deleted.`);
      setDeleteConfirmOpen(false);
      setLeadToDelete(null);
    } catch (err: any) {
      toastError(err.message || 'Failed to delete lead');
    }
  };

  const kanbanColumns: { id: LeadStatus; label: string }[] = [
    { id: 'new', label: 'New Inquiries' },
    { id: 'contacted', label: 'Contacted / Follow-up' },
    { id: 'qualified', label: 'Qualified Prospects' },
    { id: 'highly_interested', label: 'Highly Interested' },
    { id: 'admitted', label: 'Admitted / Enrolled' },
  ];

  if (isError) {
    return (
      <ErrorState
        title="Failed to load leads"
        message={error instanceof Error ? error.message : 'Error communicating with Leads CRM service'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Admissions Leads CRM</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track student prospects qualified automatically by Maya and your counseling team.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'
              }`}
              title="Kanban Pipeline view"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          {isStaff && (
            <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Register Prospect</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setPage(1);
        }}
        searchPlaceholder="Search candidate name, phone, course..."
        filters={[
          {
            key: 'status',
            label: 'Stage',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Stages' },
              { value: 'new', label: 'New' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'qualified', label: 'Qualified' },
              { value: 'highly_interested', label: 'Highly Interested' },
              { value: 'admitted', label: 'Admitted' },
              { value: 'lost', label: 'Closed / Lost' },
            ],
          },
          {
            key: 'interest',
            label: 'Interest Level',
            value: interestFilter,
            options: [
              { value: 'all', label: 'All Interest Levels' },
              { value: 'high', label: 'High Interest' },
              { value: 'medium', label: 'Medium Interest' },
              { value: 'low', label: 'Low Interest' },
            ],
          },
        ]}
        onFilterChange={(key, val) => {
          if (key === 'status') setStatusFilter(val);
          if (key === 'interest') setInterestFilter(val);
          setPage(1);
        }}
        onReset={() => {
          setSearchQuery('');
          setStatusFilter('all');
          setInterestFilter('all');
          setPage(1);
        }}
      />

      {/* View Mode: Table View */}
      {viewMode === 'table' ? (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            ) : leads.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Lead Prospects Found"
                description="No candidate records match your current search and stage criteria."
                actionLabel={isStaff ? 'Register Prospect' : undefined}
                onAction={isStaff ? () => setCreateModalOpen(true) : undefined}
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-4 sm:px-6">Candidate Profile</th>
                      <th className="py-3 px-4">Interested Program</th>
                      <th className="py-3 px-4">Stage</th>
                      <th className="py-3 px-4">Interest Score</th>
                      <th className="py-3 px-4">Total Calls</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {leads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors group"
                      >
                        {/* Name & Contact */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <Link href={`/${orgSlug}/leads/${lead.id}`} className="group-hover:text-indigo-600 font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{lead.full_name || 'Prospect'}</span>
                          </Link>
                          <div className="flex items-center gap-3 text-slate-500 text-[11px] mt-0.5">
                            <span className="font-mono">{formatPhoneNumber(lead.phone_number)}</span>
                            {lead.email && <span className="truncate max-w-[140px]">{lead.email}</span>}
                          </div>
                        </td>

                        {/* Course & Qualification */}
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            {lead.course_interested || lead.interested_course || 'B.Tech CSE'}
                          </p>
                          {lead.qualification && (
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {lead.qualification}
                            </p>
                          )}
                        </td>

                        {/* Stage Selector */}
                        <td className="py-3.5 px-4">
                          {isStaff ? (
                            <select
                              value={lead.status}
                              onChange={(e) => handleQuickStatusChange(lead.id, e.target.value as LeadStatus)}
                              className={`text-[11px] font-semibold rounded-lg px-2.5 py-1 border cursor-pointer ${getLeadStatusBadgeClass(lead.status)}`}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="qualified">Qualified</option>
                              <option value="highly_interested">Highly Interested</option>
                              <option value="admitted">Admitted</option>
                              <option value="lost">Closed / Lost</option>
                            </select>
                          ) : (
                            <span className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold capitalize ${getLeadStatusBadgeClass(lead.status)}`}>
                              {lead.status.replace(/_/g, ' ')}
                            </span>
                          )}
                        </td>

                        {/* Interest Level & Lead Score */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              {lead.lead_score || 75}/100
                            </span>
                            <Badge
                              variant={lead.interest_level === 'high' ? 'danger' : lead.interest_level === 'medium' ? 'warning' : 'neutral'}
                              size="sm"
                              className="capitalize text-[10px]"
                            >
                              {lead.interest_level}
                            </Badge>
                          </div>
                        </td>

                        {/* Total Calls */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-400">
                          {lead.total_calls || 1}
                        </td>

                        {/* Last Call Time */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {formatTimeAgo(lead.last_call_at || lead.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/${orgSlug}/leads/${lead.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600" title="View Profile">
                                <ArrowRight className="w-4 h-4" />
                              </Button>
                            </Link>

                            {isAdmin && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => confirmDelete(lead)}
                                className="h-8 w-8 text-slate-400 hover:text-rose-600"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="px-4 border-t border-slate-100 dark:border-slate-800">
              <Pagination
                currentPage={meta.page}
                totalPages={meta.total_pages}
                totalItems={meta.total}
                pageSize={meta.page_size}
                onPageChange={setPage}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        /* View Mode: Kanban Pipeline */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colLeads = leads.filter(
              (l) => l.status === col.id || (col.id === 'qualified' && l.status === 'interested') || (col.id === 'admitted' && l.status === 'enrolled')
            );

            return (
              <div key={col.id} className="p-3 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex flex-col min-w-[240px]">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{col.label}</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 font-semibold">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px]">
                  {colLeads.map((lead) => (
                    <Card key={lead.id} className="p-4 space-y-2.5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/${orgSlug}/leads/${lead.id}`} className="font-bold text-xs text-slate-900 dark:text-white hover:text-indigo-600 leading-snug">
                          {lead.full_name || 'Prospect'}
                        </Link>
                        <Badge variant={lead.interest_level === 'high' ? 'danger' : 'neutral'} size="sm" className="text-[9px]">
                          {lead.interest_level}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium truncate">
                        {lead.course_interested || lead.interested_course || 'B.Tech CSE'}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800 font-mono">
                        <span>{formatPhoneNumber(lead.phone_number)}</span>
                        <span>Score: {lead.lead_score || 75}</span>
                      </div>
                    </Card>
                  ))}
                  {colLeads.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400 italic">No prospects in this stage</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register Lead Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen} title="Register New Lead Prospect">
        <form onSubmit={handleCreateLead} className="space-y-4 my-2">
          <Input
            label="Candidate Full Name"
            placeholder="e.g. Rahul Verma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Phone Number"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="Email (Optional)"
              type="email"
              placeholder="candidate@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Interested Program / Course"
              placeholder="B.Tech Computer Science"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
            <Input
              label="Qualification / Score"
              placeholder="12th PCM - 92%"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Initial Stage"
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
              options={[
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'highly_interested', label: 'Highly Interested' },
              ]}
            />
            <Select
              label="Interest Level"
              value={interest}
              onChange={(e) => setInterest(e.target.value as InterestLevel)}
              options={[
                { value: 'high', label: 'High Interest' },
                { value: 'medium', label: 'Medium Interest' },
                { value: 'low', label: 'Low Interest' },
              ]}
            />
          </div>

          <Textarea
            label="Counselor Notes"
            placeholder="Key discussion points, scholarship eligibility, campus tour dates..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Save Lead Prospect
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Lead Record"
        description={`Are you sure you want to delete '${leadToDelete?.full_name}'? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
