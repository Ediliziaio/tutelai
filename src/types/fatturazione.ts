// ============================================================
// FATTURAZIONE ENTERPRISE — Normativa Italiana D.Lgs. 127/2015
// Single source of truth per FatturaPA, SDI, regimi fiscali
// ============================================================

// ============================================================
// REGIMI FISCALI (RF01-RF19)
// ============================================================
export const REGIMI_FISCALI = {
  RF01: 'Ordinario',
  RF02: 'Contribuenti minimi (art.1, c.96-117, L. 244/07)',
  RF04: 'Agricoltura e attività connesse e pesca',
  RF05: 'Vendita sali e tabacchi (art.74, c.1, DPR 633/72)',
  RF06: 'Commercio fiammiferi (art.74, c.1, DPR 633/72)',
  RF07: 'Editoria (art.74, c.1, DPR 633/72)',
  RF08: 'Gestione servizi telefonia pubblica',
  RF09: 'Rivendita documenti di trasporto pubblico',
  RF10: 'Intrattenimenti, giochi (art.74, c.6, DPR 633/72)',
  RF11: 'Agenzie viaggi (art.74-ter, DPR 633/72)',
  RF12: 'Agriturismo (art.5, c.2, L. 413/91)',
  RF13: 'Vendite a domicilio (art.25-bis, c.6, DPR 600/73)',
  RF14: 'Rivendita beni usati, oggetti arte/antiquariato',
  RF15: 'Agenzie vendite all\'asta (art.40-bis, DL 41/95)',
  RF16: 'IVA per cassa P.A. (art.6, c.5, DPR 633/72)',
  RF17: 'IVA per cassa soggetti con volume affari < 2ML',
  RF18: 'Altro',
  RF19: 'Regime forfettario (art.1, c.54-89, L. 190/2014)',
} as const;

export type CodiceRegimeFiscale = keyof typeof REGIMI_FISCALI;

// ============================================================
// METODI DI PAGAMENTO SDI (MP01-MP23)
// ============================================================
export const METODI_PAGAMENTO_SDI = {
  MP01: 'Contanti',
  MP02: 'Assegno',
  MP03: 'Assegno circolare',
  MP04: 'Contanti presso Tesoreria',
  MP05: 'Bonifico',
  MP06: 'Vaglia cambiario',
  MP07: 'Bollettino bancario',
  MP08: 'Carta di pagamento',
  MP09: 'RID',
  MP10: 'RID utenze',
  MP11: 'RID veloce',
  MP12: 'RIBA',
  MP13: 'MAV',
  MP14: 'Quietanza erario',
  MP15: 'Giroconto su conti di contabilità speciale',
  MP16: 'Domiciliazione bancaria',
  MP17: 'Domiciliazione postale',
  MP18: 'Bollettino di c/c postale',
  MP19: 'SEPA Direct Debit',
  MP20: 'SEPA Direct Debit CORE',
  MP21: 'SEPA Direct Debit B2B',
  MP22: 'Trattenuta su somme già riscosse',
  MP23: 'PagoPA',
} as const;

export type CodiceMetodoPagamento = keyof typeof METODI_PAGAMENTO_SDI;

// ============================================================
// NATURE IVA (N1-N7 con sottocodici)
// ============================================================
export const NATURE_IVA = {
  N1: 'Escluse ex art. 15',
  N2: 'Non soggette',
  N2_1: 'Non soggette ad IVA ai sensi degli artt. da 7 a 7-septies DPR 633/72',
  N2_2: 'Non soggette – altri casi',
  N3: 'Non imponibili',
  N3_1: 'Non imponibili – esportazioni',
  N3_2: 'Non imponibili – cessioni intracomunitarie',
  N3_3: 'Non imponibili – cessioni verso San Marino',
  N3_4: 'Non imponibili – operazioni assimilate alle esportazioni',
  N3_5: 'Non imponibili – a seguito di dichiarazioni d\'intento',
  N3_6: 'Non imponibili – altre operazioni non imponibili',
  N4: 'Esenti',
  N5: 'Regime del margine / IVA non esposta in fattura',
  N6: 'Inversione contabile',
  N6_1: 'Inversione contabile – cessione di rottami e altri materiali',
  N6_2: 'Inversione contabile – cessione di oro e argento puro',
  N6_3: 'Inversione contabile – subappalto nel settore edile',
  N6_4: 'Inversione contabile – cessione di fabbricati',
  N6_5: 'Inversione contabile – cessione di telefoni cellulari',
  N6_6: 'Inversione contabile – cessione di prodotti elettronici',
  N6_7: 'Inversione contabile – prestazioni comparto edile e settori connessi',
  N6_8: 'Inversione contabile – operazioni settore energetico',
  N6_9: 'Inversione contabile – altri casi',
  N7: 'IVA assolta in altro stato UE',
} as const;

