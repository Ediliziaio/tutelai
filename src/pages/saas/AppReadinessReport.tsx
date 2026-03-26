import { useRef, useState } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, Download, Printer,
  Shield, FileText, GraduationCap, Lock, Radio, ClipboardList, Bot,
  TrendingUp, Calendar, Building2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

type AreaStatus = 'conforme' | 'parziale' | 'non_conforme';

interface ReportArea {
  id: string;
  titolo: string;
  icon: React.ComponentType<{ className?: string }>;
  score: number; // 0-100
  status: AreaStatus;
  conformi: number;
  parziali: number;
  gap: number;
  gap_critici: string[];
  azioni_immediate: string[];
  fonte: string;
}

interface RiskItem {
  descrizione: string;
  impatto: 'alto' | 'medio' | 'basso';
  scadenza: string;
}

// ─── Static report data ───────────────────────────────────────────────────────
// Reflects same data as Gap Analysis for consistency

const REPORT_AREAS: ReportArea[] = [
  {
    id: 'inventario',
    titolo: 'Inventario Sistemi AI',
    icon: Bot,
    score: 75,
    status: 'parziale',
    conformi: 2, parziali: 2, gap: 0,
    gap_critici: ['HiBob HR AI non classificato per rischio', 'Scheda tecnica Tidio Chatbot incompleta'],
    azioni_immediate: ['Completare classificazione rischio HiBob entro 15 aprile 2026', 'Richiedere documentazione tecnica a Tidio entro 30 aprile 2026'],
    fonte: 'Art. 6 + Allegato III Reg. UE 2024/1689',
  },
  {
    id: 'alto_rischio',
    titolo: 'Sistemi Alto Rischio',
    icon: Shield,
    score: 30,
    status: 'non_conforme',
    conformi: 0, parziali: 2, gap: 3,
    gap_critici: [
      'Sistema di gestione del rischio AI assente (Art. 9)',
      'DPIA obbligatoria non avviata per HiBob HR AI (Art. 35 GDPR)',
      'Supervisione umana non formalizzata (Art. 14)',
    ],
    azioni_immediate: [
      'Avviare immediatamente la DPIA per HiBob HR AI — scadenza 15/04/2026',
      'Redigere il documento di gestione del rischio AI entro 15/05/2026',
      'Formalizzare le procedure di supervisione umana entro 15/05/2026',
    ],
    fonte: 'Artt. 9-15 Reg. UE 2024/1689',
  },
  {
    id: 'trasparenza',
    titolo: 'Trasparenza & Disclosure',
    icon: FileText,
    score: 63,
    status: 'parziale',
    conformi: 2, parziali: 2, gap: 0,
    gap_critici: [
      'Voice Agent Twilio: assente script disclosure obbligatorio (Art. 50)',
      'Informativa Privacy AI non revisionata (scadenza annuale)',
    ],
    azioni_immediate: [
      'Implementare script disclosure su Twilio entro 01/05/2026',
      'Aggiornare Informativa Privacy con finalità AI entro 01/06/2026',
    ],
    fonte: 'Art. 50 Reg. UE 2024/1689',
  },
  {
    id: 'formazione',
    titolo: 'AI Literacy & Formazione',
    icon: GraduationCap,
    score: 58,
    status: 'parziale',
    conformi: 1, parziali: 2, gap: 1,
    gap_critici: [
      '2 dipendenti (Marco Bianchi, Luca Verdi) non hanno completato AI Literacy obbligatoria',
      'Nessun corso avanzato completato dai responsabili AI',
    ],
    azioni_immediate: [
      'Sollecitare immediato completamento corso AI Literacy — scadenza 02/04/2026',
      'Pianificare formazione avanzata per AI Officer e CTO entro luglio 2026',
    ],
    fonte: 'Art. 4 Reg. UE 2024/1689',
  },
  {
    id: 'gdpr',
    titolo: 'GDPR + AI',
    icon: Lock,
    score: 55,
    status: 'parziale',
    conformi: 2, parziali: 1, gap: 1,
    gap_critici: [
      'Registro trattamenti Art. 30 GDPR non aggiornato da 45+ giorni',
      'DPA mancante con un fornitore AI',
    ],
    azioni_immediate: [
      'Aggiornare Registro Trattamenti includendo Voice Agent Twilio e Tidio — entro 01/04/2026',
      'Completare DPA con fornitore mancante entro 01/05/2026',
    ],
    fonte: 'Artt. 28, 30, 35 Reg. 2016/679',
  },
  {
    id: 'governance',
    titolo: 'Governance & Responsabilità',
    icon: ClipboardList,
    score: 60,
    status: 'parziale',
    conformi: 2, parziali: 2, gap: 1,
    gap_critici: [
      'Procedura incident response AI assente (Art. 73 AI Act)',
      '2 contratti fornitori AI senza clausole AI Act (Art. 25)',
    ],
    azioni_immediate: [
      'Definire procedura incident response AI entro 15/07/2026',
      'Aggiornare contratti Twilio e fornitore analytics entro 01/06/2026',
    ],
    fonte: 'Artt. 17, 25, 73 Reg. UE 2024/1689',
  },
  {
    id: 'monitor',
    titolo: 'Monitoraggio Continuo',
    icon: Radio,
    score: 25,
    status: 'non_conforme',
    conformi: 0, parziali: 1, gap: 2,
    gap_critici: [
      'Piano monitoraggio post-market assente (Art. 72) — obbligatorio per sistemi alto rischio',
      'Procedura segnalazione incidenti gravi non implementata (Art. 73)',
    ],
    azioni_immediate: [
      'Redigere piano monitoraggio post-market entro 30/06/2026',
      'Implementare procedura segnalazione incidenti gravi entro 02/08/2026',
    ],
    fonte: 'Artt. 72-73 Reg. UE 2024/1689',
  },
];

