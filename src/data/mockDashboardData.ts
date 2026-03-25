import type { Tenant, Pratica, Fattura, Notifica, ActivityLog, UserProfile, CommentoPratica, AllegatoPratica, TimelineEvento, Task } from '@/types/auth';

// ========== OPERATORI ==========
export interface OperatoreStats {
  id: string;
  nome: string;
  avatar_iniziali: string;
  pratiche_completate: number;
  pratiche_target: number;
  tempo_medio_giorni: number;
  rating: number;
}

export const mockOperatori: OperatoreStats[] = [
  { id: 'op1', nome: 'Mario Rossi', avatar_iniziali: 'MR', pratiche_completate: 18, pratiche_target: 20, tempo_medio_giorni: 1.2, rating: 4.9 },
  { id: 'op2', nome: 'Luigi Marchetti', avatar_iniziali: 'LM', pratiche_completate: 14, pratiche_target: 20, tempo_medio_giorni: 1.5, rating: 4.7 },
  { id: 'op3', nome: 'Anna Verdi', avatar_iniziali: 'AV', pratiche_completate: 11, pratiche_target: 20, tempo_medio_giorni: 1.8, rating: 4.6 },
  { id: 'op4', nome: 'Sara Bianchi', avatar_iniziali: 'SB', pratiche_completate: 9, pratiche_target: 20, tempo_medio_giorni: 2.1, rating: 4.4 },
];

// ========== TENANTS (expanded with full fields) ==========
const now = Date.now();

export const mockTenants: (Tenant & { pratiche_aperte: number; ultima_attivita: string; forma_giuridica?: string })[] = [
  { id: 't1', ragione_sociale: 'Edil Bianchi S.r.l.', partita_iva: '01234567890', codice_fiscale: '01234567890', codice_sdi: 'M5UXCR1', pec: 'edilbianchi@pec.it', indirizzo_via: 'Via Roma 45', indirizzo_cap: '20121', indirizzo_citta: 'Milano', indirizzo_provincia: 'MI', telefono: '02 1234567', email_principale: 'info@edilbianchi.it', piano: 'enterprise', stato: 'attivo', crediti_residui: 320, created_at: '2025-01-15', onboarding_completato: true, operatore_assegnato_id: 'op1', note_interne: 'Cliente storico, molto esigente sulla puntualità.', pratiche_aperte: 4, ultima_attivita: new Date(now - 2 * 3600000).toISOString(), forma_giuridica: 'S.r.l.' },
  { id: 't2', ragione_sociale: 'Studio Tecnico Verdi', partita_iva: '09876543210', codice_fiscale: '09876543210', codice_sdi: 'SUBM70N', pec: 'studioverdi@pec.it', indirizzo_via: 'Corso Garibaldi 12', indirizzo_cap: '00185', indirizzo_citta: 'Roma', indirizzo_provincia: 'RM', email_principale: 'info@studioverdi.it', piano: 'professionale', stato: 'attivo', crediti_residui: 145, created_at: '2025-02-20', onboarding_completato: true, operatore_assegnato_id: 'op3', pratiche_aperte: 2, ultima_attivita: new Date(now - 22 * 60000).toISOString(), forma_giuridica: 'Studio associato' },
  { id: 't3', ragione_sociale: 'Costruzioni Rossi', partita_iva: '11223344556', codice_fiscale: '11223344556', pec: 'rossi@pec.it', indirizzo_via: 'Via Mazzini 8', indirizzo_cap: '40126', indirizzo_citta: 'Bologna', indirizzo_provincia: 'BO', email_principale: 'info@costruzionirossi.it', piano: 'enterprise', stato: 'attivo', crediti_residui: 89, created_at: '2024-11-05', onboarding_completato: true, operatore_assegnato_id: 'op2', note_interne: 'Stanno valutando upgrade al piano enterprise.', pratiche_aperte: 3, ultima_attivita: new Date(now - 5 * 60000).toISOString(), forma_giuridica: 'S.r.l.' },
  { id: 't4', ragione_sociale: 'Impiantistica Neri', partita_iva: '66778899001', codice_fiscale: '66778899001', email_principale: 'neri@pec.it', piano: 'starter', stato: 'trial', crediti_residui: 50, created_at: '2026-03-01', onboarding_completato: false, trial_ends_at: '2026-03-19', pratiche_aperte: 0, ultima_attivita: new Date(now - 86400000).toISOString(), forma_giuridica: 'Ditta individuale' },
  { id: 't5', ragione_sociale: 'Arredo Design Lux', partita_iva: '55443322110', codice_fiscale: '55443322110', codice_sdi: 'KRRH6B9', pec: 'arredolux@pec.it', indirizzo_via: 'Piazza Duomo 1', indirizzo_cap: '50122', indirizzo_citta: 'Firenze', indirizzo_provincia: 'FI', email_principale: 'info@arredolux.it', piano: 'professionale', stato: 'attivo', crediti_residui: 42, created_at: '2025-06-12', onboarding_completato: true, operatore_assegnato_id: 'op4', pratiche_aperte: 1, ultima_attivita: new Date(now - 3 * 86400000).toISOString(), forma_giuridica: 'S.r.l.' },
  { id: 't6', ragione_sociale: 'Termoidraulica Gialli', partita_iva: '99887766554', codice_fiscale: '99887766554', indirizzo_via: 'Via Dante 22', indirizzo_cap: '10121', indirizzo_citta: 'Torino', indirizzo_provincia: 'TO', email_principale: 'gialli@gmail.com', piano: 'starter', stato: 'sospeso', crediti_residui: 0, created_at: '2025-04-08', onboarding_completato: true, pratiche_aperte: 0, ultima_attivita: new Date(now - 15 * 86400000).toISOString(), forma_giuridica: 'S.n.c.' },
  { id: 't7', ragione_sociale: 'Serramenti Blu', partita_iva: '22334455667', codice_fiscale: '22334455667', codice_sdi: 'W7YVJK9', pec: 'blu@pec.it', indirizzo_via: 'Via Verdi 55', indirizzo_cap: '30121', indirizzo_citta: 'Venezia', indirizzo_provincia: 'VE', email_principale: 'info@serramentiblu.it', piano: 'professionale', stato: 'attivo', crediti_residui: 210, created_at: '2025-09-20', onboarding_completato: true, operatore_assegnato_id: 'op1', note_interne: 'Interessati al servizio call center.', pratiche_aperte: 5, ultima_attivita: new Date(now - 45 * 60000).toISOString(), forma_giuridica: 'S.r.l.' },
  { id: 't8', ragione_sociale: 'Elettrica Viola', partita_iva: '44556677889', codice_fiscale: '44556677889', indirizzo_via: 'Via Napoli 3', indirizzo_cap: '80133', indirizzo_citta: 'Napoli', indirizzo_provincia: 'NA', email_principale: 'viola@elettrica.it', piano: 'starter', stato: 'attivo', crediti_residui: 8, created_at: '2025-12-01', onboarding_completato: true, operatore_assegnato_id: 'op2', pratiche_aperte: 1, ultima_attivita: new Date(now - 6 * 3600000).toISOString(), forma_giuridica: 'Ditta individuale' },
  { id: 't9', ragione_sociale: 'Carpenteria Metallica Ferro', partita_iva: '33445566778', codice_fiscale: '33445566778', codice_sdi: 'T04ZHR3', pec: 'ferro@pec.it', indirizzo_via: 'Via Industriale 100', indirizzo_cap: '24122', indirizzo_citta: 'Bergamo', indirizzo_provincia: 'BG', email_principale: 'info@ferro.it', piano: 'enterprise', stato: 'attivo', crediti_residui: 480, created_at: '2024-08-10', onboarding_completato: true, operatore_assegnato_id: 'op1', note_interne: 'Cliente VIP, contratto annuale.', pratiche_aperte: 6, ultima_attivita: new Date(now - 30 * 60000).toISOString(), forma_giuridica: 'S.p.A.' },
  { id: 't10', ragione_sociale: 'Green Energy Solutions', partita_iva: '77889900112', codice_fiscale: '77889900112', email_principale: 'info@greenenergy.it', piano: 'professionale', stato: 'trial', crediti_residui: 100, created_at: '2026-03-05', onboarding_completato: false, trial_ends_at: '2026-03-22', pratiche_aperte: 0, ultima_attivita: new Date(now - 2 * 86400000).toISOString(), forma_giuridica: 'S.r.l.' },
  { id: 't11', ragione_sociale: 'Pavimenti Italia', partita_iva: '88990011223', codice_fiscale: '88990011223', pec: 'pavimenti@pec.it', indirizzo_via: 'Via della Ceramica 15', indirizzo_cap: '41049', indirizzo_citta: 'Sassuolo', indirizzo_provincia: 'MO', email_principale: 'info@pavimentitalia.it', piano: 'starter', stato: 'churned', crediti_residui: 0, created_at: '2024-06-01', onboarding_completato: true, pratiche_aperte: 0, ultima_attivita: new Date(now - 45 * 86400000).toISOString(), forma_giuridica: 'S.r.l.' },
  { id: 't12', ragione_sociale: 'Idraulica Rapida', partita_iva: '11009988776', codice_fiscale: '11009988776', indirizzo_via: 'Via Po 78', indirizzo_cap: '10123', indirizzo_citta: 'Torino', indirizzo_provincia: 'TO', email_principale: 'info@idraulicarapida.it', piano: 'starter', stato: 'attivo', crediti_residui: 65, created_at: '2025-11-15', onboarding_completato: true, operatore_assegnato_id: 'op4', pratiche_aperte: 2, ultima_attivita: new Date(now - 4 * 3600000).toISOString(), forma_giuridica: 'S.a.s.' },
];

