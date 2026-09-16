'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentOrg } from '@/context/tenant-context';
import { useAgents } from '@/hooks/useAgents';
import { useToast } from '@/context/toast-context';
import { Bot, Plus, Settings, Phone, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/shared/error-state';
import { EmptyState } from '@/components/shared/empty-state';

export default function AgentsPage() {
  const { organizationId, orgSlug, userRole } = useCurrentOrg();
  const { agents, isLoading, isError, error, refetch, createAgent, isCreating, toggleAgentStatus } =
    useAgents(organizationId);
  const { success, error: toastError } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');

  const isAdmin = userRole === 'admin';

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAgent({
        name: newAgentName,
        description: newAgentDesc,
      });
      success(`Agent '${newAgentName}' created successfully.`);
      setCreateModalOpen(false);
      setNewAgentName('');
      setNewAgentDesc('');
    } catch (err: any) {
      toastError(err.message || 'Failed to create agent');
    }
  };

  const handleToggle = async (agentId: string, currentStatus: boolean) => {
    if (!isAdmin) {
      toastError('Only administrators can change agent active status.');
      return;
    }
    try {
      await toggleAgentStatus({ agentId, isActive: !currentStatus });
      success(`Agent status updated to ${!currentStatus ? 'Active' : 'Inactive'}.`);
    } catch (err: any) {
      toastError(err.message || 'Failed to update agent status');
    }
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load AI Agents"
        message={error instanceof Error ? error.message : 'Error connecting to agent service'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AI Agent Studio</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your admission voice counselors, prompts, voice personalities, and SIP human handoff.
          </p>
        </div>

        {isAdmin && (
          <Button onClick={() => setCreateModalOpen(true)} className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span>Create New Agent</span>
          </Button>
        )}
      </div>

      {/* Agents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : agents.length === 0 ? (
        <EmptyState
          icon={Bot}
          title="No AI Agents Configured"
          description="Create your first admission voice counselor to begin receiving automated student inquiries."
          actionLabel={isAdmin ? 'Create Agent' : undefined}
          onAction={isAdmin ? () => setCreateModalOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((agent) => (
            <Card
              key={agent.id}
              className="flex flex-col justify-between hover:border-indigo-500/50 transition-colors shadow-sm"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20 shrink-0">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold">{agent.name}</CardTitle>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                        {agent.agent_type?.replace(/_/g, ' ') || 'Admission AI'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={agent.is_active ? 'success' : 'neutral'} size="sm">
                      {agent.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                  {agent.description || 'Primary voice counselor configured for higher-education admission inquiries.'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 py-2 text-xs">
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500">Voice ID:</span>
                    <p className="font-semibold text-slate-900 dark:text-white capitalize truncate mt-0.5">
                      {agent.speech_config?.voice_id?.replace(/_/g, ' ') || 'Maya Warm'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Language:</span>
                    <p className="font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                      {agent.speech_config?.primary_language || 'en-IN (English / Hindi)'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">DID Phone Line:</span>
                    <p className="font-mono font-bold text-slate-900 dark:text-white truncate mt-0.5">
                      {agent.assigned_phone_number || '040-459-01132'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Human Transfer:</span>
                    <p className="font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                      {agent.handoff_config?.human_handoff_enabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>

                {isAdmin && (
                  <div className="flex items-center justify-between px-1 pt-1">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Inbound Reception Status</span>
                    <Switch
                      checked={agent.is_active}
                      onCheckedChange={() => handleToggle(agent.id, agent.is_active)}
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Updated: {new Date(agent.created_at).toLocaleDateString()}
                </span>
                <Link href={`/${orgSlug}/agents/${agent.id}/config`}>
                  <Button variant="primary" size="sm" className="gap-1.5 text-xs font-semibold">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Configure Voice & Prompt</span>
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Agent Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen} title="Create Admission AI Agent">
        <form onSubmit={handleCreateAgent} className="space-y-4 my-2">
          <Input
            label="Agent Name"
            placeholder="e.g. Maya — Admission Counselor"
            value={newAgentName}
            onChange={(e) => setNewAgentName(e.target.value)}
            required
          />

          <Textarea
            label="Description & Responsibilities"
            placeholder="Describe the agent's target audience, degree programs handled, or special quota guidance..."
            value={newAgentDesc}
            onChange={(e) => setNewAgentDesc(e.target.value)}
            rows={3}
          />

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Create Agent
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
