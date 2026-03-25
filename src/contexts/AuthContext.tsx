import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthContextType, UserProfile, Tenant, UserRole } from '@/types/auth';

// Extend context type with completeOnboarding
interface ExtendedAuthContextType extends AuthContextType {
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<ExtendedAuthContextType | undefined>(undefined);

// ========== MOCK DATA ==========
const MOCK_USERS: Record<string, { profile: UserProfile; tenant: Tenant | null }> = {
  'admin@impresaleggera.it': {
    profile: {
      id: 'sa-001',
      email: 'admin@impresaleggera.it',
      full_name: 'Marco Rossi',
      role: 'superadmin',
      created_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    },
    tenant: null,
  },
  'cliente@demo.it': {
    profile: {
      id: 'cl-001',
      email: 'cliente@demo.it',
      full_name: 'Luigi Bianchi',
      role: 'cliente_admin',
      tenant_id: 'tenant-001',
      created_at: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    },
    tenant: {
      id: 'tenant-001',
      ragione_sociale: 'Bianchi Serramenti S.r.l.',
      partita_iva: '01234567890',
      codice_fiscale: 'BNCLGU80A01H501Z',
      email_principale: 'info@bianchiserramenti.it',
      piano: 'professionale',
      stato: 'attivo',
      crediti_residui: 42,
      created_at: new Date().toISOString(),
      onboarding_completato: true,
    },
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);

  const role: UserRole | null = profile?.role ?? null;
  const isAdmin = role === 'superadmin' || role === 'admin_operatore' || role === 'operatore';
  const isCliente = role === 'cliente_admin' || role === 'cliente_user';

  const login = useCallback(async (email: string, _password: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (!mockUser) {
      setLoading(false);
      throw new Error('Credenziali non valide. Prova: admin@impresaleggera.it o cliente@demo.it');
    }
    setUser({ id: mockUser.profile.id, email });
    setProfile(mockUser.profile);
    setTenant(mockUser.tenant);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setProfile(null);
    setTenant(null);
  }, []);

  const completeOnboarding = useCallback(async () => {
    if (tenant) {
      setTenant({ ...tenant, onboarding_completato: true });
    }
  }, [tenant]);

  return (
    <AuthContext.Provider value={{ user, profile, tenant, role, isAdmin, isCliente, loading, logout, login, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
