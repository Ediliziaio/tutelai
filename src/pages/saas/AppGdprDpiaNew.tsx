import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Save, CheckCircle2,
  FileText, Bot,
} from 'lucide-react';
import { mockAiSystems } from '@/data/tutelaiMockData';

const STEPS = [
  'Sistema AI',
  'Descrizione trattamento',
  'Necessità e proporzionalità',
  'Rischi identificati',
  'Misure di mitigazione',
  'Consultazione DPO',
  'Conclusione',
];

const AI_RISKS = [
  'Discriminazione algoritmica',
  'Mancanza di trasparenza',
  'Violazione della privacy',
  'Errori nelle decisioni automatizzate',
  'Bias nei dati di addestramento',
  'Sicurezza e accesso non autorizzato',
];

const SEVERITY_LABELS: Record<number, string> = {
  1: 'Basso',
  2: 'Medio-basso',
  3: 'Medio',
  4: 'Medio-alto',
  5: 'Alto',
};

interface StepData {
  sistema_id: string;
  descrizione: string;
  categorie_dati: string[];
  volume: string;
  trasferimenti: boolean;
  minimizzazione: string;
  proporzionalita: string;
  limitazione_scopo: string;
  rischi: Record<string, boolean>;
  severita: Record<string, number>;
  mitigazioni: Record<string, string>;
  dpo_consultato: string;
}

const DATA_CATEGORIES = [
  'Dati anagrafici', 'Dati professionali', 'Dati di navigazione',
  'Dati biometrici', 'Dati di salute', 'Dati finanziari', 'Dati sensibili',
];

