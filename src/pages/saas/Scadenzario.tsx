import { useState, useMemo } from 'react';
import { Clock, AlertCircle, TrendingUp, Banknote } from 'lucide-react';
import { StatCard } from '@/components/saas/StatCard';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { Button } from '@/components/ui/button';
import { RegistraIncassoPanel } from '@/components/saas/RegistraIncassoPanel';
import { mockDocumentiFiscali } from '@/data/mockDashboardData';
import type { DocumentoFiscale } from '@/types/fatturazione';

const fmtCur = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
const fmtDate = (d: string) => { try { return new Date(d).toLocaleDateString('it-IT'); } catch { return d; } };

const Scadenzario = () => {
  const [incassoOpen, setIncassoOpen] = useState(false);
  const [incassoFattura, setIncassoFattura] = useState<DocumentoFiscale | null>(null);

  const daIncassare = useMemo(() =>
    mockDocumentiFiscali.filter(f =>
      f.tipo === 'fattura' && f.data_scadenza && ['inviata_sdi', 'consegnata', 'bozza'].includes(f.stato) && (f.importo_pagato ?? 0) < f.totale_da_pagare
    ).sort((a, b) => (a.data_scadenza ?? '').localeCompare(b.data_scadenza ?? ''))
  , []);

  const now = Date.now();
  const getUrgency = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - now) / 86400000);
    if (diff < 0) return 'scaduta';
    if (diff <= 7) return 'urgente';
    return 'futuro';
  };

  const totDaIncassare = daIncassare.reduce((s, f) => s + f.totale_da_pagare - (f.importo_pagato ?? 0), 0);
  const totScaduto = daIncassare.filter(f => f.data_scadenza && getUrgency(f.data_scadenza) === 'scaduta').reduce((s, f) => s + f.totale_da_pagare - (f.importo_pagato ?? 0), 0);
  const incassatoMese = mockDocumentiFiscali.filter(f => f.stato === 'pagata' && f.pagato_at && new Date(f.pagato_at).getMonth() === new Date().getMonth()).reduce((s, f) => s + (f.importo_pagato ?? 0), 0);

  const openIncasso = (f: DocumentoFiscale) => { setIncassoFattura(f); setIncassoOpen(true); };

  const urgencyStyles: Record<string, string> = {
    scaduta: 'border-l-4 border-l-red-400 bg-red-50/50',
    urgente: 'border-l-4 border-l-amber-400 bg-amber-50/50',
    futuro: 'border-l-4 border-l-slate-200 bg-background',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <p className="text-xs text-muted-foreground font-medium">Impresa Leggera › Scadenzario</p>
        <h1 className="text-2xl font-bold text-foreground">Scadenzario</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Da incassare" value={fmtCur(totDaIncassare)} icon={Clock} />
        <StatCard label="Scaduto" value={fmtCur(totScaduto)} icon={AlertCircle} />
        <StatCard label="Incassato questo mese" value={fmtCur(incassatoMese)} icon={TrendingUp} />
      </div>

      <div className="space-y-2">
        {daIncassare.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Banknote className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nessuna fattura in scadenza</p>
          </div>
        ) : (
          daIncassare.map(f => {
            const urg = f.data_scadenza ? getUrgency(f.data_scadenza) : 'futuro';
            const diff = f.data_scadenza ? Math.ceil((new Date(f.data_scadenza).getTime() - now) / 86400000) : 0;
            const residuo = f.totale_da_pagare - (f.importo_pagato ?? 0);
            return (
              <div key={f.id} className={`rounded-lg p-4 flex items-center gap-4 ${urgencyStyles[urg]}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground">{f.numero}</span>
                    <StatusBadge status={f.stato as any} />
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{f.cliente_snapshot.ragione_sociale}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">Scadenza: {fmtDate(f.data_scadenza ?? '')}</p>
                  <p className={`text-xs font-semibold ${urg === 'scaduta' ? 'text-red-600' : urg === 'urgente' ? 'text-amber-600' : 'text-muted-foreground'}`}>
                    {diff < 0 ? `${Math.abs(diff)} gg scaduta` : diff === 0 ? 'Oggi' : `tra ${diff} gg`}
                  </p>
                </div>
                <div className="text-right shrink-0 w-28">
                  <p className="font-mono font-bold text-sm">{fmtCur(residuo)}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs h-8" onClick={() => openIncasso(f)}>
                  Registra incasso
                </Button>
              </div>
            );
          })
        )}
      </div>

      <RegistraIncassoPanel open={incassoOpen} onOpenChange={setIncassoOpen} fattura={incassoFattura} />
    </div>
  );
};

export default Scadenzario;
