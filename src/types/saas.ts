// ========== AI REGISTRY ==========
export type RischioAI = 'inaccettabile' | 'alto' | 'limitato' | 'minimo';
export type StatoCompliance = 'conforme' | 'attenzione' | 'critico' | 'non_valutato';

export interface AiSystem {
  id: string;
  tenant_id: string;
  nome: string;
  fornitore: string;
  url_fornitore?: string;
  descrizione_uso?: string;
  categoria: string;
  chi_usa: string[];
  rischio: RischioAI;
  stato_compliance: StatoCompliance;
  problemi: AiSystemProblema[];
  documenti_correlati: string[];
  responsabile_id?: string;
  responsabile_nome?: string;
  fornitore_llm?: string;
  data_adozione?: string;
  interagisce_utenti: boolean;
  impatta_hr: boolean;
  created_at: string;
  updated_at: string;
}

export interface AiSystemProblema {
  id: string;
  descrizione: string;
  azione_suggerita?: string;
  urgente: boolean;
}

// ========== DOC GENERATOR ==========
export type StatoDocumento = 'bozza' | 'in_revisione' | 'approvato' | 'firmato' | 'archiviato';
export type TipoDocumento =
  | 'policy_ai_interno'
  | 'regolamento_ai'
  | 'informativa_lavoratori'
  | 'procedura_breach'
  | 'nomina_ai_officer'
  | 'procedura_dpia'
  | 'clausole_cliente'
  | 'clausole_fornitore'
  | 'contratto_saas'
  | 'nda_ai'
  | 'tc_sito'
  | 'addendum_ai'
  | 'registro_trattamenti'
  | 'informativa_privacy_ai'
  | 'dpia'
  | 'nomina_dpo'
  | 'consenso_ai'
  | 'notifica_breach'
  | 'disclaimer_sito'
  | 'script_disclosure'
  | 'etichetta_contenuto'
  | 'informativa_chatbot'
  | 'attestato_ai_literacy'
  | 'registro_corsi';

export interface Documento {
  id: string;
  tenant_id: string;
  tipo: TipoDocumento;
  titolo: string;
  stato: StatoDocumento;
  versione: number;
  contenuto?: string;
  sistemi_ai_inclusi?: string[];
  firmato_da?: string;
  firmato_at?: string;
  metodo_firma?: 'fea' | 'semplice' | 'manuale';
  created_at: string;
  updated_at: string;
}

// ========== AI MONITOR ==========
export type UrgenzaMonitor = 'critico' | 'attenzione' | 'info';
export type FonteMonitor = 'ai_act' | 'legge_132' | 'garante' | 'acn' | 'enisa' | 'commissione_ue' | 'altro';

export interface MonitorAggiornamento {
  id: string;
  titolo: string;
  fonte: FonteMonitor;
  fonte_label: string;
  url_originale?: string;
  urgenza: UrgenzaMonitor;
  data: string;
  sintesi: string;
  sistemi_impattati: string[];
  azioni_suggerite: string[];
  scadenza_azione?: string;
  letto: boolean;
}

// ========== TRAINING HUB ==========
export type StatoCorso = 'non_iniziato' | 'in_corso' | 'completato';

export interface TrainingCourse {
  id: string;
  titolo: string;
  descrizione: string;
  durata_minuti: number;
  obbligatorio: boolean;
  categoria: 'base' | 'avanzato';
  riferimento_normativo?: string;
  moduli: TrainingModulo[];
}

export interface TrainingModulo {
  id: string;
  corso_id: string;
  titolo: string;
  durata_minuti: number;
  ordine: number;
  tipo: 'video' | 'slide' | 'testo';
  ha_quiz: boolean;
}

export interface TrainingEnrollment {
  id: string;
  tenant_id: string;
  user_id: string;
  user_nome: string;
  corso_id: string;
  stato: StatoCorso;
  progresso_percentuale: number;
  punteggio_quiz?: number;
  completato_at?: string;
  codice_attestato?: string;
  ultimo_accesso?: string;
}

// ========== GDPR + AI ==========
export type RischioGdpr = 'basso' | 'medio' | 'alto';
export type BaseGiuridica = 'contratto' | 'legittimo' | 'consenso' | 'obbligo_legale' | 'interesse_vitale' | 'pubblico';
export type StatoDpia = 'non_richiesta' | 'in_corso' | 'completata' | 'da_aggiornare';

export interface DataProcessing {
  id: string;
  tenant_id: string;
  trattamento: string;
  base_giuridica: BaseGiuridica;
  sistema_ai_id?: string;
  sistema_ai_nome?: string;
  rischio: RischioGdpr;
  stato_dpia: StatoDpia;
  trasferimento_internazionale: boolean;
  paesi_destinazione?: string[];
  created_at: string;
  updated_at: string;
}

export interface Breach {
  id: string;
  tenant_id: string;
  titolo: string;
  stato: 'identificato' | 'in_gestione' | 'notificato' | 'chiuso';
  data_scoperta: string;
  notifica_garante_entro: string;
  created_at: string;
}

// ========== AUDIT TRAIL ==========
export type TipoEventoAudit =
  | 'DOCUMENT_CREATED'
  | 'DOCUMENT_UPDATED'
  | 'DOCUMENT_SIGNED'
  | 'AI_SYSTEM_ADDED'
  | 'AI_SYSTEM_UPDATED'
  | 'TRAINING_COMPLETED'
  | 'TRAINING_FAILED'
  | 'DPIA_STARTED'
  | 'BREACH_REPORTED'
  | 'MONITOR_ALERT_SENT'
  | 'USER_LOGIN'
  | 'USER_INVITED'
  | 'SETTINGS_CHANGED';

export interface AuditLog {
  id: string;
  tenant_id: string;
  timestamp: string;
  utente_id?: string;
  utente_nome?: string;
  ip?: string;
  modulo: string;
  tipo: TipoEventoAudit;
  azione: string;
  oggetto?: string;
  oggetto_id?: string;
  hash: string;
  hash_precedente?: string;
  integrita_ok: boolean;
  metadati?: Record<string, unknown>;
}

// ========== BILLING ==========
export interface Subscription {
  piano: 'starter' | 'business' | 'enterprise';
  importo_mensile: number;
  prossimo_rinnovo: string;
  stato: 'attivo' | 'sospeso' | 'cancellato';
  fatturazione: 'mensile' | 'annuale';
  add_ons: AddOn[];
  storico_fatture: Fattura[];
}

export interface AddOn {
  id: string;
  nome: string;
  prezzo: number;
  attivo: boolean;
}

export interface Fattura {
  id: string;
  data: string;
  importo: number;
  stato: 'pagata' | 'in_attesa' | 'fallita';
  url_pdf?: string;
}

// ========== TEAM ==========
export interface TeamMember {
  id: string;
  tenant_id: string;
  nome: string;
  email: string;
  ruolo: string;
  stato: 'attivo' | 'invitato' | 'disattivo';
  ultimo_accesso?: string;
  avatar_initials: string;
}