// ========== UTENTI CLIENTE ==========
export interface UtenteCliente {
  id: string;
  tenant_id: string;
  nome: string;
  cognome: string;
  email: string;
  ruolo: 'cliente_admin' | 'cliente_user';
  ruolo_azienda?: string;
  telefono?: string;
  attivo: boolean;
  ultimo_accesso: string;
  created_at: string;
}

export const mockUtentiCliente: UtenteCliente[] = [
  { id: 'uc1', tenant_id: 't1', nome: 'Francesco', cognome: 'Bianchi', email: 'f.bianchi@edilbianchi.it', ruolo: 'cliente_admin', ruolo_azienda: 'Titolare', telefono: '333 1234567', attivo: true, ultimo_accesso: new Date(now - 2 * 3600000).toISOString(), created_at: '2025-01-15' },
  { id: 'uc2', tenant_id: 't1', nome: 'Giulia', cognome: 'Conti', email: 'g.conti@edilbianchi.it', ruolo: 'cliente_user', ruolo_azienda: 'Segretaria', attivo: true, ultimo_accesso: new Date(now - 8 * 3600000).toISOString(), created_at: '2025-02-01' },
  { id: 'uc3', tenant_id: 't2', nome: 'Paolo', cognome: 'Verdi', email: 'p.verdi@studioverdi.it', ruolo: 'cliente_admin', ruolo_azienda: 'Geometra', telefono: '347 9876543', attivo: true, ultimo_accesso: new Date(now - 22 * 60000).toISOString(), created_at: '2025-02-20' },
  { id: 'uc4', tenant_id: 't3', nome: 'Andrea', cognome: 'Rossi', email: 'a.rossi@costruzionirossi.it', ruolo: 'cliente_admin', ruolo_azienda: 'Amministratore', attivo: true, ultimo_accesso: new Date(now - 5 * 60000).toISOString(), created_at: '2024-11-05' },
  { id: 'uc5', tenant_id: 't3', nome: 'Marta', cognome: 'Rossi', email: 'm.rossi@costruzionirossi.it', ruolo: 'cliente_user', ruolo_azienda: 'Contabile', attivo: true, ultimo_accesso: new Date(now - 24 * 3600000).toISOString(), created_at: '2024-12-10' },
  { id: 'uc6', tenant_id: 't3', nome: 'Roberto', cognome: 'Fabbri', email: 'r.fabbri@costruzionirossi.it', ruolo: 'cliente_user', attivo: false, ultimo_accesso: new Date(now - 30 * 86400000).toISOString(), created_at: '2025-01-05' },
  { id: 'uc7', tenant_id: 't5', nome: 'Valentina', cognome: 'Lux', email: 'v.lux@arredolux.it', ruolo: 'cliente_admin', ruolo_azienda: 'Titolare', attivo: true, ultimo_accesso: new Date(now - 3 * 86400000).toISOString(), created_at: '2025-06-12' },
  { id: 'uc8', tenant_id: 't7', nome: 'Stefano', cognome: 'Blu', email: 's.blu@serramentiblu.it', ruolo: 'cliente_admin', ruolo_azienda: 'Titolare', telefono: '320 5556677', attivo: true, ultimo_accesso: new Date(now - 45 * 60000).toISOString(), created_at: '2025-09-20' },
  { id: 'uc9', tenant_id: 't9', nome: 'Alberto', cognome: 'Ferro', email: 'a.ferro@ferro.it', ruolo: 'cliente_admin', ruolo_azienda: 'CEO', telefono: '335 1112233', attivo: true, ultimo_accesso: new Date(now - 30 * 60000).toISOString(), created_at: '2024-08-10' },
];

// ========== NOTE INTERNE ==========
export interface NotaInterna {
  id: string;
  tenant_id: string;
  autore_id: string;
  autore_nome: string;
  testo: string;
  created_at: string;
  updated_at: string;
}

export const mockNoteInterne: NotaInterna[] = [
  { id: 'ni1', tenant_id: 't1', autore_id: 'op1', autore_nome: 'Mario Rossi', testo: 'Cliente storico, molto esigente sulla puntualità. Preferisce comunicazione via email. Ha richiesto un account manager dedicato.\n\nUltimo incontro: 5 marzo 2026 — soddisfatto del servizio ENEA.', created_at: new Date(now - 5 * 86400000).toISOString(), updated_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'ni2', tenant_id: 't3', autore_id: 'op2', autore_nome: 'Luigi Marchetti', testo: 'Stanno valutando upgrade. Preparare offerta entro fine mese.', created_at: new Date(now - 10 * 86400000).toISOString(), updated_at: new Date(now - 10 * 86400000).toISOString() },
  { id: 'ni3', tenant_id: 't7', autore_id: 'op1', autore_nome: 'Mario Rossi', testo: 'Interessati al servizio call center. Organizzare demo.', created_at: new Date(now - 3 * 86400000).toISOString(), updated_at: new Date(now - 3 * 86400000).toISOString() },
];

// ========== ATTIVITÀ CLIENTE ==========
export interface ClienteActivity {
  id: string;
  tenant_id: string;
  user_id: string;
  user_name: string;
  azione: string;
  descrizione: string;
  entita_tipo?: string;
  entita_id?: string;
  created_at: string;
}

export const mockClienteActivities: ClienteActivity[] = [
  { id: 'ca1', tenant_id: 't1', user_id: 'sa-001', user_name: 'SuperAdmin', azione: 'creazione', descrizione: 'Cliente creato', created_at: '2025-01-15T09:32:00Z' },
  { id: 'ca2', tenant_id: 't1', user_id: 'sys', user_name: 'Sistema', azione: 'email', descrizione: 'Email di benvenuto inviata', created_at: '2025-01-15T09:33:00Z' },
  { id: 'ca3', tenant_id: 't1', user_id: 'op1', user_name: 'Mario Rossi', azione: 'pratica', descrizione: 'Pratica PRA-2026-0047 creata', entita_tipo: 'pratica', entita_id: 'p1', created_at: '2025-01-16T14:11:00Z' },
  { id: 'ca4', tenant_id: 't1', user_id: 'uc1', user_name: 'Francesco Bianchi', azione: 'accesso', descrizione: 'Accesso effettuato', created_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'ca5', tenant_id: 't1', user_id: 'op1', user_name: 'Mario Rossi', azione: 'nota', descrizione: 'Nota interna aggiornata', created_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'ca6', tenant_id: 't1', user_id: 'sys', user_name: 'Sistema', azione: 'crediti', descrizione: 'Ricarica crediti: +€200', created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'ca7', tenant_id: 't1', user_id: 'op2', user_name: 'Luigi Marchetti', azione: 'fattura', descrizione: 'Fattura INV-090 emessa', entita_tipo: 'fattura', entita_id: 'f2', created_at: new Date(now - 10 * 86400000).toISOString() },
  { id: 'ca8', tenant_id: 't3', user_id: 'sa-001', user_name: 'SuperAdmin', azione: 'creazione', descrizione: 'Cliente creato', created_at: '2024-11-05T10:00:00Z' },
  { id: 'ca9', tenant_id: 't3', user_id: 'op2', user_name: 'Luigi Marchetti', azione: 'pratica', descrizione: 'Pratica PRA-2026-0048 completata', entita_tipo: 'pratica', entita_id: 'p2', created_at: new Date(now - 86400000).toISOString() },
];

// ========== STORICO RICARICHE ==========
export interface StoricoRicarica {
  id: string;
  tenant_id: string;
  importo: number;
  data: string;
  metodo: string;
}

export const mockRicariche: StoricoRicarica[] = [
  { id: 'r1', tenant_id: 't1', importo: 200, data: new Date(now - 5 * 86400000).toISOString(), metodo: 'Bonifico' },
  { id: 'r2', tenant_id: 't1', importo: 300, data: new Date(now - 35 * 86400000).toISOString(), metodo: 'Carta' },
  { id: 'r3', tenant_id: 't1', importo: 150, data: new Date(now - 65 * 86400000).toISOString(), metodo: 'Bonifico' },
  { id: 'r4', tenant_id: 't3', importo: 100, data: new Date(now - 20 * 86400000).toISOString(), metodo: 'Carta' },
  { id: 'r5', tenant_id: 't7', importo: 250, data: new Date(now - 10 * 86400000).toISOString(), metodo: 'Bonifico' },
];

// ========== SERVIZI ==========
export const SERVIZI_DISPONIBILI = [
  { id: 'fatture', label: 'Creazione Fatture', default: true },
  { id: 'enea', label: 'Pratiche ENEA', default: true },
  { id: 'call_center', label: 'Call Center', default: false },
  { id: 'segreteria', label: 'Segreteria Virtuale', default: false },
  { id: 'recupero_crediti', label: 'Recupero Crediti', default: false },
  { id: 'finanziamento', label: 'Pratiche Finanziamento', default: false },
  { id: 'report', label: 'Report Mensile', default: true },
] as const;

export interface ServiziAttiviTenant {
  tenant_id: string;
  servizi: string[];
}

export const mockServiziAttivi: ServiziAttiviTenant[] = [
  { tenant_id: 't1', servizi: ['fatture', 'enea', 'call_center', 'report'] },
  { tenant_id: 't2', servizi: ['fatture', 'enea', 'finanziamento', 'report'] },
  { tenant_id: 't3', servizi: ['fatture', 'enea', 'report'] },
  { tenant_id: 't5', servizi: ['fatture', 'segreteria', 'report'] },
  { tenant_id: 't7', servizi: ['fatture', 'enea', 'report'] },
  { tenant_id: 't8', servizi: ['fatture', 'report'] },
  { tenant_id: 't9', servizi: ['fatture', 'enea', 'call_center', 'segreteria', 'recupero_crediti', 'finanziamento', 'report'] },
  { tenant_id: 't12', servizi: ['fatture', 'enea', 'report'] },
];

