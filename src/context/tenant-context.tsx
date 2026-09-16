'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Organization, UserRole } from '@/types/api';
import { dataProvider } from '@/services/data-provider';
import { useAuth } from './auth-context';

interface TenantContextValue {
  currentOrganization: Organization | null;
  organizationId: string | null;
  orgSlug: string;
  userRole: UserRole;
  organizations: Organization[];
  loading: boolean;
  notFound: boolean;
  switchOrganization: (slug: string) => void;
  refreshOrganizations: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { user, activeRole } = useAuth();
  const routeSlug = (params?.orgSlug as string) || '';

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchOrgs = useCallback(async () => {
    try {
      setLoading(true);
      const orgs = await dataProvider.getOrganizations();
      setOrganizations(orgs);

      if (routeSlug) {
        const matched = orgs.find((o) => o.slug === routeSlug || o.id === routeSlug);
        if (matched) {
          setCurrentOrganization(matched);
          setNotFound(false);
        } else {
          setCurrentOrganization(null);
          setNotFound(true);
        }
      } else if (orgs.length > 0) {
        setCurrentOrganization(orgs[0]);
        setNotFound(false);
      } else {
        setCurrentOrganization(null);
        setNotFound(false);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [routeSlug]);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const organizationId = useMemo(() => currentOrganization?.id || null, [currentOrganization]);

  const userRole: UserRole = useMemo(() => {
    if (!user || !currentOrganization) return activeRole || 'member';
    const membership = user.organizations.find(
      (m) => m.organization_id === currentOrganization.id || m.id === currentOrganization.id || m.slug === currentOrganization.slug
    );
    return membership?.role || activeRole || 'member';
  }, [user, currentOrganization, activeRole]);

  const switchOrganization = (slug: string) => {
    const target = organizations.find((o) => o.slug === slug || o.id === slug);
    if (target) {
      setCurrentOrganization(target);
      router.push(`/${target.slug}`);
    }
  };

  return (
    <TenantContext.Provider
      value={{
        currentOrganization,
        organizationId,
        orgSlug: routeSlug,
        userRole,
        organizations,
        loading,
        notFound,
        switchOrganization,
        refreshOrganizations: fetchOrgs,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useCurrentOrg() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useCurrentOrg must be used within a TenantProvider');
  }
  return context;
}