export default function AppGdprDpiaNew() {
  const [step, setStep] = useState(2);
  const [data, setData] = useState<StepData>({
    sistema_id: 'ai-005',
    descrizione: '',
    categorie_dati: [],
    volume: '',
    trasferimenti: false,
    minimizzazione: '',
    proporzionalita: '',
    limitazione_scopo: '',
    rischi: {},
    severita: {},
    mitigazioni: {},
    dpo_consultato: '',
  });
  const [toast, setToast] = useState<string | null>(null);

  function showToastMsg(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggleCategoria(cat: string) {
    setData((d) => ({
      ...d,
      categorie_dati: d.categorie_dati.includes(cat)
        ? d.categorie_dati.filter((c) => c !== cat)
        : [...d.categorie_dati, cat],
    }));
  }

  function toggleRischio(r: string) {
    setData((d) => ({
      ...d,
      rischi: { ...d.rischi, [r]: !d.rischi[r] },
      severita: d.rischi[r] ? d.severita : { ...d.severita, [r]: d.severita[r] ?? 3 },
    }));
  }

  const selectedSystem = mockAiSystems.find((s) => s.id === data.sistema_id);

  return (
    <div className="p-6 space-y-6 bg-[#FAFAF8] min-h-full">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-[#042C53] text-white px-5 py-3 rounded-xl shadow-lg text-sm">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/app/gdpr" className="inline-flex items-center gap-1.5 text-sm text-[#185FA5] hover:underline mb-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            GDPR+AI
          </Link>
          <h1 className="text-2xl font-bold text-[#042C53] flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#185FA5]" />
            Nuova DPIA — Wizard guidato
          </h1>
        </div>
        <button
          onClick={() => showToastMsg('Bozza DPIA salvata.')}
          className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          Salva bozza
        </button>
      </div>

      {/* Stepper */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-5">
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => {
            const idx = i + 1;
            const active = idx === step;
            const done = idx < step;
            return (
              <div key={label} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      done ? 'bg-[#185FA5] text-white' : active ? 'bg-[#042C53] text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {done ? <CheckCircle2 className="w-4 h-4" /> : idx}
                  </div>
                  <span className={`text-xs mt-1 hidden sm:block text-center ${active ? 'text-[#042C53] font-semibold' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${done ? 'bg-[#185FA5]' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-[#185FA5] h-1.5 rounded-full transition-all"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 shrink-0">Step {step}/{STEPS.length}</span>
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white border border-[#C8C5BC] rounded-xl p-6 space-y-5">

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#042C53]">Sistema AI da valutare</h2>
            <p className="text-sm text-gray-500">Seleziona il sistema AI per cui avviare la DPIA.</p>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sistema AI *</label>
              <select
                value={data.sistema_id}
                onChange={(e) => setData((d) => ({ ...d, sistema_id: e.target.value }))}
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
              >
                {mockAiSystems.filter((s) => s.rischio === 'alto' || s.rischio === 'limitato').map((s) => (
                  <option key={s.id} value={s.id}>{s.nome} — {s.rischio}</option>
                ))}
              </select>
            </div>
            {selectedSystem && (
              <div className="bg-[#E6F1FB] border border-[#185FA5]/30 rounded-lg p-4 text-sm space-y-1">
                <div className="font-medium text-[#042C53] flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#185FA5]" />
                  {selectedSystem.nome}
                </div>
                <div className="text-gray-600">{selectedSystem.descrizione_uso}</div>
                <div className="text-xs text-gray-500">Rischio AI Act: {selectedSystem.rischio} | Fornitore: {selectedSystem.fornitore}</div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#042C53]">Descrizione del trattamento</h2>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Descrizione del trattamento *</label>
              <textarea
                value={data.descrizione}
                onChange={(e) => setData((d) => ({ ...d, descrizione: e.target.value }))}
                rows={4}
                placeholder="Descrivi come vengono trattati i dati personali nel contesto di questo sistema AI..."
                className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Categorie di dati trattati</label>
              <div className="flex flex-wrap gap-2">
                {DATA_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategoria(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      data.categorie_dati.includes(cat)
                        ? 'bg-[#042C53] text-white border-[#042C53]'
                        : 'border-[#C8C5BC] text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Volume di interessati stimato</label>
                <select
                  value={data.volume}
                  onChange={(e) => setData((d) => ({ ...d, volume: e.target.value }))}
                  className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5]"
                >
                  <option value="">— Seleziona —</option>
                  <option value="lt100">Meno di 100</option>
                  <option value="100-1000">100 – 1.000</option>
                  <option value="1000-10000">1.000 – 10.000</option>
                  <option value="gt10000">Più di 10.000</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="trasf2"
                  checked={data.trasferimenti}
                  onChange={(e) => setData((d) => ({ ...d, trasferimenti: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="trasf2" className="text-sm text-gray-700">Trasferimenti internazionali</label>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#042C53]">Necessità e proporzionalità</h2>
            {[
              { key: 'minimizzazione', label: 'Il trattamento è limitato ai soli dati necessari (minimizzazione)?' },
              { key: 'proporzionalita', label: 'Le finalità perseguite sono proporzionate rispetto ai rischi per gli interessati?' },
              { key: 'limitazione_scopo', label: 'I dati sono trattati solo per le finalità originariamente dichiarate?' },
            ].map(({ key, label }) => (
              <div key={key} className="border border-[#C8C5BC] rounded-lg p-4">
                <p className="text-sm font-medium text-[#042C53] mb-3">{label}</p>
                <div className="flex gap-4">
                  {['si', 'no', 'parzialmente'].map((val) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name={key}
                        value={val}
                        checked={data[key as keyof StepData] === val}
                        onChange={() => setData((d) => ({ ...d, [key]: val }))}
                        className="accent-[#185FA5]"
                      />
                      <span className="text-sm text-gray-700 capitalize">{val}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#042C53]">Rischi identificati</h2>
            <p className="text-sm text-gray-500">Seleziona i rischi applicabili e indica la severità stimata.</p>
            <div className="space-y-3">
              {AI_RISKS.map((r) => (
                <div key={r} className={`border rounded-lg p-4 transition-colors ${data.rischi[r] ? 'border-[#185FA5] bg-[#E6F1FB]' : 'border-[#C8C5BC]'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`r-${r}`}
                      checked={!!data.rischi[r]}
                      onChange={() => toggleRischio(r)}
                      className="rounded accent-[#185FA5]"
                    />
                    <label htmlFor={`r-${r}`} className="text-sm font-medium text-[#042C53] cursor-pointer flex-1">{r}</label>
                    {data.rischi[r] && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        (data.severita[r] ?? 3) >= 4 ? 'bg-[#FDEAEA] text-[#8B1A1A]' :
                        (data.severita[r] ?? 3) === 3 ? 'bg-[#FDF3E3] text-[#854F0B]' :
                        'bg-[#EAF5EE] text-[#1D6B3A]'
                      }`}>
                        {SEVERITY_LABELS[data.severita[r] ?? 3]}
                      </span>
                    )}
                  </div>
                  {data.rischi[r] && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-16">Severità:</span>
                      <input
                        type="range"
                        min={1}
                        max={5}
                        value={data.severita[r] ?? 3}
                        onChange={(e) => setData((d) => ({ ...d, severita: { ...d.severita, [r]: Number(e.target.value) } }))}
                        className="flex-1 accent-[#185FA5]"
                      />
                      <span className="text-xs text-gray-600 w-20 text-right">{SEVERITY_LABELS[data.severita[r] ?? 3]}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#042C53]">Misure di mitigazione</h2>
            <p className="text-sm text-gray-500">Per ogni rischio identificato, descrivi le misure di mitigazione adottate o pianificate.</p>
            {Object.keys(data.rischi).filter((r) => data.rischi[r]).length === 0 && (
              <div className="text-sm text-gray-400 italic">Nessun rischio selezionato al passo precedente.</div>
            )}
            {Object.keys(data.rischi).filter((r) => data.rischi[r]).map((r) => (
              <div key={r} className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">Mitigazione per: <span className="text-[#042C53]">{r}</span></label>
                <textarea
                  value={data.mitigazioni[r] ?? ''}
                  onChange={(e) => setData((d) => ({ ...d, mitigazioni: { ...d.mitigazioni, [r]: e.target.value } }))}
                  rows={3}
                  placeholder={`Descrivi le misure per ridurre il rischio di "${r}"...`}
                  className="w-full border border-[#C8C5BC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5] resize-none"
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 6 */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#042C53]">Consultazione DPO</h2>
            <p className="text-sm text-gray-500">Il DPO deve essere consultato prima di avviare trattamenti ad alto rischio (art. 36 GDPR).</p>
            <div className="border border-[#C8C5BC] rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-[#042C53]">Il DPO ha revisionato questa DPIA?</p>
              {[
                { val: 'si', label: 'Sì — Dr. Rossi (TutelAI) ha revisionato' },
                { val: 'programmato', label: 'Consultazione programmata per i prossimi giorni' },
                { val: 'no', label: 'Non ancora consultato' },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="dpo"
                    value={val}
                    checked={data.dpo_consultato === val}
                    onChange={() => setData((d) => ({ ...d, dpo_consultato: val }))}
                    className="mt-0.5 accent-[#185FA5]"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            <div className="bg-[#E6F1FB] border border-[#185FA5]/30 rounded-lg p-4 text-sm text-[#042C53]">
              <strong>DPO nominato:</strong> Dr. Rossi — TutelAI<br />
              <span className="text-gray-600">Per richiedere la consultazione contatta: dpo@tutelai.it</span>
            </div>
          </div>
        )}

        {/* Step 7 */}
        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#042C53]">Conclusione DPIA</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sistema AI</div>
                <div className="font-medium text-[#042C53]">{selectedSystem?.nome ?? '—'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Categorie dati</div>
                <div className="text-gray-700">{data.categorie_dati.join(', ') || '—'}</div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rischi identificati</div>
                <div className="text-gray-700">
                  {Object.keys(data.rischi).filter((r) => data.rischi[r]).length} rischi
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Consultazione DPO</div>
                <div className={`font-medium ${data.dpo_consultato === 'si' ? 'text-green-700' : 'text-amber-700'}`}>
                  {data.dpo_consultato === 'si' ? 'Completata' : data.dpo_consultato === 'programmato' ? 'Programmata' : 'Non ancora'}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => showToastMsg('Documento DPIA generato con successo.')}
                className="bg-[#042C53] hover:bg-[#185FA5] text-white px-6 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Genera documento DPIA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="border border-[#C8C5BC] hover:bg-gray-50 text-[#042C53] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Indietro
        </button>
        {step < STEPS.length && (
          <button
            onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
            className="bg-[#042C53] hover:bg-[#185FA5] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            Avanti
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
