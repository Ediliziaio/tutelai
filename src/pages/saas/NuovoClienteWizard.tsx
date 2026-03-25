import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, Building2, Users, Settings, Zap, Rocket, Crown, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { mockOperatori, SERVIZI_DISPONIBILI, PROVINCE_ITALIANE } from '@/data/mockDashboardData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

const steps = [
  { num: 1, label: 'Dati Azienda', icon: Building2 },
  { num: 2, label: 'Contatti & Accesso', icon: Users },
  { num: 3, label: 'Piano & Impostazioni', icon: Settings },
];

const piani = [
  { id: 'starter', label: 'Starter', icon: Zap, desc: 'Fino a 20 fatture/mese, ENEA inclusa, email support', prezzo: 'A pratica', colore: 'border-slate-200 bg-white' },
  { id: 'professionale', label: 'Professionale', icon: Rocket, desc: 'Tutto Starter + Call center 20h, segreteria, report', prezzo: 'A pratica', badge: 'Più scelto', colore: 'border-sky-200 bg-sky-50/30' },
  { id: 'enterprise', label: 'Enterprise', icon: Crown, desc: 'Su misura, account manager dedicato, SLA personalizzato', prezzo: 'Preventivo', colore: 'border-violet-200 bg-violet-50/30' },
];

const NuovoClienteWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [ragioneSociale, setRagioneSociale] = useState('');
  const [formaGiuridica, setFormaGiuridica] = useState('');
  const [partitaIva, setPartitaIva] = useState('');
  const [codiceFiscale, setCodiceFiscale] = useState('');
  const [codiceSdi, setCodiceSdi] = useState('');
  const [pec, setPec] = useState('');
  const [via, setVia] = useState('');
  const [cap, setCap] = useState('');
  const [citta, setCitta] = useState('');
  const [provincia, setProvincia] = useState('');
  const [noteInterne, setNoteInterne] = useState('');

  // Step 2
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ruoloAzienda, setRuoloAzienda] = useState('');
  const [invioWelcome, setInvioWelcome] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordTemp, setPasswordTemp] = useState('');
  const [ruoloUtente, setRuoloUtente] = useState('cliente_admin');

  // Step 3
  const [piano, setPiano] = useState('professionale');
  const [creditiIniziali, setCreditiIniziali] = useState('0');
  const [hasTrial, setHasTrial] = useState(false);
  const [trialEnd, setTrialEnd] = useState<Date | undefined>(new Date(Date.now() + 14 * 86400000));
  const [operatoreId, setOperatoreId] = useState('auto');
  const [serviziAttivi, setServiziAttivi] = useState<string[]>(SERVIZI_DISPONIBILI.filter(s => s.default).map(s => s.id));

  const pivaValid = /^\d{11}$/.test(partitaIva);
  const step1Valid = ragioneSociale.trim().length > 0 && pivaValid && codiceFiscale.trim().length > 0;
  const step2Valid = nome.trim().length > 0 && cognome.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
    setPasswordTemp(Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
  };

  const toggleServizio = (id: string) => {
    setServiziAttivi(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    toast({ title: '✓ Cliente creato con successo!', description: `${ragioneSociale} è stato aggiunto alla piattaforma.` });
    navigate('/admin/clienti/t1');
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <button onClick={() => navigate('/admin/clienti')} className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Torna ai clienti
        </button>
        <h1 className="text-2xl font-bold font-subtitle text-slate-900">Nuovo Cliente</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all',
                step > s.num ? 'bg-emerald-500 border-emerald-500 text-white' :
                step === s.num ? 'bg-sky-500 border-sky-500 text-white' :
                'border-slate-200 text-slate-400'
              )}>
                {step > s.num ? <Check className="h-5 w-5" /> : s.num}
              </div>
              <span className={cn('text-sm font-medium hidden sm:block', step >= s.num ? 'text-slate-800' : 'text-slate-400')}>{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn('flex-1 h-0.5 mx-4', step > s.num ? 'bg-emerald-400' : 'bg-slate-200')} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 lg:p-8">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold font-subtitle text-slate-900">Dati Azienda</h3>
              <p className="text-sm text-slate-500 mt-1">Informazioni fiscali e anagrafiche</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ragione Sociale *</Label>
                <Input placeholder="Es. Edil Rossi S.r.l." value={ragioneSociale} onChange={e => setRagioneSociale(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Forma Giuridica</Label>
                <Input placeholder="S.r.l., S.n.c., Ditta ind..." value={formaGiuridica} onChange={e => setFormaGiuridica(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Partita IVA *</Label>
                <div className="relative">
                  <Input maxLength={11} placeholder="12345678901" className="font-mono" value={partitaIva} onChange={e => setPartitaIva(e.target.value.replace(/\D/g, '').slice(0, 11))} />
                  {partitaIva.length > 0 && (
                    <span className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium', pivaValid ? 'text-emerald-500' : 'text-red-500')}>
                      {pivaValid ? '✓ Valida' : `${partitaIva.length}/11`}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Codice Fiscale *</Label>
                <Input maxLength={16} className="font-mono uppercase" value={codiceFiscale} onChange={e => setCodiceFiscale(e.target.value.toUpperCase().slice(0, 16))} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Codice SDI</Label>
                <Input maxLength={7} placeholder="7 caratteri" className="font-mono uppercase" value={codiceSdi} onChange={e => setCodiceSdi(e.target.value.toUpperCase().slice(0, 7))} />
              </div>
              <div className="space-y-2">
                <Label>PEC</Label>
                <Input type="email" placeholder="posta@pec-azienda.it" value={pec} onChange={e => setPec(e.target.value)} />
              </div>
            </div>
            <div className="pt-2">
              <p className="text-sm font-semibold text-slate-700 mb-3">Indirizzo Sede Legale</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Via / Piazza</Label>
                  <Input placeholder="Via Roma 1" value={via} onChange={e => setVia(e.target.value)} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>CAP</Label>
                    <Input maxLength={5} className="font-mono" placeholder="00100" value={cap} onChange={e => setCap(e.target.value.replace(/\D/g, '').slice(0, 5))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Città</Label>
                    <Input placeholder="Roma" value={citta} onChange={e => setCitta(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Provincia</Label>
                    <Select value={provincia} onValueChange={setProvincia}>
                      <SelectTrigger><SelectValue placeholder="--" /></SelectTrigger>
                      <SelectContent className="max-h-60">
                        {PROVINCE_ITALIANE.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Note interne</Label>
              <Textarea placeholder="Note visibili solo agli operatori" rows={2} value={noteInterne} onChange={e => setNoteInterne(e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold font-subtitle text-slate-900">Contatti & Credenziali Accesso</h3>
              <p className="text-sm text-slate-500 mt-1">Referente principale e accesso alla piattaforma</p>
            </div>
            <p className="text-sm font-semibold text-slate-700">Referente Principale</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Nome *</Label><Input value={nome} onChange={e => setNome(e.target.value)} /></div>
              <div className="space-y-2"><Label>Cognome *</Label><Input value={cognome} onChange={e => setCognome(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email * (sarà l'email di login)</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
              <div className="space-y-2"><Label>Telefono</Label><Input value={telefono} onChange={e => setTelefono(e.target.value)} /></div>
            </div>
            <div className="space-y-2">
              <Label>Ruolo in azienda</Label>
              <Input placeholder="Es. Titolare, Amministrativo..." value={ruoloAzienda} onChange={e => setRuoloAzienda(e.target.value)} />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm font-semibold text-slate-700 mb-4">Credenziali Accesso</p>
              <div className="flex items-center justify-between mb-4">
                <Label className="cursor-pointer">Invia email di benvenuto con link configurazione password</Label>
                <Switch checked={invioWelcome} onCheckedChange={setInvioWelcome} />
              </div>
              {!invioWelcome && (
                <div className="space-y-2">
                  <Label>Password temporanea</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input type={showPassword ? 'text' : 'password'} value={passwordTemp} onChange={e => setPasswordTemp(e.target.value)} className="pr-10 font-mono" />
                      <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <Button variant="outline" size="sm" onClick={generatePassword}><RefreshCw className="h-4 w-4 mr-1" /> Genera</Button>
                  </div>
                </div>
              )}
              <div className="space-y-2 mt-4">
                <Label>Ruolo utente</Label>
                <Select value={ruoloUtente} onValueChange={setRuoloUtente}>
                  <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente_admin">Amministratore</SelectItem>
                    <SelectItem value="cliente_user">Utente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold font-subtitle text-slate-900">Piano e Configurazione</h3>
              <p className="text-sm text-slate-500 mt-1">Scegli il piano e configura i servizi iniziali</p>
            </div>

            {/* Piano cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {piani.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPiano(p.id)}
                  className={cn(
                    'relative rounded-xl border-2 p-5 text-left transition-all hover:shadow-md',
                    piano === p.id ? 'border-sky-500 bg-sky-50/50 shadow-sm' : p.colore
                  )}
                >
                  {p.badge && <span className="absolute -top-2.5 right-3 rounded-full bg-amber-100 text-amber-700 px-2 py-0.5 text-[10px] font-bold">{p.badge}</span>}
                  <p.icon className={cn('h-6 w-6 mb-3', piano === p.id ? 'text-sky-600' : 'text-slate-400')} />
                  <p className="font-semibold text-slate-800">{p.label}</p>
                  <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
                  <p className="text-xs font-mono text-slate-400 mt-2">{p.prezzo}</p>
                </button>
              ))}
            </div>

            {/* Crediti */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Crediti iniziali €</Label>
                <Input type="number" min={0} value={creditiIniziali} onChange={e => setCreditiIniziali(e.target.value)} />
                <p className="text-xs text-slate-400">Potrai ricaricare in seguito dalla scheda cliente</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch checked={hasTrial} onCheckedChange={setHasTrial} />
                  <Label>Periodo di trial</Label>
                </div>
                {hasTrial && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn('w-full justify-start text-left', !trialEnd && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {trialEnd ? format(trialEnd, 'dd/MM/yyyy') : 'Seleziona data'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={trialEnd} onSelect={setTrialEnd} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            {/* Operatore */}
            <div className="space-y-2">
              <Label>Operatore Assegnato</Label>
              <Select value={operatoreId} onValueChange={setOperatoreId}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-assegna (meno carico)</SelectItem>
                  {mockOperatori.map(op => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.nome} — {op.pratiche_completate} pratiche in corso
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Servizi */}
            <div className="space-y-3">
              <Label>Servizi Attivi</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SERVIZI_DISPONIBILI.map(s => (
                  <label key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-100 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors">
                    <Checkbox checked={serviziAttivi.includes(s.id)} onCheckedChange={() => toggleServizio(s.id)} />
                    <span className="text-sm text-slate-700">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Riepilogo */}
            <div className="rounded-xl bg-sky-50 border border-sky-200 p-5 space-y-2">
              <p className="text-sm font-semibold text-sky-800 mb-3">Riepilogo</p>
              <div className="grid grid-cols-2 gap-y-1.5 text-sm">
                <span className="text-slate-500">Ragione Sociale:</span><span className="font-medium text-slate-800">{ragioneSociale || '—'}</span>
                <span className="text-slate-500">P.IVA:</span><span className="font-mono text-slate-800">{partitaIva || '—'}</span>
                <span className="text-slate-500">Referente:</span><span className="text-slate-800">{nome} {cognome}</span>
                <span className="text-slate-500">Email:</span><span className="text-slate-800">{email || '—'}</span>
                <span className="text-slate-500">Piano:</span><span className="text-slate-800 capitalize">{piano}</span>
                <span className="text-slate-500">Crediti:</span><span className="text-slate-800">€{creditiIniziali}</span>
                {hasTrial && <><span className="text-slate-500">Trial fino:</span><span className="text-slate-800">{trialEnd ? format(trialEnd, 'dd/MM/yyyy') : '—'}</span></>}
                <span className="text-slate-500">Operatore:</span><span className="text-slate-800">{operatoreId === 'auto' ? 'Auto-assegna' : mockOperatori.find(o => o.id === operatoreId)?.nome}</span>
                <span className="text-slate-500">Email welcome:</span><span className="text-slate-800">{invioWelcome ? 'Sì' : 'No'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between mt-6">
        <Button variant="ghost" onClick={() => step > 1 ? setStep(step - 1) : navigate('/admin/clienti')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> {step > 1 ? 'Indietro' : 'Annulla'}
        </Button>
        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 ? !step1Valid : !step2Valid}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            Avanti <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting} className="bg-sky-500 hover:bg-sky-600 text-white px-8">
            {submitting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
            Crea Cliente
          </Button>
        )}
      </div>
    </div>
  );
};

export default NuovoClienteWizard;
