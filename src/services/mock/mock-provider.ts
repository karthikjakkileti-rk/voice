// =============================================================================
// Edu-Voice-AI — Isolated Mock Data Provider (Demo Mode Only)
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
  SEEDED_USER_PROFILE,
  SEEDED_ORGANIZATIONS,
  SEEDED_MEMBERS,
  SEEDED_AGENTS,
  SEEDED_PHONE_NUMBERS,
  SEEDED_CALLS,
  SEEDED_LEADS,
  SEEDED_KNOWLEDGE_DOCUMENTS,
  SEEDED_KNOWLEDGE_CHUNKS,
  SEEDED_RAG_SEARCH_RESULTS,
  SEEDED_USAGE_SUMMARY,
  SEEDED_USAGE_ANALYTICS,
  SEEDED_DEMO_FOLLOWUPS,
  SEEDED_DEMO_AUDIT_LOGS,
} from './mock-data';

class MockProvider {
  private userProfile: UserProfile = { ...SEEDED_USER_PROFILE };
  private organizations: Organization[] = [...SEEDED_ORGANIZATIONS];
  private members: OrganizationMember[] = [...SEEDED_MEMBERS];
  private agents: Agent[] = [...SEEDED_AGENTS];
  private phoneNumbers: PhoneNumber[] = [...SEEDED_PHONE_NUMBERS];
  private calls: CallDetail[] = [...SEEDED_CALLS];
  private leads: Lead[] = [...SEEDED_LEADS];
  private knowledgeDocs: KnowledgeDocument[] = [...SEEDED_KNOWLEDGE_DOCUMENTS];
  private knowledgeChunks: DemoKnowledgeChunk[] = [...SEEDED_KNOWLEDGE_CHUNKS];
  private followups: DemoFollowupTask[] = [...SEEDED_DEMO_FOLLOWUPS];
  private auditLogs: DemoAuditLog[] = [...SEEDED_DEMO_AUDIT_LOGS];

