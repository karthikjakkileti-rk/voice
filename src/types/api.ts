// =============================================================================
// Edu-Voice-AI — Frontend Canonical Production API Types
// Strictly adhering to FastAPI REST API v1 Specification
// =============================================================================

export type UserRole = 'admin' | 'staff' | 'member';
export type CallStatus = 'initiated' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'busy' | 'no_answer' | 'transferred';
export type CallDirection = 'inbound' | 'outbound';
export type CallOutcome = 'admission_inquiry' | 'campus_visit_scheduled' | 'fee_query' | 'general_inquiry' | 'dropped';
export type LeadStatus = 'new' | 'contacted' | 'interested' | 'highly_interested' | 'qualified' | 'enrolled' | 'admitted' | 'closed_lost' | 'lost';
export type InterestLevel = 'high' | 'medium' | 'low' | 'unclear';
export type PhoneNumberStatus = 'active' | 'provisioning' | 'suspended' | 'released' | 'pending';
export type KnowledgeDocStatus = 'pending' | 'processing' | 'indexed' | 'ready' | 'failed';

// -----------------------------------------------------------------------------
// Standard Response Envelopes
// -----------------------------------------------------------------------------

export interface PaginatedMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string | null;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  meta: PaginatedMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

// -----------------------------------------------------------------------------
// Authentication & User Profile
// -----------------------------------------------------------------------------

export interface UserOrganizationMembership {
  id?: string;
  organization_id?: string;
  organization_name?: string;
  name?: string;
  slug: string;
  role: UserRole;
}

export interface UserProfile {
  id?: string;
  user_id?: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  phone_number?: string | null;
  phone?: string | null;
  organizations: Array<{
    id?: string;
    organization_id?: string;
    name?: string;
    organization_name?: string;
    slug: string;
    role: UserRole;
  }>;
}

// -----------------------------------------------------------------------------
// Organizations
// -----------------------------------------------------------------------------

export interface OrganizationAddress {
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  institution_type?: 'college' | 'university' | 'school' | 'coaching' | string;
  website_url?: string;
  timezone?: string;
  primary_contact_name?: string;
  primary_contact_phone?: string;
  primary_contact_email?: string;
  address?: OrganizationAddress;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  created_at: string;
}

// -----------------------------------------------------------------------------
// AI Agents & Voice Configuration
// -----------------------------------------------------------------------------

export interface SpeechConfig {
  primary_language?: string;
  language?: string;
  supported_languages?: string[];
  voice_id: string;
  voice_speed: number;
  temperature?: number;
  allow_barge_in?: boolean;
  vad_silence_threshold_ms?: number;
  welcome_message?: string;
  max_call_duration_seconds?: number;
  max_duration_seconds?: number;
  stt_provider?: string;
  tts_provider?: string;
  llm_provider?: string;
  llm_model?: string;
}

export interface HandoffConfig {
  human_handoff_enabled: boolean;
  human_handoff_number?: string | null;
  human_handoff_condition?: 'on_request_or_unknown' | 'always' | 'never' | string;
}

export interface OperatingHours {
  enabled: boolean;
  timezone: string;
  start_time: string;
  end_time: string;
  working_days: number[];
}

export interface Agent {
  id: string;
  organization_id: string;
  name: string;
  agent_type?: string;
  description?: string | null;
  is_active: boolean;
  speech_config?: SpeechConfig;
  config?: (SpeechConfig & HandoffConfig) | null;
  system_prompt?: string;
  handoff_config?: HandoffConfig;
  operating_hours?: OperatingHours;
  assigned_phone_number?: string;
  created_at: string;
  updated_at?: string;
}

export interface AgentConfigUpdatePayload {
  system_prompt?: string;
  voice_id?: string;
  language?: string;
  voice_speed?: number;
  temperature?: number;
  human_handoff_enabled?: boolean;
  human_handoff_number?: string | null;
  human_handoff_condition?: string;
  welcome_message?: string;
  max_duration_seconds?: number;
  allow_barge_in?: boolean;
}

// -----------------------------------------------------------------------------
// Telephony & Phone Numbers
// -----------------------------------------------------------------------------