export type CodiceNaturaIVA = keyof typeof NATURE_IVA;

// ============================================================
// TIPI DOCUMENTO FATTURAPA (TD01-TD28)
// ============================================================
export const TIPI_DOCUMENTO_FATTURAPA = {
  TD01: 'Fattura',
  TD02: 'Acconto/anticipo su fattura',
  TD03: 'Acconto/anticipo su parcella',
  TD04: 'Nota di credito',
  TD05: 'Nota di debito',
  TD06: 'Parcella',
  TD16: 'Integrazione fattura reverse charge interno',
  TD17: 'Integrazione/autofattura per acquisto servizi dall\'estero',
  TD18: 'Integrazione per acquisto di beni intracomunitari',
  TD19: 'Integrazione/autofattura per acquisto di beni ex art.17 c.2 DPR 633/72',
  TD20: 'Autofattura per regolarizzazione e integrazione delle fatture',
  TD21: 'Autofattura per splafonamento',
  TD22: 'Estrazione beni da Deposito IVA',
  TD23: 'Estrazione beni da Deposito IVA con versamento IVA',
  TD24: 'Fattura differita di cui all\'art. 21, comma 4, lett. a)',
  TD25: 'Fattura differita di cui all\'art. 21, comma 4, terzo periodo, lett. b)',
  TD26: 'Cessione di beni ammortizzabili e per passaggi interni',
  TD27: 'Fattura per autoconsumo o per cessioni gratuite senza rivalsa',
  TD28: 'Acquisti da San Marino con IVA (fattura cartacea)',
} as const;

export type CodiceTipoDocumento = keyof typeof TIPI_DOCUMENTO_FATTURAPA;

// ============================================================
// CAUSALI RITENUTA D'ACCONTO
// ============================================================
export const CAUSALI_RITENUTA = {
  A: 'Prestazioni di lavoro autonomo rientranti nell\'esercizio di arte o professione',
  B: 'Utilizzazione economica di opere dell\'ingegno, brevetti, know-how',
  C: 'Utili derivanti da contratti di associazione in partecipazione',
  D: 'Corrispettivi per prestazioni sportive dilettantistiche',
  E: 'Provvigioni ad agenti, mediatori, rappresentanti di commercio',
  G: 'Indennità per la cessazione di agenzie',
  H: 'Indennità per la cessazione di attività sportiva',
  I: 'Redditi derivanti dalla vendita a domicilio',
  J: 'Provvigioni corrisposti ad altri soggetti',
  K: 'Assegni di ricerca',
  L: 'Redditi derivanti da rapporti di collaborazione',
  M: 'Prestazioni di lavoro autonomo non esercitate abitualmente',
  N: 'Indennità di trasferta, rimborso forfetario spese',
  O: 'Prestazioni di lavoro autonomo non esercitate abitualmente con compensi < €25,82',
  P: 'Compensi corrisposti a soggetti non residenti',
  Q: 'Provvigioni ad agenti in attività finanziaria',
  R: 'Compensi per prestazioni di intermediazione immobiliare',
  S: 'Indennità di esproprio e risarcimenti sostitutivi',
  T: 'Redditi derivanti da attività commerciali non abituali',
  U: 'Redditi derivanti da attività di lavoro autonomo non abituali',
  V: 'Proventi derivanti dalla cessione a termine di titoli',
  W: 'Canoni corrisposti nel 2021',
  X: 'Canoni corrisposti dal 2022',
  Y: 'Canoni corrisposti dal 2024',
  ZO: 'Titolo diverso dai precedenti',
} as const;

export type CodiceCausaleRitenuta = keyof typeof CAUSALI_RITENUTA;

// ============================================================
// UNITÀ DI MISURA
// ============================================================
export const UNITA_MISURA_ENUM = {
  pz: 'Pezzi',
  h: 'Ore',
  gg: 'Giorni',
  mese: 'Mesi',
  km: 'Chilometri',
  kg: 'Chilogrammi',
  l: 'Litri',
  m: 'Metri',
  m2: 'Metri quadri',
  m3: 'Metri cubi',
  kw: 'Kilowatt',
  kwh: 'Kilowattora',
  '%': 'Percentuale',
  altro: 'Altro',
} as const;

