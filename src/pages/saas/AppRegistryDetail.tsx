import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Pencil, Archive, Trash2, FileText, AlertTriangle,
  CheckCircle, XCircle, ExternalLink, Clock, User, Building,
  CalendarDays, Users, Cpu, ShieldAlert, ShieldCheck, Info,
} from 'lucide-react';
import { mockAiSystems, mockDocumenti } from '@/data/tutelaiMockData';
import type { RischioAI, StatoCompliance, AiSystemProblema } from '@/types/saas';

// ─── Badge configs ────────────────────────────────────────────────────────────

const RISCHIO_CFG: Record<RischioAI, { label: string; dot: string; badge: string; bg: string }> = {
  inaccettabile: { label: 'Inaccettabile', dot: 'bg-red-900', badge: 'bg-red-100 text-red-900 border border-red-200', bg: 'bg-red-50' },
  alto:          { label: 'Alto',          dot: 'bg-red-500',  badge: 'bg-red-50 text-red-700 border border-red-200', bg: 'bg-red-50' },
  limitato:      { label: 'Limitato',      dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border border-amber-200', bg: 'bg-amber-50' },
  minimo:        { label: 'Minimo',        dot: 'bg-green-500', badge: 'bg-green-50 text-green-700 border border-green-200', bg: 'bg-green-50' },
};

const STATO_CFG: Record<StatoCompliance, { label: string; badge: string }> = {
  conforme:     { label: 'Conforme',     badge: 'bg-[#EAF5EE] text-[#1D6B3A] border border-green-200' },
  attenzione:   { label: 'Attenzione',   badge: 'bg-[#FDF3E3] text-[#854F0B] border border-amber-200' },
  critico:      { label: 'Critico',      badge: 'bg-[#FDEAEA] text-[#8B1A1A] border border-red-200' },
  non_valutato: { label: 'Non valutato', badge: 'bg-gray-100 text-gray-600 border border-gray-200' },
};

const OBBLIGHI: Record<RischioAI, { items: string[]; icon: React.ComponentType<{ className?: string }> }> = {
  inaccettabile: {
    items: ["Sistema vietato dall'AI Act — rimozione obbligatoria", 'Notifica all\'autorità competente', 'Valutazione giuridica urgente'],
    icon: ShieldAlert,
  },
  alto: {
    items: [
      'Registrazione obbligatoria nel database EU',
      "Valutazione d'impatto (DPIA/FRIA) richiesta",
      'Supervisione umana obbligatoria',
      'Trasparenza verso utenti e candidati',
      'Documentazione tecnica completa',
      'Test post-mercato',
    ],
    icon: ShieldAlert,
  },
  limitato: {
    items: [
      'Disclosure obbligatoria all\'utente ("Stai interagendo con un AI")',
      'Informativa AI Act agli utenti',
      'Registrazione nel registro AI interno',
    ],
    icon: Info,
  },
  minimo: {
    items: [
      'Nessun obbligo specifico AI Act',
      'Raccomandato: policy uso AI interno',
      'Monitoraggio periodico aggiornamenti normativi',
    ],
    icon: ShieldCheck,
  },
};

const CHECKLIST: Record<RischioAI, string[]> = {
  inaccettabile: ['Rimozione immediata', 'Notifica autorità', 'Audit legale'],
  alto: ['DPIA completata', 'Supervisione umana attiva', 'Log decisioni', 'Documentazione tecnica', 'Test post-mercato'],
  limitato: ['Script disclosure utenti', 'Informativa AI', 'Registro AI interno'],
  minimo: ['Policy uso AI interno', 'Formazione dipendenti AI literacy'],
};

const AUDIT_STUB = [
  { evento: 'Sistema aggiornato', utente: 'Florin Andriciuc', data: '2025-03-01T11:00:00Z' },
  { evento: 'Documento correlato aggiunto', utente: 'Marco Bianchi', data: '2025-02-10T14:00:00Z' },
  { evento: 'Sistema registrato nel registro AI', utente: 'Florin Andriciuc', data: '2025-01-15T09:30:00Z' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

const Card = ({ title, icon: Icon, children }: { title?: string; icon?: React.ComponentType<{ className?: string }>; children: React.ReactNode }) => (
  <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
    {(title || Icon) && (
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="h-4 w-4 text-[#185FA5]" />}
        {title && <h3 className="font-semibold text-[#042C53] text-sm uppercase tracking-wide">{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppRegistryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const system = mockAiSystems.find((s) => s.id === id);

  if (!system) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sistema non trovato</h2>
        <p className="text-sm text-slate-500 mb-6">L'ID fornito non corrisponde a nessun sistema nel registro.</p>
        <button
          onClick={() => navigate('/app/registry')}
          className="bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Torna al registro
        </button>
      </div>
    );
  }

  const rCfg = RISCHIO_CFG[system.rischio];
  const sCfg = STATO_CFG[system.stato_compliance];
  const obblighi = OBBLIGHI[system.rischio];
  const ObbIcon = obblighi.icon;
  const checklist = CHECKLIST[system.rischio];
  const documentiCorrelati = mockDocumenti.filter((d) => system.documenti_correlati.includes(d.id));

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-5">
        <Link to="/app/registry" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-3">
          <ArrowLeft className="h-4 w-4" />
          Torna al registro
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-[#042C53]">{system.nome}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${sCfg.badge}`}>
              {sCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
              <Pencil className="h-4 w-4" /> Modifica
            </button>
            <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
              <Archive className="h-4 w-4" /> Archivia
            </button>
            <button className="border border-red-200 hover:bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
              <Trash2 className="h-4 w-4" /> Elimina
            </button>
          </div>
        </div>
      </div>

      {/* ── Info strip ── */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-4 mb-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Building className="h-4 w-4 text-slate-400" />
          <strong className="text-slate-800">{system.fornitore}</strong>
        </span>
        <span className="flex items-center gap-1.5 text-slate-600">
          <Cpu className="h-4 w-4 text-slate-400" />
          {system.categoria}
        </span>
        {system.data_adozione && (
          <span className="flex items-center gap-1.5 text-slate-600">
            <CalendarDays className="h-4 w-4 text-slate-400" />
            Adottato {formatDate(system.data_adozione)}
          </span>
        )}
        {system.responsabile_nome && (
          <span className="flex items-center gap-1.5 text-slate-600">
            <User className="h-4 w-4 text-slate-400" />
            {system.responsabile_nome}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-slate-600">
          <Users className="h-4 w-4 text-slate-400" />
          {system.chi_usa.join(', ')}
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left column */}
        <div className="flex-1 space-y-5">

          {/* Classificazione AI Act */}
          <Card title="Classificazione AI Act" icon={ShieldAlert}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold ${rCfg.badge}`}>
                <span className={`w-2 h-2 rounded-full ${rCfg.dot}`} />
                Rischio {rCfg.label}
              </span>
            </div>
            <div className={`rounded-lg p-4 ${rCfg.bg} border border-[#C8C5BC]`}>
              <div className="flex items-start gap-2 mb-3">
                <ObbIcon className="h-4 w-4 text-[#185FA5] mt-0.5 shrink-0" />
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Obblighi applicabili</span>
              </div>
              <ul className="space-y-1.5">
                {obblighi.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="h-3.5 w-3.5 text-[#185FA5] mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          {/* Stato compliance */}
          <Card title="Stato Compliance" icon={ShieldCheck}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${sCfg.badge}`}>
                {sCfg.label}
              </span>
            </div>
            {system.problemi.length === 0 ? (
              <div className="flex items-center gap-2 text-[#1D6B3A] bg-[#EAF5EE] rounded-lg px-4 py-3 text-sm">
                <CheckCircle className="h-4 w-4" />
                Nessun problema aperto. Sistema in regola.
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Problemi aperti</p>
                {system.problemi.map((p: AiSystemProblema) => (
                  <div key={p.id} className={`rounded-lg border p-4 ${p.urgente ? 'bg-[#FDEAEA] border-red-200' : 'bg-[#FDF3E3] border-amber-200'}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <XCircle className={`h-4 w-4 mt-0.5 shrink-0 ${p.urgente ? 'text-[#8B1A1A]' : 'text-[#854F0B]'}`} />
                      <span className={`text-sm font-medium ${p.urgente ? 'text-[#8B1A1A]' : 'text-[#854F0B]'}`}>{p.descrizione}</span>
                    </div>
                    {p.azione_suggerita && (
                      <button className="ml-6 text-xs bg-[#042C53] hover:bg-[#185FA5] text-white px-3 py-1.5 rounded-lg transition-colors">
                        {p.azione_suggerita}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Documenti correlati */}
          <Card title="Documenti Correlati" icon={FileText}>
            {documentiCorrelati.length === 0 ? (
              <p className="text-sm text-slate-500 italic mb-3">Nessun documento associato a questo sistema.</p>
            ) : (
              <div className="space-y-2 mb-3">
                {documentiCorrelati.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-[#C8C5BC] hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-[#185FA5]" />
                      <div>
                        <p className="text-sm font-medium text-[#042C53]">{doc.titolo}</p>
                        <p className="text-xs text-slate-500">v{doc.versione} · {formatDate(doc.updated_at)}</p>
                      </div>
                    </div>
                    <Link to={`/app/docs/${doc.id}`} className="text-xs text-[#185FA5] hover:underline flex items-center gap-1">
                      Visualizza <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
            <button className="text-sm text-[#185FA5] hover:underline flex items-center gap-1">
              + Genera documento correlato
            </button>
          </Card>

          {/* Storico modifiche */}
          <Card title="Storico Modifiche" icon={Clock}>
            <div className="space-y-3">
              {AUDIT_STUB.map((ev, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-[#185FA5]" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{ev.evento}</p>
                    <p className="text-xs text-slate-500">{ev.utente} · {formatDate(ev.data)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:w-80 space-y-5">

          {/* Quick stats */}
          <Card title="Dettagli sistema">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Data adozione</dt>
                <dd className="font-medium text-slate-800">{system.data_adozione ? formatDate(system.data_adozione) : '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Provider LLM</dt>
                <dd className="font-medium text-slate-800">{system.fornitore_llm ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Chi utilizza</dt>
                <dd className="font-medium text-slate-800">{system.chi_usa.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Interazione diretta utenti</dt>
                <dd className="font-medium text-slate-800">{system.interagisce_utenti ? 'Sì' : 'No'}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Impatto HR</dt>
                <dd className="font-medium text-slate-800">{system.impatta_hr ? 'Sì' : 'No'}</dd>
              </div>
              {system.url_fornitore && (
                <div>
                  <dt className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Sito fornitore</dt>
                  <dd>
                    <a href={system.url_fornitore} target="_blank" rel="noopener noreferrer" className="text-[#185FA5] hover:underline flex items-center gap-1 text-sm">
                      {system.fornitore} <ExternalLink className="h-3 w-3" />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Risk explanation */}
          <div className={`rounded-xl border p-5 ${rCfg.bg} border-[#C8C5BC]`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${rCfg.dot}`} />
              <span className="text-sm font-semibold text-slate-800">Rischio {rCfg.label}</span>
            </div>
            <p className="text-xs text-slate-600">
              {system.rischio === 'alto' && "Sistemi che influenzano decisioni significative su persone fisiche. Soggetti a obblighi stringenti AI Act Art. 6-51."}
              {system.rischio === 'limitato' && "Sistemi che interagiscono con utenti o generano contenuti. Obblighi di trasparenza obbligatori."}
              {system.rischio === 'minimo' && "Sistemi a basso impatto. Nessun obbligo specifico AI Act, ma buone pratiche raccomandate."}
              {system.rischio === 'inaccettabile' && "Sistemi vietati dall'AI Act. Uso proibito nell'UE. Rimozione immediata necessaria."}
            </p>
          </div>

          {/* Compliance checklist */}
          <Card title="Checklist compliance">
            <ul className="space-y-2">
              {checklist.map((item, i) => {
                const done = system.stato_compliance === 'conforme' && i < 1;
                return (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    {done
                      ? <CheckCircle className="h-4 w-4 text-[#1D6B3A] shrink-0" />
                      : <div className="w-4 h-4 rounded-full border-2 border-[#C8C5BC] shrink-0" />
                    }
                    <span className={done ? 'text-[#1D6B3A] line-through' : 'text-slate-700'}>{item}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
