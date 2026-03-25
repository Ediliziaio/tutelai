import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, FileText, Building2, Zap, Phone, Mail, HelpCircle, AlertTriangle, Paperclip, Check, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TipoPratica } from '@/types/auth';

const tipoCards: { tipo: TipoPratica; label: string; descrizione: string; icon: React.ElementType; tempoStima: string; prezzo: string; color: string }[] = [
  { tipo: 'fattura', label: 'Creazione Fatture', descrizione: 'Fatturazione elettronica, note di credito, invio SDI', icon: FileText, tempoStima: '24h', prezzo: 'Da €12', color: 'text-sky-600 bg-sky-50' },
  { tipo: 'enea', label: 'Pratica ENEA', descrizione: '110%, 90%, 70%, 65% — certificazioni energetiche', icon: Building2, tempoStima: '5-7gg', prezzo: 'Da €250', color: 'text-emerald-600 bg-emerald-50' },
  { tipo: 'finanziamento', label: 'Finanziamento', descrizione: 'Bandi, contributi, prestiti agevolati', icon: Zap, tempoStima: '3-5gg', prezzo: 'Da €500', color: 'text-amber-600 bg-amber-50' },
  { tipo: 'call_center', label: 'Call Center', descrizione: 'Gestione chiamate, appuntamenti, supporto clienti', icon: Phone, tempoStima: '48h', prezzo: 'Da €400', color: 'text-violet-600 bg-violet-50' },
  { tipo: 'segreteria', label: 'Segreteria Virtuale', descrizione: 'Email, corrispondenza, scadenzario', icon: Mail, tempoStima: '24h', prezzo: 'Da €120/mese', color: 'text-pink-600 bg-pink-50' },
  { tipo: 'altro', label: 'Altro / Personalizzato', descrizione: 'Descrivici cosa ti serve', icon: HelpCircle, tempoStima: 'Variabile', prezzo: 'Su misura', color: 'text-slate-600 bg-slate-50' },
];