export type CodiceUnitaMisura = keyof typeof UNITA_MISURA_ENUM;

// ============================================================
// ALIQUOTE IVA STANDARD
// ============================================================
export const ALIQUOTE_IVA = [
  { codice: '22', label: '22% — Aliquota ordinaria', valore: 22, natura: null },
  { codice: '10', label: '10% — Aliquota ridotta', valore: 10, natura: null },
  { codice: '5', label: '5% — Aliquota super-ridotta', valore: 5, natura: null },
  { codice: '4', label: '4% — Aliquota minima', valore: 4, natura: null },
  { codice: '0_N1', label: '0% — Escluse art. 15', valore: 0, natura: 'N1' as CodiceNaturaIVA },
  { codice: '0_N2', label: '0% — Non soggette', valore: 0, natura: 'N2' as CodiceNaturaIVA },
  { codice: '0_N3', label: '0% — Non imponibili', valore: 0, natura: 'N3' as CodiceNaturaIVA },
  { codice: '0_N4', label: '0% — Esenti', valore: 0, natura: 'N4' as CodiceNaturaIVA },
  { codice: '0_N5', label: '0% — Regime del margine', valore: 0, natura: 'N5' as CodiceNaturaIVA },
  { codice: '0_N6', label: '0% — Inversione contabile', valore: 0, natura: 'N6' as CodiceNaturaIVA },
  { codice: '0_N7', label: '0% — IVA assolta in altro stato UE', valore: 0, natura: 'N7' as CodiceNaturaIVA },
] as const;

// ============================================================
// FORME GIURIDICHE
// ============================================================
export const FORME_GIURIDICHE = [
  'Ditta individuale',
  'S.r.l.',
  'S.r.l.s.',
  'S.p.A.',
  'S.a.s.',
  'S.n.c.',
  'S.s.',
  'Cooperativa',
  'Studio associato',
  'Associazione',
  'Fondazione',
  'Ente pubblico',
  'Professionista',
  'Altro',
] as const;

export type FormaGiuridica = typeof FORME_GIURIDICHE[number];

// ============================================================
// ESIGIBILITÀ IVA
// ============================================================
export const ESIGIBILITA_IVA = {
  I: 'Immediata',
  D: 'Differita',
  S: 'Scissione dei pagamenti',
} as const;

export type CodiceEsigibilitaIVA = keyof typeof ESIGIBILITA_IVA;

// ============================================================
// TIPI RITENUTA
// ============================================================
export const TIPI_RITENUTA = {
  RT01: 'Ritenuta persone fisiche',
  RT02: 'Ritenuta persone giuridiche',
} as const;

export type CodiceTipoRitenuta = keyof typeof TIPI_RITENUTA;

// ============================================================
// TIPI CASSA PREVIDENZIALE (TC01-TC22)
// ============================================================
export const TIPI_CASSA = {
  TC01: 'Cassa nazionale previdenza e assistenza avvocati e procuratori legali',
  TC02: 'Cassa previdenza dottori commercialisti',
  TC03: 'Cassa previdenza e assistenza geometri',
  TC04: 'Cassa nazionale previdenza e assistenza ingegneri e architetti liberi professionisti',
  TC05: 'Cassa nazionale del notariato',
  TC06: 'Cassa nazionale previdenza e assistenza ragionieri e periti commerciali',
  TC07: 'Ente nazionale assistenza agenti e rappresentanti di commercio (ENASARCO)',
  TC08: 'Ente nazionale previdenza e assistenza consulenti del lavoro (ENPACL)',
  TC09: 'Ente nazionale previdenza e assistenza medici (ENPAM)',
  TC10: 'Ente nazionale previdenza e assistenza farmacisti (ENPAF)',
  TC11: 'Ente nazionale previdenza e assistenza veterinari (ENPAV)',
  TC12: 'Ente nazionale previdenza e assistenza impiegati dell\'agricoltura (ENPAIA)',
  TC13: 'Fondo previdenza impiegati imprese di spedizione e agenzie marittime',
  TC14: 'Istituto nazionale previdenza giornalisti italiani (INPGI)',
  TC15: 'Opera nazionale assistenza orfani sanitari italiani (ONAOSI)',
  TC16: 'Cassa autonoma assistenza integrativa giornalisti italiani (CASAGIT)',
  TC17: 'Ente previdenza periti industriali e periti industriali laureati (EPPI)',
  TC18: 'Ente previdenza e assistenza pluricategoriale (EPAP)',
  TC19: 'Ente nazionale previdenza e assistenza biologi (ENPAB)',
  TC20: 'Ente nazionale previdenza e assistenza professione infermieristica (ENPAPI)',
  TC21: 'Ente nazionale previdenza e assistenza psicologi (ENPAP)',
  TC22: 'INPS',
} as const;

