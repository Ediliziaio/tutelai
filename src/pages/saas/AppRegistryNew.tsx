import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { mockTeam } from '@/data/tutelaiMockData';

// ─── Types ────────────────────────────────────────────────────────────────────

type RischioCalcolato = 'Alto' | 'Limitato' | 'Minimo' | null;

interface FormData {
  nome: string;
  fornitore: string;
  url_fornitore: string;
  descrizione_uso: string;
  categoria: string;
  chi_usa: string[];
  interagisce_utenti: string;
  impatta_hr: string;
  responsabile_id: string;
  data_adozione: string;
  fornitore_llm: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FORNITORI_SUGGERITI = ['OpenAI', 'Google', 'Microsoft', 'Anthropic', 'Salesforce', 'HubSpot', 'Twilio', 'Altro'];
const CATEGORIE = ['Produzione contenuti', 'Analisi dati', 'Automazione vendite', 'Customer service', 'HR e selezione', 'Sviluppo software', 'Altro'];
const CHI_USA_OPTIONS = ['Solo il proprietario', 'Dipendenti specifici', 'Tutti i dipendenti', 'Clienti', 'Visitatori sito'];
const FORNITORI_LLM = ['OpenAI', 'Anthropic', 'Google', 'Meta', 'Altro', 'N.A.'];

const EMPTY_FORM: FormData = {
  nome: '', fornitore: '', url_fornitore: '', descrizione_uso: '',
  categoria: '', chi_usa: [], interagisce_utenti: '', impatta_hr: '',
  responsabile_id: '', data_adozione: '', fornitore_llm: '',
};

// ─── Risk calculation ────────────────────────────────────────────────────────

function calcolaRischio(form: FormData): RischioCalcolato {
  if (!form.categoria && form.interagisce_utenti === '' && form.impatta_hr === '') return null;
  if (form.impatta_hr === 'si' || form.categoria === 'HR e selezione') return 'Alto';
  if (form.interagisce_utenti === 'si') return 'Limitato';
  return 'Minimo';
}

function obblighiDaRischio(rischio: RischioCalcolato): string {
  if (!rischio) return '';
  if (rischio === 'Alto') return 'Registrazione nel registro AI, valutazione d\'impatto (DPIA), supervisione umana obbligatoria, trasparenza candidati/lavoratori.';
  if (rischio === 'Limitato') return 'Disclosure obbligatoria agli utenti, informativa AI Act, registrazione nel registro AI.';
  return 'Nessun obbligo specifico AI Act. Raccomandato: policy uso AI interno.';
}

const RISCHIO_BADGE: Record<string, string> = {
  Alto:    'bg-red-50 text-red-700 border border-red-200',
  Limitato: 'bg-amber-50 text-amber-700 border border-amber-200',
  Minimo:  'bg-green-50 text-green-700 border border-green-200',
};

// ─── Field components ─────────────────────────────────────────────────────────

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <label className="block text-sm font-medium text-slate-700 mb-1">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const inputCls = "w-full px-3 py-2 border border-[#C8C5BC] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] transition-colors";
const errorCls = "text-xs text-red-600 mt-1";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-base font-semibold text-[#1a375b] border-b border-[#C8C5BC] pb-2 mb-4">{children}</h2>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function AppRegistryNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const rischio = calcolaRischio(form);
  const obblighi = obblighiDaRischio(rischio);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleChiUsa = (val: string) => {
    setForm((prev) => ({
      ...prev,
      chi_usa: prev.chi_usa.includes(val)
        ? prev.chi_usa.filter((v) => v !== val)
        : [...prev.chi_usa, val],
    }));
    if (errors.chi_usa) setErrors((prev) => ({ ...prev, chi_usa: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.nome.trim()) e.nome = 'Il nome del sistema è obbligatorio';
    if (!form.fornitore.trim()) e.fornitore = 'Il fornitore è obbligatorio';
    if (!form.categoria) e.categoria = 'Seleziona una categoria';
    if (form.chi_usa.length === 0) e.chi_usa = 'Seleziona almeno un\'opzione';
    if (!form.responsabile_id) e.responsabile_id = 'Seleziona un responsabile';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setShowSuccess(true);
    setTimeout(() => navigate('/app/registry'), 1500);
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="mb-6">
        <Link to="/app/registry" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-3">
          <ArrowLeft className="h-4 w-4" />
          Torna al registro
        </Link>
        <h1 className="text-2xl font-bold text-[#1a375b]">Aggiungi Sistema AI</h1>
        <p className="text-sm text-slate-500 mt-0.5">Registra un nuovo strumento AI usato in azienda</p>
      </div>

      {/* ── Success toast ── */}
      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-[#EAF5EE] border border-green-300 text-[#1D6B3A] rounded-xl px-5 py-3 flex items-center gap-2 shadow-lg">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Sistema AI salvato con successo!</span>
        </div>
      )}

      <div className="space-y-6">
        {/* ══ SECTION 1 ══ */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
          <SectionTitle>1. Informazioni base</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label required>Nome sistema</Label>
              <input className={inputCls} value={form.nome} onChange={set('nome')} placeholder="es. ChatGPT Plus" />
              {errors.nome && <p className={errorCls}>{errors.nome}</p>}
            </div>
            <div className="relative">
              <Label required>Fornitore</Label>
              <input
                className={inputCls}
                value={form.fornitore}
                onChange={set('fornitore')}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="es. OpenAI"
              />
              {showSuggestions && (
                <ul className="absolute z-10 w-full bg-white border border-[#C8C5BC] rounded-lg shadow-lg mt-1 py-1 text-sm">
                  {FORNITORI_SUGGERITI.filter((f) =>
                    !form.fornitore || f.toLowerCase().includes(form.fornitore.toLowerCase())
                  ).map((f) => (
                    <li
                      key={f}
                      className="px-3 py-2 cursor-pointer hover:bg-[#E6F1FB] text-[#1a375b]"
                      onMouseDown={() => { setForm((prev) => ({ ...prev, fornitore: f })); setShowSuggestions(false); }}
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {errors.fornitore && <p className={errorCls}>{errors.fornitore}</p>}
            </div>
            <div>
              <Label>URL fornitore</Label>
              <input className={inputCls} value={form.url_fornitore} onChange={set('url_fornitore')} placeholder="https://…" />
            </div>
            <div className="md:col-span-2">
              <Label>Descrizione uso</Label>
              <textarea
                className={inputCls}
                rows={3}
                value={form.descrizione_uso}
                onChange={set('descrizione_uso')}
                placeholder="Descrivi come viene usato questo sistema AI in azienda…"
              />
            </div>
          </div>
        </div>

        {/* ══ SECTION 2 ══ */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
          <SectionTitle>2. Classificazione</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Label required>Categoria d'uso</Label>
              <select className={inputCls} value={form.categoria} onChange={set('categoria')}>
                <option value="">Seleziona categoria…</option>
                {CATEGORIE.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.categoria && <p className={errorCls}>{errors.categoria}</p>}
            </div>

            <div>
              <Label required>Chi usa questo sistema?</Label>
              <div className="space-y-2 mt-1">
                {CHI_USA_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.chi_usa.includes(opt)}
                      onChange={() => toggleChiUsa(opt)}
                      className="w-4 h-4 rounded border-[#C8C5BC] accent-[#185FA5]"
                    />
                    <span className="text-slate-700">{opt}</span>
                  </label>
                ))}
              </div>
              {errors.chi_usa && <p className={errorCls}>{errors.chi_usa}</p>}
            </div>

            <div>
              <Label>Il sistema interagisce direttamente con utenti?</Label>
              <div className="flex gap-4 mt-1">
                {['si', 'no'].map((val) => (
                  <label key={val} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="radio"
                      name="interagisce_utenti"
                      value={val}
                      checked={form.interagisce_utenti === val}
                      onChange={set('interagisce_utenti')}
                      className="accent-[#185FA5]"
                    />
                    <span className="text-slate-700 capitalize">{val === 'si' ? 'Sì' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Il sistema impatta su decisioni HR/selezione?</Label>
              <div className="flex gap-4 mt-1">
                {['si', 'no'].map((val) => (
                  <label key={val} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="radio"
                      name="impatta_hr"
                      value={val}
                      checked={form.impatta_hr === val}
                      onChange={set('impatta_hr')}
                      className="accent-[#185FA5]"
                    />
                    <span className="text-slate-700">{val === 'si' ? 'Sì' : 'No'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-classification */}
          {rischio && (
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-[#C8C5BC] space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-700">Classificazione AI Act calcolata:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${RISCHIO_BADGE[rischio]}`}>
                  Rischio {rischio}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 mb-0.5">Obblighi applicabili:</p>
                <p className="text-xs text-slate-600">{obblighi}</p>
              </div>
            </div>
          )}
        </div>

        {/* ══ SECTION 3 ══ */}
        <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
          <SectionTitle>3. Responsabile e dettagli</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label required>Responsabile interno</Label>
              <select className={inputCls} value={form.responsabile_id} onChange={set('responsabile_id')}>
                <option value="">Seleziona responsabile…</option>
                {mockTeam.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome} — {m.ruolo}</option>
                ))}
              </select>
              {errors.responsabile_id && <p className={errorCls}>{errors.responsabile_id}</p>}
            </div>
            <div>
              <Label>Data prima adozione</Label>
              <input type="date" className={inputCls} value={form.data_adozione} onChange={set('data_adozione')} />
            </div>
            <div>
              <Label>Fornitore LLM sottostante</Label>
              <select className={inputCls} value={form.fornitore_llm} onChange={set('fornitore_llm')}>
                <option value="">Seleziona…</option>
                {FORNITORI_LLM.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <button
            onClick={() => navigate('/app/registry')}
            className="border border-[#C8C5BC] hover:bg-gray-50 text-[#1a375b] px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            className="bg-[#1a375b] hover:bg-[#185FA5] text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Salva sistema AI
          </button>
        </div>
      </div>
    </div>
  );
}
