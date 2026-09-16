// =============================================================================
// Edu-Voice-AI — Demo-Only & Extended UI Types
// Used exclusively in Demo Mode or for TBD features pending backend implementation
// =============================================================================

import { UserRole } from './api';

export interface DemoKnowledgeChunk {
  id: string;
  organization_id: string;
  document_id: string;
  chunk_index: number;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DemoAuditLog {
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

export interface DemoFollowupTask {
  id: string;
  organization_id: string;
  lead_id: string;
  lead_name?: string;
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
}
