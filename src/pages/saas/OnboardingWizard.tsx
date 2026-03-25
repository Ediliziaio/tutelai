import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Building2, FileText, Zap, Check, ArrowRight, ArrowLeft, Rocket, PartyPopper,
  Sparkles, ShieldCheck, Clock3, FolderOpen, Receipt, CalendarClock, Archive,
} from 'lucide-react';
import { SERVIZI_DISPONIBILI } from '@/data/mockDashboardData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const steps = [
  { label: 'Benvenuto', icon: Sparkles },
  { label: 'Dati Aziendali', icon: Building2 },
  { label: 'Servizi', icon: Zap },
  { label: 'Scopri', icon: FolderOpen },
  { label: 'Completa', icon: Rocket },
];

const tourCards = [
  { icon: FolderOpen, title: 'Pratiche', desc: 'Apri richieste e segui lo stato in tempo reale. Tutto tracciato, niente perso.' },
  { icon: Receipt, title: 'Fatture', desc: 'Crea, invia e gestisci fatture elettroniche con un click. Conformi alla normativa italiana.' },
  { icon: CalendarClock, title: 'Scadenzario', desc: 'Mai più una scadenza dimenticata. Avvisi automatici per ogni deadline importante.' },
  { icon: Archive, title: 'Documenti', desc: 'Archivio digitale centralizzato. Tutti i tuoi documenti aziendali sempre a portata di mano.' },
];

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(0);

  // Step 1 — Dati aziendali
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [piva, setPiva] = useState('');
  const [cf, setCf] = useState('');
  const [sdi, setSdi] = useState('');
  const [pec, setPec] = useState('');
  const [via, setVia] = useState('');
  const [cap, setCap] = useState('');
  const [citta, setCitta] = useState('');
  const [emailAzienda, setEmailAzienda] = useState('');
  const [telefonoAzienda, setTelefonoAzienda] = useState('');

  // Step 2 — Servizi
  const [serviziSelezionati, setServiziSelezionati] = useState<string[]>(
    SERVIZI_DISPONIBILI.filter(s => s.default).map(s => s.id)
  );

  const toggleServizio = (id: string) => {
    setServiziSelezionati(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const canProceedStep1 = ragioneSociale.trim() && piva.trim() && emailAzienda.trim();

  const handleComplete = async () => {
    await completeOnboarding();
    toast({ title: '🎉 Onboarding completato!', description: 'Benvenuto su Impresa Leggera. Il tuo account è pronto.' });
    setTimeout(() => navigate('/app/dashboard'), 1000);
  };

  const progressPercent = (step / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold font-subtitle text-slate-900">Impresa Leggera</h1>
          <p className="text-sm text-slate-500 mt-1">Configura il tuo account in pochi passi</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-all ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  {i < step ? <Check className="h-3.5 w-3.5" /> : <s.icon className="h-3.5 w-3.5" />}
                </div>
                <span className={`text-[10px] hidden sm:block ${i <= step ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white border rounded-2xl shadow-sm p-6 sm:p-8">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center py-6 space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-sky-100 flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-sky-500" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Benvenuto su Impresa Leggera!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Configura il tuo account in meno di 3 minuti e inizia subito a semplificare la gestione della tua azienda.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-lg mx-auto">
                {[
                  { icon: Clock3, label: 'Setup in 3 minuti', desc: 'Inserisci i dati base e sei operativo' },
                  { icon: ShieldCheck, label: 'Sicuro e conforme', desc: 'Dati protetti, conforme GDPR' },
                  { icon: Zap, label: 'Subito operativo', desc: 'Apri la tua prima pratica oggi' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <item.icon className="h-6 w-6 text-sky-500" />
                    <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.desc}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setStep(1)} size="lg" className="gap-2">
                Inizia la configurazione <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Dati Aziendali */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Dati della tua azienda</h2>
                <p className="text-sm text-slate-500">Inserisci i dati per la fatturazione e la corrispondenza.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Ragione Sociale *</label>
                  <Input value={ragioneSociale} onChange={e => setRagioneSociale(e.target.value)} placeholder="Es. Edil Rossi S.r.l." className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Partita IVA *</label>
                  <Input value={piva} onChange={e => setPiva(e.target.value)} placeholder="01234567890" className="mt-1 font-mono" maxLength={11} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Codice Fiscale</label>
                  <Input value={cf} onChange={e => setCf(e.target.value)} placeholder="01234567890" className="mt-1 font-mono" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Codice SDI</label>
                  <Input value={sdi} onChange={e => setSdi(e.target.value)} placeholder="M5UXCR1" className="mt-1 font-mono" maxLength={7} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">PEC</label>
                  <Input type="email" value={pec} onChange={e => setPec(e.target.value)} placeholder="azienda@pec.it" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Email principale *</label>
                  <Input type="email" value={emailAzienda} onChange={e => setEmailAzienda(e.target.value)} placeholder="info@azienda.it" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Telefono</label>
                  <Input value={telefonoAzienda} onChange={e => setTelefonoAzienda(e.target.value)} placeholder="02 1234567" className="mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-slate-700">Indirizzo (Via e n°)</label>
                  <Input value={via} onChange={e => setVia(e.target.value)} placeholder="Via Roma 1" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">CAP</label>
                  <Input value={cap} onChange={e => setCap(e.target.value)} placeholder="20100" className="mt-1" maxLength={5} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Città</label>
                  <Input value={citta} onChange={e => setCitta(e.target.value)} placeholder="Milano" className="mt-1" />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(0)} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Indietro</Button>
                <Button onClick={() => setStep(2)} disabled={!canProceedStep1} className="gap-1.5">Avanti <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 2: Servizi */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Quali servizi ti servono?</h2>
                <p className="text-sm text-slate-500">Seleziona i servizi che vuoi attivare. Potrai sempre modificarli in seguito.</p>
              </div>
              <div className="space-y-2">
                {SERVIZI_DISPONIBILI.map(s => (
                  <div key={s.id} className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all ${serviziSelezionati.includes(s.id) ? 'border-sky-300 bg-sky-50/50' : 'border-slate-200 hover:border-slate-300'}`} onClick={() => toggleServizio(s.id)}>
                    <Checkbox checked={serviziSelezionati.includes(s.id)} onCheckedChange={() => toggleServizio(s.id)} />
                    <span className="text-sm font-medium text-slate-700">{s.label}</span>
                    {s.default && <span className="text-[10px] bg-sky-100 text-sky-600 rounded px-1.5 py-0.5 ml-auto">Incluso</span>}
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Indietro</Button>
                <Button onClick={() => setStep(3)} className="gap-1.5">Avanti <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 3: Tour Prodotto */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-1">Cosa puoi fare con Impresa Leggera</h2>
                <p className="text-sm text-slate-500">Ecco le sezioni principali che troverai nella tua area riservata.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tourCards.map((card) => (
                  <div key={card.title} className="flex gap-3 p-4 rounded-xl border border-slate-200 hover:border-sky-200 hover:bg-sky-50/30 transition-all">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                      <card.icon className="h-5 w-5 text-sky-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{card.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Indietro</Button>
                <Button onClick={() => setStep(4)} className="gap-1.5">Avanti <ArrowRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* Step 4: Completa */}
          {step === 4 && (
            <div className="text-center py-8 space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                  <PartyPopper className="h-10 w-10 text-emerald-600" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Tutto pronto!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Il tuo account è configurato. Il nostro team ti contatterà entro 24 ore per una breve call di benvenuto.
                </p>
              </div>
              <div className="bg-slate-50 border rounded-lg p-4 text-left max-w-sm mx-auto space-y-1.5">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Riepilogo</h4>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Azienda:</span><span className="font-medium">{ragioneSociale || '—'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">P.IVA:</span><span className="font-mono text-xs">{piva || '—'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-400">Servizi:</span><span className="font-medium">{serviziSelezionati.length}</span></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Button onClick={handleComplete} size="lg" className="gap-2"><Rocket className="h-5 w-5" /> Vai alla Dashboard</Button>
                <Button variant="ghost" size="sm" onClick={() => setStep(3)} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Torna indietro</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
