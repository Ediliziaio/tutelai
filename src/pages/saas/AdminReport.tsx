import { useState, useMemo, useCallback } from 'react';
import { mockPratiche, mockTenants, mockFatture, mockOperatori, mockFatturatoMensile, mockPratichePerTipo, mockDocumentiFiscali } from '@/data/mockDashboardData';
import { StatCard } from '@/components/saas/StatCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import {
  TrendingUp, TrendingDown, Clock, Users, FileText, Download, BarChart3, Target,
  AlertCircle, CheckCircle2, Banknote, Receipt, Activity, Flame, UserMinus,
  ArrowUpRight, ArrowDownRight, CalendarDays,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line, ComposedChart,
} from 'recharts';

// ── Helpers ──
const formatEur = (v: number) => `€ ${v.toLocaleString('it-IT', { minimumFractionDigits: 0 })}`;
const fmtK = (v: number) => `€${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}k`;

// ── Mock MRR data (12 months) ──
const MESI = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const mrrData = MESI.map((mese, i) => {
  const base = 8500 + i * 720 + Math.round(Math.random() * 800);
  const newMrr = 400 + Math.round(Math.random() * 600);
  const churnMrr = 100 + Math.round(Math.random() * 300);
  return { mese, mrr: base, new_mrr: newMrr, churn_mrr: churnMrr, net: base + newMrr - churnMrr };
});

// ── Churn data ──
const churnMonthly = MESI.map((mese, i) => ({
  mese,
  rate: +(2.5 + Math.sin(i) * 1.2 + Math.random() * 0.5).toFixed(1),
  clienti_persi: Math.floor(Math.random() * 3),
  clienti_totali: 8 + i,
}));

// ── Activity heatmap (7x24 grid) ──
const GIORNI = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
const heatmapData = GIORNI.map(giorno =>
  Array.from({ length: 24 }, (_, ora) => {
    const isWeekend = giorno === 'Sab' || giorno === 'Dom';
    const isWork = ora >= 8 && ora <= 18;
    const base = isWeekend ? 0.1 : isWork ? 0.5 : 0.15;
    return { giorno, ora, intensity: +(base + Math.random() * (isWork && !isWeekend ? 0.5 : 0.2)).toFixed(2) };
  })
);

// ── Revenue per service ──
const revenuePerServizio = [
  { servizio: 'Pratiche ENEA', revenue: 12400, count: 34 },
  { servizio: 'Catasto', revenue: 8900, count: 22 },
  { servizio: 'APE', revenue: 6200, count: 18 },
  { servizio: 'Visure', revenue: 4100, count: 45 },
  { servizio: 'CILA/SCIA', revenue: 3800, count: 12 },
  { servizio: 'Altro', revenue: 2100, count: 15 },
].sort((a, b) => b.revenue - a.revenue);

// ── Cohort retention ──
const cohortData = [
  { coorte: 'Gen 25', m0: 100, m1: 88, m2: 82, m3: 78, m4: 75, m5: 73 },
  { coorte: 'Feb 25', m0: 100, m1: 90, m2: 85, m3: 80, m4: 77 },
  { coorte: 'Mar 25', m0: 100, m1: 92, m2: 87, m3: 83 },
  { coorte: 'Apr 25', m0: 100, m1: 85, m2: 80 },
  { coorte: 'Mag 25', m0: 100, m1: 91 },
  { coorte: 'Giu 25', m0: 100 },
];