  // Auth / Me
  async getMe(): Promise<UserProfile> {
    await this.delay(100);
    return { ...this.userProfile };
  }

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    await this.delay(100);
    return [...this.organizations];
  }

  async getOrganization(id: string): Promise<Organization> {
    await this.delay(100);
    const org = this.organizations.find((o) => o.id === id || o.slug === id);
    if (!org) throw new Error(`Organization with ID/slug '${id}' not found in mock store.`);
    return { ...org };
  }

  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    await this.delay(200);
    const newOrg: Organization = {
      id: `a0000000-0000-0000-0000-${String(Date.now()).slice(-12)}`,
      name: data.name || 'New Educational Institution',
      slug: data.slug || `org-${Date.now()}`,
      institution_type: data.institution_type || 'college',
      website_url: data.website_url,
      timezone: data.timezone || 'Asia/Kolkata',
      primary_contact_name: data.primary_contact_name,
      primary_contact_phone: data.primary_contact_phone,
      primary_contact_email: data.primary_contact_email,
      address: data.address,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.organizations.push(newOrg);
    this.userProfile.organizations.push({
      id: newOrg.id,
      organization_id: newOrg.id,
      name: newOrg.name,
      organization_name: newOrg.name,
      slug: newOrg.slug,
      role: 'admin',
    });
    return newOrg;
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    await this.delay(150);
    const index = this.organizations.findIndex((o) => o.id === id || o.slug === id);
    if (index === -1) throw new Error(`Organization '${id}' not found.`);
    this.organizations[index] = {
      ...this.organizations[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { ...this.organizations[index] };
  }

  async getMembers(orgId: string): Promise<OrganizationMember[]> {
    await this.delay(100);
    return this.members.filter((m) => m.organization_id === orgId);
  }

  // Agents
  async getAgents(orgId: string): Promise<Agent[]> {
    await this.delay(100);
    return this.agents.filter((a) => a.organization_id === orgId);
  }

  async getAgent(orgId: string, agentId: string): Promise<Agent> {
    await this.delay(100);
    const agent = this.agents.find((a) => a.id === agentId && a.organization_id === orgId);
    if (!agent) throw new Error(`Agent '${agentId}' not found.`);
    return { ...agent };
  }

  async createAgent(orgId: string, data: { name: string; description?: string }): Promise<Agent> {
    await this.delay(200);
    const newAgent: Agent = {
      id: `c0000000-0000-0000-0000-${String(Date.now()).slice(-12)}`,
      organization_id: orgId,
      name: data.name,
      description: data.description || '',
      agent_type: 'admission_ai',
      is_active: true,
      speech_config: {
        primary_language: 'en-IN',
        language: 'en-IN',
        supported_languages: ['en-IN', 'hi-IN'],
        voice_id: 'maya_indian_female_warm',
        voice_speed: 1.0,
        temperature: 0.7,
        allow_barge_in: true,
        vad_silence_threshold_ms: 400,
        welcome_message: `Hello! Thank you for calling admissions. How may I assist you today?`,
        max_call_duration_seconds: 600,
      },
      system_prompt: `You are the official admission counselor for this institution. Provide accurate information on courses, fees, and eligibility.`,
      handoff_config: {
        human_handoff_enabled: true,
        human_handoff_number: '+919876500001',
        human_handoff_condition: 'on_request_or_unknown',
      },
      operating_hours: {
        enabled: true,
        timezone: 'Asia/Kolkata',
        start_time: '09:00',
        end_time: '19:00',
        working_days: [1, 2, 3, 4, 5, 6],
      },
      created_at: new Date().toISOString(),
    };
    this.agents.push(newAgent);
    return newAgent;
  }

  async updateAgentConfig(orgId: string, agentId: string, config: AgentConfigUpdatePayload): Promise<Agent> {
    await this.delay(150);
    const index = this.agents.findIndex((a) => a.id === agentId && a.organization_id === orgId);
    if (index === -1) throw new Error(`Agent '${agentId}' not found.`);

    const current = this.agents[index];
    const updatedSpeech = {
      ...current.speech_config,
      ...(config.voice_id ? { voice_id: config.voice_id } : {}),
      ...(config.language ? { primary_language: config.language, language: config.language } : {}),
      ...(config.voice_speed !== undefined ? { voice_speed: config.voice_speed } : {}),
      ...(config.temperature !== undefined ? { temperature: config.temperature } : {}),
      ...(config.allow_barge_in !== undefined ? { allow_barge_in: config.allow_barge_in } : {}),
      ...(config.welcome_message ? { welcome_message: config.welcome_message } : {}),
      ...(config.max_duration_seconds ? { max_call_duration_seconds: config.max_duration_seconds, max_duration_seconds: config.max_duration_seconds } : {}),
    };

    const updatedHandoff = {
      ...current.handoff_config,
      ...(config.human_handoff_enabled !== undefined ? { human_handoff_enabled: config.human_handoff_enabled } : {}),
      ...(config.human_handoff_number ? { human_handoff_number: config.human_handoff_number } : {}),
      ...(config.human_handoff_condition ? { human_handoff_condition: config.human_handoff_condition } : {}),
    };

    this.agents[index] = {
      ...current,
      system_prompt: config.system_prompt !== undefined ? config.system_prompt : current.system_prompt,
      speech_config: updatedSpeech as any,
      handoff_config: updatedHandoff as any,
      updated_at: new Date().toISOString(),
    };

    return { ...this.agents[index] };
  }

  async toggleAgentStatus(orgId: string, agentId: string, isActive: boolean): Promise<Agent> {
    await this.delay(100);
    const index = this.agents.findIndex((a) => a.id === agentId && a.organization_id === orgId);
    if (index === -1) throw new Error(`Agent '${agentId}' not found.`);
    this.agents[index].is_active = isActive;
    return { ...this.agents[index] };
  }

  // Telephony & Phone Numbers
  async getPhoneNumbers(orgId: string): Promise<PhoneNumber[]> {
    await this.delay(100);
    return this.phoneNumbers.filter((p) => p.organization_id === orgId);
  }

  async assignPhoneNumber(orgId: string, phoneId: string, agentId: string): Promise<PhoneNumber> {
    await this.delay(150);
    const pIndex = this.phoneNumbers.findIndex((p) => p.id === phoneId && p.organization_id === orgId);
    if (pIndex === -1) throw new Error(`Phone number '${phoneId}' not found.`);

    const agent = this.agents.find((a) => a.id === agentId);
    this.phoneNumbers[pIndex].assigned_agent = agent
      ? { id: agent.id, name: agent.name }
      : null;
    this.phoneNumbers[pIndex].assignment = agent
      ? {
          id: `asg_${Date.now()}`,
          organization_id: orgId,
          phone_number_id: phoneId,
          agent_id: agent.id,
          agent_name: agent.name,
          is_active: true,
          created_at: new Date().toISOString(),
        }
      : null;

    return { ...this.phoneNumbers[pIndex] };
  }

  // Calls
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
    await this.delay(120);
    let list = this.calls.filter((c) => c.organization_id === orgId);

    if (filters.status && filters.status !== 'all') {
      list = list.filter((c) => c.status === filters.status || c.call_status === filters.status);
    }
    if (filters.direction && filters.direction !== 'all') {
      list = list.filter((c) => c.direction === filters.direction);
    }
    if (filters.agent_id && filters.agent_id !== 'all') {
      list = list.filter((c) => c.agent_id === filters.agent_id);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.caller_number.toLowerCase().includes(q) ||
          c.lead_name?.toLowerCase().includes(q) ||
          c.agent_name?.toLowerCase().includes(q)
      );
    }

    const page = filters.page || 1;
    const pageSize = filters.page_size || 20;
    const total = list.length;
    const startIndex = (page - 1) * pageSize;
    const data = list.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        page_size: pageSize,
        total_pages: Math.ceil(total / pageSize) || 1,
      },
    };
  }

  async getCall(orgId: string, callId: string): Promise<CallDetail> {
    await this.delay(100);
    const call = this.calls.find((c) => c.id === callId && c.organization_id === orgId);
    if (!call) throw new Error(`Call session '${callId}' not found.`);
    return { ...call };
  }

  // Leads CRM
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
    await this.delay(120);
    let list = this.leads.filter((l) => l.organization_id === orgId);

    if (filters.status && filters.status !== 'all') {
      list = list.filter((l) => l.status === filters.status);
    }
    if (filters.interest_level && filters.interest_level !== 'all') {
      list = list.filter((l) => l.interest_level === filters.interest_level);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) =>
          l.full_name?.toLowerCase().includes(q) ||
          l.phone_number.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.course_interested?.toLowerCase().includes(q)
      );
    }

    const page = filters.page || 1;
    const pageSize = filters.page_size || 20;
    const total = list.length;
    const startIndex = (page - 1) * pageSize;
    const data = list.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        page_size: pageSize,
        total_pages: Math.ceil(total / pageSize) || 1,
      },
    };
  }

  async getLead(orgId: string, leadId: string): Promise<Lead> {
    await this.delay(100);
    const lead = this.leads.find((l) => l.id === leadId && l.organization_id === orgId);
    if (!lead) throw new Error(`Lead with ID '${leadId}' not found.`);
    return { ...lead };
  }

  async createLead(orgId: string, data: LeadCreatePayload): Promise<Lead> {
    await this.delay(150);
    const newLead: Lead = {
      id: `f0000000-0000-0000-0000-${String(Date.now()).slice(-12)}`,
      organization_id: orgId,
      full_name: data.full_name || 'Prospective Candidate',
      phone_number: data.phone_number,
      email: data.email,
      course_interested: data.course_interested || data.interested_course || 'B.Tech Computer Science',
      interested_course: data.course_interested || data.interested_course || 'B.Tech Computer Science',
      qualification: data.qualification || '12th Standard',
      preferred_batch: data.preferred_batch || 'Fall 2026',
      academic_year: '2026-2027',
      status: data.status || 'new',
      interest_level: data.interest_level || 'medium',
      lead_score: data.lead_score || 70,
      total_calls: 1,
      notes: data.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.leads.unshift(newLead);
    return newLead;
  }

  async updateLead(orgId: string, leadId: string, data: LeadUpdatePayload): Promise<Lead> {
    await this.delay(150);
    const index = this.leads.findIndex((l) => l.id === leadId && l.organization_id === orgId);
    if (index === -1) throw new Error(`Lead '${leadId}' not found.`);
    this.leads[index] = {
      ...this.leads[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { ...this.leads[index] };
  }

  async deleteLead(orgId: string, leadId: string): Promise<void> {
    await this.delay(150);
    this.leads = this.leads.filter((l) => !(l.id === leadId && l.organization_id === orgId));
  }

  // Knowledge Base
  async getKnowledge(orgId: string): Promise<KnowledgeDocument[]> {
    await this.delay(100);
    return this.knowledgeDocs.filter((d) => d.organization_id === orgId);
  }

  async uploadKnowledgeDoc(
    orgId: string,
    data: { title: string; category: string; file_type?: string; file_size_bytes?: number }
  ): Promise<KnowledgeDocument> {
    await this.delay(300);
    const newDoc: KnowledgeDocument = {
      id: `k0000000-0000-0000-0000-${String(Date.now()).slice(-12)}`,
      organization_id: orgId,
      title: data.title,
      category: data.category || 'general',
      source_type: data.file_type || 'pdf',
      file_type: data.file_type || 'pdf',
      file_size_bytes: data.file_size_bytes || 1200000,
      status: 'ready',
      chunks_count: Math.floor(Math.random() * 15) + 10,
      total_chunks: Math.floor(Math.random() * 15) + 10,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.knowledgeDocs.unshift(newDoc);
    return newDoc;
  }

  async deleteKnowledgeDoc(orgId: string, docId: string): Promise<void> {
    await this.delay(150);
    this.knowledgeDocs = this.knowledgeDocs.filter((d) => !(d.id === docId && d.organization_id === orgId));
  }

  async searchKnowledge(orgId: string, query: string, topK = 3): Promise<KnowledgeSearchResult[]> {
    await this.delay(200);
    const results = SEEDED_RAG_SEARCH_RESULTS.default || [];
    return results.slice(0, topK);
  }

  // Usage & Analytics
  async getUsageSummary(orgId: string): Promise<UsageSummary> {
    await this.delay(100);
    return { ...SEEDED_USAGE_SUMMARY, organization_id: orgId };
  }

  async getUsageAnalytics(orgId: string): Promise<UsageAnalytics> {
    await this.delay(120);
    return { ...SEEDED_USAGE_ANALYTICS };
  }

  // Demo-Only Extended Methods (For Simulated TBD features)
  async getDemoChunks(orgId: string, docId?: string): Promise<DemoKnowledgeChunk[]> {
    await this.delay(100);
    if (docId) {
      return this.knowledgeChunks.filter((c) => c.organization_id === orgId && c.document_id === docId);
    }
    return this.knowledgeChunks.filter((c) => c.organization_id === orgId);
  }

  async getDemoFollowups(orgId: string): Promise<DemoFollowupTask[]> {
    await this.delay(100);
    return this.followups.filter((f) => f.organization_id === orgId);
  }

  async completeDemoFollowup(orgId: string, followupId: string, outcome: string): Promise<DemoFollowupTask> {
    await this.delay(100);
    const index = this.followups.findIndex((f) => f.id === followupId && f.organization_id === orgId);
    if (index === -1) throw new Error('Followup not found');
    this.followups[index].status = 'completed';
    this.followups[index].outcome = outcome;
    this.followups[index].completed_at = new Date().toISOString();
    return { ...this.followups[index] };
  }

  async getDemoAuditLogs(orgId: string): Promise<DemoAuditLog[]> {
    await this.delay(100);
    return this.auditLogs.filter((a) => a.organization_id === orgId);
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const mockProvider = new MockProvider();
