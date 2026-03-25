import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Coins, ArrowUpCircle, ArrowDownCircle, TrendingUp, AlertTriangle,
  CreditCard, Receipt, FileText, Phone, Headphones, ShieldCheck, Zap,
  ChevronRight, Clock, Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// ── Listino prezzi per servizio ──
const LISTINO = [
  { id: 'fattura', label: 'Creazione Fattura', costo: 5, icon: Receipt, color: 'sky' as const },
  { id: 'enea', label: 'Pratica ENEA', costo: 25, icon: FileText, color: 'emerald' as const },
  { id: 'call_center', label: 'Call Center (per ora)', costo: 15, icon: Phone, color: 'violet' as const },
  { id: 'segreteria', label: 'Segreteria Virtuale (giorno)', costo: 20, icon: Headphones, color: 'amber' as const },
  { id: 'recupero', label: 'Recupero Crediti', costo: 35, icon: ShieldCheck, color: 'red' as const },
  { id: 'altro', label: 'Pratica Generica', costo: 10, icon: Zap, color: 'slate' as const },
];

const colorMap = {
  sky: 'bg-sky-50 text-sky-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-500',
  slate: 'bg-slate-100 text-slate-600',
};

// ── Mock transazioni ──
interface CreditTransaction {
  id: string;
  tipo: 'ricarica' | 'consumo' | 'bonus' | 'rimborso';
  descrizione: string;
  importo: number;
  saldo_dopo: number;
  data: string;
  riferimento?: string;
}

const mockTransazioni: CreditTransaction[] = [
  { id: 'tx1', tipo: 'ricarica', descrizione: 'Ricarica crediti — Carta di credito', importo: 200, saldo_dopo: 242, data: '2026-03-10T14:30:00', riferimento: 'PAY-2026-0042' },
  { id: 'tx2', tipo: 'consumo', descrizione: 'Pratica ENEA — PRA-2026-0018', importo: -25, saldo_dopo: 42, data: '2026-03-09T10:15:00', riferimento: 'PRA-2026-0018' },
  { id: 'tx3', tipo: 'consumo', descrizione: 'Creazione Fattura FT-2026/012', importo: -5, saldo_dopo: 67, data: '2026-03-08T16:45:00', riferimento: 'FT-2026/012' },
  { id: 'tx4', tipo: 'consumo', descrizione: 'Segreteria Virtuale — 1 giornata', importo: -20, saldo_dopo: 72, data: '2026-03-07T09:00:00' },
  { id: 'tx5', tipo: 'bonus', descrizione: 'Bonus benvenuto primo mese', importo: 50, saldo_dopo: 92, data: '2026-03-01T00:00:00' },
  { id: 'tx6', tipo: 'ricarica', descrizione: 'Ricarica crediti — Bonifico SEPA', importo: 500, saldo_dopo: 542, data: '2026-02-15T11:20:00', riferimento: 'PAY-2026-0031' },
  { id: 'tx7', tipo: 'consumo', descrizione: 'Recupero Crediti — PRA-2026-0009', importo: -35, saldo_dopo: 42, data: '2026-02-12T14:00:00', riferimento: 'PRA-2026-0009' },
  { id: 'tx8', tipo: 'rimborso', descrizione: 'Rimborso pratica annullata PRA-2026-0005', importo: 10, saldo_dopo: 77, data: '2026-02-10T09:30:00', riferimento: 'PRA-2026-0005' },
];

// ── Pacchetti ricarica ──
const PACCHETTI = [
  { crediti: 100, prezzo: 100, label: 'Starter', popolare: false },
  { crediti: 250, prezzo: 225, label: 'Business', popolare: true, sconto: 10 },
  { crediti: 500, prezzo: 400, label: 'Pro', popolare: false, sconto: 20 },
];

const tipoColors: Record<string, { bg: string; text: string; icon: typeof ArrowUpCircle }> = {
  ricarica: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: ArrowUpCircle },
  consumo: { bg: 'bg-red-50', text: 'text-red-500', icon: ArrowDownCircle },
  bonus: { bg: 'bg-violet-50', text: 'text-violet-600', icon: TrendingUp },
  rimborso: { bg: 'bg-sky-50', text: 'text-sky-600', icon: ArrowUpCircle },
};

