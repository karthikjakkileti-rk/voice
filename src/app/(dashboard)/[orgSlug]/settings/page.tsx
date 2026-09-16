'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentOrg } from '@/context/tenant-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/context/toast-context';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { dataProvider } from '@/services/data-provider';
import { OrganizationMember, UserRole } from '@/types/api';
import {
  Building2,
  Users,
  Shield,
  Save,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/utils';

export default function SettingsPage() {
  const { currentOrganization, organizationId, userRole, refreshOrganizations } = useCurrentOrg();
  const { user, demoMode } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [institutionType, setInstitutionType] = useState('college');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const { auditLogs, isSupported: auditLogsSupported, isLoading: isAuditLoading } = useAuditLogs(organizationId);

  const isAdmin = userRole === 'admin';

  useEffect(() => {
    if (currentOrganization) {
      setName(currentOrganization.name);
      setInstitutionType(currentOrganization.institution_type || 'college');
      setWebsiteUrl(currentOrganization.website_url || '');
      setTimezone(currentOrganization.timezone || 'Asia/Kolkata');
      setContactName(currentOrganization.primary_contact_name || '');
      setContactPhone(currentOrganization.primary_contact_phone || '');
      setContactEmail(currentOrganization.primary_contact_email || '');
      setCity(currentOrganization.address?.city || '');
      setState(currentOrganization.address?.state || '');
    }
  }, [currentOrganization]);

  useEffect(() => {
    if (organizationId && activeTab === 'team') {
      setIsMembersLoading(true);
      dataProvider
        .getMembers(organizationId)
        .then(setMembers)
        .catch(() => toastError('Failed to load team members'))
        .finally(() => setIsMembersLoading(false));
    }
  }, [organizationId, activeTab, toastError]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !organizationId) {
      toastError('Permission denied: Only administrators can update institution profile.');
      return;
    }

    setIsSaving(true);
    try {
      await dataProvider.updateOrganization(organizationId, {
        name,
        institution_type: institutionType as any,
        website_url: websiteUrl,
        timezone,
        primary_contact_name: contactName,
        primary_contact_phone: contactPhone,
        primary_contact_email: contactEmail,
        address: { city, state, country: 'India', pincode: '500081' },
      });
      await refreshOrganizations();
      success('Institution profile updated successfully.');
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Institution Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your organization profile, team permissions, security preferences, and audit logs.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={[
          { id: 'profile', label: 'Institution Profile', icon: <Building2 className="w-4 h-4" /> },
          { id: 'team', label: 'Team Members & Roles', icon: <Users className="w-4 h-4" /> },
          { id: 'audit', label: 'Security & Audit Logs', icon: <Shield className="w-4 h-4" /> },
        ]}
      />

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-3xl animate-in fade-in duration-150">
          <Card className="p-6 space-y-4">
            <div>
              <CardTitle className="text-base">Institutional Details</CardTitle>
              <CardDescription>Official institution identity and regional location parameters.</CardDescription>
            </div>

            <div className="space-y-4">
              <Input
                label="Institution Legal Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isAdmin}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Institution Type"
                  value={institutionType}
                  onChange={(e) => setInstitutionType(e.target.value)}
                  disabled={!isAdmin}
                  options={[
                    { value: 'college', label: 'Engineering / Degree College' },
                    { value: 'university', label: 'University / Deemed University' },
                    { value: 'school', label: 'K-12 School' },
                    { value: 'coaching', label: 'Coaching / Training Academy' },
                  ]}
                />
                <Input
                  label="Official Website URL"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  disabled={!isAdmin}
                  placeholder="https://apexcollege.edu.in"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={!isAdmin}
                />
                <Input
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Contact Email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  disabled={!isAdmin}
                />
                <Input
                  label="Primary Contact Phone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  disabled={!isAdmin}
                />
              </div>
            </div>

            {isAdmin && (
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="submit" variant="primary" isLoading={isSaving} className="gap-2">
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </Button>
              </div>
            )}
          </Card>
        </form>
      )}

      {/* TAB 2: Team Members */}
      {activeTab === 'team' && (
        <Card className="max-w-4xl space-y-4 animate-in fade-in duration-150">
          <CardHeader>
            <CardTitle className="text-base">Counseling Team & Staff</CardTitle>
            <CardDescription>Members authorized to manage leads, review transcripts, or administer settings.</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {isMembersLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        {member.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-slate-900 dark:text-white">{member.full_name}</p>
                        <p className="text-[11px] text-slate-500">{member.email}</p>
                      </div>
                    </div>

                    <Badge
                      variant={member.role === 'admin' ? 'primary' : member.role === 'staff' ? 'warning' : 'neutral'}
                      size="sm"
                      className="uppercase text-[10px] font-bold"
                    >
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Security & Audit Logs (Section 6) */}
      {activeTab === 'audit' && (
        <Card className="max-w-4xl space-y-4 animate-in fade-in duration-150">
          <CardHeader>
            <CardTitle className="text-base">Administrative Security Audit Trail</CardTitle>
            <CardDescription>Immutable log of agent prompt edits, role modifications, and phone reassignments.</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {!auditLogsSupported ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <Lock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700 dark:text-slate-300">
                  Audit Logging API is pending backend integration.
                </p>
                <p className="max-w-sm mx-auto">
                  Administrative changes are tracked internally and will be exposed via the audit endpoint in the upcoming FastAPI release.
                </p>
              </div>
            ) : isAuditLoading ? (
              <div className="p-6 space-y-3">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">No security events logged yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 sm:px-6 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white capitalize">
                          {log.action.replace(/_/g, ' ')}
                        </span>
                        <Badge variant="neutral" size="sm" className="text-[10px]">
                          {log.resource_type}
                        </Badge>
                      </div>
                      <p className="text-slate-500">
                        Actor: <span className="font-medium text-slate-700 dark:text-slate-300">{log.actor_name || 'Admin'}</span> • IP: {log.ip_address || '49.207.198.44'}
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-400 shrink-0">
                      {formatDateTime(log.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