export type CodiceTipoCassa = keyof typeof TIPI_CASSA;

// ============================================================
// STATI DOCUMENTO
// ============================================================
export type StatoDocumento =
  | 'bozza'
  | 'emessa'
  | 'inviata_sdi'
  | 'consegnata'
  | 'accettata'
  | 'rifiutata'
  | 'scaduta'
  | 'pagata'
  | 'parzialmente_pagata'
  | 'stornata'
  | 'annullata';

// ============================================================
// TIPO DOCUMENTO INTERNO (mapping a TipoDocumentoFatturaPA)
// ============================================================
export type TipoDocumento =
  | 'fattura'
  | 'fattura_pa'
  | 'nota_credito'
  | 'nota_debito'
  | 'autofattura'
  | 'fattura_riepilogativa'
  | 'proforma'
  | 'preventivo'
  | 'ddt';

// ============================================================
// TIPO SOGGETTO & TIPO CLIENTE
// ============================================================
export type TipoSoggetto = 'giuridico' | 'fisico' | 'pa' | 'estero';
export type TipoCliente = 'B2B' | 'B2C' | 'PA' | 'Estero';
export type TipoAnagrafica = 'cliente' | 'fornitore' | 'entrambi';

// ============================================================
// INTERFACCE PRINCIPALI
// ============================================================

/** Riga singola di un documento fiscale */
export interface RigaDocumento {
  id: string;
  numero_linea: number;
  tipo_cessione?: 'SC' | 'PR' | 'AB' | 'AC';
  codice_articolo?: string;
  codice_tipo?: string;
  descrizione: string;
  quantita: number;
  unita_misura: CodiceUnitaMisura;
  prezzo_unitario: number;
  sconto_percentuale?: number;
  sconto_valore?: number;
  prezzo_unitario_scontato?: number;
  imponibile: number;
  aliquota_iva: string;
  natura_iva?: CodiceNaturaIVA;
  imposta: number;
  totale_riga: number;
  ritenuta?: boolean;
  riferimento_amministrazione?: string;
  note_riga?: string;
}

/** Riepilogo IVA per aliquota */
export interface RiepilogoIVA {
  aliquota: string;
  natura?: CodiceNaturaIVA;
  imponibile: number;
  imposta: number;
  esigibilita: CodiceEsigibilitaIVA;
  riferimento_normativo?: string;
}

/** Scadenza pagamento / rata */
export interface ScadenzaPagamento {
  numero_rata: number;
  data_scadenza: string;
  importo: number;
  metodo_pagamento: CodiceMetodoPagamento;
  iban?: string;
  bic?: string;
  istituto_finanziario?: string;
  pagato: boolean;
  pagato_at?: string;
  pagato_importo?: number;
}

/** Snapshot dati cliente al momento emissione */
export interface ClienteSnapshot {
  ragione_sociale: string;
  nome?: string;
  cognome?: string;
  partita_iva?: string;
  codice_fiscale?: string;
  codice_sdi?: string;
  pec?: string;
  indirizzo_via?: string;
  indirizzo_cap?: string;
  indirizzo_comune?: string;
  indirizzo_provincia?: string;
  indirizzo_nazione?: string;
  tipo_cliente: TipoCliente;
  cig?: string;
  cup?: string;
}

/** Documento fiscale enterprise completo */
export interface DocumentoFiscale {
  id: string;
  tenant_id: string;
  tipo: TipoDocumento;
  tipo_documento_sdi?: CodiceTipoDocumento;
  numero: string;
  numero_progressivo: number;
  anno: number;
  serie?: string;
  data_emissione: string;
  data_scadenza?: string;
  data_consegna?: string;

  // Anagrafica
  anagrafica_id?: string;
  cliente_snapshot: ClienteSnapshot;

  // Stato
  stato: StatoDocumento;

  // SDI tracking
  sdi_id_trasmissione?: string;
  sdi_stato?: string;
  sdi_data_consegna?: string;
  sdi_file_xml_url?: string;
  sdi_ricevuta_url?: string;
  sdi_errori?: Array<{ codice: string; descrizione: string }>;
  trasmissione?: 'sdi' | 'pec' | 'manuale';

