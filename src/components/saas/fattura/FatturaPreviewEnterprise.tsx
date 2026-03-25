import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import type { RigaDocumento, RiepilogoIVA, ClienteSnapshot, AnagraficaAzienda, ScadenzaPagamento } from '@/types/fatturazione';
import { TIPI_DOCUMENTO_FATTURAPA, METODI_PAGAMENTO_SDI, REGIMI_FISCALI, type CodiceTipoDocumento, type CodiceMetodoPagamento, type CodiceRegimeFiscale } from '@/types/fatturazione';
import { formatEuro, type TotaliDocumento } from './calcoliDocumento';
import { DDTSignatures } from './DDTSignatures';

interface FatturaPreviewEnterpriseProps {
  azienda: AnagraficaAzienda;
  tipoDocumento: CodiceTipoDocumento;
  numero: string;
  dataEmissione: string;
  dataScadenza?: string;
  clienteSnapshot: ClienteSnapshot | null;
  righe: RigaDocumento[];
  totali: TotaliDocumento;
  bolloVirtuale: boolean;
  ritenutaAttiva: boolean;
  ritenutaAliquota?: number;
  cassaAttiva: boolean;
  cassaImporto?: number;
  metodoPagamento?: CodiceMetodoPagamento;
  iban?: string;
  intestatarioConto?: string;
  nomeBanca?: string;
  noteDocumento?: string;
  scadenze?: ScadenzaPagamento[];
  className?: string;
  isDDT?: boolean;
}

function fmtDate(d: string) {
  if (!d) return '—';
  try { return format(new Date(d), 'dd/MM/yyyy', { locale: it }); } catch { return d; }
}