const AdminReport = () => {
  const [periodo, setPeriodo] = useState('anno');
  const [tab, setTab] = useState('overview');

  // ── Enterprise fatturazione KPIs ──
  const docFiscali = mockDocumentiFiscali;
  const fatture = docFiscali.filter(d => d.tipo === 'fattura');
  const noteCredito = docFiscali.filter(d => d.tipo === 'nota_credito');

  const fatturatoDocs = fatture.reduce((s, d) => s + d.totale_documento, 0);
  const incassatoDocs = fatture.filter(d => d.stato === 'pagata').reduce((s, d) => s + d.totale_documento, 0);
  const daIncassare = fatture.filter(d => ['inviata_sdi', 'consegnata', 'bozza'].includes(d.stato) && d.stato !== 'pagata').reduce((s, d) => s + d.totale_da_pagare, 0);
  const totaleNC = noteCredito.reduce((s, d) => s + d.totale_documento, 0);

  const ivaDebito = fatture.reduce((s, d) => s + d.iva_totale, 0);
  const saldoIVA = ivaDebito;

  // Distribuzione per tipo documento
  const tipiDistribuzione = useMemo(() => {
    const map = new Map<string, number>();
    docFiscali.forEach(d => {
      const label = d.tipo === 'fattura' ? 'Fatture' : d.tipo === 'nota_credito' ? 'Note Credito' : d.tipo === 'proforma' ? 'Pro-forma' : 'Altro';
      map.set(label, (map.get(label) || 0) + 1);
    });
    const colors = ['hsl(200, 80%, 50%)', 'hsl(35, 90%, 55%)', 'hsl(150, 60%, 45%)', 'hsl(270, 60%, 55%)'];
    return Array.from(map.entries()).map(([tipo, count], i) => ({ tipo, count, colore: colors[i % colors.length] }));
  }, []);

  const fatturatoPerCliente = useMemo(() => {
    const map = new Map<string, number>();
    fatture.forEach(d => {
      const nome = d.cliente_snapshot.ragione_sociale;
      map.set(nome, (map.get(nome) || 0) + d.totale_documento);
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cliente, totale]) => ({ cliente: cliente.length > 20 ? cliente.slice(0, 20) + '…' : cliente, totale }));
  }, []);

  // Legacy KPIs
  const fatturatoTotale = mockFatture.filter(f => f.stato === 'pagata').reduce((s, f) => s + f.totale, 0);
  const praticheCompletate = mockPratiche.filter(p => p.stato === 'completata').length;
  const praticheAperte = mockPratiche.filter(p => ['in_attesa', 'in_corso', 'in_revisione'].includes(p.stato)).length;
  const clientiAttivi = mockTenants.filter(t => t.stato === 'attivo').length;
  const tempoMedio = mockOperatori.reduce((s, o) => s + o.tempo_medio_giorni, 0) / mockOperatori.length;

  const operatoriPerformance = mockOperatori.map(o => ({
    nome: o.nome.split(' ')[0],
    completate: o.pratiche_completate,
    target: o.pratiche_target,
    rating: o.rating,
  }));

  const pratichePerStato = useMemo(() => [
    { stato: 'In Attesa', count: mockPratiche.filter(p => p.stato === 'in_attesa').length, colore: '#f59e0b' },
    { stato: 'In Corso', count: mockPratiche.filter(p => p.stato === 'in_corso').length, colore: '#0ea5e9' },
    { stato: 'Completate', count: mockPratiche.filter(p => p.stato === 'completata').length, colore: '#10b981' },
    { stato: 'Scadute', count: mockPratiche.filter(p => p.stato === 'scaduta').length, colore: '#ef4444' },
  ], []);

  const clientiPerPiano = useMemo(() => [
    { piano: 'Enterprise', count: mockTenants.filter(t => t.piano === 'enterprise').length, colore: '#8b5cf6' },
    { piano: 'Professionale', count: mockTenants.filter(t => t.piano === 'professionale').length, colore: '#0ea5e9' },
    { piano: 'Starter', count: mockTenants.filter(t => t.piano === 'starter').length, colore: '#10b981' },
  ], []);

  // ── MRR KPIs ──
  const currentMRR = mrrData[mrrData.length - 1].net;
  const prevMRR = mrrData[mrrData.length - 2].net;
  const mrrGrowth = ((currentMRR - prevMRR) / prevMRR * 100).toFixed(1);
  const avgChurn = (churnMonthly.reduce((s, c) => s + c.rate, 0) / churnMonthly.length).toFixed(1);
  const ltv = Math.round(currentMRR / (parseFloat(avgChurn) / 100));
  const arpu = Math.round(currentMRR / clientiAttivi);

  // ── Export ──
  const handleExport = useCallback((format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const headers = 'Mese,MRR,New MRR,Churn MRR,Net\n';
      const rows = mrrData.map(r => `${r.mese},${r.mrr},${r.new_mrr},${r.churn_mrr},${r.net}`).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-analytics-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: '✓ Export CSV completato', description: 'Il file è stato scaricato.' });
    } else {
      toast({ title: 'Export PDF', description: 'La funzione di export PDF sarà disponibile a breve.' });
    }
  }, []);

  const getHeatColor = (intensity: number) => {
    if (intensity < 0.2) return 'bg-slate-100';
    if (intensity < 0.4) return 'bg-sky-100';
    if (intensity < 0.6) return 'bg-sky-300';
    if (intensity < 0.8) return 'bg-sky-500';
    return 'bg-sky-700';
  };

  const getCohortColor = (val: number) => {
    if (val >= 90) return 'bg-emerald-100 text-emerald-800';
    if (val >= 80) return 'bg-emerald-50 text-emerald-700';
    if (val >= 70) return 'bg-amber-50 text-amber-700';
    return 'bg-red-50 text-red-700';
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-subtitle text-slate-900">Report & Analytics</h1>
          <p className="text-sm text-slate-500">Panoramica completa delle performance aziendali</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mese">Questo mese</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="anno">Anno corrente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => handleExport('pdf')}>
            <FileText className="h-4 w-4" /> PDF
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="overview" className="gap-1.5"><BarChart3 className="h-3.5 w-3.5" /> Overview</TabsTrigger>
          <TabsTrigger value="revenue" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> Revenue</TabsTrigger>
          <TabsTrigger value="churn" className="gap-1.5"><UserMinus className="h-3.5 w-3.5" /> Churn</TabsTrigger>
          <TabsTrigger value="activity" className="gap-1.5"><Activity className="h-3.5 w-3.5" /> Attività</TabsTrigger>
        </TabsList>

        {/* ═══════ OVERVIEW TAB ═══════ */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Top-level SaaS KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="MRR" value={formatEur(currentMRR)} icon={TrendingUp} trend={{ value: +parseFloat(mrrGrowth), label: 'vs mese prec.' }} />
            <StatCard label="ARPU" value={formatEur(arpu)} icon={Banknote} />
            <StatCard label="LTV stimato" value={formatEur(ltv)} icon={Target} />
            <StatCard label="Churn medio" value={`${avgChurn}%`} icon={UserMinus} trend={{ value: -0.3, label: 'vs trimestre' }} />
            <StatCard label="Clienti Attivi" value={String(clientiAttivi)} icon={Users} trend={{ value: 15, label: `su ${mockTenants.length}` }} />
          </div>

          {/* MRR + Fatturato charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">MRR Trend</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={mrrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mese" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={v => fmtK(v)} />
                  <Tooltip formatter={(v: number) => [formatEur(v), '']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="net" name="MRR Netto" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} strokeWidth={2} />
                  <Area type="monotone" dataKey="new_mrr" name="New MRR" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Fatturato vs Target</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={mockFatturatoMensile}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mese" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={v => fmtK(v)} />
                  <Tooltip formatter={(v: number) => [formatEur(v), '']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Legend />
                  <Bar dataKey="fatturato" name="Fatturato" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operational row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Fatturato YTD" value={formatEur(fatturatoTotale)} icon={TrendingUp} trend={{ value: 12, label: 'vs anno prec.' }} />
            <StatCard label="Pratiche Completate" value={String(praticheCompletate)} icon={CheckCircle2} trend={{ value: 8, label: `${praticheAperte} aperte` }} />
            <StatCard label="Tempo Medio" value={`${tempoMedio.toFixed(1)}gg`} icon={Clock} trend={{ value: -5, label: 'per pratica' }} />
            <StatCard label="Documenti Fiscali" value={String(docFiscali.length)} icon={Receipt} />
          </div>

          {/* Pratiche + Clienti */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-3">Pratiche per Stato</h3>
              <div className="space-y-2">
                {pratichePerStato.map(s => (
                  <div key={s.stato}>
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="text-slate-600">{s.stato}</span>
                      <span className="font-mono font-medium">{s.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(s.count / mockPratiche.length) * 100}%`, backgroundColor: s.colore }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-3">Clienti per Piano</h3>
              <div className="space-y-2">
                {clientiPerPiano.map(c => (
                  <div key={c.piano}>
                    <div className="flex justify-between text-sm mb-0.5">
                      <span className="text-slate-600">{c.piano}</span>
                      <span className="font-mono font-medium">{c.count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${(c.count / mockTenants.length) * 100}%`, backgroundColor: c.colore }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══════ REVENUE TAB ═══════ */}
        <TabsContent value="revenue" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatCard label="Fatturato Docs" value={formatEur(fatturatoDocs)} icon={TrendingUp} />
            <StatCard label="Incassato" value={formatEur(incassatoDocs)} icon={Banknote} />
            <StatCard label="Da Incassare" value={formatEur(daIncassare)} icon={Clock} />
            <StatCard label="Note Credito" value={formatEur(totaleNC)} icon={AlertCircle} />
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-4">
              <p className="text-xs font-medium text-slate-500 mb-1">Saldo IVA</p>
              <p className="text-xl font-bold font-mono text-slate-900">{formatEur(saldoIVA)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue per servizio */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Revenue per Servizio</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revenuePerServizio} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={v => fmtK(v)} />
                  <YAxis type="category" dataKey="servizio" tick={{ fontSize: 11 }} stroke="#94a3b8" width={100} />
                  <Tooltip formatter={(v: number) => [formatEur(v), 'Revenue']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="revenue" fill="hsl(200, 80%, 50%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top clienti */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Top Clienti per Fatturato</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fatturatoPerCliente} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={v => fmtK(v)} />
                  <YAxis type="category" dataKey="cliente" tick={{ fontSize: 11 }} stroke="#94a3b8" width={120} />
                  <Tooltip formatter={(v: number) => [formatEur(v), 'Fatturato']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="totale" fill="hsl(150, 60%, 45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              {/* Distribuzione docs */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Documenti per Tipo</h4>
                <div className="space-y-1.5">
                  {tipiDistribuzione.map(t => (
                    <div key={t.tipo} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.colore }} />
                        <span className="text-slate-600">{t.tipo}</span>
                      </div>
                      <span className="font-mono text-slate-800 font-medium">{t.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MRR breakdown */}
          <div className="bg-white border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-4">MRR Breakdown Mensile</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={mrrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mese" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={v => fmtK(v)} />
                <Tooltip formatter={(v: number) => [formatEur(v), '']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend />
                <Bar dataKey="new_mrr" name="New MRR" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churn_mrr" name="Churn MRR" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="net" name="MRR Netto" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        {/* ═══════ CHURN TAB ═══════ */}
        <TabsContent value="churn" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Churn Rate Medio" value={`${avgChurn}%`} icon={UserMinus} />
            <StatCard label="Clienti Persi (YTD)" value={String(churnMonthly.reduce((s, c) => s + c.clienti_persi, 0))} icon={TrendingDown} />
            <StatCard label="Stato Churned" value={String(mockTenants.filter(t => t.stato === 'churned').length)} icon={AlertCircle} />
            <StatCard label="LTV Medio" value={formatEur(ltv)} icon={Target} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Churn rate trend */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Churn Rate Mensile (%)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={churnMonthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mese" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" domain={[0, 5]} tickFormatter={v => `${v}%`} />
                  <Tooltip formatter={(v: number) => [`${v}%`, 'Churn']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="rate" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Cohort retention */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Retention Coorte (%)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left py-1.5 px-2 text-slate-500 font-medium">Coorte</th>
                      {['M0', 'M1', 'M2', 'M3', 'M4', 'M5'].map(m => (
                        <th key={m} className="text-center py-1.5 px-2 text-slate-500 font-medium">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohortData.map(row => (
                      <tr key={row.coorte}>
                        <td className="py-1 px-2 font-medium text-slate-700">{row.coorte}</td>
                        {[row.m0, row.m1, row.m2, row.m3, row.m4, row.m5].map((val, i) => (
                          <td key={i} className="py-1 px-2 text-center">
                            {val !== undefined ? (
                              <span className={`inline-block px-2 py-0.5 rounded font-mono font-medium ${getCohortColor(val)}`}>
                                {val}%
                              </span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* At-risk clients */}
          <div className="bg-white border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" /> Clienti a Rischio
            </h3>
            <div className="space-y-2">
              {mockTenants
                .filter(t => t.crediti_residui <= 50 && t.stato === 'attivo')
                .sort((a, b) => a.crediti_residui - b.crediti_residui)
                .slice(0, 5)
                .map(t => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{t.ragione_sociale}</p>
                      <p className="text-xs text-slate-500">Piano: {t.piano} · Ultima attività: {new Date(t.ultima_attivita).toLocaleDateString('it-IT')}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50">€ {t.crediti_residui}</Badge>
                      <p className="text-[10px] text-slate-400 mt-0.5">crediti residui</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>

        {/* ═══════ ACTIVITY TAB ═══════ */}
        <TabsContent value="activity" className="mt-6 space-y-6">
          {/* Heatmap */}
          <div className="bg-white border rounded-xl p-5">
            <h3 className="font-semibold text-slate-800 mb-1">Heatmap Attività Piattaforma</h3>
            <p className="text-xs text-slate-500 mb-4">Intensità di utilizzo per giorno e fascia oraria</p>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                {/* Hour labels */}
                <div className="flex ml-10 mb-1">
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex-1 text-center text-[9px] text-slate-400">{i.toString().padStart(2, '0')}</div>
                  ))}
                </div>
                {/* Grid */}
                {heatmapData.map((row, gi) => (
                  <div key={gi} className="flex items-center gap-1 mb-0.5">
                    <span className="w-9 text-[10px] text-slate-500 text-right pr-1">{GIORNI[gi]}</span>
                    <div className="flex flex-1 gap-px">
                      {row.map((cell, hi) => (
                        <div
                          key={hi}
                          className={`flex-1 h-4 rounded-sm ${getHeatColor(cell.intensity)} transition-colors`}
                          title={`${cell.giorno} ${cell.ora}:00 — ${(cell.intensity * 100).toFixed(0)}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-2 mt-3 ml-10">
                  <span className="text-[10px] text-slate-400">Bassa</span>
                  {['bg-slate-100', 'bg-sky-100', 'bg-sky-300', 'bg-sky-500', 'bg-sky-700'].map(c => (
                    <div key={c} className={`h-3 w-6 rounded-sm ${c}`} />
                  ))}
                  <span className="text-[10px] text-slate-400">Alta</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance operatori + pratiche per tipo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Performance Operatori</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={operatoriPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="nome" tick={{ fontSize: 12 }} stroke="#94a3b8" width={60} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="completate" name="Completate" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {mockOperatori.map(o => (
                  <div key={o.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold">{o.avatar_iniziali}</span>
                      <span className="text-slate-600">{o.nome}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">{o.tempo_medio_giorni}gg avg</span>
                      <span className="text-xs font-medium text-amber-600">⭐ {o.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold text-slate-800 mb-4">Pratiche per Tipo</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={mockPratichePerTipo} dataKey="count" nameKey="tipo" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={2}>
                    {mockPratichePerTipo.map((entry, i) => <Cell key={i} fill={entry.colore} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {mockPratichePerTipo.map(t => (
                  <div key={t.tipo} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.colore }} />
                      <span className="text-slate-600">{t.tipo}</span>
                    </div>
                    <span className="font-mono text-slate-800 font-medium">{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-sky-600 font-mono">{docFiscali.length}</p>
              <p className="text-xs text-slate-500">Documenti fiscali</p>
            </div>
            <div className="bg-white border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600 font-mono">{fatture.filter(d => d.stato === 'pagata').length}</p>
              <p className="text-xs text-slate-500">Fatture pagate</p>
            </div>
            <div className="bg-white border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-amber-600 font-mono">{fatture.filter(d => ['inviata_sdi', 'consegnata'].includes(d.stato)).length}</p>
              <p className="text-xs text-slate-500">In attesa pagamento</p>
            </div>
            <div className="bg-white border rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-red-600 font-mono">{noteCredito.length}</p>
              <p className="text-xs text-slate-500">Note di credito</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReport;
