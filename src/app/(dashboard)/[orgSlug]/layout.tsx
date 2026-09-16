'use client';

import React from 'react';
import { TenantProvider } from '@/context/tenant-context';
import { AppShell } from '@/components/layout/AppShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TenantProvider>
      <AppShell>{children}</AppShell>
    </TenantProvider>
  );
}
