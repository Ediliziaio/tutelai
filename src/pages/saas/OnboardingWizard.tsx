import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check, ChevronRight, ChevronLeft, Download, Eye,
  Sparkles, Building2, CreditCard, Bot, Users,
  UserCheck, ClipboardList, BarChart2, FileText, Rocket,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 2
  ragione_sociale: string;
  partita_iva: string;
  settore: string;
  num_dipendenti: string;
  sito_web: string;
  indirizzo: string;
  // Step 3 add-ons
  addon_ai_lawyer: boolean;
  addon_fea: boolean;
  addon_whatsapp: boolean;
  // Step 4
  ai_nome: string;
  ai_fornitore: string;
  ai_uso: string;
  ai_chi_usa: string;
  // Step 5
  inviti: { email: string; ruolo: string }[];
  // Step 6
  dpo_scelta: 'yes' | 'no' | 'later' | '';
  // Step 7
  risposte: Record<string, boolean | null>;
}

// ── Step config ───────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Benvenuto', icon: Sparkles },
  { label: 'Azienda', icon: Building2 },
  { label: 'Piano', icon: CreditCard },
  { label: 'Primo AI', icon: Bot },
  { label: 'Team', icon: Users },
  { label: 'DPO / Officer', icon: UserCheck },
  { label: 'Scansione', icon: ClipboardList },
  { label: 'Risk Score', icon: BarChart2 },
  { label: 'Documenti', icon: FileText },
  { label: 'Completato', icon: Rocket },
];

const SETTORI = [
  'Consulenza / Servizi digitali',
  'Retail / E-commerce',
  'Manifattura / Industria',
  'Salute / Farmaceutico',
  'Legale / Professioni',
  'Finanza / Assicurazioni',
  'Edilizia / Immobiliare',
  'Formazione / Istruzione',
  'Pubblica Amministrazione',
  'Altro',
];

const NUM_DIPENDENTI = ['1-9', '10-49', '50-199', '200-499', '500+'];

const FORNITORI_AI = ['OpenAI', 'Google', 'Microsoft', 'Anthropic', 'Meta', 'Mistral', 'Altro'];
const USI_AI = [
  'Produzione contenuti',
  'Analisi dati',
  'Customer service / Chatbot',
  'HR e selezione',
  'Automazione processi',
  'Sviluppo software',
  'Marketing automation',
  'Altro',
];
const CHI_USA = ['Tutti i dipendenti', 'Alcuni dipendenti', 'Dipendenti specifici', 'Clienti', 'Visitatori sito'];

const RUOLI = ['Admin', 'Member', 'Viewer', 'AI Officer'];

const SCAN_QUESTIONS = [
  { id: 'q1', testo: 'Hai già una policy interna sull\'uso degli strumenti AI?' },
  { id: 'q2', testo: 'I tuoi dipendenti hanno ricevuto formazione sull\'uso responsabile dell\'AI?' },
  { id: 'q3', testo: 'Hai informato i lavoratori dell\'uso di AI nei processi aziendali (art. 11 L.132/2025)?' },
  { id: 'q4', testo: 'I contratti con i tuoi fornitori AI includono clausole sulla responsabilità e protezione dei dati?' },
  { id: 'q5', testo: 'Hai un registro dei sistemi AI in uso in azienda?' },
];

// ── Gauge mini ────────────────────────────────────────────────────────────────

function MiniGauge({ score }: { score: number }) {
  const r = 70;
  const cx = 100;
  const cy = 100;
  const circumference = Math.PI * r;
  const filled = (score / 100) * circumference;
  const dashOffset = circumference - filled;
  const getColor = (s: number) => s <= 33 ? '#22A86B' : s <= 66 ? '#D97706' : '#DC2626';
  const getLevel = (s: number) => {
    if (s <= 33) return { label: 'BASSO', bg: '#EAF5EE', text: '#1D6B3A' };
    if (s <= 66) return { label: 'ATTENZIONE', bg: '#FDF3E3', text: '#854F0B' };
    return { label: 'CRITICO', bg: '#FDEAEA', text: '#8B1A1A' };
  };
  const color = getColor(score);
  const level = getLevel(score);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-40 h-24">
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#E5E7EB" strokeWidth="14" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={dashOffset} />
        <text x="100" y="88" textAnchor="middle" fontSize="28" fontWeight="700" fill="#042C53">{score}</text>
        <text x="100" y="103" textAnchor="middle" fontSize="10" fill="#6B7280">/ 100</text>
      </svg>
      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
        style={{ background: level.bg, color: level.text }}>
        {level.label}
      </span>
    </div>
  );
}

