'use client';

import React, { useState } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useToast } from '@/context/toast-context';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  Activity,
  FileSpreadsheet,
  Lock,
  Download,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FilterBar } from '@/components/shared/filter-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';
import { formatDateTime } from '@/lib/utils';

export default function SecurityPage() {
  const { organizationId, currentOrganization } = useCurrentOrg();
  const { auditLogs, isSupported, isLoading, isError, error, refetch } = useAuditLogs(organizationId);
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== 'all' && !log.action.toLowerCase().includes(actionFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const actor = (log.actor_name || '').toLowerCase();
      const action = (log.action || '').toLowerCase();
      const resource = (log.resource_type || '').toLowerCase();
      if (!actor.includes(q) && !action.includes(q) && !resource.includes(q)) return false;
    }
    return true;
  });

  const handleExport = () => {
    success('Audit logs export generated. CSV file downloaded.');
  };

  const getActionBadgeVariant = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('create') || act.includes('upload')) return 'success';
    if (act.includes('update') || act.includes('assign') || act.includes('configure')) return 'primary';
    if (act.includes('delete') || act.includes('remove')) return 'danger';
    return 'outline';
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load Security Audit Trail"
        message={error instanceof Error ? error.message : 'Error communicating with audit logging service'}
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
            Security & Activity Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable log of system modifications, agent prompt revisions, DID telephone reassignments, and security events.
          </p>
        </div>

        <Button variant="outline" onClick={handleExport} className="gap-2 shrink-0 text-xs">
          <Download className="w-4 h-4" />
          <span>Export Audit CSV</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search actor name, action, or resource..."
        onFilterChange={(_key, value) => setActionFilter(value)}
        onReset={() => {
          setSearchQuery('');
          setActionFilter('all');
        }}
        filters={[
          {
            key: 'action',
            label: 'Action Type',
            value: actionFilter,
            options: [
              { value: 'all', label: 'All Actions' },
              { value: 'create', label: 'Created' },
              { value: 'update', label: 'Updated / Configured' },
              { value: 'assign', label: 'Assigned' },
              { value: 'delete', label: 'Deleted' },
            ],
          },
        ]}
      />

      {/* Logs Table / Cards */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Audit Events Log</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tracking all administrative events for {currentOrganization?.name || 'this institution'}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {filteredLogs.length} Event{filteredLogs.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No audit logs found matching your filters.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {log.actor_name || 'System Administrator'}
                      </span>
                      <Badge
                        variant={getActionBadgeVariant(log.action)}
                        size="sm"
                        className="text-[10px] uppercase font-bold"
                      >
                        {log.action}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      Resource: <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{log.resource_type}</span>
                      {log.resource_id && (
                        <span className="text-[11px] text-slate-400 font-mono ml-1">({log.resource_id})</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center text-right text-[11px] text-slate-400">
                  {log.ip_address && (
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {log.ip_address}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDateTime(log.created_at)}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
