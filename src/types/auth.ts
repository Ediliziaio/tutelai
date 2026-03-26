// ========== RUOLI ==========
export type UserRole =
  | 'superadmin'
  | 'owner'
  | 'admin'
  | 'member'
  | 'viewer'
  | 'ai_officer'
  | 'dpo'
  | 'trainer';

// ========== PIANI ==========
export type PianoTenant = 'starter' | 'business' | 'enterprise';
export type StatoTenant = 'attivo' | 'sospeso' | 'trial' | 'churned';

// ========== PROFILO UTENTE ==========
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  tenant_id?: string;
  posizione?: string;
  created_at: string;
  last_seen: string;
}

// ========== TENANT ==========
export interface Tenant {
  id: string;
  ragione_sociale: string;
  partita_iva: string;
  settore?: string;
  num_dipendenti?: string;
  sito_web?: string;
  indirizzo?: string;
  legale_rappresentante?: string;
  email_legale?: string;
  pec?: string;
  logo_url?: string;
  email_principale: string;
  piano: PianoTenant;
  stato: StatoTenant;
  created_at: string;
  trial_ends_at?: string;
  onboarding_completato: boolean;
  ai_risk_score?: number;
  ai_risk_level?: 'ottimo' | 'buono' | 'attenzione' | 'critico';
  add_ons?: string[];
}

// ========== AUTH CONTEXT ==========
export interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  tenant: Tenant | null;
  role: UserRole | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCliente: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  updateTenant: (updates: Partial<Tenant>) => void;
  completeOnboarding: () => Promise<void>;
  // Impersonation
  impersonating: boolean;
  impersonatedTenant: Tenant | null;
  startImpersonation: (tenant: Tenant) => void;
  stopImpersonation: () => void;
}

// ========== NOTIFICHE ==========
export interface Notifica {
  id: string;
  user_id: string;
  tenant_id?: string;
  tipo: 'scadenza' | 'normativa' | 'formazione' | 'documento' | 'sistema';
  urgenza: 'info' | 'warning' | 'danger';
  titolo: string;
  messaggio?: string;
  link?: string;
  letta: boolean;
  created_at: string;
}