export function FatturaPreviewEnterprise(props: FatturaPreviewEnterpriseProps) {
  const az = props.azienda;

  return (
    <div className={`bg-white text-slate-800 text-[11px] leading-relaxed print:text-[10px] ${props.className ?? ''}`} id="fattura-preview">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-base font-bold text-sky-600">{az.ragione_sociale}</p>
          <p className="text-slate-500 mt-1">
            {[az.indirizzo_via, az.indirizzo_numero_civico].filter(Boolean).join(' ')} — {az.indirizzo_cap} {az.indirizzo_comune} ({az.indirizzo_provincia})
          </p>
          <p className="text-slate-500">P.IVA: {az.partita_iva} — C.F.: {az.codice_fiscale}</p>
          {az.pec && <p className="text-slate-500">PEC: {az.pec}</p>}
          {az.email && <p className="text-slate-500">Email: {az.email}</p>}
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{TIPI_DOCUMENTO_FATTURAPA[props.tipoDocumento]?.toUpperCase() || 'FATTURA'}</p>
          <p className="font-mono text-sm font-semibold text-slate-700 mt-1">{props.numero || '—'}</p>
          <p className="text-slate-500 mt-2">Data: {fmtDate(props.dataEmissione)}</p>
          {props.dataScadenza && <p className="text-slate-500">Scadenza: {fmtDate(props.dataScadenza)}</p>}
        </div>
      </div>

      <div className="h-px bg-slate-200 mb-4" />

      {/* Cliente */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Destinatario</p>
        {props.clienteSnapshot ? (
          <>
            <p className="font-semibold text-sm text-slate-900">{props.clienteSnapshot.ragione_sociale}</p>
            {props.clienteSnapshot.partita_iva && <p className="text-slate-500">P.IVA: {props.clienteSnapshot.partita_iva}</p>}
            {props.clienteSnapshot.codice_fiscale && props.clienteSnapshot.codice_fiscale !== props.clienteSnapshot.partita_iva && (
              <p className="text-slate-500">C.F.: {props.clienteSnapshot.codice_fiscale}</p>
            )}
            {props.clienteSnapshot.codice_sdi && <p className="text-slate-500">SDI: {props.clienteSnapshot.codice_sdi}</p>}
            {props.clienteSnapshot.pec && <p className="text-slate-500">PEC: {props.clienteSnapshot.pec}</p>}
            {props.clienteSnapshot.indirizzo_via && (
              <p className="text-slate-500">
                {[props.clienteSnapshot.indirizzo_via, props.clienteSnapshot.indirizzo_cap, props.clienteSnapshot.indirizzo_comune, props.clienteSnapshot.indirizzo_provincia].filter(Boolean).join(', ')}
              </p>
            )}
          </>
        ) : (
          <p className="text-slate-400 italic">Nessun cliente selezionato</p>
        )}
      </div>

      <div className="h-px bg-slate-200 mb-4" />

      {/* Table */}
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b border-slate-300 text-[10px] uppercase tracking-wider text-slate-500">
            <th className="text-left py-2 font-semibold">Descrizione</th>
            <th className="text-center py-2 font-semibold w-12">Q.tà</th>
            <th className="text-center py-2 font-semibold w-10">U.M.</th>
            <th className="text-right py-2 font-semibold w-20">Prezzo</th>
            {props.righe.some(r => (r.sconto_percentuale || 0) > 0) && (
              <th className="text-center py-2 font-semibold w-12">Sc.%</th>
            )}
            <th className="text-center py-2 font-semibold w-12">IVA</th>
            <th className="text-right py-2 font-semibold w-20">Importo</th>
          </tr>
        </thead>
        <tbody>
          {props.righe.length === 0 && (
            <tr><td colSpan={7} className="py-4 text-center text-slate-400 italic">Nessuna riga inserita</td></tr>
          )}
          {props.righe.map((r, i) => (
            <tr key={r.id || i} className="border-b border-slate-100">
              <td className="py-2 text-slate-700">{r.descrizione || '—'}</td>
              <td className="py-2 text-center text-slate-600">{r.quantita}</td>
              <td className="py-2 text-center text-slate-500">{r.unita_misura}</td>
              <td className="py-2 text-right font-mono text-slate-600">{formatEuro(r.prezzo_unitario)}</td>
              {props.righe.some(r => (r.sconto_percentuale || 0) > 0) && (
                <td className="py-2 text-center text-slate-500">{(r.sconto_percentuale || 0) > 0 ? `${r.sconto_percentuale}%` : ''}</td>
              )}
              <td className="py-2 text-center text-slate-500">{r.natura_iva || `${r.aliquota_iva}%`}</td>
              <td className="py-2 text-right font-mono font-semibold text-slate-800">{formatEuro(r.imponibile)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Riepilogo IVA */}
      {props.totali.riepilogo_iva.length > 0 && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Riepilogo IVA</p>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left py-1 font-semibold">Aliquota</th>
                <th className="text-right py-1 font-semibold">Imponibile</th>
                <th className="text-right py-1 font-semibold">Imposta</th>
              </tr>
            </thead>
            <tbody>
              {props.totali.riepilogo_iva.map((r, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-1">{r.natura ? `${r.natura} — Esente` : `${r.aliquota}%`}</td>
                  <td className="py-1 text-right font-mono">{formatEuro(r.imponibile)}</td>
                  <td className="py-1 text-right font-mono">{formatEuro(r.imposta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-56 space-y-1">
          <div className="flex justify-between text-slate-600"><span>Subtotale</span><span className="font-mono">{formatEuro(props.totali.subtotale)}</span></div>
          {props.totali.sconto_globale > 0 && (
            <div className="flex justify-between text-red-600"><span>Sconto</span><span className="font-mono">-{formatEuro(props.totali.sconto_globale)}</span></div>
          )}
          {props.cassaAttiva && props.totali.cassa_importo > 0 && (
            <div className="flex justify-between text-slate-600"><span>Cassa prev.</span><span className="font-mono">+{formatEuro(props.totali.cassa_importo)}</span></div>
          )}
          <div className="flex justify-between text-slate-600"><span>IVA</span><span className="font-mono">{formatEuro(props.totali.iva_totale)}</span></div>
          {props.bolloVirtuale && (
            <div className="flex justify-between text-slate-600"><span>Bollo</span><span className="font-mono">€ 2,00</span></div>
          )}
          <div className="h-px bg-slate-300 my-1" />
          <div className="flex justify-between text-base font-bold text-sky-700"><span>TOTALE</span><span className="font-mono">{formatEuro(props.totali.totale_documento)}</span></div>
          {props.ritenutaAttiva && props.totali.ritenuta_importo > 0 && (
            <>
              <div className="flex justify-between text-red-600 text-[10px]"><span>Ritenuta ({props.ritenutaAliquota}%)</span><span className="font-mono">-{formatEuro(props.totali.ritenuta_importo)}</span></div>
              <div className="flex justify-between font-semibold text-sky-600"><span>NETTO DA PAGARE</span><span className="font-mono">{formatEuro(props.totali.totale_da_pagare)}</span></div>
            </>
          )}
        </div>
      </div>

      {/* Dati pagamento */}
      {props.metodoPagamento && props.iban && (
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Dati Pagamento</p>
          <p className="text-slate-600">Modalità: {METODI_PAGAMENTO_SDI[props.metodoPagamento]}</p>
          <p className="font-mono text-slate-700">{props.iban}</p>
          {props.intestatarioConto && <p className="text-slate-600">Intestatario: {props.intestatarioConto}</p>}
          {props.nomeBanca && <p className="text-slate-600">Banca: {props.nomeBanca}</p>}
        </div>
      )}

      {/* Regime forfettario */}
      {az.regime_fiscale === 'RF19' && (
        <p className="text-[10px] text-slate-500 italic mb-3">
          Operazione in regime forfettario — non soggetta a IVA ex art. 1, commi 54-89, L. 190/2014
        </p>
      )}

      {/* Notes */}
      {props.noteDocumento && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Note</p>
          <p className="text-slate-600 whitespace-pre-line">{props.noteDocumento}</p>
        </div>
      )}

      {/* DDT Signatures */}
      {props.isDDT && <DDTSignatures />}

      {/* Footer */}
      <div className="h-px bg-slate-200 mt-6 mb-2" />
      <p className="text-center text-[9px] text-slate-400">
        {az.ragione_sociale} — P.IVA {az.partita_iva} — {az.indirizzo_via}, {az.indirizzo_cap} {az.indirizzo_comune}
      </p>
    </div>
  );
}