const NuovaPraticaCliente = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedTipo, setSelectedTipo] = useState<TipoPratica | null>(null);
  const [titolo, setTitolo] = useState('');
  const [priorita, setPriorita] = useState('normale');
  const [descrizione, setDescrizione] = useState('');
  const [dataDesiderata, setDataDesiderata] = useState('');

  const handleSubmit = () => {
    toast({ title: '✓ Richiesta inviata!', description: 'Il team ti contatterà presto.' });
    setTimeout(() => navigate('/app/pratiche'), 1500);
  };

  const selectedCard = tipoCards.find(c => c.tipo === selectedTipo);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => step === 1 ? navigate('/app/pratiche') : setStep(1)} className="mb-4 gap-1.5 text-slate-500">
        <ArrowLeft className="h-4 w-4" /> {step === 1 ? 'Pratiche' : 'Indietro'}
      </Button>

      <h1 className="text-2xl font-bold font-subtitle text-slate-900 mb-2">Nuova Richiesta</h1>
      <p className="text-sm text-slate-500 mb-6">
        {step === 1 ? 'Di cosa hai bisogno?' : 'Dettagli della tua richiesta'}
      </p>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${step >= 1 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
        <div className={`h-px flex-1 ${step >= 2 ? 'bg-sky-500' : 'bg-slate-200'}`} />
        <div className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${step >= 2 ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
      </div>

      {/* Step 1 — Selezione tipo */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tipoCards.map(card => {
            const isSelected = selectedTipo === card.tipo;
            return (
              <div key={card.tipo} onClick={() => setSelectedTipo(card.tipo)} className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-sky-500 bg-sky-50/50 scale-[1.02]' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color} mb-3`}>
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{card.label}</h3>
                <p className="text-xs text-slate-500 mb-3">{card.descrizione}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-emerald-600 font-medium">⏱ {card.tempoStima}</span>
                  <span className="text-[10px] text-slate-400">{card.prezzo}</span>
                </div>
                {isSelected && <div className="mt-3 flex justify-center"><Check className="h-5 w-5 text-sky-500" /></div>}
              </div>
            );
          })}
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end mt-4">
            <Button disabled={!selectedTipo} onClick={() => setStep(2)} className="gap-1.5">
              Avanti <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 — Dettagli */}
      {step === 2 && selectedCard && (
        <div className="max-w-2xl space-y-5">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${selectedCard.color}`}>
              <selectedCard.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">{selectedCard.label}</p>
              <p className="text-[10px] text-slate-400">{selectedCard.descrizione}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Titolo richiesta *</label>
            <Input placeholder="Breve titolo descrittivo" value={titolo} onChange={e => setTitolo(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Priorità</label>
              <Select value={priorita} onValueChange={setPriorita}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normale">Normale</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
              {priorita === 'urgente' && (
                <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" /> Le pratiche urgenti hanno priorità assoluta
                </div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Data desiderata</label>
              <Input type="date" value={dataDesiderata} onChange={e => setDataDesiderata(e.target.value)} />
            </div>
          </div>

          {/* Campi specifici per tipo */}
          {selectedTipo === 'enea' && (
            <div className="space-y-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg">
              <h4 className="text-sm font-semibold text-emerald-800">Dettagli ENEA</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500">Tipo intervento</label>
                  <Select><SelectTrigger><SelectValue placeholder="Seleziona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="110">Superbonus 110%</SelectItem>
                      <SelectItem value="90">Bonus 90%</SelectItem>
                      <SelectItem value="70">Bonus 70%</SelectItem>
                      <SelectItem value="65">Ecobonus 65%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><label className="text-xs text-slate-500">Indirizzo immobile</label><Input placeholder="Via, n., città" /></div>
                <div><label className="text-xs text-slate-500">Data inizio lavori</label><Input type="date" /></div>
                <div><label className="text-xs text-slate-500">Importo lavori (€)</label><Input type="number" placeholder="0,00" /></div>
              </div>
            </div>
          )}
          {selectedTipo === 'finanziamento' && (
            <div className="space-y-3 p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-800">Dettagli Finanziamento</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500">Importo richiesto (€)</label><Input type="number" placeholder="0,00" /></div>
                <div>
                  <label className="text-xs text-slate-500">Tipo finanziamento</label>
                  <Select><SelectTrigger><SelectValue placeholder="Seleziona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bando">Bando</SelectItem>
                      <SelectItem value="contributo">Contributo</SelectItem>
                      <SelectItem value="prestito">Prestito agevolato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2"><label className="text-xs text-slate-500">Destinazione fondi</label><Input placeholder="Descrizione utilizzo fondi" /></div>
              </div>
            </div>
          )}
          {selectedTipo === 'call_center' && (
            <div className="space-y-3 p-4 bg-violet-50/50 border border-violet-200 rounded-lg">
              <h4 className="text-sm font-semibold text-violet-800">Dettagli Call Center</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-slate-500">Numero chiamate previste</label><Input type="number" placeholder="0" /></div>
                <div>
                  <label className="text-xs text-slate-500">Lingua</label>
                  <Select><SelectTrigger><SelectValue placeholder="Seleziona..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="italiano">Italiano</SelectItem>
                      <SelectItem value="inglese">Inglese</SelectItem>
                      <SelectItem value="altro">Altro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2"><label className="text-xs text-slate-500">Script / istruzioni</label><Textarea placeholder="Istruzioni per gli operatori..." rows={3} /></div>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Descrizione dettagliata *</label>
            <Textarea placeholder="Descrivi nel dettaglio cosa hai bisogno. Più dettagli dai, più velocemente possiamo aiutarti." rows={5} value={descrizione} onChange={e => setDescrizione(e.target.value)} maxLength={2000} />
            <p className="text-[10px] text-slate-400 text-right mt-0.5">{descrizione.length}/2000</p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">Allegati (opzionale)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-400 hover:bg-sky-50/50 transition-colors cursor-pointer">
              <Paperclip className="h-6 w-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">Trascina qui i file o clicca per selezionare</p>
            </div>
          </div>

          {/* Riepilogo */}
          <div className="p-4 bg-slate-50 border rounded-lg space-y-1">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Riepilogo</h4>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Tipo:</span><Badge variant="secondary" className={`text-[10px] ${selectedCard.color}`}>{selectedCard.label}</Badge></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Titolo:</span><span className="text-slate-700">{titolo || '—'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Priorità:</span><span className="text-slate-700 capitalize">{priorita}</span></div>
            {dataDesiderata && <div className="flex justify-between text-sm"><span className="text-slate-400">Data desiderata:</span><span className="text-slate-700">{new Date(dataDesiderata).toLocaleDateString('it-IT')}</span></div>}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="ghost" onClick={() => setStep(1)} className="gap-1.5"><ArrowLeft className="h-4 w-4" /> Indietro</Button>
            <Button onClick={handleSubmit} disabled={!titolo.trim() || !descrizione.trim()} className="gap-1.5"><Send className="h-4 w-4" /> Invia Richiesta</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuovaPraticaCliente;
