// =============================================================================
// Edu-Voice-AI — Unified Data Provider
// Strict Separation: Demo Mode (MockProvider) vs Production Mode (ApiService)
// =============================================================================

import {
  UserProfile,
  Organization,
  OrganizationMember,
  Agent,
  AgentConfigUpdatePayload,
  PhoneNumber,
  Call,
  CallDetail,
  Lead,
  LeadCreatePayload,
  LeadUpdatePayload,
  KnowledgeDocument,
  KnowledgeSearchResult,
  UsageSummary,
  UsageAnalytics,
  PaginatedResponse,
} from '@/types/api';
import { DemoAuditLog, DemoFollowupTask, DemoKnowledgeChunk } from '@/types/demo';
import {
  apiAuthService,
  apiOrganizationService,
  apiAgentService,
  apiPhoneService,
  apiCallsService,
  apiLeadsService,
  apiKnowledgeService,
  apiUsageService,
} from './api';
import { mockProvider } from './mock/mock-provider';

export const isDemoMode = (): boolean => {
  if (typeof window !== 'undefined') {
    const override = localStorage.getItem('eduvoice_demo_mode');
    if (override !== null) return override.replace(/[\\"'`]/g, '').trim() === 'true';
  }
  const envVal = process.env.NEXT_PUBLIC_DEMO_MODE;
  if (!envVal) return false;
  return envVal.replace(/[\\"'`]/g, '').trim() === 'true';
};

export function setDemoModeOverride(enabled: boolean) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('eduvoice_demo_mode', enabled ? 'true' : 'false');
    window.location.reload();
  }
}

export const dataProvider = {
  // ---------------------------------------------------------------------------
  // Auth & Profile
  // ---------------------------------------------------------------------------
  async getMe(): Promise<UserProfile> {
    if (isDemoMode()) return mockProvider.getMe();
    return apiAuthService.getMe();
  },

  // ---------------------------------------------------------------------------
  // Organizations
  // ---------------------------------------------------------------------------
  async getOrganizations(): Promise<Organization[]> {
    if (isDemoMode()) return mockProvider.getOrganizations();
    return apiOrganizationService.list();
  },

  async getOrganization(id: string): Promise<Organization> {
    if (isDemoMode()) return mockProvider.getOrganization(id);
    return apiOrganizationService.getById(id);
  },

  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    if (isDemoMode()) return mockProvider.createOrganization(data);
    return apiOrganizationService.create(data);
  },

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    if (isDemoMode()) return mockProvider.updateOrganization(id, data);
    return apiOrganizationService.update(id, data);
  },

  async getMembers(orgId: string): Promise<OrganizationMember[]> {
    if (isDemoMode()) return mockProvider.getMembers(orgId);
    return apiOrganizationService.getMembers(orgId);
  },

  // ---------------------------------------------------------------------------
  // AI Agents
  // ---------------------------------------------------------------------------
  async getAgents(orgId: string): Promise<Agent[]> {
    if (isDemoMode()) return mockProvider.getAgents(orgId);
    return apiAgentService.list(orgId);
  },

  async getAgent(orgId: string, agentId: string): Promise<Agent> {
    if (isDemoMode()) return mockProvider.getAgent(orgId, agentId);
    return apiAgentService.getById(orgId, agentId);
  },

  async createAgent(orgId: string, data: { name: string; description?: string }): Promise<Agent> {
    if (isDemoMode()) return mockProvider.createAgent(orgId, data);
    return apiAgentService.create(orgId, data);
  },

  async updateAgentConfig(orgId: string, agentId: string, config: AgentConfigUpdatePayload): Promise<Agent> {
    if (isDemoMode()) return mockProvider.updateAgentConfig(orgId, agentId, config);
    return apiAgentService.updateConfig(orgId, agentId, config);
  },

  async toggleAgentStatus(orgId: string, agentId: string, isActive: boolean): Promise<Agent> {
    if (isDemoMode()) return mockProvider.toggleAgentStatus(orgId, agentId, isActive);
    return apiAgentService.updateConfig(orgId, agentId, {});
  },

  // ---------------------------------------------------------------------------
  // Telephony & Phone Numbers
  // ---------------------------------------------------------------------------
  async getPhoneNumbers(orgId: string, status?: string): Promise<PhoneNumber[]> {
    if (isDemoMode()) return mockProvider.getPhoneNumbers(orgId);
    return apiPhoneService.list(orgId, status);
  },

  async assignPhoneNumber(orgId: string, phoneId: string, agentId: string): Promise<PhoneNumber> {
    if (isDemoMode()) return mockProvider.assignPhoneNumber(orgId, phoneId, agentId);
    return apiPhoneService.assign(orgId, phoneId, agentId);
  },

  // ---------------------------------------------------------------------------
  // Calls
  // ---------------------------------------------------------------------------
  async getCalls(
    orgId: string,
    filters: {
      page?: number;
      page_size?: number;
      status?: string;
      direction?: string;
      agent_id?: string;
      search?: string;
    } = {}
  ): Promise<PaginatedResponse<Call>> {
    if (isDemoMode()) return mockProvider.getCalls(orgId, filters);
    return apiCallsService.list(orgId, filters);
  },

  async getCall(orgId: string, callId: string): Promise<CallDetail> {
    if (isDemoMode()) return mockProvider.getCall(orgId, callId);
    return apiCallsService.getById(orgId, callId);
  },

  // ---------------------------------------------------------------------------
  // Leads CRM
  // ---------------------------------------------------------------------------
  async getLeads(
    orgId: string,
    filters: {
      page?: number;
      page_size?: number;
      status?: string;
      interest_level?: string;
      search?: string;
    } = {}
  ): Promise<PaginatedResponse<Lead>> {
    if (isDemoMode()) return mockProvider.getLeads(orgId, filters);
    return apiLeadsService.list(orgId, filters);
  },

  async getLead(orgId: string, leadId: string): Promise<Lead> {
    if (isDemoMode()) return mockProvider.getLead(orgId, leadId);
    return apiLeadsService.getById(orgId, leadId);
  },

  async createLead(orgId: string, data: LeadCreatePayload): Promise<Lead> {
    if (isDemoMode()) return mockProvider.createLead(orgId, data);
    return apiLeadsService.create(orgId, data);
  },

  async updateLead(orgId: string, leadId: string, data: LeadUpdatePayload): Promise<Lead> {
    if (isDemoMode()) return mockProvider.updateLead(orgId, leadId, data);
    return apiLeadsService.update(orgId, leadId, data);
  },

  async deleteLead(orgId: string, leadId: string): Promise<void> {
    if (isDemoMode()) return mockProvider.deleteLead(orgId, leadId);
    return apiLeadsService.delete(orgId, leadId);
  },

  // ---------------------------------------------------------------------------
  // Knowledge Base
  // ---------------------------------------------------------------------------
  async getKnowledge(orgId: string, category?: string, status?: string): Promise<KnowledgeDocument[]> {
    if (isDemoMode()) return mockProvider.getKnowledge(orgId);
    return apiKnowledgeService.list(orgId, category, status);
  },

  async uploadKnowledgeDoc(
    orgId: string,
    data: { title: string; category: string; file_type?: string; file_size_bytes?: number; file?: File }
  ): Promise<KnowledgeDocument> {
    if (isDemoMode()) return mockProvider.uploadKnowledgeDoc(orgId, data);
    const formData = new FormData();
    if (data.file) formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('category', data.category);
    return apiKnowledgeService.upload(orgId, formData);
  },

  async deleteKnowledgeDoc(orgId: string, docId: string): Promise<void> {
    if (isDemoMode()) return mockProvider.deleteKnowledgeDoc(orgId, docId);
    return apiKnowledgeService.delete(orgId, docId);
  },

  async searchKnowledge(orgId: string, query: string, topK = 3): Promise<KnowledgeSearchResult[]> {
    if (isDemoMode()) return mockProvider.searchKnowledge(orgId, query, topK);
    return apiKnowledgeService.search(orgId, query, topK);
  },

  // ---------------------------------------------------------------------------
  // Usage & Analytics
  // ---------------------------------------------------------------------------
  async getUsageSummary(orgId: string, fromDate?: string, toDate?: string): Promise<UsageSummary> {
    if (isDemoMode()) return mockProvider.getUsageSummary(orgId);
    return apiUsageService.getSummary(orgId, fromDate, toDate);
  },

  async getUsageAnalytics(orgId: string): Promise<UsageAnalytics> {
    if (isDemoMode()) return mockProvider.getUsageAnalytics(orgId);
    return apiUsageService.getAnalytics(orgId);
  },

  // ---------------------------------------------------------------------------
  // Unconfirmed / TBD Endpoints (Supported only in Demo Mode)
  // ---------------------------------------------------------------------------
  async getKnowledgeChunks(orgId: string, docId?: string): Promise<{ supported: boolean; data: DemoKnowledgeChunk[] }> {
    if (isDemoMode()) {
      const data = await mockProvider.getDemoChunks(orgId, docId);
      return { supported: true, data };
    }
    return { supported: false, data: [] };
  },

  async getFollowups(orgId: string): Promise<{ supported: boolean; data: DemoFollowupTask[] }> {
    if (isDemoMode()) {
      const data = await mockProvider.getDemoFollowups(orgId);
      return { supported: true, data };
    }
    return { supported: false, data: [] };
  },

  async completeFollowup(orgId: string, followupId: string, outcome: string): Promise<{ supported: boolean; data?: DemoFollowupTask }> {
    if (isDemoMode()) {
      const data = await mockProvider.completeDemoFollowup(orgId, followupId, outcome);
      return { supported: true, data };
    }
    return { supported: false };
  },

  async getAuditLogs(orgId: string): Promise<{ supported: boolean; data: DemoAuditLog[] }> {
    if (isDemoMode()) {
      const data = await mockProvider.getDemoAuditLogs(orgId);
      return { supported: true, data };
    }
    return { supported: false, data: [] };
  },
};