  // Righe e riepilogo
  righe: RigaDocumento[];
  riepilogo_iva: RiepilogoIVA[];

  // Totali
  subtotale: number;
  sconto_globale_percentuale?: number;
  sconto_globale_valore?: number;
  imponibile_totale: number;
  iva_totale: number;
  totale_documento: number;
  arrotondamento?: number;

  // Bollo virtuale
  bollo_virtuale?: boolean;
  bollo_importo?: number;

  // Ritenuta d'acconto
  ritenuta_acconto?: boolean;
  ritenuta_tipo?: CodiceTipoRitenuta;
  ritenuta_aliquota?: number;
  ritenuta_causale?: CodiceCausaleRitenuta;
  ritenuta_importo?: number;

  // Cassa previdenziale
  cassa_previdenziale?: boolean;
  cassa_tipo?: CodiceTipoCassa;
  cassa_aliquota?: number;
  cassa_imponibile?: number;
  cassa_importo?: number;
  cassa_aliquota_iva?: string;
  cassa_ritenuta?: boolean;

  // Totale da pagare (dopo ritenute)
  totale_da_pagare: number;

  // Pagamenti
  scadenze_pagamento: ScadenzaPagamento[];
  metodo_pagamento_codice?: CodiceMetodoPagamento;
  metodo_pagamento_nome?: string;
  iban_pagamento?: string;
  bic_pagamento?: string;
  importo_pagato?: number;
  pagato_at?: string;

  // Riferimenti
  documento_correlato_id?: string;
  riferimenti_ordine?: string[];
  riferimenti_ddt?: string[];
  cig?: string;
  cup?: string;
  codice_commessa_convenzione?: string;

  // DDT specifici
  ddt_causale_trasporto?: string;
  ddt_numero_colli?: number;
  ddt_peso?: string;
  ddt_porto?: 'Franco' | 'Assegnato';
  ddt_aspetto_beni?: string;
  ddt_indirizzo_consegna?: Record<string, string>;

  // Allegati e note
  allegati?: Array<{ nome: string; url: string }>;
  pdf_url?: string;
  note_documento?: string;
  causale?: string[];
  note_interne?: string;

  // Regime speciale
  art_21_comma_6_bis?: boolean;
  art_73_comma_3?: boolean;

  created_at: string;
  updated_at: string;
}

