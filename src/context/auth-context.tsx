'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { UserProfile, UserRole } from '@/types/api';
import { dataProvider, isDemoMode, setDemoModeOverride } from '@/services/data-provider';
import { SEEDED_USER_PROFILE } from '@/services/mock/mock-data';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  demoMode: boolean;
  activeRole: UserRole;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  toggleDemoRole: (role: UserRole) => void;
  setDemoMode: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoModeState] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>('admin');

  const loadUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      const isDemo = isDemoMode();
      setDemoModeState(isDemo);

      if (isDemo) {
        setUser({ ...SEEDED_USER_PROFILE });
        setActiveRole('admin');
        setLoading(false);
        return;
      }

      // Real Supabase Mode
      const supabase = getSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const profile = await dataProvider.getMe();
      setUser(profile);
      if (profile.organizations.length > 0) {
        setActiveRole(profile.organizations[0].role || 'member');
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserProfile();

    if (!isDemoMode()) {
      const supabase = getSupabaseBrowserClient();
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          loadUserProfile();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          router.push('/login');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [loadUserProfile, router]);

  const signIn = async (email: string, password = 'password123') => {
    if (isDemoMode()) {
      setUser({ ...SEEDED_USER_PROFILE, email });
      setActiveRole('admin');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await loadUserProfile();
  };

  const signUp = async (email: string, password = 'password123', fullName = 'Institution Admin') => {
    if (isDemoMode()) {
      setUser({ ...SEEDED_USER_PROFILE, email, full_name: fullName });
      setActiveRole('admin');
      return;
    }

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    await loadUserProfile();
  };

  const signOut = async () => {
    if (!isDemoMode()) {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push('/login');
  };

  const toggleDemoRole = (role: UserRole) => {
    setActiveRole(role);
    if (user && user.organizations.length > 0) {
      const updatedOrgs = user.organizations.map((org) => ({ ...org, role }));
      setUser({ ...user, organizations: updatedOrgs });
    }
  };

  const setDemoMode = (enabled: boolean) => {
    setDemoModeOverride(enabled);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode,
        activeRole,
        signIn,
        signUp,
        signOut,
        toggleDemoRole,
        setDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
