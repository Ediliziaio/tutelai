import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockOperatori } from '@/data/mockDashboardData';
import { User, Building2, Receipt, Bell, Users, Save, Upload, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminImpostazioni = () => {
  const { toast } = useToast();

  // Profilo
  const [nome, setNome] = useState('Super Admin');
  const [emailProfilo, setEmailProfilo] = useState('admin@impresaleggera.it');
  const [telefonoProfilo, setTelefonoProfilo] = useState('02 1234567');

  // Azienda
  const [ragioneSociale, setRagioneSociale] = useState('Impresa Leggera S.r.l.');
  const [piva, setPiva] = useState('12345678901');
  const [cf, setCf] = useState('12345678901');
  const [sdi, setSdi] = useState('M5UXCR1');
  const [pec, setPec] = useState('impresaleggera@pec.it');
  const [indirizzo, setIndirizzo] = useState('Via Esempio 1, 20100 Milano (MI)');
  const [emailAzienda, setEmailAzienda] = useState('info@impresaleggera.it');
  const [telefono, setTelefono] = useState('02 9876543');

  // Fatturazione
  const [iban, setIban] = useState('IT60X0542811101000000123456');
  const [intestatario, setIntestatario] = useState('Impresa Leggera S.r.l.');
  const [banca, setBanca] = useState('Intesa Sanpaolo');
  const [regime, setRegime] = useState('ordinario');
  const [prefissoFattura, setPrefissoFattura] = useState('INV');
  const [prossimoNumero, setProssimoNumero] = useState('013');

  // Notifiche
  const [notifiche, setNotifiche] = useState({
    nuovaPratica: true,
    praticaCompletata: true,
    praticaScaduta: true,
    nuovaFattura: true,
    fatturaPagata: true,
    fatturaScaduta: true,
    nuovoCliente: true,
    emailSolleciti: true,
  });

  const toggleNotifica = (key: keyof typeof notifiche) => {
    setNotifiche(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => toast({ title: '✓ Impostazioni salvate', description: 'Le modifiche sono state applicate.' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-subtitle text-slate-900">Impostazioni</h1>
          <p className="text-sm text-slate-500">Configura la piattaforma</p>
        </div>
        <Button onClick={handleSave} className="gap-1.5"><Save className="h-4 w-4" /> Salva</Button>
      </div>

      <Tabs defaultValue="profilo">
        <TabsList className="mb-6 w-full justify-start overflow-x-auto">
          <TabsTrigger value="profilo" className="gap-1.5"><User className="h-3.5 w-3.5" /> Profilo</TabsTrigger>
          <TabsTrigger value="azienda" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Azienda</TabsTrigger>
          <TabsTrigger value="fatturazione" className="gap-1.5"><Receipt className="h-3.5 w-3.5" /> Fatturazione</TabsTrigger>
          <TabsTrigger value="notifiche" className="gap-1.5"><Bell className="h-3.5 w-3.5" /> Notifiche</TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Team</TabsTrigger>
        </TabsList>

        {/* Profilo */}
        <TabsContent value="profilo">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Profilo Personale</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center text-xl font-bold text-sky-700">SA</div>
                <div>
                  <Button variant="outline" size="sm" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Cambia foto</Button>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Nome completo</Label><Input value={nome} onChange={e => setNome(e.target.value)} className="mt-1" /></div>
                <div><Label>Email</Label><Input type="email" value={emailProfilo} onChange={e => setEmailProfilo(e.target.value)} className="mt-1" /></div>
                <div><Label>Telefono</Label><Input value={telefonoProfilo} onChange={e => setTelefonoProfilo(e.target.value)} className="mt-1" /></div>
                <div><Label>Ruolo</Label><Input value="SuperAdmin" disabled className="mt-1" /></div>
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

        {/* Azienda */}
        <TabsContent value="azienda">
          <div className="max-w-2xl bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Dati Aziendali</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 border-2 border-dashed border-slate-300">Logo</div>
              <div>
                <Button variant="outline" size="sm" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Carica logo</Button>
                <p className="text-[10px] text-slate-400 mt-1">Apparirà nelle fatture e documenti</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><Label>Ragione Sociale</Label><Input value={ragioneSociale} onChange={e => setRagioneSociale(e.target.value)} className="mt-1" /></div>
              <div><Label>Partita IVA</Label><Input value={piva} onChange={e => setPiva(e.target.value)} className="mt-1 font-mono" /></div>
              <div><Label>Codice Fiscale</Label><Input value={cf} onChange={e => setCf(e.target.value)} className="mt-1 font-mono" /></div>
              <div><Label>Codice SDI</Label><Input value={sdi} onChange={e => setSdi(e.target.value)} className="mt-1 font-mono" /></div>
              <div><Label>PEC</Label><Input type="email" value={pec} onChange={e => setPec(e.target.value)} className="mt-1" /></div>
              <div><Label>Email principale</Label><Input type="email" value={emailAzienda} onChange={e => setEmailAzienda(e.target.value)} className="mt-1" /></div>
              <div className="sm:col-span-2"><Label>Indirizzo</Label><Input value={indirizzo} onChange={e => setIndirizzo(e.target.value)} className="mt-1" /></div>
              <div><Label>Telefono</Label><Input value={telefono} onChange={e => setTelefono(e.target.value)} className="mt-1" /></div>
            </div>
          </div>
        </TabsContent>

        {/* Fatturazione */}
        <TabsContent value="fatturazione">
          <div className="max-w-2xl space-y-6">
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Dati Bancari Default</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><Label>IBAN</Label><Input value={iban} onChange={e => setIban(e.target.value)} className="mt-1 font-mono" /></div>
                <div><Label>Intestatario</Label><Input value={intestatario} onChange={e => setIntestatario(e.target.value)} className="mt-1" /></div>
                <div><Label>Banca</Label><Input value={banca} onChange={e => setBanca(e.target.value)} className="mt-1" /></div>
              </div>
            </div>
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Regime Fiscale</h3>
              <Select value={regime} onValueChange={setRegime}>
                <SelectTrigger className="w-full sm:w-[300px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ordinario">Regime Ordinario</SelectItem>
                  <SelectItem value="forfettario">Regime Forfettario</SelectItem>
                  <SelectItem value="minimi">Regime dei Minimi</SelectItem>
                </SelectContent>
              </Select>
              {regime === 'forfettario' && (
                <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg p-2">Contribuente forfettario — non soggetto IVA ex art. 1, commi 54-89, L. 190/2014</p>
              )}
            </div>
            <div className="bg-white border rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Numerazione Fatture</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Prefisso</Label><Input value={prefissoFattura} onChange={e => setPrefissoFattura(e.target.value)} className="mt-1 font-mono" /></div>
                <div><Label>Prossimo numero</Label><Input value={prossimoNumero} onChange={e => setProssimoNumero(e.target.value)} className="mt-1 font-mono" /></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Anteprima: {prefissoFattura}-2026-{prossimoNumero}</p>
            </div>
          </div>
        </TabsContent>

        {/* Notifiche */}
        <TabsContent value="notifiche">
          <div className="max-w-2xl bg-white border rounded-xl p-6">
            <h3 className="font-semibold text-slate-800 mb-4">Preferenze Notifiche</h3>
            <div className="space-y-4">
              {[
                { key: 'nuovaPratica' as const, label: 'Nuova pratica ricevuta', desc: 'Ricevi una notifica quando un cliente invia una richiesta' },
                { key: 'praticaCompletata' as const, label: 'Pratica completata', desc: 'Notifica al completamento di una pratica' },
                { key: 'praticaScaduta' as const, label: 'Pratica in scadenza', desc: 'Avviso 7 giorni prima della scadenza' },
                { key: 'nuovaFattura' as const, label: 'Nuova fattura emessa', desc: 'Conferma emissione fattura' },
                { key: 'fatturaPagata' as const, label: 'Fattura pagata', desc: 'Notifica alla ricezione del pagamento' },
                { key: 'fatturaScaduta' as const, label: 'Fattura scaduta', desc: 'Avviso fatture non pagate oltre scadenza' },
                { key: 'nuovoCliente' as const, label: 'Nuovo cliente registrato', desc: 'Notifica alla registrazione di un nuovo cliente' },
                { key: 'emailSolleciti' as const, label: 'Email solleciti automatici', desc: 'Invio automatico solleciti per fatture scadute' },
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

        {/* Team */}
        <TabsContent value="team">
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">Team Operatori</h3>
              <Button size="sm" className="gap-1.5"><Users className="h-3.5 w-3.5" /> Invita operatore</Button>
            </div>
            <div className="bg-white border rounded-xl divide-y">
              {mockOperatori.map(o => (
                <div key={o.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">{o.avatar_iniziali}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{o.nome}</p>
                      <p className="text-xs text-slate-400">{o.pratiche_completate} pratiche completate · ⭐ {o.rating}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">Operatore</Badge>
                    <Button variant="ghost" size="sm" className="text-xs">Modifica</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminImpostazioni;