export interface PhoneAssignment {
  id?: string;
  organization_id?: string;
  phone_number_id?: string;
  agent_id: string;
  agent_name?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PhoneNumber {
  id: string;
  organization_id: string;
  phone_number: string;
  display_number?: string;
  provider: string;
  provider_sid?: string;
  country_code?: string;
  status: PhoneNumberStatus;
  assigned_agent?: {
    id: string;
    name: string;
  } | null;
  assignment?: PhoneAssignment | null;
  created_at: string;
  updated_at?: string;
}

// -----------------------------------------------------------------------------
// Calls & Telephony Intelligence
// -----------------------------------------------------------------------------

export interface CallTranscript {
  id?: string;
  call_id?: string;
  turn_number?: number;
  turn_index?: number;
  speaker: 'agent' | 'user' | 'caller' | 'system';
  message?: string;
  text?: string;
  timestamp_seconds?: number;
  audio_timestamp_offset_ms?: number;
  latency_ms?: number;
  confidence?: number;
  intent?: string;
  created_at?: string;
}

export interface CallSummary {
  id?: string;
  call_id?: string;
  organization_id?: string;
  summary: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed' | null;
  intent?: string | null;
  key_topics?: string[];
  action_items?: string[];
  caller_satisfaction_score?: number | null;
  created_at?: string;
}

export interface Call {
  id: string;
  organization_id: string;
  agent_id?: string | null;
  agent_name?: string;
  phone_number_id?: string | null;
  provider_call_id?: string | null;
  caller_number: string;
  receiver_number?: string;
  direction?: CallDirection;
  status?: CallStatus;
  call_status?: CallStatus;
  call_outcome?: CallOutcome;
  lead_id?: string | null;
  lead_name?: string | null;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'mixed';
  duration_seconds: number;
  recording_url?: string | null;
  has_recording?: boolean;
  transferred_to_human?: boolean;
  transferred_to_phone?: string | null;
  handoff_reason?: string | null;
  handoff_at?: string | null;
  disconnect_reason?: string | null;
  language_detected?: string | null;
  started_at?: string | null;
  answered_at?: string | null;
  ended_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CallDetail extends Call {
  summary_text?: string;
  summary?: CallSummary | null;
  transcripts?: CallTranscript[];
  turns?: CallTranscript[];
  extracted_data?: Record<string, any>;
  metadata?: Record<string, any>;
}

// -----------------------------------------------------------------------------
// Leads CRM
// -----------------------------------------------------------------------------

export interface Lead {
  id: string;
  organization_id: string;
  source_call_id?: string | null;
  full_name?: string | null;
  phone_number: string;
  email?: string | null;
  course_interested?: string | null;
  interested_course?: string | null;
  qualification?: string | null;
  preferred_batch?: string | null;
  academic_year?: string | null;
  status: LeadStatus;
  interest_level: InterestLevel;
  lead_score?: number;
  total_calls?: number;
  last_call_at?: string | null;
  notes?: string | null;
  assigned_to_user_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface LeadCreatePayload {
  full_name?: string;
  phone_number: string;
  email?: string;
  course_interested?: string;
  interested_course?: string;
  qualification?: string;
  preferred_batch?: string;
  status?: LeadStatus;
  interest_level?: InterestLevel;
  lead_score?: number;
  notes?: string;
}

export interface LeadUpdatePayload {
  full_name?: string;
  phone_number?: string;
  email?: string;
  course_interested?: string;
  interested_course?: string;
  qualification?: string;
  preferred_batch?: string;
  status?: LeadStatus;
  interest_level?: InterestLevel;
  lead_score?: number;
  notes?: string;
  assigned_to_user_id?: string | null;
}

// -----------------------------------------------------------------------------
// Knowledge Base & RAG
// -----------------------------------------------------------------------------

export interface KnowledgeDocument {
  id: string;
  organization_id: string;
  title: string;
  category: string;
  source_type?: string;
  file_type?: string;
  file_url?: string | null;
  file_size_bytes?: number | null;
  status: KnowledgeDocStatus;
  chunks_count?: number;
  total_chunks?: number;
  error_message?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface KnowledgeSearchRequest {
  query: string;
  top_k?: number;
}

export interface KnowledgeSearchResult {
  id: string;
  document_id: string;
  document_title: string;
  category: string;
  content: string;
  similarity_score: number;
  chunk_index?: number;
}

// -----------------------------------------------------------------------------
// Usage & Analytics
// -----------------------------------------------------------------------------

export interface UsageSummary {
  organization_id?: string;
  from_date?: string;
  to_date?: string;
  total_calls: number;
  total_minutes: number;
  total_voice_minutes?: number;
  total_leads_captured: number;
  lead_conversion_rate: number;
  average_call_duration_seconds: number;
  human_handoff_count: number;
  human_handoff_percentage: number;
  total_llm_input_tokens?: number;
  total_llm_output_tokens?: number;
  total_stt_audio_seconds?: number;
  total_tts_characters?: number;
  total_cost_cents?: number;
}

export interface UsageAnalyticsPoint {
  date: string;
  calls: number;
  minutes: number;
  leads: number;
  conversions: number;
  handoffs: number;
}

export interface UsageAnalytics {
  time_series: UsageAnalyticsPoint[];
  sentiment_distribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  hourly_traffic: Array<{
    hour: number;
    call_count: number;
  }>;
  outcomes_breakdown: Array<{
    outcome: string;
    count: number;
    percentage: number;
  }>;
}

// -----------------------------------------------------------------------------
// Subscriptions & Plans
// -----------------------------------------------------------------------------

export interface Subscription {
  id: string;
  organization_id: string;
  plan_tier: 'starter' | 'pro' | 'enterprise' | string;
  plan_name?: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | string;
  billing_cycle?: 'monthly' | 'annual' | string;
  voice_minutes_limit?: number | null;
  call_limit?: number | null;
  phone_numbers_limit?: number | null;
  current_period_start?: string;
  current_period_end?: string;
  currency?: string;
  amount_cents?: number;
  created_at: string;
  updated_at?: string;
}

// -----------------------------------------------------------------------------
// Follow-ups & Counselor Tasks
// -----------------------------------------------------------------------------

export interface FollowupTask {
  id: string;
  organization_id: string;
  lead_id: string;
  lead_name?: string;
  lead_phone?: string;
  call_id?: string | null;
  assigned_to_user_id?: string | null;
  assigned_to_name?: string;
  scheduled_at: string;
  status: 'pending' | 'completed' | 'rescheduled' | 'cancelled';
  followup_type: 'phone_call' | 'whatsapp' | 'email' | 'campus_visit';
  notes?: string | null;
  outcome?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// -----------------------------------------------------------------------------
// Security & Audit Logs
// -----------------------------------------------------------------------------

export interface AuditLog {
  id: string;
  organization_id?: string | null;
  actor_user_id?: string | null;
  actor_name?: string;
  action: string;
  resource_type: string;
  resource_id?: string | null;
  changes?: Record<string, any>;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

