'use client';

import React, { useState } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { usePhoneNumbers } from '@/hooks/usePhoneNumbers';
import { useAgents } from '@/hooks/useAgents';
import { useToast } from '@/context/toast-context';
import { PhoneNumber } from '@/types/api';
import {
  Phone,
  Bot,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Shield,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';

export default function TelephonyPage() {
  const { organizationId, userRole } = useCurrentOrg();
  const { phoneNumbers, isLoading, isError, error, refetch, assignPhoneNumber, isAssigning } =
    usePhoneNumbers(organizationId);
  const { agents } = useAgents(organizationId);
  const { success, error: toastError } = useToast();

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<PhoneNumber | null>(null);
  const [targetAgentId, setTargetAgentId] = useState('');

  const isAdmin = userRole === 'admin';

  const openAssignDialog = (phone: PhoneNumber) => {
    setSelectedPhone(phone);
    setTargetAgentId(phone.assigned_agent?.id || (agents.length > 0 ? agents[0].id : ''));
    setAssignModalOpen(true);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhone || !targetAgentId) return;

    try {
      await assignPhoneNumber({
        phoneId: selectedPhone.id,
        agentId: targetAgentId,
      });
      success('Virtual DID number assigned to AI agent successfully.');
      setAssignModalOpen(false);
    } catch (err: any) {
      toastError(err.message || 'Failed to assign phone number');
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load phone numbers"
        message={error instanceof Error ? error.message : 'Error connecting to telephony provider'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Telephony & Phone Lines</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your Exotel Indian virtual DID lines and map incoming callers to your AI admission counselors.
          </p>
        </div>
      </div>

      {/* DID Numbers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : phoneNumbers.length === 0 ? (
        <EmptyState
          icon={Phone}
          title="No Virtual Phone Numbers Configured"
          description="Provision or register an Indian virtual DID line to begin answering admission phone calls."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {phoneNumbers.map((phone) => (
            <Card key={phone.id} className="p-6 space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-base shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                      {phone.display_number || phone.phone_number}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Provider: {phone.provider}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">Country: {phone.country_code || 'IN'}</span>
                    </div>
                  </div>
                </div>

                <Badge variant={phone.status === 'active' ? 'success' : 'neutral'} size="sm">
                  {phone.status.toUpperCase()}
                </Badge>
              </div>

              {/* Assignment Status Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Assigned AI Counselor:</span>
                  {phone.assigned_agent ? (
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5" />
                      <span>{phone.assigned_agent.name}</span>
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Unassigned / Inactive</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Routing Protocol:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">FastAPI REST / Exotel Webhook</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Carrier Trunk Operational</span>
                </div>

                {isAdmin && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openAssignDialog(phone)}
                    className="gap-1.5 text-xs"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Assign Agent</span>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Assignment Modal */}
      <Dialog
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        title="Assign Virtual Number to Agent"
        description={`Route incoming phone calls from ${selectedPhone?.display_number || selectedPhone?.phone_number} to an AI counselor.`}
      >
        <form onSubmit={handleAssign} className="space-y-4 my-2">
          <Select
            label="Select AI Admission Counselor"
            value={targetAgentId}
            onChange={(e) => setTargetAgentId(e.target.value)}
            options={agents.map((a) => ({
              value: a.id,
              label: `${a.name} (${a.is_active ? 'Active' : 'Inactive'})`,
            }))}
          />

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-500">
            Incoming telephony calls on this virtual number will trigger real-time AI conversation processing using the selected counselor&apos;s prompt and knowledge base.
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isAssigning}>
              Save Assignment
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
