/**
 * Legacy invoice types — used by the simple FatturaPreview and mock data.
 * For new code, prefer the enterprise types in fatturazione.ts.
 */

export type StatoFattura = 'bozza' | 'inviata' | 'pagata' | 'scaduta' | 'annullata';

export type UnitaMisura = 'pz' | 'h' | 'gg' | 'km' | 'kg' | '%';
export type ModalitaPagamento = 'bonifico' | 'rimessa_diretta' | 'rid' | 'assegno' | 'contanti';
export type RegimeFiscale = 'ordinario' | 'forfettario' | 'minimi';
export type ScontoTipo = 'percentuale' | 'fisso' | 'nessuno';

export interface RigaFattura {
  id: string;
  descrizione: string;
  quantita: number;
  unita_misura: UnitaMisura;
  prezzo_unitario: number;
  iva_percentuale: number;
  totale: number;
}

export interface Fattura {
  id: string;
  numero: string;
  tenant_id: string;
  data_emissione: string;
  data_scadenza: string;
  stato: StatoFattura;
  righe: RigaFattura[];
  subtotale: number;
  iva_percentuale: number;
  iva_importo: number;
  totale: number;
  note?: string;
  note_interne?: string;
  pratiche_collegate: string[];
  modalita_pagamento: ModalitaPagamento;
  iban?: string;
  intestatario_conto?: string;
  banca?: string;
  mostra_iban: boolean;
  regime_fiscale: RegimeFiscale;
  sconto_tipo: ScontoTipo;
  sconto_valore: number;
  pagato_at?: string;
  created_at: string;
}
