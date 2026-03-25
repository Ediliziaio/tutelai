import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Building2, Bell, Save, Upload, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AppImpostazioni = () => {
  const { toast } = useToast();

  const [nome, setNome] = useState('Francesco Bianchi');
  const [email, setEmail] = useState('f.bianchi@edilbianchi.it');
  const [tel, setTel] = useState('333 1234567');
  const [ruolo, setRuolo] = useState('Titolare');

  const [notifiche, setNotifiche] = useState({
    praticaAggiornata: true,
    nuovaFattura: true,
    fatturaScadenza: true,
    messaggioOperatore: true,
    emailRiepilogo: false,
  });

  const toggleNotifica = (key: keyof typeof notifiche) => {
    setNotifiche(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => toast({ title: '✓ Impostazioni salvate', description: 'Le preferenze sono state aggiornate.' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-subtitle text-slate-900">Impostazioni</h1>
          <p className="text-sm text-slate-500">Gestisci il tuo profilo e le preferenze</p>
        </div>
        <Button onClick={handleSave} className="gap-1.5"><Save className="h-4 w-4" /> Salva</Button>
      </div>

      <Tabs defaultValue="profilo">
        <TabsList className="mb-6">
          <TabsTrigger value="profilo" className="gap-1.5"><User className="h-3.5 w-3.5" /> Profilo</TabsTrigger>
          <TabsTrigger value="azienda" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Azienda</TabsTrigger>
          <TabsTrigger value="notifiche" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifiche</TabsTrigger>
        </TabsList>

        {/* Profilo */}
        <TabsContent value="profilo">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Il tuo Profilo</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center text-xl font-bold text-sky-700">FB</div>
                <div>
                  <Button variant="outline" size="sm" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Cambia foto</Button>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Nome completo</Label><Input value={nome} onChange={e => setNome(e.target.value)} className="mt-1" /></div>
                <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" /></div>
                <div><Label>Telefono</Label><Input value={tel} onChange={e => setTel(e.target.value)} className="mt-1" /></div>
                <div><Label>Ruolo in azienda</Label><Input value={ruolo} onChange={e => setRuolo(e.target.value)} className="mt-1" /></div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2"><Shield className="h-5 w-5 text-slate-400" /> Sicurezza</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Password attuale</Label><Input type="password" placeholder="••••••••" className="mt-1" /></div>
                <div><Label>Nuova password</Label><Input type="password" placeholder="Min. 8 caratteri" className="mt-1" /></div>
              </div>
              <Button variant="outline" size="sm" className="mt-4">Aggiorna Password</Button>
            </div>
          </div>
        </TabsContent>

        {/* Azienda (read-only per il cliente) */}
        <TabsContent value="azienda">
          <div className="max-w-2xl bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-2">Dati Aziendali</h3>
            <p className="text-xs text-slate-400 mb-4">Per modificare i dati aziendali contatta il supporto.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label className="text-slate-400">Ragione Sociale</Label><Input value="Edil Bianchi S.r.l." disabled className="mt-1" /></div>
              <div><Label className="text-slate-400">Partita IVA</Label><Input value="01234567890" disabled className="mt-1 font-mono" /></div>
              <div><Label className="text-slate-400">Codice Fiscale</Label><Input value="01234567890" disabled className="mt-1 font-mono" /></div>
              <div><Label className="text-slate-400">SDI</Label><Input value="M5UXCR1" disabled className="mt-1 font-mono" /></div>
              <div><Label className="text-slate-400">PEC</Label><Input value="edilbianchi@pec.it" disabled className="mt-1" /></div>
              <div><Label className="text-slate-400">Piano</Label><Input value="Enterprise" disabled className="mt-1" /></div>
              <div className="sm:col-span-2"><Label className="text-slate-400">Indirizzo</Label><Input value="Via Roma 45, 20121 Milano (MI)" disabled className="mt-1" /></div>
            </div>
          </div>
        </TabsContent>

        {/* Notifiche */}
        <TabsContent value="notifiche">
          <div className="max-w-2xl bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Preferenze Notifiche</h3>
            <div className="space-y-4">
              {[
                { key: 'praticaAggiornata' as const, label: 'Aggiornamenti pratiche', desc: 'Notifica quando una pratica cambia stato' },
                { key: 'nuovaFattura' as const, label: 'Nuova fattura', desc: 'Notifica all\'emissione di una nuova fattura' },
                { key: 'fatturaScadenza' as const, label: 'Fattura in scadenza', desc: 'Promemoria 7 giorni prima della scadenza' },
                { key: 'messaggioOperatore' as const, label: 'Messaggi dall\'operatore', desc: 'Notifica quando l\'operatore risponde a una pratica' },
                { key: 'emailRiepilogo' as const, label: 'Email riepilogo settimanale', desc: 'Ricevi un riepilogo settimanale via email' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <Switch checked={notifiche[item.key]} onCheckedChange={() => toggleNotifica(item.key)} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppImpostazioni;
