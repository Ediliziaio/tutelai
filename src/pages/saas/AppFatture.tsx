import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Download, FileText, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { EmptyState } from '@/components/saas/EmptyState';
import { mockFatture } from '@/data/mockDashboardData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

function fmtCur(n: number) { return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n); }
function fmtDate(d: string) { try { return format(new Date(d), 'dd/MM/yyyy', { locale: it }); } catch { return d; } }

const AppFatture = () => {
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const [tab, setTab] = useState('tutte');

  const fatture = useMemo(() => {
    let list = mockFatture.filter(f => f.tenant_id === (tenant?.id ?? 't1'));
    if (tab === 'da_pagare') list = list.filter(f => f.stato === 'inviata');
    if (tab === 'pagate') list = list.filter(f => f.stato === 'pagata');
    if (tab === 'scadute') list = list.filter(f => f.stato === 'scaduta');
    return list.sort((a, b) => b.data_emissione.localeCompare(a.data_emissione));
  }, [tab, tenant]);

  const allTenantFatture = mockFatture.filter(f => f.tenant_id === (tenant?.id ?? 't1'));
  const totPagato = allTenantFatture.filter(f => f.stato === 'pagata').reduce((s, f) => s + f.totale, 0);
  const totInAttesa = allTenantFatture.filter(f => f.stato === 'inviata').reduce((s, f) => s + f.totale, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Le mie Fatture</h1>
        <p className="text-sm text-slate-500 mt-1">Storico fatture e pagamenti</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="tutte">Tutte ({allTenantFatture.length})</TabsTrigger>
          <TabsTrigger value="da_pagare">Da Pagare ({allTenantFatture.filter(f => f.stato === 'inviata').length})</TabsTrigger>
          <TabsTrigger value="pagate">Pagate ({allTenantFatture.filter(f => f.stato === 'pagata').length})</TabsTrigger>
          <TabsTrigger value="scadute">Scadute ({allTenantFatture.filter(f => f.stato === 'scaduta').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {fatture.length === 0 ? (
        <EmptyState title="Nessuna fattura" description="Non ci sono fatture per questa categoria." icon={<FileText className="h-10 w-10 text-slate-300" />} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Numero</th>
                  <th className="px-3 py-3 text-left">Data</th>
                  <th className="px-3 py-3 text-left">Descrizione</th>
                  <th className="px-3 py-3 text-right">Importo</th>
                  <th className="px-3 py-3 text-left">Scadenza</th>
                  <th className="px-3 py-3 text-center">Stato</th>
                  <th className="px-3 py-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {fatture.map(f => {
                  const isScaduta = f.stato === 'scaduta';
                  const daysLeft = Math.ceil((new Date(f.data_scadenza).getTime() - Date.now()) / 86400000);
                  return (
                    <tr key={f.id} className="border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors" onClick={() => navigate(`/app/fatture/${f.id}`)}>
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{f.numero}</td>
                      <td className="px-3 py-3 text-slate-600 text-xs">{fmtDate(f.data_emissione)}</td>
                      <td className="px-3 py-3 text-slate-700 text-xs max-w-[200px] truncate">{f.righe.map(r => r.descrizione).join(', ')}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">{fmtCur(f.totale)}</td>
                      <td className={`px-3 py-3 text-xs ${isScaduta ? 'text-red-600 font-semibold' : daysLeft <= 7 && f.stato === 'inviata' ? 'text-amber-600' : 'text-slate-600'}`}>
                        {fmtDate(f.data_scadenza)}
                      </td>
                      <td className="px-3 py-3 text-center"><StatusBadge status={f.stato as any} /></td>
                      <td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-end gap-1">
                          {f.stato === 'bozza' && <Button variant="ghost" size="sm" onClick={() => navigate(`/app/fatture/${f.id}`)}><Eye className="h-3.5 w-3.5" /></Button>}
                          {(f.stato === 'inviata' || f.stato === 'pagata' || f.stato === 'scaduta') && (
                            <Button variant="ghost" size="sm" onClick={() => toast({ title: 'PDF scaricato' })}><Download className="h-3.5 w-3.5" /></Button>
                          )}
                          {f.stato === 'pagata' && <CheckCircle className="h-4 w-4 text-emerald-500 mt-1.5" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span className="text-slate-500">Totale pagato quest'anno:</span>
          <span className="font-bold font-mono text-slate-900">{fmtCur(totPagato)}</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="text-slate-500">In attesa di pagamento:</span>
          <span className="font-bold font-mono text-slate-900">{fmtCur(totInAttesa)}</span>
        </div>
      </div>
    </div>
  );
};

export default AppFatture;