// ── Input / Select helpers ────────────────────────────────────────────────────

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#042C53] mb-1">
        {label}{required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:border-transparent transition';
const selectCls = inputCls;

// ── Main Component ────────────────────────────────────────────────────────────

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { profile, completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ragione_sociale: '',
    partita_iva: '',
    settore: '',
    num_dipendenti: '',
    sito_web: '',
    indirizzo: '',
    addon_ai_lawyer: false,
    addon_fea: false,
    addon_whatsapp: false,
    ai_nome: '',
    ai_fornitore: '',
    ai_uso: '',
    ai_chi_usa: '',
    inviti: [{ email: '', ruolo: 'Member' }],
    dpo_scelta: '',
    risposte: {},
  });

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Utente';

  const canSkip = currentStep >= 4;

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function next() {
    if (currentStep < 10) setCurrentStep((s) => s + 1);
  }
  function prev() {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  }

  async function finish() {
    await completeOnboarding();
    navigate('/app/dashboard');
  }

  // ── Step renders ────────────────────────────────────────────────────────────

  function renderStep() {
    switch (currentStep) {
      // ---- Step 1: Welcome ----
      case 1:
        return (
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#E6F1FB] flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#185FA5]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#042C53]">Benvenuto in TutelAI</h2>
              <p className="text-gray-500 mt-2 max-w-md">
                Ciao <span className="font-semibold text-[#042C53]">{firstName}</span>! Siamo pronti ad aiutarti a rendere la tua azienda conforme all'AI Act UE e alla legge 132/2025.
              </p>
            </div>
            <div className="bg-[#E6F1FB] rounded-xl p-5 w-full max-w-sm text-left space-y-2">
              {['Censisci i tuoi sistemi AI', 'Genera documenti legali pronti', 'Forma il tuo team', 'Monitora le normative in tempo reale'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#042C53]">
                  <div className="w-5 h-5 rounded-full bg-[#22A86B] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">Ci vorranno circa 5 minuti per completare la configurazione</p>
          </div>
        );

      // ---- Step 2: Dati aziendali ----
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">Dati aziendali</h2>
              <p className="text-sm text-gray-500 mt-1">Questi dati verranno usati per personalizzare i documenti legali.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ragione sociale" required>
                <input className={inputCls} value={formData.ragione_sociale} onChange={(e) => update('ragione_sociale', e.target.value)} placeholder="AEDIX S.r.l." />
              </Field>
              <Field label="Partita IVA" required>
                <input className={inputCls} value={formData.partita_iva} onChange={(e) => update('partita_iva', e.target.value)} placeholder="IT12345678901" />
              </Field>
              <Field label="Settore" required>
                <select className={selectCls} value={formData.settore} onChange={(e) => update('settore', e.target.value)}>
                  <option value="">Seleziona settore...</option>
                  {SETTORI.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="N. dipendenti" required>
                <select className={selectCls} value={formData.num_dipendenti} onChange={(e) => update('num_dipendenti', e.target.value)}>
                  <option value="">Seleziona...</option>
                  {NUM_DIPENDENTI.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Sito web">
                <input className={inputCls} value={formData.sito_web} onChange={(e) => update('sito_web', e.target.value)} placeholder="https://azienda.it" />
              </Field>
              <Field label="Indirizzo">
                <input className={inputCls} value={formData.indirizzo} onChange={(e) => update('indirizzo', e.target.value)} placeholder="Via Roma 12, 20121 Milano MI" />
              </Field>
            </div>
          </div>
        );

      // ---- Step 3: Piano attivo ----
      case 3:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">Piano attivo</h2>
              <p className="text-sm text-gray-500 mt-1">Stai usando il piano Business. Puoi aggiungere moduli extra.</p>
            </div>
            <div className="bg-[#E6F1FB] rounded-xl p-5 border border-[#185FA5]/20">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-[#042C53] text-lg">Piano Business</span>
                <span className="text-2xl font-bold text-[#042C53]">€199<span className="text-sm font-normal text-gray-500">/mese</span></span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'Registro sistemi AI illimitato',
                  'Generatore documenti AI',
                  'AI Monitor normativo',
                  'Training Hub (5 utenti)',
                  'GDPR + AI integrato',
                  'Audit log immutabile',
                  'Supporto email prioritario',
                  'Dashboard compliance',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-[#042C53]">
                    <Check className="w-4 h-4 text-[#22A86B] flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#042C53] mb-3">Add-on disponibili</p>
              <div className="space-y-2">
                {[
                  { key: 'addon_ai_lawyer' as const, label: 'AI Lawyer Chat', desc: 'Consulta un avvocato AI specializzato', price: '+€39/mese' },
                  { key: 'addon_fea' as const, label: 'Firma Elettronica Avanzata (FEA)', desc: 'Firma digitale avanzata per i tuoi documenti', price: '+€29/mese' },
                  { key: 'addon_whatsapp' as const, label: 'WhatsApp Alert', desc: 'Ricevi notifiche urgenti su WhatsApp', price: '+€19/mese' },
                ].map((addon) => (
                  <label key={addon.key} className="flex items-center gap-3 p-3 border border-[#C8C5BC] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#185FA5]"
                      checked={formData[addon.key]}
                      onChange={(e) => update(addon.key, e.target.checked)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#042C53]">{addon.label}</p>
                      <p className="text-xs text-gray-500">{addon.desc}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#185FA5]">{addon.price}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      // ---- Step 4: Primo sistema AI ----
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">Censisci il tuo primo sistema AI</h2>
              <p className="text-sm text-gray-500 mt-1">Aggiungi il primo strumento AI che usi in azienda. Potrai aggiungerne altri in seguito.</p>
            </div>
            <Field label="Nome del sistema AI" required>
              <input className={inputCls} value={formData.ai_nome} onChange={(e) => update('ai_nome', e.target.value)} placeholder="es. ChatGPT, Copilot, Gemini..." />
            </Field>
            <Field label="Fornitore">
              <select className={selectCls} value={formData.ai_fornitore} onChange={(e) => update('ai_fornitore', e.target.value)}>
                <option value="">Seleziona fornitore...</option>
                {FORNITORI_AI.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>
            <Field label="Come lo usi?" required>
              <select className={selectCls} value={formData.ai_uso} onChange={(e) => update('ai_uso', e.target.value)}>
                <option value="">Seleziona uso principale...</option>
                {USI_AI.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </Field>
            <Field label="Chi lo usa?" required>
              <select className={selectCls} value={formData.ai_chi_usa} onChange={(e) => update('ai_chi_usa', e.target.value)}>
                <option value="">Seleziona...</option>
                {CHI_USA.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            {formData.ai_nome && formData.ai_uso && formData.ai_chi_usa && (
              <div className="bg-[#EAF5EE] border border-[#22A86B]/30 rounded-lg p-4">
                <p className="text-xs font-semibold text-[#1D6B3A] mb-1">Classificazione automatica AI Act</p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide bg-[#EAF5EE] text-[#1D6B3A] px-2 py-0.5 rounded-full border border-[#22A86B]/30">
                    Rischio Limitato
                  </span>
                  <span className="text-xs text-[#1D6B3A]">— Art. 50 AI Act (trasparenza)</span>
                </div>
              </div>
            )}
          </div>
        );

      // ---- Step 5: Invita team ----
      case 5:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">Invita il tuo team</h2>
              <p className="text-sm text-gray-500 mt-1">Aggiungi fino a 5 colleghi per collaborare sulla compliance AI.</p>
            </div>
            <div className="space-y-2">
              {formData.inviti.map((inv, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    className={`${inputCls} flex-1`}
                    placeholder="email@azienda.it"
                    value={inv.email}
                    onChange={(e) => {
                      const next = [...formData.inviti];
                      next[idx] = { ...next[idx], email: e.target.value };
                      update('inviti', next);
                    }}
                  />
                  <select
                    className={`${selectCls} w-36`}
                    value={inv.ruolo}
                    onChange={(e) => {
                      const next = [...formData.inviti];
                      next[idx] = { ...next[idx], ruolo: e.target.value };
                      update('inviti', next);
                    }}
                  >
                    {RUOLI.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              ))}
            </div>
            {formData.inviti.length < 5 && (
              <button
                type="button"
                onClick={() => update('inviti', [...formData.inviti, { email: '', ruolo: 'Member' }])}
                className="text-sm text-[#185FA5] hover:text-[#042C53] font-medium transition-colors"
              >
                + Aggiungi altro
              </button>
            )}
            <div className="bg-[#E6F1FB] rounded-lg p-3">
              <p className="text-xs text-[#042C53]">Gli invitati riceveranno una email con le istruzioni per accedere a TutelAI.</p>
            </div>
          </div>
        );

      // ---- Step 6: DPO / AI Officer ----
      case 6:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">DPO e AI Officer</h2>
              <p className="text-sm text-gray-500 mt-1">La normativa richiede figure responsabili per la governance AI e GDPR.</p>
            </div>
            <div className="space-y-3">
              {([
                { val: 'yes', label: 'Sì, ho già un DPO / AI Officer nominato', desc: 'Inserirò i dati nella sezione impostazioni' },
                { val: 'no', label: 'No, non ho ancora queste figure', desc: 'TutelAI ti aiuterà a capire se sei obbligato e come procedere' },
                { val: 'later', label: 'Configura più tardi', desc: 'Puoi tornare a farlo in qualsiasi momento' },
              ] as const).map((opt) => (
                <label
                  key={opt.val}
                  className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${formData.dpo_scelta === opt.val ? 'border-[#185FA5] bg-[#E6F1FB]' : 'border-[#C8C5BC] hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    name="dpo"
                    className="mt-0.5 accent-[#185FA5]"
                    checked={formData.dpo_scelta === opt.val}
                    onChange={() => update('dpo_scelta', opt.val)}
                  />
                  <div>
                    <p className="text-sm font-medium text-[#042C53]">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      // ---- Step 7: Scansione rapida ----
      case 7:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">Scansione rapida compliance</h2>
              <p className="text-sm text-gray-500 mt-1">5 domande per calcolare il tuo AI Risk Score iniziale.</p>
            </div>
            <div className="space-y-3">
              {SCAN_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="bg-white border border-[#C8C5BC] rounded-xl p-4">
                  <p className="text-sm font-medium text-[#042C53] mb-3">
                    <span className="text-[#185FA5] font-bold mr-1.5">{idx + 1}.</span>
                    {q.testo}
                  </p>
                  <div className="flex gap-3">
                    {[true, false].map((val) => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => update('risposte', { ...formData.risposte, [q.id]: val })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          formData.risposte[q.id] === val
                            ? val
                              ? 'bg-[#EAF5EE] text-[#1D6B3A] border-[#22A86B]'
                              : 'bg-[#FDEAEA] text-[#8B1A1A] border-[#DC2626]'
                            : 'border-[#C8C5BC] text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {val ? 'Sì' : 'No'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ---- Step 8: AI Risk Score ----
      case 8:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">Il tuo AI Risk Score iniziale</h2>
              <p className="text-sm text-gray-500 mt-1">Basato sulle risposte fornite, ecco la tua situazione attuale.</p>
            </div>
            <div className="flex justify-center py-2">
              <MiniGauge score={34} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#042C53] mb-3">Gap rilevati</p>
              <div className="space-y-2">
                {[
                  { urgency: 'red', text: 'Formazione obbligatoria mancante — 2 utenti non formati (Art. 4 AI Act)' },
                  { urgency: 'red', text: 'Manca disclosure per i sistemi AI rivolti al pubblico (Art. 50 AI Act)' },
                  { urgency: 'yellow', text: 'Contratti con fornitori AI privi di clausole obbligatorie' },
                ].map((gap, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 p-3 rounded-lg border-l-4 ${
                      gap.urgency === 'red'
                        ? 'bg-[#FDEAEA] border-l-[#DC2626]'
                        : 'bg-[#FDF3E3] border-l-[#D97706]'
                    }`}
                  >
                    <p className="text-xs text-gray-700">{gap.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#E6F1FB] rounded-lg p-4">
              <p className="text-xs text-[#042C53]">
                TutelAI genererà automaticamente i documenti necessari e assegnerà i corsi di formazione obbligatori per colmare questi gap.
              </p>
            </div>
          </div>
        );

      // ---- Step 9: Documenti pre-generati ----
      case 9:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-[#042C53]">Documenti pre-generati</h2>
              <p className="text-sm text-gray-500 mt-1">Abbiamo preparato questi documenti legali personalizzati per la tua azienda.</p>
            </div>
            <div className="space-y-3">
              {[
                {
                  titolo: 'Policy Uso AI Interno',
                  desc: 'Regola l\'uso responsabile degli strumenti AI da parte dei dipendenti. Obbligatoria ex Legge 132/2025.',
                  badge: 'Pronta per la firma',
                  badgeColor: 'green' as const,
                },
                {
                  titolo: 'Informativa lavoratori sull\'AI',
                  desc: 'Informativa obbligatoria ai lavoratori sull\'uso di AI nei processi aziendali (Art. 11 L.132/2025).',
                  badge: 'Bozza generata',
                  badgeColor: 'yellow' as const,
                },
                {
                  titolo: 'Lettera nomina DPO',
                  desc: 'Lettera formale di nomina del Data Protection Officer secondo GDPR art. 37.',
                  badge: 'Bozza generata',
                  badgeColor: 'yellow' as const,
                },
              ].map((doc) => (
                <div key={doc.titolo} className="bg-white border border-[#C8C5BC] rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#042C53]">{doc.titolo}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{doc.desc}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full flex-shrink-0 ${
                      doc.badgeColor === 'green'
                        ? 'bg-[#EAF5EE] text-[#1D6B3A]'
                        : 'bg-[#FDF3E3] text-[#854F0B]'
                    }`}>
                      {doc.badge}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Visualizza
                    </button>
                    <button className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      Scarica bozza
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // ---- Step 10: Completato ----
      case 10:
        return (
          <div className="flex flex-col items-center text-center gap-6 py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF5EE] flex items-center justify-center">
              <Rocket className="w-8 h-8 text-[#22A86B]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#042C53]">Setup completato!</h2>
              <p className="text-gray-500 mt-2">TutelAI è pronto. Ecco cosa abbiamo configurato per te.</p>
            </div>
            <div className="w-full max-w-sm text-left space-y-2">
              {[
                'Profilo aziendale configurato',
                'Piano Business attivato',
                'Primo sistema AI censito nel registro',
                'AI Risk Score calcolato: 34/100',
                '3 documenti legali pre-generati',
                'Corsi di formazione assegnati al team',
                'AI Monitor normativo attivato',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-3 bg-[#EAF5EE] rounded-lg">
                  <div className="w-5 h-5 rounded-full bg-[#22A86B] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-[#042C53]">{item}</p>
                </div>
              ))}
            </div>
            <button
              onClick={finish}
              className="bg-[#042C53] hover:bg-[#185FA5] text-white font-semibold px-8 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              Vai alla Dashboard
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        );

      default:
        return null;
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAF8] overflow-y-auto flex flex-col">

      {/* Top bar with logo */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#C8C5BC] bg-white flex-shrink-0">
        <span className="font-display text-lg font-bold text-[#042C53]">TutelAI</span>
        <span className="text-xs text-gray-400">Configurazione iniziale</span>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-[#C8C5BC] px-4 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          {/* Circles */}
          <div className="flex items-center justify-between mb-3 overflow-x-auto">
            {STEPS.map((step, idx) => {
              const num = idx + 1;
              const isCompleted = num < currentStep;
              const isActive = num === currentStep;
              return (
                <div key={num} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-[#185FA5] text-white'
                          : isActive
                            ? 'border-2 border-[#185FA5] text-[#185FA5] bg-white'
                            : 'border-2 border-gray-200 text-gray-400 bg-white'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : num}
                    </div>
                    <span className={`text-[9px] font-medium hidden sm:block ${isActive ? 'text-[#185FA5]' : isCompleted ? 'text-gray-600' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-1 transition-colors ${num < currentStep ? 'bg-[#185FA5]' : 'bg-gray-200'}`} style={{ minWidth: '12px', maxWidth: '40px' }} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-[#185FA5] transition-all duration-500"
              style={{ width: `${(currentStep / 10) * 100}%` }}
            />
          </div>
          <p className="text-right text-[11px] text-gray-400 mt-1">Passo {currentStep} di 10</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <div className="w-full max-w-2xl">
          <div className="bg-white border border-[#C8C5BC] rounded-2xl p-6 sm:p-8 min-h-[400px] flex flex-col">
            <div className="flex-1">
              {renderStep()}
            </div>

            {/* Navigation buttons */}
            {currentStep < 10 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={prev}
                  disabled={currentStep === 1}
                  className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Indietro
                </button>

                <div className="flex items-center gap-3">
                  {canSkip && (
                    <button
                      onClick={next}
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Salta per ora
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="bg-[#042C53] hover:bg-[#185FA5] text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    {currentStep === 9 ? 'Completa' : 'Avanti'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