// ========== PRATICHE ==========
export const mockPratiche: Pratica[] = [
  { id: 'p1', codice: 'PRA-2026-0047', tenant_id: 't1', tipo: 'enea', titolo: 'Dichiarazione ENEA – Cappotto termico', stato: 'in_corso', priorita: 'alta', operatore_id: 'op1', richiedente_id: 'u1', scadenza: new Date(now + 2 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 5 * 86400000).toISOString(), updated_at: new Date(now - 3600000).toISOString() },
  { id: 'p2', codice: 'PRA-2026-0048', tenant_id: 't3', tipo: 'fattura', titolo: 'Fatturazione elettronica Q1', stato: 'completata', priorita: 'normale', operatore_id: 'op2', richiedente_id: 'u2', completata_at: new Date(now - 86400000).toISOString(), allegati: [], created_at: new Date(now - 10 * 86400000).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
  { id: 'p3', codice: 'PRA-2026-0049', tenant_id: 't2', tipo: 'finanziamento', titolo: 'Pratica finanziamento impianto FV', stato: 'in_attesa', priorita: 'urgente', operatore_id: 'op3', richiedente_id: 'u3', scadenza: new Date(now - 86400000).toISOString(), allegati: [], created_at: new Date(now - 7 * 86400000).toISOString(), updated_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'p4', codice: 'PRA-2026-0050', tenant_id: 't1', tipo: 'call_center', titolo: 'Campagna recall clienti 2025', stato: 'in_corso', priorita: 'normale', operatore_id: 'op1', richiedente_id: 'u1', scadenza: new Date(now + 5 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 3 * 86400000).toISOString(), updated_at: new Date(now - 7200000).toISOString() },
  { id: 'p5', codice: 'PRA-2026-0051', tenant_id: 't7', tipo: 'enea', titolo: 'ENEA sostituzione infissi', stato: 'scaduta', priorita: 'alta', richiedente_id: 'u4', scadenza: new Date(now - 3 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 15 * 86400000).toISOString(), updated_at: new Date(now - 3 * 86400000).toISOString() },
  { id: 'p6', codice: 'PRA-2026-0052', tenant_id: 't5', tipo: 'segreteria', titolo: 'Gestione appuntamenti marzo', stato: 'in_corso', priorita: 'bassa', operatore_id: 'op4', richiedente_id: 'u5', scadenza: new Date(now + 10 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 2 * 86400000).toISOString(), updated_at: new Date(now - 4 * 3600000).toISOString() },
  { id: 'p7', codice: 'PRA-2026-0053', tenant_id: 't3', tipo: 'recupero_crediti', titolo: 'Recupero crediti fornitore XY', stato: 'in_attesa', priorita: 'urgente', richiedente_id: 'u2', scadenza: new Date(now + 1 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 4 * 86400000).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
  { id: 'p8', codice: 'PRA-2026-0054', tenant_id: 't1', tipo: 'fattura', titolo: 'Emissione fatture febbraio', stato: 'completata', priorita: 'normale', operatore_id: 'op2', richiedente_id: 'u1', completata_at: new Date(now - 5 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 20 * 86400000).toISOString(), updated_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'p9', codice: 'PRA-2026-0055', tenant_id: 't2', tipo: 'enea', titolo: 'ENEA caldaia condensazione', stato: 'bozza', priorita: 'normale', richiedente_id: 'u3', allegati: [], created_at: new Date(now - 1 * 86400000).toISOString(), updated_at: new Date(now - 1 * 86400000).toISOString() },
  { id: 'p10', codice: 'PRA-2026-0056', tenant_id: 't7', tipo: 'finanziamento', titolo: 'Finanziamento ristrutturazione', stato: 'in_corso', priorita: 'alta', operatore_id: 'op3', richiedente_id: 'u4', scadenza: new Date(now + 3 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 8 * 86400000).toISOString(), updated_at: new Date(now - 3600000).toISOString() },
  { id: 'p11', codice: 'PRA-2026-0057', tenant_id: 't5', tipo: 'fattura', titolo: 'Fattura proforma cliente GH', stato: 'in_attesa', priorita: 'normale', operatore_id: 'op4', richiedente_id: 'u5', scadenza: new Date(now + 7 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 6 * 86400000).toISOString(), updated_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'p12', codice: 'PRA-2026-0058', tenant_id: 't8', tipo: 'call_center', titolo: 'Survey soddisfazione clienti', stato: 'completata', priorita: 'bassa', operatore_id: 'op1', richiedente_id: 'u6', completata_at: new Date(now - 2 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 12 * 86400000).toISOString(), updated_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'p13', codice: 'PRA-2026-0059', tenant_id: 't9', tipo: 'enea', titolo: 'ENEA impianto solare termico', stato: 'in_corso', priorita: 'alta', operatore_id: 'op1', richiedente_id: 'uc9', scadenza: new Date(now + 4 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 6 * 86400000).toISOString(), updated_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'p14', codice: 'PRA-2026-0060', tenant_id: 't9', tipo: 'fattura', titolo: 'Fatturazione trimestrale', stato: 'in_corso', priorita: 'normale', operatore_id: 'op2', richiedente_id: 'uc9', scadenza: new Date(now + 8 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 4 * 86400000).toISOString(), updated_at: new Date(now - 86400000).toISOString() },
  { id: 'p15', codice: 'PRA-2026-0061', tenant_id: 't1', tipo: 'enea', titolo: 'ENEA pompa di calore', stato: 'in_attesa', priorita: 'normale', richiedente_id: 'uc1', scadenza: new Date(now + 14 * 86400000).toISOString(), allegati: [], created_at: new Date(now - 1 * 86400000).toISOString(), updated_at: new Date(now - 1 * 86400000).toISOString() },
];

// ========== TEMPLATE RIGHE ==========
export interface RigaTemplate {
  id: string;
  descrizione: string;
  prezzo_default: number;
  unita_misura: import('@/types/auth').UnitaMisura;
  iva_percentuale: number;
}

export const mockRigheTemplate: RigaTemplate[] = [
  { id: 'rt1', descrizione: 'Gestione pratiche ENEA', prezzo_default: 250, unita_misura: 'pz', iva_percentuale: 22 },
  { id: 'rt2', descrizione: 'Call Center (pacchetto 20h)', prezzo_default: 400, unita_misura: 'h', iva_percentuale: 22 },
  { id: 'rt3', descrizione: 'Creazione fatture elettroniche', prezzo_default: 75, unita_misura: 'pz', iva_percentuale: 22 },
  { id: 'rt4', descrizione: 'Segreteria Virtuale (mensile)', prezzo_default: 120, unita_misura: 'pz', iva_percentuale: 22 },
  { id: 'rt5', descrizione: 'Pratica finanziamento', prezzo_default: 500, unita_misura: 'pz', iva_percentuale: 22 },
  { id: 'rt6', descrizione: 'Recupero crediti (pratica)', prezzo_default: 300, unita_misura: 'pz', iva_percentuale: 22 },
];

// ========== FATTURE ==========
export const mockFatture: import('@/types/auth').Fattura[] = [
  { id: 'f1', numero: 'INV-2026-001', tenant_id: 't3', data_emissione: '2026-01-15', data_scadenza: '2026-02-14', stato: 'pagata', righe: [{ id: 'r1a', descrizione: 'Servizio fatturazione Q4 2025', quantita: 1, unita_misura: 'pz', prezzo_unitario: 450, iva_percentuale: 22, totale: 450 }], subtotale: 450, iva_percentuale: 22, iva_importo: 99, totale: 549, pratiche_collegate: ['p2'], pagato_at: '2026-02-10', created_at: '2026-01-15', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f2', numero: 'INV-2026-002', tenant_id: 't1', data_emissione: '2026-01-20', data_scadenza: '2026-02-19', stato: 'pagata', righe: [{ id: 'r2a', descrizione: 'Pratica ENEA cappotto termico', quantita: 1, unita_misura: 'pz', prezzo_unitario: 280, iva_percentuale: 22, totale: 280 }, { id: 'r2b', descrizione: 'Call Center (10h)', quantita: 10, unita_misura: 'h', prezzo_unitario: 15, iva_percentuale: 22, totale: 150 }], subtotale: 430, iva_percentuale: 22, iva_importo: 94.6, totale: 524.6, pratiche_collegate: ['p1', 'p4'], pagato_at: '2026-02-15', created_at: '2026-01-20', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f3', numero: 'INV-2026-003', tenant_id: 't5', data_emissione: '2026-02-01', data_scadenza: '2026-03-03', stato: 'scaduta', righe: [{ id: 'r3a', descrizione: 'Segreteria Virtuale - Febbraio', quantita: 1, unita_misura: 'pz', prezzo_unitario: 120, iva_percentuale: 22, totale: 120 }], subtotale: 120, iva_percentuale: 22, iva_importo: 26.4, totale: 146.4, pratiche_collegate: ['p6'], created_at: '2026-02-01', modalita_pagamento: 'bonifico', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f4', numero: 'INV-2026-004', tenant_id: 't7', data_emissione: '2026-02-10', data_scadenza: '2026-03-12', stato: 'pagata', righe: [{ id: 'r4a', descrizione: 'ENEA sostituzione infissi', quantita: 1, unita_misura: 'pz', prezzo_unitario: 350, iva_percentuale: 22, totale: 350 }], subtotale: 350, iva_percentuale: 22, iva_importo: 77, totale: 427, pratiche_collegate: ['p5'], pagato_at: '2026-03-08', created_at: '2026-02-10', modalita_pagamento: 'rimessa_diretta', mostra_iban: false, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f5', numero: 'INV-2026-005', tenant_id: 't2', data_emissione: '2026-02-15', data_scadenza: '2026-03-17', stato: 'inviata', righe: [{ id: 'r5a', descrizione: 'Pratica finanziamento impianto FV', quantita: 1, unita_misura: 'pz', prezzo_unitario: 500, iva_percentuale: 22, totale: 500 }], subtotale: 500, iva_percentuale: 22, iva_importo: 110, totale: 610, pratiche_collegate: ['p3'], created_at: '2026-02-15', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f6', numero: 'INV-2026-006', tenant_id: 't9', data_emissione: '2026-02-20', data_scadenza: '2026-03-22', stato: 'inviata', righe: [{ id: 'r6a', descrizione: 'ENEA impianto solare termico', quantita: 1, unita_misura: 'pz', prezzo_unitario: 380, iva_percentuale: 22, totale: 380 }, { id: 'r6b', descrizione: 'Fatturazione trimestrale', quantita: 3, unita_misura: 'pz', prezzo_unitario: 75, iva_percentuale: 22, totale: 225 }], subtotale: 605, iva_percentuale: 22, iva_importo: 133.1, totale: 738.1, pratiche_collegate: ['p13', 'p14'], created_at: '2026-02-20', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'percentuale', sconto_valore: 5 },
  { id: 'f7', numero: 'INV-2026-007', tenant_id: 't1', data_emissione: '2026-03-01', data_scadenza: '2026-03-31', stato: 'inviata', righe: [{ id: 'r7a', descrizione: 'ENEA pompa di calore', quantita: 1, unita_misura: 'pz', prezzo_unitario: 320, iva_percentuale: 22, totale: 320 }, { id: 'r7b', descrizione: 'Report mensile', quantita: 1, unita_misura: 'pz', prezzo_unitario: 50, iva_percentuale: 22, totale: 50 }], subtotale: 370, iva_percentuale: 22, iva_importo: 81.4, totale: 451.4, pratiche_collegate: ['p15'], created_at: '2026-03-01', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f8', numero: 'INV-2026-008', tenant_id: 't8', data_emissione: '2026-03-05', data_scadenza: '2026-04-04', stato: 'bozza', righe: [{ id: 'r8a', descrizione: 'Survey soddisfazione clienti', quantita: 1, unita_misura: 'pz', prezzo_unitario: 200, iva_percentuale: 22, totale: 200 }], subtotale: 200, iva_percentuale: 22, iva_importo: 44, totale: 244, pratiche_collegate: ['p12'], created_at: '2026-03-05', modalita_pagamento: 'bonifico', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f9', numero: 'INV-2026-009', tenant_id: 't3', data_emissione: '2026-03-08', data_scadenza: '2026-04-07', stato: 'inviata', righe: [{ id: 'r9a', descrizione: 'Recupero crediti fornitore XY', quantita: 1, unita_misura: 'pz', prezzo_unitario: 300, iva_percentuale: 22, totale: 300 }, { id: 'r9b', descrizione: 'Consulenza telefonica', quantita: 2, unita_misura: 'h', prezzo_unitario: 60, iva_percentuale: 22, totale: 120 }], subtotale: 420, iva_percentuale: 22, iva_importo: 92.4, totale: 512.4, pratiche_collegate: ['p7'], created_at: '2026-03-08', modalita_pagamento: 'rid', mostra_iban: false, regime_fiscale: 'ordinario', sconto_tipo: 'fisso', sconto_valore: 20 },
  { id: 'f10', numero: 'INV-2026-010', tenant_id: 't12', data_emissione: '2026-03-10', data_scadenza: '2026-04-09', stato: 'bozza', righe: [{ id: 'r10a', descrizione: 'ENEA caldaia condensazione', quantita: 1, unita_misura: 'pz', prezzo_unitario: 280, iva_percentuale: 22, totale: 280 }], subtotale: 280, iva_percentuale: 22, iva_importo: 61.6, totale: 341.6, pratiche_collegate: [], created_at: '2026-03-10', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'forfettario', sconto_tipo: 'nessuno', sconto_valore: 0, note: 'Operazione in regime forfettario — non soggetta a IVA ex art. 1, commi 54-89, L. 190/2014' },
  { id: 'f11', numero: 'INV-2026-011', tenant_id: 't5', data_emissione: '2026-03-01', data_scadenza: '2026-03-31', stato: 'inviata', righe: [{ id: 'r11a', descrizione: 'Segreteria Virtuale - Marzo', quantita: 1, unita_misura: 'pz', prezzo_unitario: 120, iva_percentuale: 22, totale: 120 }, { id: 'r11b', descrizione: 'Gestione appuntamenti extra', quantita: 5, unita_misura: 'h', prezzo_unitario: 25, iva_percentuale: 22, totale: 125 }], subtotale: 245, iva_percentuale: 22, iva_importo: 53.9, totale: 298.9, pratiche_collegate: ['p6'], created_at: '2026-03-01', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
  { id: 'f12', numero: 'INV-2026-012', tenant_id: 't1', data_emissione: '2026-02-01', data_scadenza: '2026-02-28', stato: 'pagata', righe: [{ id: 'r12a', descrizione: 'Emissione fatture febbraio (lotto)', quantita: 15, unita_misura: 'pz', prezzo_unitario: 12, iva_percentuale: 22, totale: 180 }], subtotale: 180, iva_percentuale: 22, iva_importo: 39.6, totale: 219.6, pratiche_collegate: ['p8'], pagato_at: '2026-02-25', created_at: '2026-02-01', modalita_pagamento: 'bonifico', iban: 'IT60X0542811101000000123456', intestatario_conto: 'Impresa Leggera S.r.l.', banca: 'Intesa Sanpaolo', mostra_iban: true, regime_fiscale: 'ordinario', sconto_tipo: 'nessuno', sconto_valore: 0 },
];

// ========== COMMENTI PRATICA ==========
export const mockCommentiPratica: CommentoPratica[] = [
  { id: 'c1', pratica_id: 'p1', autore_id: 'op1', autore_nome: 'Mario Rossi', autore_ruolo: 'operatore', autore_iniziali: 'MR', tipo: 'messaggio', testo: 'Ho avviato la verifica della documentazione. Mancano il certificato energetico e la planimetria catastale. Potete caricarli entro venerdì?', allegati: [], created_at: new Date(now - 4 * 86400000).toISOString() },
  { id: 'c2', pratica_id: 'p1', autore_id: 'uc1', autore_nome: 'Francesco Bianchi', autore_ruolo: 'cliente', autore_iniziali: 'FB', tipo: 'messaggio', testo: 'Certo, li carico domani mattina. Il certificato è quello rilasciato dal geometra Verdi?', allegati: [], created_at: new Date(now - 3.5 * 86400000).toISOString() },
  { id: 'c3', pratica_id: 'p1', autore_id: 'op1', autore_nome: 'Mario Rossi', autore_ruolo: 'operatore', autore_iniziali: 'MR', tipo: 'messaggio', testo: 'Esatto, quello con la firma digitale. Serve anche la ricevuta di pagamento dell\'intervento.', allegati: [], created_at: new Date(now - 3 * 86400000).toISOString() },
  { id: 'c4', pratica_id: 'p1', autore_id: 'op1', autore_nome: 'Mario Rossi', autore_ruolo: 'operatore', autore_iniziali: 'MR', tipo: 'nota_interna', testo: 'Il cliente è in ritardo con i documenti. Se non arrivano entro lunedì, la pratica rischia di scadere. Valutare se sollecitare.', allegati: [], created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'c5', pratica_id: 'p1', autore_id: 'sys', autore_nome: 'Sistema', autore_ruolo: 'sistema', autore_iniziali: 'SY', tipo: 'sistema', testo: 'Stato cambiato: In Attesa → In Corso', allegati: [], created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'c6', pratica_id: 'p1', autore_id: 'uc1', autore_nome: 'Francesco Bianchi', autore_ruolo: 'cliente', autore_iniziali: 'FB', tipo: 'messaggio', testo: 'Documenti caricati! Ho aggiunto anche la visura catastale aggiornata.', allegati: ['visura_catastale.pdf', 'certificato_energetico.pdf'], created_at: new Date(now - 1 * 86400000).toISOString() },
  { id: 'c7', pratica_id: 'p1', autore_id: 'op1', autore_nome: 'Mario Rossi', autore_ruolo: 'operatore', autore_iniziali: 'MR', tipo: 'messaggio', testo: 'Perfetto, ho ricevuto tutto. Procedo con la compilazione della pratica ENEA. Vi aggiorno entro 48h.', allegati: [], created_at: new Date(now - 12 * 3600000).toISOString() },
  { id: 'c8', pratica_id: 'p3', autore_id: 'op3', autore_nome: 'Anna Verdi', autore_ruolo: 'operatore', autore_iniziali: 'AV', tipo: 'messaggio', testo: 'Ho contattato l\'ente erogatore. La domanda è stata presa in carico. Tempi stimati: 15 giorni lavorativi.', allegati: [], created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'c9', pratica_id: 'p4', autore_id: 'op1', autore_nome: 'Mario Rossi', autore_ruolo: 'operatore', autore_iniziali: 'MR', tipo: 'messaggio', testo: 'Abbiamo completato 45 chiamate su 100 previste. Report parziale allegato.', allegati: ['report_parziale_chiamate.xlsx'], created_at: new Date(now - 86400000).toISOString() },
  { id: 'c10', pratica_id: 'p7', autore_id: 'sys', autore_nome: 'Sistema', autore_ruolo: 'sistema', autore_iniziali: 'SY', tipo: 'sistema', testo: 'Pratica assegnata a Luigi Marchetti', allegati: [], created_at: new Date(now - 3 * 86400000).toISOString() },
];

// ========== TASK PRATICA ==========
export const mockTaskPratica: Task[] = [
  { id: 'tk1', pratica_id: 'p1', tenant_id: 't1', titolo: 'Verificare documentazione cliente', assegnato_a: 'op1', creato_da: 'op1', stato: 'completato', priorita: 'alta', scadenza: new Date(now - 3 * 86400000).toISOString(), completato_at: new Date(now - 2 * 86400000).toISOString(), created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'tk2', pratica_id: 'p1', tenant_id: 't1', titolo: 'Compilare modulo ENEA online', assegnato_a: 'op1', creato_da: 'op1', stato: 'in_corso', priorita: 'alta', scadenza: new Date(now + 1 * 86400000).toISOString(), created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'tk3', pratica_id: 'p1', tenant_id: 't1', titolo: 'Inviare pratica all\'ENEA', assegnato_a: 'op1', creato_da: 'op1', stato: 'da_fare', priorita: 'normale', scadenza: new Date(now + 2 * 86400000).toISOString(), created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'tk4', pratica_id: 'p1', tenant_id: 't1', titolo: 'Comunicare esito al cliente', creato_da: 'op1', stato: 'da_fare', priorita: 'normale', created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'tk5', pratica_id: 'p3', tenant_id: 't2', titolo: 'Preparare business plan', assegnato_a: 'op3', creato_da: 'op3', stato: 'completato', priorita: 'urgente', completato_at: new Date(now - 4 * 86400000).toISOString(), created_at: new Date(now - 7 * 86400000).toISOString() },
  { id: 'tk6', pratica_id: 'p3', tenant_id: 't2', titolo: 'Inviare domanda finanziamento', assegnato_a: 'op3', creato_da: 'op3', stato: 'in_corso', priorita: 'urgente', scadenza: new Date(now + 1 * 86400000).toISOString(), created_at: new Date(now - 3 * 86400000).toISOString() },
  { id: 'tk7', pratica_id: 'p4', tenant_id: 't1', titolo: 'Completare 100 chiamate recall', assegnato_a: 'op1', creato_da: 'op1', stato: 'in_corso', priorita: 'normale', scadenza: new Date(now + 5 * 86400000).toISOString(), created_at: new Date(now - 3 * 86400000).toISOString() },
  { id: 'tk8', pratica_id: 'p4', tenant_id: 't1', titolo: 'Inviare report finale', creato_da: 'op1', stato: 'da_fare', priorita: 'bassa', created_at: new Date(now - 3 * 86400000).toISOString() },
];

// ========== ALLEGATI PRATICA ==========
export const mockAllegatiPratica: AllegatoPratica[] = [
  { id: 'al1', pratica_id: 'p1', nome: 'certificato_energetico.pdf', peso_bytes: 2456000, tipo_file: 'application/pdf', url: '#', caricato_da_id: 'uc1', caricato_da_nome: 'Francesco Bianchi', created_at: new Date(now - 1 * 86400000).toISOString() },
  { id: 'al2', pratica_id: 'p1', nome: 'visura_catastale.pdf', peso_bytes: 1234000, tipo_file: 'application/pdf', url: '#', caricato_da_id: 'uc1', caricato_da_nome: 'Francesco Bianchi', created_at: new Date(now - 1 * 86400000).toISOString() },
  { id: 'al3', pratica_id: 'p1', nome: 'planimetria_immobile.dwg', peso_bytes: 5678000, tipo_file: 'application/octet-stream', url: '#', caricato_da_id: 'op1', caricato_da_nome: 'Mario Rossi', created_at: new Date(now - 4 * 86400000).toISOString() },
  { id: 'al4', pratica_id: 'p3', nome: 'business_plan_2026.xlsx', peso_bytes: 890000, tipo_file: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', url: '#', caricato_da_id: 'op3', caricato_da_nome: 'Anna Verdi', created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'al5', pratica_id: 'p4', nome: 'report_parziale_chiamate.xlsx', peso_bytes: 456000, tipo_file: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', url: '#', caricato_da_id: 'op1', caricato_da_nome: 'Mario Rossi', created_at: new Date(now - 86400000).toISOString() },
  { id: 'al6', pratica_id: 'p4', nome: 'foto_sede_cliente.jpg', peso_bytes: 3200000, tipo_file: 'image/jpeg', url: '#', caricato_da_id: 'uc1', caricato_da_nome: 'Francesco Bianchi', created_at: new Date(now - 2 * 86400000).toISOString() },
];

// ========== TIMELINE PRATICA ==========
export const mockTimelinePratica: TimelineEvento[] = [
  { id: 'tl1', pratica_id: 'p1', tipo: 'creazione', descrizione: 'Pratica creata', autore_nome: 'Mario Rossi', autore_id: 'op1', created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'tl2', pratica_id: 'p1', tipo: 'assegnazione', descrizione: 'Pratica assegnata a Mario Rossi', autore_nome: 'SuperAdmin', autore_id: 'sa-001', created_at: new Date(now - 5 * 86400000 + 60000).toISOString() },
  { id: 'tl3', pratica_id: 'p1', tipo: 'stato', descrizione: 'Stato cambiato: Bozza → In Attesa', autore_nome: 'Mario Rossi', autore_id: 'op1', created_at: new Date(now - 5 * 86400000 + 120000).toISOString() },
  { id: 'tl4', pratica_id: 'p1', tipo: 'commento', descrizione: 'Nuovo messaggio inviato al cliente', autore_nome: 'Mario Rossi', autore_id: 'op1', created_at: new Date(now - 4 * 86400000).toISOString() },
  { id: 'tl5', pratica_id: 'p1', tipo: 'stato', descrizione: 'Stato cambiato: In Attesa → In Corso', autore_nome: 'Sistema', autore_id: 'sys', created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'tl6', pratica_id: 'p1', tipo: 'commento', descrizione: 'Risposta dal cliente', autore_nome: 'Francesco Bianchi', autore_id: 'uc1', created_at: new Date(now - 3.5 * 86400000).toISOString() },
  { id: 'tl7', pratica_id: 'p1', tipo: 'task', descrizione: 'Task "Verificare documentazione" completato', autore_nome: 'Mario Rossi', autore_id: 'op1', created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'tl8', pratica_id: 'p1', tipo: 'allegato', descrizione: '2 file caricati: certificato_energetico.pdf, visura_catastale.pdf', autore_nome: 'Francesco Bianchi', autore_id: 'uc1', created_at: new Date(now - 1 * 86400000).toISOString() },
  { id: 'tl9', pratica_id: 'p1', tipo: 'commento', descrizione: 'Documenti ricevuti, procedo con la compilazione', autore_nome: 'Mario Rossi', autore_id: 'op1', created_at: new Date(now - 12 * 3600000).toISOString() },
  { id: 'tl10', pratica_id: 'p1', tipo: 'task', descrizione: 'Task "Compilare modulo ENEA" avviato', autore_nome: 'Mario Rossi', autore_id: 'op1', created_at: new Date(now - 6 * 3600000).toISOString() },
  { id: 'tl11', pratica_id: 'p3', tipo: 'creazione', descrizione: 'Pratica creata', autore_nome: 'Anna Verdi', autore_id: 'op3', created_at: new Date(now - 7 * 86400000).toISOString() },
  { id: 'tl12', pratica_id: 'p3', tipo: 'fattura', descrizione: 'Fattura INV-2026-005 collegata', autore_nome: 'Luigi Marchetti', autore_id: 'op2', created_at: new Date(now - 3 * 86400000).toISOString() },
];

// ========== ACTIVITY FEED ==========
export const mockActivities: (ActivityLog & { user_name: string; descrizione_html: string })[] = [
  { id: 'a1', user_id: 'op1', user_name: 'Mario R.', azione: 'completata', entita_tipo: 'pratica', entita_id: 'p2', descrizione_html: 'ha completato <b>PRA-2026-0048 • Fattura</b> per Costruzioni Rossi', dettagli: {}, created_at: new Date(now - 5 * 60000).toISOString() },
  { id: 'a2', user_id: 'sys', user_name: 'Sistema', azione: 'registrazione', entita_tipo: 'tenant', entita_id: 't4', descrizione_html: 'Nuovo cliente registrato: <b>Impiantistica Neri</b>', dettagli: {}, created_at: new Date(now - 22 * 60000).toISOString() },
  { id: 'a3', user_id: 'sys', user_name: 'Sistema', azione: 'scaduta', entita_tipo: 'pratica', entita_id: 'p5', descrizione_html: 'Pratica <b>PRA-2026-0051</b> scaduta senza risposta', dettagli: {}, created_at: new Date(now - 3600000).toISOString() },
  { id: 'a4', user_id: 'op2', user_name: 'Luigi M.', azione: 'pagamento', entita_tipo: 'fattura', entita_id: 'f1', descrizione_html: 'Fattura <b>#INV-089</b> pagata da Costruzioni Rossi', dettagli: {}, created_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'a5', user_id: 'op3', user_name: 'Anna V.', azione: 'presa_in_carico', entita_tipo: 'pratica', entita_id: 'p3', descrizione_html: 'ha preso in carico <b>PRA-2026-0049</b>', dettagli: {}, created_at: new Date(now - 3 * 3600000).toISOString() },
  { id: 'a6', user_id: 'op1', user_name: 'Mario R.', azione: 'commento', entita_tipo: 'pratica', entita_id: 'p1', descrizione_html: 'ha aggiunto un commento a <b>PRA-2026-0047</b>', dettagli: {}, created_at: new Date(now - 5 * 3600000).toISOString() },
  { id: 'a7', user_id: 'op4', user_name: 'Sara B.', azione: 'caricamento', entita_tipo: 'pratica', entita_id: 'p6', descrizione_html: 'ha caricato documenti per <b>PRA-2026-0052</b>', dettagli: {}, created_at: new Date(now - 8 * 3600000).toISOString() },
  { id: 'a8', user_id: 'sys', user_name: 'Sistema', azione: 'fattura', entita_tipo: 'fattura', entita_id: 'f4', descrizione_html: 'Fattura <b>#INV-092</b> inviata a Serramenti Blu', dettagli: {}, created_at: new Date(now - 12 * 3600000).toISOString() },
  { id: 'a9', user_id: 'op2', user_name: 'Luigi M.', azione: 'completata', entita_tipo: 'pratica', entita_id: 'p12', descrizione_html: 'ha completato <b>PRA-2026-0058 • Call Center</b> per Elettrica Viola', dettagli: {}, created_at: new Date(now - 24 * 3600000).toISOString() },
  { id: 'a10', user_id: 'op3', user_name: 'Anna V.', azione: 'aggiornamento', entita_tipo: 'pratica', entita_id: 'p10', descrizione_html: 'ha aggiornato stato di <b>PRA-2026-0056</b>', dettagli: {}, created_at: new Date(now - 30 * 3600000).toISOString() },
];

// ========== NOTIFICHE ==========
export const mockNotifiche: Notifica[] = [
  { id: 'n1', user_id: 'admin', tipo: 'pratica', titolo: 'Pratica scaduta', messaggio: 'PRA-2026-0051 è scaduta senza risposta', link: '/admin/pratiche', letta: false, created_at: new Date(now - 3600000).toISOString() },
  { id: 'n2', user_id: 'admin', tipo: 'cliente', titolo: 'Nuovo cliente', messaggio: 'Impiantistica Neri si è registrata', link: '/admin/clienti', letta: false, created_at: new Date(now - 22 * 60000).toISOString() },
  { id: 'n3', user_id: 'admin', tipo: 'fattura', titolo: 'Fattura pagata', messaggio: 'INV-089 pagata da Costruzioni Rossi', link: '/admin/fatturazione', letta: true, created_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'n4', user_id: 'cliente', tipo: 'pratica', titolo: 'Pratica aggiornata', messaggio: 'La tua pratica ENEA è in lavorazione', link: '/app/pratiche', letta: false, created_at: new Date(now - 30 * 60000).toISOString() },
  { id: 'n5', user_id: 'cliente', tipo: 'fattura', titolo: 'Nuova fattura', messaggio: 'Fattura INV-090 disponibile', link: '/app/fatture', letta: true, created_at: new Date(now - 6 * 3600000).toISOString() },
  { id: 'n6', user_id: 'admin', tipo: 'sistema', titolo: 'Backup completato', messaggio: 'Backup giornaliero eseguito con successo', letta: true, created_at: new Date(now - 8 * 3600000).toISOString() },
  { id: 'n7', user_id: 'admin', tipo: 'pratica', titolo: 'Pratica completata', messaggio: 'PRA-2026-0048 completata da Luigi Marchetti', link: '/admin/pratiche', letta: true, created_at: new Date(now - 86400000).toISOString() },
  { id: 'n8', user_id: 'admin', tipo: 'fattura', titolo: 'Fattura scaduta', messaggio: 'INV-2026-003 non ancora pagata', link: '/admin/fatturazione', letta: false, created_at: new Date(now - 4 * 3600000).toISOString() },
  { id: 'n9', user_id: 'admin', tipo: 'cliente', titolo: 'Crediti bassi', messaggio: 'Elettrica Viola ha solo €8 di crediti residui', link: '/admin/clienti', letta: false, created_at: new Date(now - 5 * 3600000).toISOString() },
  { id: 'n10', user_id: 'admin', tipo: 'pratica', titolo: 'Nuova richiesta', messaggio: 'Costruzioni Rossi ha aperto recupero crediti', link: '/admin/pratiche', letta: true, created_at: new Date(now - 2 * 86400000).toISOString() },
  { id: 'n11', user_id: 'cliente', tipo: 'sistema', titolo: 'Benvenuto!', messaggio: 'Il tuo account è stato attivato con successo', letta: true, created_at: new Date(now - 5 * 86400000).toISOString() },
  { id: 'n12', user_id: 'cliente', tipo: 'pratica', titolo: 'Documenti richiesti', messaggio: 'Carica il certificato energetico per la pratica ENEA', link: '/app/pratiche', letta: false, created_at: new Date(now - 2 * 3600000).toISOString() },
  { id: 'n13', user_id: 'cliente', tipo: 'fattura', titolo: 'Pagamento confermato', messaggio: 'Il pagamento della fattura INV-002 è stato registrato', link: '/app/fatture', letta: true, created_at: new Date(now - 3 * 86400000).toISOString() },
  { id: 'n14', user_id: 'cliente', tipo: 'sistema', titolo: 'Crediti in esaurimento', messaggio: 'Hai solo €42 di crediti. Ricarica per continuare.', link: '/app/crediti', letta: false, created_at: new Date(now - 12 * 3600000).toISOString() },
];

// ========== FATTURATO MENSILE (12 mesi) ==========
export const mockFatturatoMensile = [
  { mese: 'Apr', fatturato: 8200, target: 9000 },
  { mese: 'Mag', fatturato: 9100, target: 9000 },
  { mese: 'Giu', fatturato: 7800, target: 9500 },
  { mese: 'Lug', fatturato: 6500, target: 9500 },
  { mese: 'Ago', fatturato: 4200, target: 9500 },
  { mese: 'Set', fatturato: 9800, target: 10000 },
  { mese: 'Ott', fatturato: 10500, target: 10000 },
  { mese: 'Nov', fatturato: 11200, target: 10500 },
  { mese: 'Dic', fatturato: 9900, target: 10500 },
  { mese: 'Gen', fatturato: 10800, target: 11000 },
  { mese: 'Feb', fatturato: 11400, target: 11000 },
  { mese: 'Mar', fatturato: 12840, target: 12000 },
];

// ========== PRATICHE PER TIPO (donut) ==========
export const mockPratichePerTipo = [
  { tipo: 'Fattura', count: 28, colore: '#0ea5e9' },
  { tipo: 'ENEA', count: 19, colore: '#10b981' },
  { tipo: 'Finanziamento', count: 12, colore: '#f59e0b' },
  { tipo: 'Call Center', count: 8, colore: '#8b5cf6' },
  { tipo: 'Altro', count: 5, colore: '#94a3b8' },
];

// ========== PROVINCE ITALIANE ==========
export const PROVINCE_ITALIANE = [
  'AG','AL','AN','AO','AP','AQ','AR','AT','AV','BA','BG','BI','BL','BN','BO','BR','BS','BT','BZ',
  'CA','CB','CE','CH','CL','CN','CO','CR','CS','CT','CZ','EN','FC','FE','FG','FI','FM','FR','GE',
  'GO','GR','IM','IS','KR','LC','LE','LI','LO','LT','LU','MB','MC','ME','MI','MN','MO','MS','MT',
  'NA','NO','NU','OR','PA','PC','PD','PE','PG','PI','PN','PO','PR','PT','PU','PV','PZ','RA','RC',
  'RE','RG','RI','RM','RN','RO','SA','SI','SO','SP','SR','SS','SU','SV','TA','TE','TN','TO','TP',
  'TR','TS','TV','UD','VA','VB','VC','VE','VI','VR','VT','VV',
] as const;

// ========== UTILITÀ ==========
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ora';
  if (mins < 60) return `${mins}m fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h fa`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'ieri';
  return `${days}gg fa`;
}

export function daysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export function getOperatoreById(id: string | undefined) {
  return mockOperatori.find(o => o.id === id);
}

export function getTenantById(id: string) {
  return mockTenants.find(t => t.id === id);
}

// ============================================================
// ENTERPRISE MOCK DATA — Fatturazione Compliant
// ============================================================
import type {
  AnagraficaAzienda, Anagrafica, Articolo, DocumentoFiscale,
} from '@/types/fatturazione';

/** Configurazione emittente Impresa Leggera S.r.l. */
export const mockAnagraficaAzienda: AnagraficaAzienda = {
  id: 'aa-001',
  tenant_id: 'impresa-leggera',
  ragione_sociale: 'Impresa Leggera S.r.l.',
  partita_iva: '12345678901',
  codice_fiscale: '12345678901',
  forma_giuridica: 'S.r.l.',
  indirizzo_via: 'Via dell\'Innovazione',
  indirizzo_numero_civico: '42',
  indirizzo_cap: '20121',
  indirizzo_comune: 'Milano',
  indirizzo_provincia: 'MI',
  indirizzo_nazione: 'IT',
  codice_sdi: 'M5UXCR1',
  pec: 'impresaleggera@pec.it',
  codice_rea: 'MI-2098765',
  capitale_sociale: 50000,
  numero_iscr_registro_imprese: '12345678901',
  regime_fiscale: 'RF01',
  iban_principale: 'IT60X0542811101000000123456',
  bic_swift: 'BPMOIT22XXX',
  intestatario_conto: 'Impresa Leggera S.r.l.',
  nome_banca: 'Intesa Sanpaolo',
  logo_url: '/placeholder.svg',
  colore_primario: '#0EA5E9',
  font_fattura: 'Inter',
  telefono: '+39 02 1234567',
  email: 'info@impresaleggera.it',
  sito_web: 'https://impresaleggera.it',
  ultimo_numero_fattura: 12,
  ultimo_numero_nc: 1,
  ultimo_numero_ddt: 3,
  ultimo_numero_preventivo: 5,
  prefisso_fattura: 'FT',
  prefisso_nc: 'NC',
  prefisso_ddt: 'DDT',
  prefisso_preventivo: 'PRV',
  anno_corrente: 2026,
  reset_numeratore_annuale: true,
  note_fattura_default: 'Contributo CONAI assolto ove dovuto. Operazione soggetta a fatturazione elettronica ai sensi del D.Lgs. 127/2015.',
  condizioni_pagamento_default: 'Pagamento entro 30 giorni data fattura tramite bonifico bancario.',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: new Date().toISOString(),
};

/** Rubrica clienti/fornitori enterprise */
export const mockAnagrafiche: Anagrafica[] = [
  {
    id: 'an-001', tenant_id: 'impresa-leggera', tipo: 'cliente', tipo_soggetto: 'giuridico',
    ragione_sociale: 'Edil Bianchi S.r.l.', forma_giuridica: 'S.r.l.',
    partita_iva: '01234567890', codice_fiscale: '01234567890',
    codice_sdi: 'M5UXCR1', pec: 'edilbianchi@pec.it',
    indirizzo_via: 'Via Roma', indirizzo_numero_civico: '45',
    indirizzo_cap: '20121', indirizzo_comune: 'Milano', indirizzo_provincia: 'MI', indirizzo_nazione: 'IT',
    telefono: '02 1234567', email: 'info@edilbianchi.it', email_fatture: 'fatture@edilbianchi.it',
    tipo_cliente: 'B2B', aliquota_iva_default: '22', sconto_default: 0,
    condizioni_pagamento_default: '30gg', metodo_pagamento_default: 'MP05', giorni_pagamento_default: 30,
    fatturato_totale: 1293.20, numero_fatture: 3, ultima_fattura_at: '2026-03-01',
    tags: ['edilizia', 'storico'], attivo: true,
    created_at: '2025-01-15T00:00:00Z', updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'an-002', tenant_id: 'impresa-leggera', tipo: 'cliente', tipo_soggetto: 'giuridico',
    ragione_sociale: 'Studio Tecnico Verdi', forma_giuridica: 'Studio associato',
    partita_iva: '09876543210', codice_fiscale: '09876543210',
    codice_sdi: 'SUBM70N', pec: 'studioverdi@pec.it',
    indirizzo_via: 'Corso Garibaldi', indirizzo_numero_civico: '12',
    indirizzo_cap: '00185', indirizzo_comune: 'Roma', indirizzo_provincia: 'RM', indirizzo_nazione: 'IT',
    email: 'info@studioverdi.it',
    tipo_cliente: 'B2B', aliquota_iva_default: '22', sconto_default: 5,
    condizioni_pagamento_default: '30gg', metodo_pagamento_default: 'MP05', giorni_pagamento_default: 30,
    fatturato_totale: 610, numero_fatture: 1,
    tags: ['studio tecnico'], attivo: true,
    created_at: '2025-02-20T00:00:00Z', updated_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'an-003', tenant_id: 'impresa-leggera', tipo: 'cliente', tipo_soggetto: 'pa',
    ragione_sociale: 'Comune di Bergamo', forma_giuridica: 'Ente pubblico',
    codice_fiscale: '80034840164',
    codice_sdi: 'UFLA2V', pec: 'protocollo@pec.comune.bergamo.it',
    indirizzo_via: 'Piazza Matteotti', indirizzo_numero_civico: '27',
    indirizzo_cap: '24122', indirizzo_comune: 'Bergamo', indirizzo_provincia: 'BG', indirizzo_nazione: 'IT',
    telefono: '035 399111', email: 'info@comune.bergamo.it',
    tipo_cliente: 'PA', aliquota_iva_default: '22', sconto_default: 0,
    condizioni_pagamento_default: '60gg', metodo_pagamento_default: 'MP05', giorni_pagamento_default: 60,
    cig: 'Z4F3A1B2C3', cup: 'J41B20000050001',
    fatturato_totale: 0, numero_fatture: 0,
    tags: ['PA', 'ente locale'], attivo: true,
    created_at: '2026-01-10T00:00:00Z', updated_at: '2026-01-10T00:00:00Z',
  },
  {
    id: 'an-004', tenant_id: 'impresa-leggera', tipo: 'cliente', tipo_soggetto: 'fisico',
    nome: 'Marco', cognome: 'Ferretti',
    codice_fiscale: 'FRRMRC85M15F205Z', codice_sdi: '0000000',
    indirizzo_via: 'Via Garibaldi', indirizzo_numero_civico: '8',
    indirizzo_cap: '40126', indirizzo_comune: 'Bologna', indirizzo_provincia: 'BO', indirizzo_nazione: 'IT',
    cellulare: '348 5551234', email: 'marco.ferretti@gmail.com',
    tipo_cliente: 'B2C', aliquota_iva_default: '22', sconto_default: 0,
    condizioni_pagamento_default: 'immediato', metodo_pagamento_default: 'MP01', giorni_pagamento_default: 0,
    fatturato_totale: 0, numero_fatture: 0,
    tags: ['privato'], attivo: true,
    created_at: '2026-02-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'an-005', tenant_id: 'impresa-leggera', tipo: 'fornitore', tipo_soggetto: 'giuridico',
    ragione_sociale: 'TechSupply S.p.A.', forma_giuridica: 'S.p.A.',
    partita_iva: '55667788990', codice_fiscale: '55667788990',
    codice_sdi: 'W7YVJK9', pec: 'techsupply@pec.it',
    indirizzo_via: 'Via dell\'Industria', indirizzo_numero_civico: '100',
    indirizzo_cap: '10121', indirizzo_comune: 'Torino', indirizzo_provincia: 'TO', indirizzo_nazione: 'IT',
    email: 'ordini@techsupply.it',
    tipo_cliente: 'B2B', aliquota_iva_default: '22', sconto_default: 0,
    condizioni_pagamento_default: '60gg', metodo_pagamento_default: 'MP05', giorni_pagamento_default: 60,
    fatturato_totale: 0, numero_fatture: 0,
    tags: ['fornitore', 'IT'], attivo: true,
    created_at: '2025-06-01T00:00:00Z', updated_at: '2025-06-01T00:00:00Z',
  },
];

/** Catalogo articoli/servizi */
export const mockArticoli: Articolo[] = [
  { id: 'art-001', tenant_id: 'impresa-leggera', codice: 'SRV-ENEA', descrizione: 'Gestione pratica ENEA', descrizione_estesa: 'Compilazione e invio pratica ENEA per interventi di efficienza energetica', unita_misura: 'pz', prezzo_vendita: 250, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Pratiche', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-002', tenant_id: 'impresa-leggera', codice: 'SRV-FATT', descrizione: 'Creazione fattura elettronica', unita_misura: 'pz', prezzo_vendita: 75, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Fatturazione', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-003', tenant_id: 'impresa-leggera', codice: 'SRV-CC20', descrizione: 'Call Center (pacchetto 20h)', unita_misura: 'h', prezzo_vendita: 20, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Call Center', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-004', tenant_id: 'impresa-leggera', codice: 'SRV-SEGR', descrizione: 'Segreteria Virtuale (mensile)', unita_misura: 'mese', prezzo_vendita: 120, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Segreteria', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-005', tenant_id: 'impresa-leggera', codice: 'SRV-FIN', descrizione: 'Pratica finanziamento', unita_misura: 'pz', prezzo_vendita: 500, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Finanziamenti', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-006', tenant_id: 'impresa-leggera', codice: 'SRV-REC', descrizione: 'Recupero crediti (pratica singola)', unita_misura: 'pz', prezzo_vendita: 300, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Recupero Crediti', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-007', tenant_id: 'impresa-leggera', codice: 'SRV-RPT', descrizione: 'Report mensile attività', unita_misura: 'mese', prezzo_vendita: 50, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Report', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-008', tenant_id: 'impresa-leggera', codice: 'SRV-CONS', descrizione: 'Consulenza telefonica', unita_misura: 'h', prezzo_vendita: 60, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Consulenza', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-009', tenant_id: 'impresa-leggera', codice: 'BOLLO', descrizione: 'Imposta di bollo', unita_misura: 'pz', prezzo_vendita: 2, aliquota_iva: '0', natura_iva: 'N1', categoria: 'Imposte', attivo: true, mostra_in_fattura: false, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
  { id: 'art-010', tenant_id: 'impresa-leggera', codice: 'SRV-FORM', descrizione: 'Formazione operativa (giornata)', unita_misura: 'gg', prezzo_vendita: 450, aliquota_iva: '22', categoria: 'Servizi', sottocategoria: 'Formazione', attivo: true, mostra_in_fattura: true, created_at: '2025-01-01T00:00:00Z', updated_at: '2025-01-01T00:00:00Z' },
];

/** Documenti fiscali enterprise di esempio */
export const mockDocumentiFiscali: DocumentoFiscale[] = [
  {
    id: 'df-001',
    tenant_id: 'impresa-leggera',
    tipo: 'fattura',
    tipo_documento_sdi: 'TD01',
    numero: 'FT-2026-0011',
    numero_progressivo: 11,
    anno: 2026,
    serie: 'A',
    data_emissione: '2026-03-01',
    data_scadenza: '2026-03-31',
    anagrafica_id: 'an-001',
    cliente_snapshot: {
      ragione_sociale: 'Edil Bianchi S.r.l.',
      partita_iva: '01234567890',
      codice_fiscale: '01234567890',
      codice_sdi: 'M5UXCR1',
      pec: 'edilbianchi@pec.it',
      indirizzo_via: 'Via Roma 45',
      indirizzo_cap: '20121',
      indirizzo_comune: 'Milano',
      indirizzo_provincia: 'MI',
      indirizzo_nazione: 'IT',
      tipo_cliente: 'B2B',
    },
    stato: 'inviata_sdi',
    sdi_id_trasmissione: 'IT12345678901_00011',
    sdi_stato: 'RC',
    trasmissione: 'sdi',
    righe: [
      { id: 'df1-r1', numero_linea: 1, codice_articolo: 'SRV-ENEA', descrizione: 'Gestione pratica ENEA – Cappotto termico', quantita: 1, unita_misura: 'pz', prezzo_unitario: 250, imponibile: 250, aliquota_iva: '22', imposta: 55, totale_riga: 305 },
      { id: 'df1-r2', numero_linea: 2, codice_articolo: 'SRV-CC20', descrizione: 'Call Center (10h)', quantita: 10, unita_misura: 'h', prezzo_unitario: 20, imponibile: 200, aliquota_iva: '22', imposta: 44, totale_riga: 244 },
      { id: 'df1-r3', numero_linea: 3, codice_articolo: 'SRV-RPT', descrizione: 'Report mensile marzo', quantita: 1, unita_misura: 'mese', prezzo_unitario: 50, imponibile: 50, aliquota_iva: '22', imposta: 11, totale_riga: 61 },
    ],
    riepilogo_iva: [
      { aliquota: '22', imponibile: 500, imposta: 110, esigibilita: 'I' },
    ],
    subtotale: 500,
    imponibile_totale: 500,
    iva_totale: 110,
    totale_documento: 610,
    totale_da_pagare: 610,
    scadenze_pagamento: [
      { numero_rata: 1, data_scadenza: '2026-03-31', importo: 610, metodo_pagamento: 'MP05', iban: 'IT60X0542811101000000123456', istituto_finanziario: 'Intesa Sanpaolo', pagato: false },
    ],
    metodo_pagamento_codice: 'MP05',
    metodo_pagamento_nome: 'Bonifico Bancario',
    iban_pagamento: 'IT60X0542811101000000123456',
    note_documento: 'Contributo CONAI assolto ove dovuto.',
    causale: ['Servizi marzo 2026 — contratto n. 2025/042'],
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'df-002',
    tenant_id: 'impresa-leggera',
    tipo: 'nota_credito',
    tipo_documento_sdi: 'TD04',
    numero: 'NC-2026-0001',
    numero_progressivo: 1,
    anno: 2026,
    data_emissione: '2026-02-28',
    anagrafica_id: 'an-002',
    cliente_snapshot: {
      ragione_sociale: 'Studio Tecnico Verdi',
      partita_iva: '09876543210',
      codice_fiscale: '09876543210',
      codice_sdi: 'SUBM70N',
      indirizzo_via: 'Corso Garibaldi 12',
      indirizzo_cap: '00185',
      indirizzo_comune: 'Roma',
      indirizzo_provincia: 'RM',
      indirizzo_nazione: 'IT',
      tipo_cliente: 'B2B',
    },
    stato: 'consegnata',
    sdi_id_trasmissione: 'IT12345678901_NC001',
    sdi_stato: 'RC',
    trasmissione: 'sdi',
    documento_correlato_id: 'df-legacy-005',
    righe: [
      { id: 'df2-r1', numero_linea: 1, descrizione: 'Storno parziale fattura FT-2026-0005 – sconto concordato', quantita: 1, unita_misura: 'pz', prezzo_unitario: 50, imponibile: 50, aliquota_iva: '22', imposta: 11, totale_riga: 61 },
    ],
    riepilogo_iva: [
      { aliquota: '22', imponibile: 50, imposta: 11, esigibilita: 'I' },
    ],
    subtotale: 50,
    imponibile_totale: 50,
    iva_totale: 11,
    totale_documento: 61,
    totale_da_pagare: 61,
    scadenze_pagamento: [],
    note_documento: 'Nota di credito a storno parziale fattura FT-2026-0005.',
    created_at: '2026-02-28T14:30:00Z',
    updated_at: '2026-02-28T14:30:00Z',
  },
  {
    id: 'df-003',
    tenant_id: 'impresa-leggera',
    tipo: 'proforma',
    numero: 'PRV-2026-0005',
    numero_progressivo: 5,
    anno: 2026,
    data_emissione: '2026-03-10',
    data_scadenza: '2026-04-10',
    anagrafica_id: 'an-003',
    cliente_snapshot: {
      ragione_sociale: 'Comune di Bergamo',
      codice_fiscale: '80034840164',
      codice_sdi: 'UFLA2V',
      pec: 'protocollo@pec.comune.bergamo.it',
      indirizzo_via: 'Piazza Matteotti 27',
      indirizzo_cap: '24122',
      indirizzo_comune: 'Bergamo',
      indirizzo_provincia: 'BG',
      indirizzo_nazione: 'IT',
      tipo_cliente: 'PA',
      cig: 'Z4F3A1B2C3',
      cup: 'J41B20000050001',
    },
    stato: 'bozza',
    cig: 'Z4F3A1B2C3',
    cup: 'J41B20000050001',
    righe: [
      { id: 'df3-r1', numero_linea: 1, codice_articolo: 'SRV-FORM', descrizione: 'Formazione operativa digitalizzazione', quantita: 2, unita_misura: 'gg', prezzo_unitario: 450, imponibile: 900, aliquota_iva: '22', imposta: 198, totale_riga: 1098 },
      { id: 'df3-r2', numero_linea: 2, codice_articolo: 'SRV-SEGR', descrizione: 'Segreteria Virtuale (3 mesi)', quantita: 3, unita_misura: 'mese', prezzo_unitario: 120, imponibile: 360, aliquota_iva: '22', imposta: 79.20, totale_riga: 439.20 },
    ],
    riepilogo_iva: [
      { aliquota: '22', imponibile: 1260, imposta: 277.20, esigibilita: 'S', riferimento_normativo: 'Scissione dei pagamenti ex art. 17-ter DPR 633/72' },
    ],
    subtotale: 1260,
    imponibile_totale: 1260,
    iva_totale: 277.20,
    totale_documento: 1537.20,
    totale_da_pagare: 1260, // PA trattiene IVA (split payment)
    scadenze_pagamento: [
      { numero_rata: 1, data_scadenza: '2026-05-10', importo: 630, metodo_pagamento: 'MP05', iban: 'IT60X0542811101000000123456', pagato: false },
      { numero_rata: 2, data_scadenza: '2026-06-10', importo: 630, metodo_pagamento: 'MP05', iban: 'IT60X0542811101000000123456', pagato: false },
    ],
    metodo_pagamento_codice: 'MP05',
    note_documento: 'Preventivo non fiscale — soggetto a conferma.',
    created_at: '2026-03-10T09:00:00Z',
    updated_at: '2026-03-10T09:00:00Z',
  },
  {
    id: 'df-004',
    tenant_id: 'impresa-leggera',
    tipo: 'fattura',
    tipo_documento_sdi: 'TD01',
    numero: 'FT-2026-0012',
    numero_progressivo: 12,
    anno: 2026,
    data_emissione: '2026-03-05',
    data_scadenza: '2026-04-04',
    anagrafica_id: 'an-004',
    cliente_snapshot: {
      ragione_sociale: 'Marco Ferretti',
      nome: 'Marco',
      cognome: 'Ferretti',
      codice_fiscale: 'FRRMRC85M15F205Z',
      codice_sdi: '0000000',
      indirizzo_via: 'Via Garibaldi 8',
      indirizzo_cap: '40126',
      indirizzo_comune: 'Bologna',
      indirizzo_provincia: 'BO',
      indirizzo_nazione: 'IT',
      tipo_cliente: 'B2C',
    },
    stato: 'pagata',
    pagato_at: '2026-03-06T15:00:00Z',
    importo_pagato: 341.60,
    righe: [
      { id: 'df4-r1', numero_linea: 1, codice_articolo: 'SRV-ENEA', descrizione: 'Pratica ENEA caldaia condensazione', quantita: 1, unita_misura: 'pz', prezzo_unitario: 280, imponibile: 280, aliquota_iva: '22', imposta: 61.60, totale_riga: 341.60 },
    ],
    riepilogo_iva: [
      { aliquota: '22', imponibile: 280, imposta: 61.60, esigibilita: 'I' },
    ],
    subtotale: 280,
    imponibile_totale: 280,
    iva_totale: 61.60,
    totale_documento: 341.60,
    totale_da_pagare: 341.60,
    scadenze_pagamento: [
      { numero_rata: 1, data_scadenza: '2026-04-04', importo: 341.60, metodo_pagamento: 'MP01', pagato: true, pagato_at: '2026-03-06', pagato_importo: 341.60 },
    ],
    metodo_pagamento_codice: 'MP01',
    metodo_pagamento_nome: 'Contanti',
    created_at: '2026-03-05T11:00:00Z',
    updated_at: '2026-03-06T15:00:00Z',
  },
];

export function getAnagraficaById(id: string) {
  return mockAnagrafiche.find(a => a.id === id);
}

export function getArticoloById(id: string) {
  return mockArticoli.find(a => a.id === id);
}

export function getDocumentoById(id: string) {
  return mockDocumentiFiscali.find(d => d.id === id);
}
