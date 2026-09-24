// =============================================================================
// Edu-Voice-AI — Production API Services
// Strictly Contract-Driven REST API v1
// =============================================================================

import { apiClient, apiPaginatedClient } from '@/lib/api/client';
import {
  UserProfile,
  Organization,
  OrganizationMember,
  Agent,
  AgentConfigUpdatePayload,
  PhoneNumber,
  Call,
  CallDetail,
  CallTranscript,
  Lead,
  LeadCreatePayload,
  LeadUpdatePayload,
  KnowledgeDocument,
  KnowledgeSearchResult,
  UsageSummary,
  UsageAnalytics,
  PaginatedResponse,
  FollowupTask,
  AuditLog,
  Subscription,
} from '@/types/api';

// -----------------------------------------------------------------------------
// Auth & Profile
// -----------------------------------------------------------------------------
export const apiAuthService = {
  async getMe(): Promise<UserProfile> {
    return apiClient<UserProfile>('/me');
  },
};

// -----------------------------------------------------------------------------
// Organizations
// -----------------------------------------------------------------------------
export const apiOrganizationService = {
  async list(): Promise<Organization[]> {
    return apiClient<Organization[]>('/organizations');
  },

  async getById(orgId: string): Promise<Organization> {
    return apiClient<Organization>(`/organizations/${orgId}`);
  },

  async create(payload: Partial<Organization>): Promise<Organization> {
    return apiClient<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(orgId: string, payload: Partial<Organization>): Promise<Organization> {
    return apiClient<Organization>(`/organizations/${orgId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async getMembers(orgId: string): Promise<OrganizationMember[]> {
    return apiClient<OrganizationMember[]>(`/organizations/${orgId}/members`);
  },
};

// -----------------------------------------------------------------------------
// AI Agents
// -----------------------------------------------------------------------------
export const apiAgentService = {
  async list(orgId: string): Promise<Agent[]> {
    return apiClient<Agent[]>(`/organizations/${orgId}/agents`);
  },

  async getById(orgId: string, agentId: string): Promise<Agent> {
    return apiClient<Agent>(`/organizations/${orgId}/agents/${agentId}`);
  },

  async create(orgId: string, payload: { name: string; description?: string }): Promise<Agent> {
    return apiClient<Agent>(`/organizations/${orgId}/agents`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateConfig(orgId: string, agentId: string, payload: AgentConfigUpdatePayload): Promise<Agent> {
    return apiClient<Agent>(`/organizations/${orgId}/agents/${agentId}/config`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

// -----------------------------------------------------------------------------
// Telephony & Phone Numbers
// -----------------------------------------------------------------------------
export const apiPhoneService = {
  async list(orgId: string, status?: string): Promise<PhoneNumber[]> {
    return apiClient<PhoneNumber[]>(`/organizations/${orgId}/phone-numbers`, {
      params: { status },
    });
  },

  async register(orgId: string, payload: { phone_number: string; provider?: string }): Promise<PhoneNumber> {
    return apiClient<PhoneNumber>(`/organizations/${orgId}/phone-numbers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async assign(orgId: string, phoneId: string, agentId: string): Promise<PhoneNumber> {
    return apiClient<PhoneNumber>(`/organizations/${orgId}/phone-numbers/${phoneId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ agent_id: agentId }),
    });
  },
};

// -----------------------------------------------------------------------------
// Calls
// -----------------------------------------------------------------------------
export const apiCallsService = {
  async list(
    orgId: string,
    filters: {
      page?: number;
      page_size?: number;
      status?: string;
      direction?: string;
      agent_id?: string;
      outcome?: string;
      date_from?: string;
      date_to?: string;
      search?: string;
    } = {}
  ): Promise<PaginatedResponse<Call>> {
    return apiPaginatedClient<Call>(`/organizations/${orgId}/calls`, {
      params: filters,
    });
  },

  async getById(orgId: string, callId: string): Promise<CallDetail> {
    return apiClient<CallDetail>(`/organizations/${orgId}/calls/${callId}`);
  },

  async getTranscript(orgId: string, callId: string): Promise<{ call_id: string; turns: CallTranscript[] }> {
    return apiClient<{ call_id: string; turns: CallTranscript[] }>(
      `/organizations/${orgId}/calls/${callId}/transcript`
    );
  },

  async getRecordingUrl(orgId: string, callId: string): Promise<{ recording_url: string }> {
    return apiClient<{ recording_url: string }>(
      `/organizations/${orgId}/calls/${callId}/recording`
    );
  },
};

// -----------------------------------------------------------------------------
// Leads CRM
// -----------------------------------------------------------------------------
export const apiLeadsService = {
  async list(
    orgId: string,
    filters: {
      page?: number;
      page_size?: number;
      status?: string;
      interest_level?: string;
      search?: string;
      course_interested?: string;
    } = {}
  ): Promise<PaginatedResponse<Lead>> {
    return apiPaginatedClient<Lead>(`/organizations/${orgId}/leads`, {
      params: filters,
    });
  },

  async getById(orgId: string, leadId: string): Promise<Lead> {
    return apiClient<Lead>(`/organizations/${orgId}/leads/${leadId}`);
  },

  async create(orgId: string, payload: LeadCreatePayload): Promise<Lead> {
    return apiClient<Lead>(`/organizations/${orgId}/leads`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(orgId: string, leadId: string, payload: LeadUpdatePayload): Promise<Lead> {
    return apiClient<Lead>(`/organizations/${orgId}/leads/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async delete(orgId: string, leadId: string): Promise<void> {
    return apiClient<void>(`/organizations/${orgId}/leads/${leadId}`, {
      method: 'DELETE',
    });
  },
};

// -----------------------------------------------------------------------------
// Knowledge Base
// -----------------------------------------------------------------------------
export const apiKnowledgeService = {
  async list(orgId: string, category?: string, status?: string): Promise<KnowledgeDocument[]> {
    return apiClient<KnowledgeDocument[]>(`/organizations/${orgId}/knowledge`, {
      params: { category, status },
    });
  },

  async upload(orgId: string, formData: FormData): Promise<KnowledgeDocument> {
    return apiClient<KnowledgeDocument>(`/organizations/${orgId}/knowledge/upload`, {
      method: 'POST',
      body: formData,
    });
  },

  async delete(orgId: string, docId: string): Promise<void> {
    return apiClient<void>(`/organizations/${orgId}/knowledge/${docId}`, {
      method: 'DELETE',
    });
  },

  async search(orgId: string, query: string, topK = 3): Promise<KnowledgeSearchResult[]> {
    return apiClient<KnowledgeSearchResult[]>(`/organizations/${orgId}/knowledge/search`, {
      method: 'POST',
      body: JSON.stringify({ query, top_k: topK }),
    });
  },
};

// -----------------------------------------------------------------------------
// Usage & Analytics
// -----------------------------------------------------------------------------
export const apiUsageService = {
  async getSummary(orgId: string, fromDate?: string, toDate?: string): Promise<UsageSummary> {
    return apiClient<UsageSummary>(`/organizations/${orgId}/usage/summary`, {
      params: { from_date: fromDate, to_date: toDate },
    });
  },

  async getAnalytics(orgId: string): Promise<UsageAnalytics> {
    return apiClient<UsageAnalytics>(`/organizations/${orgId}/usage/analytics`);
  },
};

// -----------------------------------------------------------------------------
// Follow-ups
// -----------------------------------------------------------------------------
export const apiFollowupService = {
  async list(orgId: string): Promise<FollowupTask[]> {
    return apiClient<FollowupTask[]>(`/organizations/${orgId}/followups`);
  },

  async getById(orgId: string, followupId: string): Promise<FollowupTask> {
    return apiClient<FollowupTask>(`/organizations/${orgId}/followups/${followupId}`);
  },

  async create(orgId: string, payload: Partial<FollowupTask>): Promise<FollowupTask> {
    return apiClient<FollowupTask>(`/organizations/${orgId}/followups`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async update(orgId: string, followupId: string, payload: Partial<FollowupTask>): Promise<FollowupTask> {
    return apiClient<FollowupTask>(`/organizations/${orgId}/followups/${followupId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

// -----------------------------------------------------------------------------
// Audit Logs
// -----------------------------------------------------------------------------
export const apiAuditLogService = {
  async list(orgId: string): Promise<AuditLog[]> {
    return apiClient<AuditLog[]>(`/organizations/${orgId}/audit-logs`);
  },
};

// -----------------------------------------------------------------------------
// Subscription / Plan
// -----------------------------------------------------------------------------
export const apiSubscriptionService = {
  async get(orgId: string): Promise<Subscription> {
    return apiClient<Subscription>(`/organizations/${orgId}/subscription`);
  },
  async update(orgId: string, payload: Partial<Subscription>): Promise<Subscription> {
    return apiClient<Subscription>(`/organizations/${orgId}/subscription`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },
};

