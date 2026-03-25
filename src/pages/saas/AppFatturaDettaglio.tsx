import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { ArrowLeft, Download, Mail, Copy, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { FatturaPreview } from '@/components/saas/FatturaPreview';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { mockFatture, getTenantById, mockPratiche } from '@/data/mockDashboardData';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

function fmtCur(n: number) { return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n); }
function fmtDate(d: string) { try { return format(new Date(d), 'dd/MM/yyyy', { locale: it }); } catch { return d; } }

const AppFatturaDettaglio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fattura = mockFatture.find(f => f.id === id);

  if (!fattura) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Fattura non trovata</p>
        <Button variant="ghost" onClick={() => navigate('/app/fatture')} className="mt-4">Torna alle fatture</Button>
      </div>
    );
  }

  const tenant = getTenantById(fattura.tenant_id);
  const daysLeft = Math.ceil((new Date(fattura.data_scadenza).getTime() - Date.now()) / 86400000);
  const praticheCollegate = mockPratiche.filter(p => fattura.pratiche_collegate.includes(p.id));
  const clienteIndirizzo = tenant ? [tenant.indirizzo_via, tenant.indirizzo_cap, tenant.indirizzo_citta, tenant.indirizzo_provincia].filter(Boolean).join(', ') : '';

  const handleCopyIban = () => {
    if (fattura.iban) { navigator.clipboard.writeText(fattura.iban); toast({ title: 'IBAN copiato!' }); }
  };

  const handlePrint = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    const el = document.getElementById('fattura-preview');
    if (!el) return;
    printWin.document.write(`<html><head><title>Fattura ${fattura.numero}</title><style>body{font-family:Inter,sans-serif;padding:40px;color:#1e293b}table{border-collapse:collapse;width:100%}th,td{padding:6px 8px;text-align:left;font-size:11px}th{border-bottom:1px solid #cbd5e1}td{border-bottom:1px solid #f1f5f9}.font-mono{font-family:monospace}</style></head><body>${el.innerHTML}</body></html>`);
    printWin.document.close();
    printWin.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate('/app/fatture')}><ArrowLeft className="h-4 w-4" /></Button>
        <p className="text-xs text-slate-400">Fatture › {fattura.numero}</p>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-xl border p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-slate-900">{fattura.numero}</h1>
            <StatusBadge status={fattura.stato as any} />
          </div>
          <p className="text-sm text-slate-500">Emessa il {fmtDate(fattura.data_emissione)}</p>
        </div>
        <p className="text-3xl font-bold font-mono text-sky-600">{fmtCur(fattura.totale)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6">
          <FatturaPreview
            numero={fattura.numero}
            dataEmissione={fattura.data_emissione}
            dataScadenza={fattura.data_scadenza}
            clienteNome={tenant?.ragione_sociale ?? ''}
            clientePiva={tenant?.partita_iva ?? ''}
            clienteCf={tenant?.codice_fiscale}
            clienteSdi={tenant?.codice_sdi}
            clientePec={tenant?.pec}
            clienteIndirizzo={clienteIndirizzo}
            righe={fattura.righe}
            scontoTipo={fattura.sconto_tipo}
            scontoValore={fattura.sconto_valore}
            modalitaPagamento={fattura.modalita_pagamento}
            iban={fattura.iban}
            intestatarioConto={fattura.intestatario_conto}
            banca={fattura.banca}
            mostraIban={fattura.mostra_iban}
            regimeFiscale={fattura.regime_fiscale}
            note={fattura.note}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment status */}
          {fattura.stato === 'pagata' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-800">PAGATA</p>
                <p className="text-xs text-emerald-600">il {fmtDate(fattura.pagato_at ?? '')}</p>
              </div>
            </div>
          )}
          {fattura.stato === 'scaduta' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">SCADUTA</p>
                <p className="text-xs text-red-600">Contatta support@impresaleggera.it</p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-white rounded-xl border p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">Scadenza:</span>
              <span className={`font-semibold ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 7 ? 'text-amber-600' : 'text-slate-700'}`}>
                {fmtDate(fattura.data_scadenza)}
                {fattura.stato === 'inviata' && ` (${daysLeft > 0 ? `tra ${daysLeft} gg` : 'scaduta'})`}
              </span>
            </div>
            {fattura.iban && (
              <div>
                <p className="text-xs text-slate-400 mb-1">IBAN</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-slate-700 bg-slate-50 rounded px-2 py-1 flex-1 truncate">{fattura.iban}</code>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopyIban}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full bg-sky-500 hover:bg-sky-600" onClick={handlePrint}>
              <Download className="h-4 w-4 mr-2" /> Scarica PDF
            </Button>
            <Button variant="outline" className="w-full" onClick={() => toast({ title: 'Email inviata' })}>
              <Mail className="h-4 w-4 mr-2" /> Invia per email
            </Button>
          </div>

          {/* Pratiche collegate */}
          {praticheCollegate.length > 0 && (
            <div className="bg-white rounded-xl border p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pratiche Collegate</p>
              <div className="space-y-2">
                {praticheCollegate.map(p => (
                  <button key={p.id} onClick={() => navigate(`/app/pratiche/${p.id}`)} className="flex items-center justify-between w-full text-left text-sm hover:bg-slate-50 rounded-lg p-2 transition-colors">
                    <div>
                      <p className="font-mono text-xs text-slate-500">{p.codice}</p>
                      <p className="text-slate-700">{p.titolo}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppFatturaDettaglio;
