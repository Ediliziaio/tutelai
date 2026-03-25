import type { RigaFattura, ModalitaPagamento, RegimeFiscale, ScontoTipo } from '@/types/auth';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface FatturaPreviewProps {
  numero: string;
  dataEmissione: string;
  dataScadenza: string;
  clienteNome: string;
  clientePiva: string;
  clienteCf?: string;
  clienteSdi?: string;
  clientePec?: string;
  clienteIndirizzo?: string;
  righe: RigaFattura[];
  scontoTipo: ScontoTipo;
  scontoValore: number;
  modalitaPagamento: ModalitaPagamento;
  iban?: string;
  intestatarioConto?: string;
  banca?: string;
  mostraIban: boolean;
  regimeFiscale: RegimeFiscale;
  note?: string;
  stato?: string;
  className?: string;
}

const modalitaLabels: Record<ModalitaPagamento, string> = {
  bonifico: 'Bonifico Bancario',
  rimessa_diretta: 'Rimessa Diretta',
  rid: 'RID',
  assegno: 'Assegno',
  contanti: 'Contanti',
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
}

function formatDate(d: string) {
  if (!d) return '—';
  try { return format(new Date(d), 'dd/MM/yyyy', { locale: it }); } catch { return d; }
}

export const FatturaPreview = (props: FatturaPreviewProps) => {
  const subtotale = props.righe.reduce((s, r) => s + r.quantita * r.prezzo_unitario, 0);
  let scontoAmount = 0;
  if (props.scontoTipo === 'percentuale') scontoAmount = subtotale * (props.scontoValore / 100);
  else if (props.scontoTipo === 'fisso') scontoAmount = props.scontoValore;
  const imponibile = subtotale - scontoAmount;
  const ivaAmount = props.regimeFiscale === 'forfettario' ? 0 : props.righe.reduce((s, r) => {
    const lineTotal = r.quantita * r.prezzo_unitario;
    return s + lineTotal * (r.iva_percentuale / 100);
  }, 0) * (1 - scontoAmount / (subtotale || 1));
  const totale = imponibile + ivaAmount;

  return (
    <div className={`bg-white text-slate-800 text-[11px] leading-relaxed print:text-[10px] ${props.className ?? ''}`} id="fattura-preview">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-base font-bold font-subtitle text-sky-600">Impresa Leggera S.r.l.</p>
          <p className="text-slate-500 mt-1">Via Esempio 1 — 20100 Milano</p>
          <p className="text-slate-500">P.IVA: 12345678901</p>
          <p className="text-slate-500">PEC: info@pec.impresaleggera.it</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-subtitle text-slate-900">FATTURA</p>
          <p className="font-mono text-sm font-semibold text-slate-700 mt-1">{props.numero || '—'}</p>
          <p className="text-slate-500 mt-2">Data: {formatDate(props.dataEmissione)}</p>
          <p className="text-slate-500">Scadenza: {formatDate(props.dataScadenza)}</p>
        </div>
      </div>

      <div className="h-px bg-slate-200 mb-4" />

      {/* Client */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Destinatario</p>
        <p className="font-semibold text-sm text-slate-900">{props.clienteNome || 'Nome cliente'}</p>
        {props.clientePiva && <p className="text-slate-500">P.IVA: {props.clientePiva}</p>}
        {props.clienteCf && props.clienteCf !== props.clientePiva && <p className="text-slate-500">C.F.: {props.clienteCf}</p>}
        {props.clienteSdi && <p className="text-slate-500">SDI: {props.clienteSdi}</p>}
        {props.clientePec && <p className="text-slate-500">PEC: {props.clientePec}</p>}
        {props.clienteIndirizzo && <p className="text-slate-500">{props.clienteIndirizzo}</p>}
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
            <th className="text-center py-2 font-semibold w-12">IVA</th>
            <th className="text-right py-2 font-semibold w-20">Importo</th>
          </tr>
        </thead>
        <tbody>
          {props.righe.length === 0 && (
            <tr><td colSpan={6} className="py-4 text-center text-slate-400 italic">Nessuna riga inserita</td></tr>
          )}
          {props.righe.map((r, i) => (
            <tr key={r.id || i} className="border-b border-slate-100">
              <td className="py-2 text-slate-700">{r.descrizione || '—'}</td>
              <td className="py-2 text-center text-slate-600">{r.quantita}</td>
              <td className="py-2 text-center text-slate-500">{r.unita_misura}</td>
              <td className="py-2 text-right font-mono text-slate-600">{formatCurrency(r.prezzo_unitario)}</td>
              <td className="py-2 text-center text-slate-500">{r.iva_percentuale}%</td>
              <td className="py-2 text-right font-mono font-semibold text-slate-800">{formatCurrency(r.quantita * r.prezzo_unitario)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-56 space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Subtotale</span>
            <span className="font-mono">{formatCurrency(subtotale)}</span>
          </div>
          {scontoAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Sconto {props.scontoTipo === 'percentuale' ? `${props.scontoValore}%` : ''}</span>
              <span className="font-mono">-{formatCurrency(scontoAmount)}</span>
            </div>
          )}
          {props.regimeFiscale !== 'forfettario' && (
            <div className="flex justify-between text-slate-600">
              <span>IVA</span>
              <span className="font-mono">{formatCurrency(ivaAmount)}</span>
            </div>
          )}
          <div className="h-px bg-slate-300 my-1" />
          <div className="flex justify-between text-base font-bold text-sky-700">
            <span>TOTALE</span>
            <span className="font-mono">{formatCurrency(totale)}</span>
          </div>
        </div>
      </div>

      {/* Payment info */}
      {props.mostraIban && props.iban && (
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Dati Pagamento</p>
          <p className="text-slate-600">Modalità: {modalitaLabels[props.modalitaPagamento]}</p>
          <p className="font-mono text-slate-700">{props.iban}</p>
          {props.intestatarioConto && <p className="text-slate-600">Intestatario: {props.intestatarioConto}</p>}
          {props.banca && <p className="text-slate-600">Banca: {props.banca}</p>}
        </div>
      )}

      {/* Regime forfettario notice */}
      {props.regimeFiscale === 'forfettario' && (
        <p className="text-[10px] text-slate-500 italic mb-3">
          Operazione in regime forfettario — non soggetta a IVA ex art. 1, commi 54-89, L. 190/2014
        </p>
      )}

      {/* Notes */}
      {props.note && (
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Note</p>
          <p className="text-slate-600 whitespace-pre-line">{props.note}</p>
        </div>
      )}

      {/* Footer */}
      <div className="h-px bg-slate-200 mt-6 mb-2" />
      <p className="text-center text-[9px] text-slate-400">
        Impresa Leggera S.r.l. — P.IVA 12345678901 — Via Esempio 1, 20100 Milano
      </p>
    </div>
  );
};
