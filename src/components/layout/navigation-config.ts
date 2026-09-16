import {
  LayoutDashboard,
  Bot,
  PhoneCall,
  Phone,
  Users,
  CalendarClock,
  BookOpen,
  BarChart3,
  UserCheck,
  Building2,
  CreditCard,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  name: string;
  href: (orgSlug: string) => string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const NAVIGATION_SECTIONS: NavSection[] = [
  {
    title: 'WORKSPACE',
    items: [
      {
        name: 'Dashboard',
        href: (slug) => `/${slug}`,
        icon: LayoutDashboard,
        exact: true,
        description: 'Executive overview and real-time operational status',
      },
      {
        name: 'AI Agents',
        href: (slug) => `/${slug}/agents`,
        icon: Bot,
        badge: 'Active',
        description: 'Manage admission voice counselors and configurations',
      },
      {
        name: 'Calls & Conversations',
        href: (slug) => `/${slug}/calls`,
        icon: PhoneCall,
        description: 'Call logs, transcripts, sentiment, and conversation summaries',
      },
      {
        name: 'Leads CRM',
        href: (slug) => `/${slug}/leads`,
        icon: Users,
        description: 'Prospective student CRM, qualifications, and pipeline',
      },
      {
        name: 'Follow-ups',
        href: (slug) => `/${slug}/followups`,
        icon: CalendarClock,
        description: 'Counselor follow-up tasks, campus visits, and callbacks',
      },
      {
        name: 'Knowledge Base',
        href: (slug) => `/${slug}/knowledge`,
        icon: BookOpen,
        description: 'Curated institutional facts, fee schedules, and admission FAQs',
      },
      {
        name: 'Telephony',
        href: (slug) => `/${slug}/telephony`,
        icon: Phone,
        description: 'Virtual DID lines and AI counselor line assignments',
      },
      {
        name: 'Analytics & Usage',
        href: (slug) => `/${slug}/analytics`,
        icon: BarChart3,
        description: 'Telemetry, voice minutes, LLM tokens, and traffic metrics',
      },
    ],
  },
  {
    title: 'ORGANIZATION',
    items: [
      {
        name: 'Team & Access',
        href: (slug) => `/${slug}/team`,
        icon: UserCheck,
        description: 'Admissions staff members, roles, and access management',
      },
      {
        name: 'Subscription / Plan',
        href: (slug) => `/${slug}/subscription`,
        icon: CreditCard,
        description: 'Plan tier, carrier voice minutes quota, and billing status',
      },
      {
        name: 'Security & Activity',
        href: (slug) => `/${slug}/security`,
        icon: ShieldCheck,
        description: 'Administrative audit logs and configuration change trails',
      },
      {
        name: 'Institution Settings',
        href: (slug) => `/${slug}/settings`,
        icon: Building2,
        description: 'Institution profile, campus details, timezone, and contacts',
      },
    ],
  },
];