const AppCrediti = () => {
  const { tenant } = useAuth();
  const crediti = tenant?.crediti_residui ?? 42;
  const creditiTotali = 500;
  const [filterTipo, setFilterTipo] = useState<string>('all');

  const { ref: visRef, isVisible } = useScrollAnimation(0.3);
  const animatedCrediti = useCounterAnimation(crediti, isVisible, 1200);

  const isLow = crediti < 50;
  const isCritical = crediti < 10;
  const percentUsed = Math.round(((creditiTotali - crediti) / creditiTotali) * 100);

  const filteredTx = mockTransazioni.filter(tx => filterTipo === 'all' || tx.tipo === filterTipo);

  return (
    <div className="space-y-6" ref={visRef as React.RefObject<HTMLDivElement>}>
      {/* Alert soglia bassa */}
      {isLow && (
        <div className={cn(
          'flex items-center gap-4 rounded-xl border p-4 animate-[fadeUp_0.4s_ease-out_forwards]',
          isCritical ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        )}>
          <AlertTriangle className={cn('h-6 w-6 shrink-0', isCritical ? 'text-red-500' : 'text-amber-500')} />
          <div className="flex-1">
            <p className={cn('text-sm font-semibold', isCritical ? 'text-red-800' : 'text-amber-800')}>
              {isCritical ? 'Crediti quasi esauriti!' : 'Crediti in esaurimento'}
            </p>
            <p className={cn('text-xs mt-0.5', isCritical ? 'text-red-600' : 'text-amber-600')}>
              {isCritical
                ? 'I tuoi servizi verranno sospesi quando i crediti raggiungono €0. Ricarica subito.'
                : `Hai ancora €${crediti} di crediti. Ricarica per continuare senza interruzioni.`}
            </p>
          </div>
          <Button size="sm" variant={isCritical ? 'destructive' : 'default'} className="shrink-0">
            Ricarica ora
          </Button>
        </div>
      )}

      {/* Row 1 — Saldo + Pacchetti */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Saldo card */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">Saldo Crediti</h3>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50">
              <Coins className="h-5 w-5 text-sky-600" />
            </div>
          </div>
          <p className="text-4xl font-bold font-subtitle text-slate-900 mb-1">
            € {animatedCrediti.toLocaleString('it-IT')}
          </p>
          <p className="text-xs text-slate-500 mb-4">su €{creditiTotali} totali caricati</p>
          <Progress value={percentUsed} className="h-2 mb-2" />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Usati: €{creditiTotali - crediti}</span>
            <span>Disponibili: €{crediti}</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-slate-800">{mockTransazioni.filter(t => t.tipo === 'consumo').length}</p>
              <p className="text-xs text-slate-500">Transazioni mese</p>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800">€{Math.abs(mockTransazioni.filter(t => t.tipo === 'consumo').reduce((a, t) => a + t.importo, 0))}</p>
              <p className="text-xs text-slate-500">Speso questo mese</p>
            </div>
          </div>
        </div>

        {/* Pacchetti ricarica */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '100ms' }}>
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Ricarica Crediti</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PACCHETTI.map((p) => (
              <div key={p.label} className={cn(
                'relative rounded-xl border p-4 text-center transition-all hover:shadow-md cursor-pointer',
                p.popolare ? 'border-sky-300 bg-sky-50/30 ring-1 ring-sky-200' : 'border-slate-200 hover:border-slate-300'
              )}>
                {p.popolare && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Più scelto
                  </span>
                )}
                <p className="text-lg font-bold text-slate-800 mt-1">€{p.crediti}</p>
                <p className="text-xs text-slate-500 mb-3">{p.label}</p>
                <p className="text-2xl font-bold font-subtitle text-slate-900">€{p.prezzo}</p>
                {p.sconto && <p className="text-xs text-emerald-600 font-medium mt-1">Risparmi {p.sconto}%</p>}
                <Button size="sm" variant={p.popolare ? 'default' : 'outline'} className="w-full mt-3 gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" /> Acquista
                </Button>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 text-center">
            Pagamento sicuro con carta, SEPA o bonifico. Fattura generata automaticamente.
          </p>
        </div>
      </div>

      {/* Row 2 — Listino prezzi */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-6 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '200ms' }}>
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Listino Prezzi per Servizio</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {LISTINO.map((item) => (
            <div key={item.id} className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 p-4 text-center hover:border-slate-200 transition-colors">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorMap[item.color])}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-slate-700 leading-tight">{item.label}</span>
              <span className="text-lg font-bold text-slate-900">€{item.costo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 — Storico transazioni */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">Storico Transazioni</h3>
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'Tutte' },
              { key: 'ricarica', label: 'Ricariche' },
              { key: 'consumo', label: 'Consumi' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterTipo(f.key)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  filterTipo === f.key ? 'bg-sky-100 text-sky-700' : 'text-slate-400 hover:text-slate-600'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {filteredTx.map((tx) => {
            const style = tipoColors[tx.tipo];
            const IconComp = style.icon;
            return (
              <div key={tx.id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', style.bg)}>
                  <IconComp className={cn('h-4 w-4', style.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{tx.descrizione}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{new Date(tx.data).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    {tx.riferimento && <code className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1 rounded">{tx.riferimento}</code>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn('text-sm font-bold', tx.importo > 0 ? 'text-emerald-600' : 'text-red-500')}>
                    {tx.importo > 0 ? '+' : ''}€{Math.abs(tx.importo)}
                  </p>
                  <p className="text-[10px] text-slate-400">Saldo: €{tx.saldo_dopo}</p>
                </div>
              </div>
            );
          })}
        </div>
        {filteredTx.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-400">Nessuna transazione trovata</div>
        )}
      </div>
    </div>
  );
};

export default AppCrediti;