const RISK_ITEMS: RiskItem[] = [
  { descrizione: 'Mancata conformità sistemi alto rischio entro agosto 2026 → sanzione fino a €15M o 3% fatturato', impatto: 'alto', scadenza: '02/08/2026' },
  { descrizione: 'DPIA obbligatoria non avviata per HiBob HR AI → violazione GDPR Art. 35 → sanzione fino a €20M o 4% fatturato', impatto: 'alto', scadenza: '15/04/2026' },
  { descrizione: 'Dipendenti senza AI Literacy → violazione Art. 4 AI Act già in vigore da feb. 2025', impatto: 'medio', scadenza: '02/04/2026' },
  { descrizione: 'Registro Trattamenti non aggiornato → violazione Art. 30 GDPR', impatto: 'medio', scadenza: '01/04/2026' },
  { descrizione: 'Voice Agent Twilio senza disclosure → violazione Art. 50 AI Act', impatto: 'medio', scadenza: '01/05/2026' },
  { descrizione: 'Assenza piano monitoraggio post-market → violazione Art. 72 AI Act', impatto: 'basso', scadenza: '02/08/2026' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function globalScore(): number {
  return Math.round(REPORT_AREAS.reduce((s, a) => s + a.score, 0) / REPORT_AREAS.length);
}

function readinessLabel(score: number): { label: string; sub: string; color: string } {
  if (score >= 75) return { label: 'Conformità buona', sub: 'L\'azienda è in buona posizione ma richiede interventi mirati prima delle scadenze.', color: 'text-emerald-600' };
  if (score >= 50) return { label: 'Conformità parziale', sub: 'Presenza di gap significativi. Intervento strutturato urgente entro Q2 2026.', color: 'text-amber-600' };
  return { label: 'Intervento urgente', sub: 'Gap critici che espongono l\'azienda a rischi sanzionatori significativi.', color: 'text-red-600' };
}

const IMPACT_CONFIG = {
  alto:  { label: 'Alto',  badge: 'bg-red-50 text-red-700 border-red-200' },
  medio: { label: 'Medio', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  basso: { label: 'Basso', badge: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const AREA_STATUS_CONFIG: Record<AreaStatus, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  conforme:     { icon: CheckCircle2, color: 'text-emerald-500', label: 'Conforme' },
  parziale:     { icon: AlertTriangle, color: 'text-amber-500', label: 'Parziale' },
  non_conforme: { icon: XCircle, color: 'text-red-500', label: 'Non conforme' },
};

// ─── Print styles injected at runtime ────────────────────────────────────────

const PRINT_STYLE = `
@media print {
  body * { visibility: hidden; }
  #report-print-area, #report-print-area * { visibility: visible; }
  #report-print-area { position: absolute; left: 0; top: 0; width: 100%; }
  .no-print { display: none !important; }
  .page-break { page-break-before: always; }
}
`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppReadinessReport() {
  const { tenant } = useAuth();
  const printRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const score = globalScore();
  const readiness = readinessLabel(score);
  const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

  const toggleExpand = (id: string) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  const handlePrint = () => {
    const style = document.createElement('style');
    style.innerHTML = PRINT_STYLE;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const areeNonConformi = REPORT_AREAS.filter(a => a.status === 'non_conforme').length;
  const areeConformi = REPORT_AREAS.filter(a => a.status === 'conforme').length;

  return (
    <div className="space-y-5">
      {/* ── Toolbar (no print) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div>
          <h1 className="text-2xl font-bold text-[#042C53]">AI Act Readiness Report</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Report di conformità aggiornato al {today} — da condividere con il CDA e i responsabili.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Printer className="h-4 w-4" /> Stampa
          </button>
          <button className="flex items-center gap-2 bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="h-4 w-4" /> Esporta PDF
          </button>
        </div>
      </div>

      {/* ── Report body ── */}
      <div id="report-print-area" ref={printRef} className="space-y-5">

        {/* Cover / intestazione */}
        <div className="bg-[#042C53] rounded-2xl p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#185FA5] font-extrabold text-xl">Tutel<span className="text-white">AI</span></span>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-300 text-sm font-medium">AI Act Readiness Report</span>
              </div>
              <h2 className="text-2xl font-bold mt-2">{tenant?.ragione_sociale ?? 'AEDIX Srl'}</h2>
              <p className="text-blue-200 text-sm mt-0.5">P.IVA {tenant?.partita_iva ?? '03456789012'} · {tenant?.settore ?? 'Technology'}</p>
              <p className="text-gray-400 text-xs mt-3">Generato il {today} · Riferimenti: Reg. UE 2024/1689 (AI Act) · Reg. UE 2016/679 (GDPR) · L. 132/2025</p>
            </div>
            <div className="text-center shrink-0">
              <div className={`text-5xl font-black ${score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {score}%
              </div>
              <div className="text-gray-300 text-sm font-medium mt-1">Readiness Score</div>
              <div className={`text-xs font-semibold mt-1 ${score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {readiness.label}
              </div>
            </div>
          </div>
        </div>

        {/* Executive summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#042C53] uppercase tracking-wide mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#185FA5]" /> Executive Summary
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            <strong>{tenant?.ragione_sociale ?? 'AEDIX Srl'}</strong> ha raggiunto un <strong>Readiness Score complessivo del {score}%</strong> rispetto agli obblighi dell'AI Act (Reg. UE 2024/1689) e del GDPR. {readiness.sub}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Aree analizzate', value: REPORT_AREAS.length, color: 'text-[#042C53]' },
              { label: 'Aree conformi', value: areeConformi, color: 'text-emerald-600' },
              { label: 'Aree con gap critici', value: areeNonConformi, color: 'text-red-600' },
              { label: 'Azioni prioritarie', value: REPORT_AREAS.reduce((s, a) => s + a.azioni_immediate.length, 0), color: 'text-amber-600' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[11px] text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score bar per area */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#042C53] uppercase tracking-wide mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#185FA5]" /> Conformità per area
          </h3>
          <div className="space-y-3">
            {REPORT_AREAS.map(area => {
              const cfg = AREA_STATUS_CONFIG[area.status];
              const StatusIcon = cfg.icon;
              const AreaIcon = area.icon;
              const barColor = area.score >= 75 ? 'bg-emerald-500' : area.score >= 50 ? 'bg-amber-500' : 'bg-red-500';
              return (
                <div key={area.id} className="flex items-center gap-3">
                  <AreaIcon className="h-4 w-4 text-gray-400 shrink-0" />
                  <div className="w-40 shrink-0">
                    <p className="text-xs font-medium text-[#042C53] truncate">{area.titolo}</p>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${area.score}%` }} />
                  </div>
                  <span className={`text-xs font-bold w-10 text-right shrink-0 ${area.score >= 75 ? 'text-emerald-600' : area.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                    {area.score}%
                  </span>
                  <div className="w-24 shrink-0 flex items-center gap-1">
                    <StatusIcon className={`h-3.5 w-3.5 ${cfg.color}`} />
                    <span className={`text-[11px] font-medium ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dettaglio per area */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#042C53] uppercase tracking-wide mb-4 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-[#185FA5]" /> Analisi dettagliata per area
          </h3>
          <div className="space-y-3">
            {REPORT_AREAS.map(area => {
              const cfg = AREA_STATUS_CONFIG[area.status];
              const StatusIcon = cfg.icon;
              const AreaIcon = area.icon;
              const isOpen = expanded[area.id] ?? (area.status === 'non_conforme');
              return (
                <div key={area.id} className={`border rounded-xl overflow-hidden ${area.status === 'non_conforme' ? 'border-red-200' : area.status === 'parziale' ? 'border-amber-200' : 'border-emerald-200'}`}>
                  <button
                    onClick={() => toggleExpand(area.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <AreaIcon className="h-4 w-4 text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[#042C53]">{area.titolo}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-xs font-bold ${area.score >= 75 ? 'text-emerald-600' : area.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {area.score}%
                          </span>
                          <div className="flex items-center gap-1">
                            <StatusIcon className={`h-4 w-4 ${cfg.color}`} />
                            <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 italic mt-0.5">{area.fonte}</p>
                    </div>
                    <span className="text-gray-400 text-xs shrink-0">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                      <div className="flex gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />{area.conformi} conformi</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />{area.parziali} parziali</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" />{area.gap} gap</span>
                      </div>

                      {area.gap_critici.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wide mb-1.5">Gap identificati</p>
                          <ul className="space-y-1">
                            {area.gap_critici.map((g, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {area.azioni_immediate.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold text-[#185FA5] uppercase tracking-wide mb-1.5">Azioni raccomandate</p>
                          <ul className="space-y-1">
                            {area.azioni_immediate.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                                <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk matrix */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#042C53] uppercase tracking-wide mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Rischi sanzionatori identificati
          </h3>
          <div className="space-y-2">
            {RISK_ITEMS.map((risk, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-lg p-3 border ${
                risk.impatto === 'alto' ? 'bg-red-50 border-red-200' :
                risk.impatto === 'medio' ? 'bg-amber-50 border-amber-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${IMPACT_CONFIG[risk.impatto].badge}`}>
                  {IMPACT_CONFIG[risk.impatto].label}
                </span>
                <p className="text-xs text-gray-700 flex-1 leading-relaxed">{risk.descrizione}</p>
                <span className="text-[10px] font-medium text-gray-500 shrink-0 whitespace-nowrap">Entro {risk.scadenza}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scadenze chiave */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-[#042C53] uppercase tracking-wide mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#185FA5]" /> Scadenze chiave
          </h3>
          <div className="space-y-2">
            {[
              { data: '01/04/2026', azione: 'Aggiornamento Registro Trattamenti GDPR', urgenza: 'critica' },
              { data: '02/04/2026', azione: 'Completamento AI Literacy — personale non formato', urgenza: 'critica' },
              { data: '15/04/2026', azione: 'Avvio DPIA HiBob HR AI', urgenza: 'critica' },
              { data: '01/05/2026', azione: 'Disclosure script Voice Agent Twilio', urgenza: 'alta' },
              { data: '15/05/2026', azione: 'Sistema gestione rischio AI documentato', urgenza: 'alta' },
              { data: '01/06/2026', azione: 'Aggiornamento contratti fornitori AI', urgenza: 'media' },
              { data: '30/06/2026', azione: 'Piano monitoraggio post-market', urgenza: 'media' },
              { data: '02/08/2026', azione: 'SCADENZA PRINCIPALE — Piena conformità sistemi AI alto rischio', urgenza: 'critica' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs font-mono font-semibold text-[#042C53] w-24 shrink-0">{item.data}</span>
                <span className="text-xs text-gray-700 flex-1">{item.azione}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                  item.urgenza === 'critica' ? 'bg-red-50 text-red-700 border-red-200' :
                  item.urgenza === 'alta' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {item.urgenza === 'critica' ? 'Critica' : item.urgenza === 'alta' ? 'Alta' : 'Media'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer report */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">Generato da TutelAI · Piattaforma AI Compliance</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed max-w-xl">
                Questo report è generato automaticamente sulla base dei dati inseriti nella piattaforma e delle normative vigenti al {today}.
                Non costituisce parere legale. Per decisioni strategiche, si raccomanda la consulenza di un professionista legale specializzato.
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-400">Report ID</p>
              <p className="text-xs font-mono font-semibold text-gray-600">RPT-{new Date().getFullYear()}-{String(new Date().getMonth() + 1).padStart(2, '0')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