// ============================================================
// ANAGRAFICA AZIENDA EMITTENTE
// ============================================================
export interface AnagraficaAzienda {
  id: string;
  tenant_id: string;
  ragione_sociale: string;
  partita_iva: string;
  codice_fiscale: string;
  forma_giuridica: FormaGiuridica;
  indirizzo_via: string;
  indirizzo_numero_civico?: string;
  indirizzo_cap: string;
  indirizzo_comune: string;
  indirizzo_provincia: string;
  indirizzo_nazione: string;
  codice_sdi?: string;
  pec?: string;
  codice_rea?: string;
  capitale_sociale?: number;
  numero_iscr_registro_imprese?: string;
  regime_fiscale: CodiceRegimeFiscale;
  iban_principale?: string;
  bic_swift?: string;
  intestatario_conto?: string;
  nome_banca?: string;
  logo_url?: string;
  colore_primario?: string;
  font_fattura?: string;
  telefono?: string;
  email?: string;
  sito_web?: string;
  ultimo_numero_fattura: number;
  ultimo_numero_nc: number;
  ultimo_numero_ddt: number;
  ultimo_numero_preventivo: number;
  prefisso_fattura: string;
  prefisso_nc: string;
  prefisso_ddt: string;
  prefisso_preventivo: string;
  anno_corrente: number;
  reset_numeratore_annuale: boolean;
  note_fattura_default?: string;
  condizioni_pagamento_default?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================
// ANAGRAFICA CLIENTI / FORNITORI
// ============================================================
export interface Anagrafica {
  id: string;
  tenant_id: string;
  tipo: TipoAnagrafica;
  tipo_soggetto: TipoSoggetto;
  ragione_sociale?: string;
  forma_giuridica?: string;
  nome?: string;
  cognome?: string;
  partita_iva?: string;
  codice_fiscale?: string;
  codice_sdi?: string;
  pec?: string;
  indirizzo_via?: string;
  indirizzo_numero_civico?: string;
  indirizzo_cap?: string;
  indirizzo_comune?: string;
  indirizzo_provincia?: string;
  indirizzo_nazione?: string;
  telefono?: string;
  cellulare?: string;
  email?: string;
  email_fatture?: string;
  sito_web?: string;
  indirizzi_consegna?: Array<{
    label: string;
    via: string;
    cap: string;
    comune: string;
    provincia: string;
    nazione: string;
  }>;
  regime_fiscale?: CodiceRegimeFiscale;
  tipo_cliente: TipoCliente;
  aliquota_iva_default: string;
  sconto_default: number;
  condizioni_pagamento_default: string;
  metodo_pagamento_default: CodiceMetodoPagamento;
  giorni_pagamento_default: number;
  iban_cliente?: string;
  bic_cliente?: string;
  cig?: string;
  cup?: string;
  codice_commessa?: string;
  fatturato_totale: number;
  numero_fatture: number;
  ultima_fattura_at?: string;
  note?: string;
  tags: string[];
  attivo: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// ARTICOLI / LISTINO
// ============================================================
export interface Articolo {
  id: string;
  tenant_id: string;
  codice?: string;
  descrizione: string;
  descrizione_estesa?: string;
  unita_misura: CodiceUnitaMisura;
  prezzo_vendita: number;
  prezzo_acquisto?: number;
  aliquota_iva: string;
  natura_iva?: CodiceNaturaIVA;
  categoria?: string;
  sottocategoria?: string;
  attivo: boolean;
  mostra_in_fattura: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// METODO DI PAGAMENTO (configurazione per tenant)
// ============================================================
export interface MetodoPagamento {
  id: string;
  tenant_id: string;
  nome: string;
  codice_fatturapa: CodiceMetodoPagamento;
  giorni_scadenza: number;
  tipo: 'standard' | 'rata' | 'riba' | 'sdd' | 'contanti';
  iban_addebito?: string;
  descrizione?: string;
  attivo: boolean;
  created_at: string;
}

// ============================================================
// MOVIMENTI CASSA
// ============================================================
export interface MovimentoCassa {
  id: string;
  tenant_id: string;
  documento_id?: string;
  tipo: 'incasso' | 'pagamento' | 'storno' | 'rettifica';
  data_movimento: string;
  importo: number;
  metodo?: string;
  riferimento?: string;
  note?: string;
  created_at: string;
}

// ============================================================
// LOG SDI
// ============================================================
export interface SdiLogEntry {
  id: string;
  tenant_id: string;
  documento_id?: string;
  evento: 'invio' | 'ricevuta_consegna' | 'notifica_esito' | 'scarto' | 'decorrenza_termini';
  sdi_id?: string;
  tipo_notifica?: 'RC' | 'NS' | 'MC' | 'EC' | 'SE' | 'DT' | 'AT';
  messaggio?: string;
  errori?: Array<{ codice: string; descrizione: string }>;
  xml_content?: string;
  created_at: string;
}

// ============================================================
// FATTURA RICEVUTA (passiva)
// ============================================================
export interface FatturaRicevuta {
  id: string;
  tenant_id: string;
  anagrafica_id?: string;
  numero_fornitore?: string;
  data_documento: string;
  data_ricezione: string;
  data_registrazione?: string;
  imponibile: number;
  iva: number;
  totale: number;
  stato: 'da_pagare' | 'pagata' | 'scaduta' | 'contestata' | 'annullata';
  xml_url?: string;
  pdf_url?: string;
  note?: string;
  created_at: string;
}

// ============================================================
// HELPER: Stato → Label italiano per UI
// ============================================================
export const STATO_DOCUMENTO_LABELS: Record<StatoDocumento, string> = {
  bozza: 'Bozza',
  emessa: 'Emessa',
  inviata_sdi: 'Inviata SDI',
  consegnata: 'Consegnata',
  accettata: 'Accettata',
  rifiutata: 'Rifiutata',
  scaduta: 'Scaduta',
  pagata: 'Pagata',
  parzialmente_pagata: 'Parz. Pagata',
  stornata: 'Stornata',
  annullata: 'Annullata',
};

export const TIPO_DOCUMENTO_LABELS: Record<TipoDocumento, string> = {
  fattura: 'Fattura',
  fattura_pa: 'Fattura PA',
  nota_credito: 'Nota di Credito',
  nota_debito: 'Nota di Debito',
  autofattura: 'Autofattura',
  fattura_riepilogativa: 'Fattura Riepilogativa',
  proforma: 'Pro-Forma',
  preventivo: 'Preventivo',
  ddt: 'DDT',
};
