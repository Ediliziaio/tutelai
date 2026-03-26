import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthContextType, UserProfile, Tenant, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, { profile: UserProfile; tenant: Tenant | null }> = {
  'admin@tutelai.it': {
    profile: { id: 'sa-001', email: 'admin@tutelai.it', full_name: 'Admin TutelAI', role: 'superadmin', created_at: new Date().toISOString(), last_seen: new Date().toISOString() },
    tenant: null,
  },
  'florin@aedix.it': {
    profile: { id: 'u-001', email: 'florin@aedix.it', full_name: 'Florin Andriciuc', role: 'owner', tenant_id: 'tenant-aedix', posizione: 'CEO', created_at: '2026-01-15T10:00:00Z', last_seen: new Date().toISOString() },
    tenant: { id: 'tenant-aedix', ragione_sociale: 'AEDIX S.r.l.', partita_iva: 'IT12345678901', settore: 'Consulenza / Servizi digitali', num_dipendenti: '10-49', sito_web: 'https://aedix.it', indirizzo: 'Via Roma 12, 20121 Milano MI', legale_rappresentante: 'Florin Andriciuc', email_legale: 'legal@aedix.it', pec: 'aedix@pec.it', email_principale: 'info@aedix.it', piano: 'business', stato: 'attivo', created_at: '2026-01-15T10:00:00Z', onboarding_completato: true, ai_risk_score: 34, ai_risk_level: 'attenzione', add_ons: ['ai_lawyer_chat'] },
  },
  'demo@tutelai.it': {
    profile: { id: 'u-demo', email: 'demo@tutelai.it', full_name: 'Mario Demo', role: 'owner', tenant_id: 'tenant-demo', created_at: new Date().toISOString(), last_seen: new Date().toISOString() },
    tenant: { id: 'tenant-demo', ragione_sociale: '', partita_iva: '', email_principale: 'demo@tutelai.it', piano: 'business', stato: 'trial', created_at: new Date().toISOString(), trial_ends_at: new Date(Date.now() + 14 * 86400000).toISOString(), onboarding_completato: false },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [impersonatedTenant, setImpersonatedTenant] = useState<Tenant | null>(null);

  const role: UserRole | null = profile?.role ?? null;
  const isSuperAdmin = role === 'superadmin';
  const isAdmin = isSuperAdmin;
  const isCliente = role !== null && role !== 'superadmin';
  const impersonating = isSuperAdmin && impersonatedTenant !== null;

  // When impersonating, expose the impersonated tenant as "tenant"
  const effectiveTenant = impersonating ? impersonatedTenant : tenant;

  const login = useCallback(async (email: string, _password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (!mockUser) {
      setLoading(false);
      throw new Error('Credenziali non valide.\nDemo disponibili:\n• florin@aedix.it (azienda)\n• admin@tutelai.it (superadmin)\n• demo@tutelai.it (onboarding)');
    }
    setUser({ id: mockUser.profile.id, email });
    setProfile(mockUser.profile);
    setTenant(mockUser.tenant);
    setImpersonatedTenant(null);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setUser(null); setProfile(null); setTenant(null); setImpersonatedTenant(null);
  }, []);

  const updateTenant = useCallback((updates: Partial<Tenant>) => {
    setTenant((prev) => prev ? { ...prev, ...updates } : prev);
  }, []);

  const completeOnboarding = useCallback(async () => {
    setTenant((prev) => prev ? { ...prev, onboarding_completato: true } : prev);
  }, []);

  const startImpersonation = useCallback((t: Tenant) => {
    setImpersonatedTenant(t);
  }, []);

  const stopImpersonation = useCallback(() => {
    setImpersonatedTenant(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, profile, tenant: effectiveTenant, role, isAdmin, isSuperAdmin, isCliente,
      loading, logout, login, updateTenant, completeOnboarding,
      impersonating, impersonatedTenant, startImpersonation, stopImpersonation,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
