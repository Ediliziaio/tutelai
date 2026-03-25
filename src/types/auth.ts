// ========== RUOLI ==========
export type UserRole =
  | 'superadmin'
  | 'admin_operatore'
  | 'operatore'
  | 'cliente_admin'
  | 'cliente_user';

// ========== PROFILI ==========
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  tenant_id?: string;
  telefono?: string;
  posizione?: string;
  created_at: string;
  last_seen: string;
}

// ========== TENANT ==========
export type PianoTenant = 'starter' | 'professionale' | 'enterprise';
export type StatoTenant = 'attivo' | 'sospeso' | 'trial' | 'churned';

export interface Tenant {
  id: string;
  ragione_sociale: string;
  partita_iva: string;
  codice_fiscale: string;
  codice_sdi?: string;
  pec?: string;
  indirizzo_via?: string;
  indirizzo_cap?: string;
  indirizzo_citta?: string;
  indirizzo_provincia?: string;
  telefono?: string;
  email_principale: string;
  piano: PianoTenant;
  stato: StatoTenant;
  crediti_residui: number;
  operatore_assegnato_id?: string;
  note_interne?: string;
  created_at: string;
  trial_ends_at?: string;
  onboarding_completato: boolean;
}

// ========== PRATICHE ==========
export type TipoPratica =
  | 'fattura'
  | 'enea'
  | 'finanziamento'
  | 'call_center'
  | 'segreteria'
  | 'recupero_crediti'
  | 'altro';

export type StatoPratica =
  | 'bozza'
  | 'in_attesa'
  | 'in_corso'
  | 'in_revisione'
  | 'completata'
  | 'annullata'
  | 'scaduta';

export type Priorita = 'bassa' | 'normale' | 'alta' | 'urgente';

export interface Pratica {
  id: string;
  codice: string;
  tenant_id: string;
  tipo: TipoPratica;
  titolo: string;
  descrizione?: string;
  stato: StatoPratica;
  priorita: Priorita;
  operatore_id?: string;
  richiedente_id: string;
  scadenza?: string;
  completata_at?: string;
  importo?: number;
  allegati: unknown[];
  note_interne?: string;
  note_cliente?: string;
  created_at: string;
  updated_at: string;
}

// ========== FATTURE ==========
// Legacy invoice types moved to @/types/fattura-legacy.ts
// Import from there for FatturaPreview and mock data compatibility.
export type { StatoFattura, UnitaMisura, ModalitaPagamento, RegimeFiscale, ScontoTipo, RigaFattura, Fattura } from './fattura-legacy';

// ========== TASKS ==========
export type StatoTask = 'da_fare' | 'in_corso' | 'completato';

export interface Task {
  id: string;
  pratica_id?: string;
  tenant_id?: string;
  titolo: string;
  descrizione?: string;
  assegnato_a?: string;
  creato_da: string;
  stato: StatoTask;
  priorita: Priorita;
  scadenza?: string;
  completato_at?: string;
  created_at: string;
}

// ========== COMMENTI ==========
export interface PraticaCommento {
  id: string;
  pratica_id: string;
  autore_id: string;
  testo: string;
  visibile_cliente: boolean;
  allegati: unknown[];
  created_at: string;
}

// ========== NOTIFICHE ==========
export interface Notifica {
  id: string;
  user_id: string;
  tenant_id?: string;
  tipo: string;
  titolo: string;
  messaggio?: string;
  link?: string;
  letta: boolean;
  created_at: string;
}

// ========== ACTIVITY LOG ==========
export interface ActivityLog {
  id: string;
  tenant_id?: string;
  user_id?: string;
  entita_tipo?: string;
  entita_id?: string;
  azione: string;
  dettagli: Record<string, unknown>;
  created_at: string;
}

// ========== COMMENTI PRATICA ==========
export type TipoCommento = 'messaggio' | 'nota_interna' | 'sistema';

export interface CommentoPratica {
  id: string;
  pratica_id: string;
  autore_id: string;
  autore_nome: string;
  autore_ruolo: 'operatore' | 'cliente' | 'sistema';
  autore_iniziali: string;
  tipo: TipoCommento;
  testo: string;
  allegati: string[];
  created_at: string;
}

// ========== ALLEGATI PRATICA ==========
export interface AllegatoPratica {
  id: string;
  pratica_id: string;
  nome: string;
  peso_bytes: number;
  tipo_file: string;
  url: string;
  caricato_da_id: string;
  caricato_da_nome: string;
  created_at: string;
}

// ========== TIMELINE PRATICA ==========
export type TipoTimelineEvento = 'creazione' | 'stato' | 'assegnazione' | 'commento' | 'allegato' | 'task' | 'fattura';

export interface TimelineEvento {
  id: string;
  pratica_id: string;
  tipo: TipoTimelineEvento;
  descrizione: string;
  autore_nome: string;
  autore_id: string;
  dettagli?: Record<string, unknown>;
  created_at: string;
}

// ========== AUTH CONTEXT ==========
export interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  tenant: Tenant | null;
  role: UserRole | null;
  isAdmin: boolean;
  isCliente: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
}
