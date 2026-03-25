import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { mockAnagraficaAzienda } from '@/data/mockDashboardData';
import { REGIMI_FISCALI, type CodiceRegimeFiscale } from '@/types/fatturazione';
import {
  Save, Building2, Hash, Receipt, FileText, Palette, Plug, Settings2, ExternalLink, CheckCircle, AlertTriangle, Info,
} from 'lucide-react';

const SDI_STATES = [
  { code: 'RC', nome: 'Ricevuta di Consegna', color: 'bg-emerald-100 text-emerald-700', desc: 'Fattura consegnata al destinatario.', azione: 'Nessuna azione richiesta.' },
  { code: 'NS', nome: 'Notifica di Scarto', color: 'bg-red-100 text-red-700', desc: 'Fattura scartata per errori formali.', azione: 'Correggere e reinviare entro 5 giorni.' },
  { code: 'MC', nome: 'Mancata Consegna', color: 'bg-amber-100 text-amber-700', desc: 'SDI non riesce a consegnare al destinatario.', azione: 'La fattura è disponibile nel Cassetto Fiscale del destinatario.' },
  { code: 'EC', nome: 'Esito Committente', color: 'bg-sky-100 text-sky-700', desc: 'La PA accetta o rifiuta la fattura (entro 15gg).', azione: 'Attendere risposta o contattare la PA.' },
  { code: 'DT', nome: 'Decorrenza Termini', color: 'bg-slate-100 text-slate-600', desc: 'PA non risponde entro 15 giorni.', azione: 'La fattura si considera accettata per silenzio-assenso.' },
];

const TEMPLATE_STYLES = [
  { id: 'classico', label: 'Classico', desc: 'Layout tradizionale con intestazione completa' },
  { id: 'moderno', label: 'Moderno', desc: 'Design pulito con accenti di colore' },
  { id: 'minimal', label: 'Minimal', desc: 'Essenziale, solo dati fondamentali' },
  { id: 'colorato', label: 'Colorato', desc: 'Intestazione a colori con sfondo' },
];

const PRESET_COLORS = ['#0EA5E9', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B', '#0F172A'];

const ImpostazioniFatturazione = () => {
  // Dati azienda
  const [ragioneSociale, setRagioneSociale] = useState(mockAnagraficaAzienda.ragione_sociale);
  const [partitaIva, setPartitaIva] = useState(mockAnagraficaAzienda.partita_iva);
  const [codiceFiscale, setCodiceFiscale] = useState(mockAnagraficaAzienda.codice_fiscale);
  const [regimeFiscale, setRegimeFiscale] = useState<CodiceRegimeFiscale>(mockAnagraficaAzienda.regime_fiscale);
  const [pec, setPec] = useState(mockAnagraficaAzienda.pec || '');
  const [email, setEmail] = useState(mockAnagraficaAzienda.email || '');
  const [telefono, setTelefono] = useState(mockAnagraficaAzienda.telefono || '');
  const [via, setVia] = useState(mockAnagraficaAzienda.indirizzo_via);
  const [civico, setCivico] = useState(mockAnagraficaAzienda.indirizzo_numero_civico || '');
  const [cap, setCap] = useState(mockAnagraficaAzienda.indirizzo_cap);
  const [comune, setComune] = useState(mockAnagraficaAzienda.indirizzo_comune);
  const [provincia, setProvincia] = useState(mockAnagraficaAzienda.indirizzo_provincia);
  const [codiceRea, setCodiceRea] = useState(mockAnagraficaAzienda.codice_rea || '');
  const [capitaleSociale, setCapitaleSociale] = useState(String(mockAnagraficaAzienda.capitale_sociale || ''));

  // Banca
  const [iban, setIban] = useState(mockAnagraficaAzienda.iban_principale || '');
  const [bic, setBic] = useState(mockAnagraficaAzienda.bic_swift || '');
  const [nomeBanca, setNomeBanca] = useState(mockAnagraficaAzienda.nome_banca || '');
  const [intestatario, setIntestatario] = useState(mockAnagraficaAzienda.intestatario_conto || '');

  // Numerazione
  const [prefissoFattura, setPrefissoFattura] = useState('FT');
  const [prefissoNC, setPrefissoNC] = useState('NC');
  const [prefissoND, setPrefissoND] = useState('ND');
  const [prefissoDDT, setPrefissoDDT] = useState('DDT');
  const [prefissoProforma, setPrefissoProforma] = useState('PRV');
  const [ultimoNumero, setUltimoNumero] = useState(String(mockAnagraficaAzienda.ultimo_numero_fattura));
  const annoCorrente = String(new Date().getFullYear());
  const [resetAnnuale, setResetAnnuale] = useState(true);

  // Defaults
  const [giorniScadenza, setGiorniScadenza] = useState('30');
  const [bolloAutomatico, setBolloAutomatico] = useState(true);
  const [notaPiePagina, setNotaPiePagina] = useState('');

  // Template
  const [templateScelto, setTemplateScelto] = useState('classico');
  const [colorePrimario, setColorePrimario] = useState('#0EA5E9');
  const [testoFooter, setTestoFooter] = useState('');
  const [mostraPrezzi, setMostraPrezzi] = useState(true);
  const [mostraSconto, setMostraSconto] = useState(true);
  const [mostraRiepilogoIva, setMostraRiepilogoIva] = useState(true);
  const [intestazioneCompatta, setIntestazioneCompatta] = useState(false);

  // Integrazioni
  const [providerSDI, setProviderSDI] = useState('aruba');
  const [apiKeySDI, setApiKeySDI] = useState('');
  const [exportCSV, setExportCSV] = useState(true);
  const [exportTeamSystem, setExportTeamSystem] = useState(false);
  const [exportZucchetti, setExportZucchetti] = useState(false);

  // Avanzate
  const [ivaPerCassa, setIvaPerCassa] = useState(false);
  const [splitPaymentAuto, setSplitPaymentAuto] = useState(true);
  const [sogliaBollo, setSogliaBollo] = useState('77.47');
  const [anniConservazione, setAnniConservazione] = useState('10');
  const [conservazioneSostitutiva, setConservazioneSostitutiva] = useState(false);

  const handleSave = () => {
    toast({ title: '✓ Impostazioni salvate', description: 'Le impostazioni di fatturazione sono state aggiornate.' });
  };

  const previewNumero = (prefix: string) => `${prefix}-${annoCorrente}-${String(Number(ultimoNumero) + 1).padStart(4, '0')}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium">Impresa Leggera › Impostazioni</p>
          <h1 className="text-2xl font-bold text-foreground">Impostazioni Fatturazione</h1>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 rounded-full px-5">
          <Save className="h-4 w-4 mr-1" /> Salva tutto
        </Button>
      </div>

      <Tabs defaultValue="azienda" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="azienda" className="gap-1.5"><Building2 className="h-3.5 w-3.5" /> Azienda</TabsTrigger>
          <TabsTrigger value="numeratori" className="gap-1.5"><Hash className="h-3.5 w-3.5" /> Numeratori</TabsTrigger>
          <TabsTrigger value="template" className="gap-1.5"><Palette className="h-3.5 w-3.5" /> Template PDF</TabsTrigger>
          <TabsTrigger value="integrazioni" className="gap-1.5"><Plug className="h-3.5 w-3.5" /> Integrazioni</TabsTrigger>
          <TabsTrigger value="avanzate" className="gap-1.5"><Settings2 className="h-3.5 w-3.5" /> Avanzate</TabsTrigger>
        </TabsList>

        {/* ── AZIENDA ── */}
        <TabsContent value="azienda" className="space-y-6 mt-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">Dati Azienda (Cedente/Prestatore)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-full sm:col-span-2">
                <Label className="text-xs">Ragione Sociale *</Label>
                <Input value={ragioneSociale} onChange={e => setRagioneSociale(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">Regime Fiscale *</Label>
                <Select value={regimeFiscale} onValueChange={v => setRegimeFiscale(v as CodiceRegimeFiscale)}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(REGIMI_FISCALI).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-xs">{k} — {v.split('(')[0].trim()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Partita IVA *</Label>
                <Input value={partitaIva} onChange={e => setPartitaIva(e.target.value)} className="font-mono text-sm" maxLength={11} />
              </div>
              <div>
                <Label className="text-xs">Codice Fiscale *</Label>
                <Input value={codiceFiscale} onChange={e => setCodiceFiscale(e.target.value)} className="font-mono text-sm" maxLength={16} />
              </div>
              <div>
                <Label className="text-xs">PEC *</Label>
                <Input value={pec} onChange={e => setPec(e.target.value)} className="text-sm" type="email" />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input value={email} onChange={e => setEmail(e.target.value)} className="text-sm" type="email" />
              </div>
              <div>
                <Label className="text-xs">Telefono</Label>
                <Input value={telefono} onChange={e => setTelefono(e.target.value)} className="text-sm" />
              </div>
              <Separator className="col-span-full my-2" />
              <div className="col-span-full sm:col-span-2">
                <Label className="text-xs">Via / Piazza *</Label>
                <Input value={via} onChange={e => setVia(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">N° civico</Label>
                <Input value={civico} onChange={e => setCivico(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">CAP *</Label>
                <Input value={cap} onChange={e => setCap(e.target.value)} className="text-sm" maxLength={5} />
              </div>
              <div>
                <Label className="text-xs">Comune *</Label>
                <Input value={comune} onChange={e => setComune(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">Provincia *</Label>
                <Input value={provincia} onChange={e => setProvincia(e.target.value)} className="text-sm uppercase" maxLength={2} />
              </div>
              <Separator className="col-span-full my-2" />
              <div>
                <Label className="text-xs">Codice REA</Label>
                <Input value={codiceRea} onChange={e => setCodiceRea(e.target.value)} className="text-sm" />
              </div>
              <div>
                <Label className="text-xs">Capitale Sociale €</Label>
                <Input type="number" value={capitaleSociale} onChange={e => setCapitaleSociale(e.target.value)} className="text-sm font-mono" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold text-card-foreground">Coordinate Bancarie</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-full">
                <Label className="text-xs">IBAN *</Label>
                <Input value={iban} onChange={e => setIban(e.target.value)} className="font-mono text-sm uppercase" maxLength={34} />
              </div>
              <div>
                <Label className="text-xs">BIC / SWIFT</Label>
                <Input value={bic} onChange={e => setBic(e.target.value)} className="font-mono text-sm uppercase" />
              </div>
              <div>
                <Label className="text-xs">Nome Banca</Label>
                <Input value={nomeBanca} onChange={e => setNomeBanca(e.target.value)} className="text-sm" />
              </div>
              <div className="col-span-full">
                <Label className="text-xs">Intestatario Conto</Label>
                <Input value={intestatario} onChange={e => setIntestatario(e.target.value)} className="text-sm" />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── NUMERATORI ── */}
        <TabsContent value="numeratori" className="mt-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-5 w-5 text-accent-foreground" />
              <h2 className="text-lg font-semibold text-card-foreground">Numerazione Documenti</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-5">
              I numeratori ripartono da 1 ogni anno se "Reset annuale" è attivo. Non possono essere ridotti se esistono già documenti emessi.
            </p>
            <div className="space-y-4">
              {[
                { label: 'Fatture', prefix: prefissoFattura, set: setPrefissoFattura },
                { label: 'Note di Credito', prefix: prefissoNC, set: setPrefissoNC },
                { label: 'Note di Debito', prefix: prefissoND, set: setPrefissoND },
                { label: 'DDT', prefix: prefissoDDT, set: setPrefissoDDT },
                { label: 'Pro-forma', prefix: prefissoProforma, set: setPrefissoProforma },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                  <span className="text-sm font-medium text-card-foreground w-32">{item.label}</span>
                  <div className="w-24">
                    <Input value={item.prefix} onChange={e => item.set(e.target.value)} className="text-sm font-mono h-8" />
                  </div>
                  <span className="text-xs text-muted-foreground">Preview:</span>
                  <code className="bg-muted px-2 py-1 rounded text-xs font-mono text-foreground">{previewNumero(item.prefix)}</code>
                </div>
              ))}
            </div>
            <Separator className="my-5" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Ultimo numero utilizzato</Label>
                <Input type="number" value={ultimoNumero} onChange={e => setUltimoNumero(e.target.value)} className="text-sm font-mono" />
              </div>
              <div>
                <Label className="text-xs">Anno corrente</Label>
                <Input value={annoCorrente} className="text-sm font-mono" readOnly />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <Switch checked={resetAnnuale} onCheckedChange={setResetAnnuale} />
                <Label className="text-xs">Reset numerazione annuale</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── TEMPLATE PDF ── */}
        <TabsContent value="template" className="space-y-6 mt-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Stile Template</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {TEMPLATE_STYLES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplateScelto(t.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${templateScelto === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}
                >
                  <p className="font-semibold text-sm text-card-foreground">{t.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                  {templateScelto === t.id && <CheckCircle className="h-4 w-4 text-primary mt-2" />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Colore Primario</h2>
            <div className="flex gap-3">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColorePrimario(c)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${colorePrimario === c ? 'border-foreground scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Testi e Opzioni</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Testo piè di pagina</Label>
                <Textarea value={testoFooter} onChange={e => setTestoFooter(e.target.value)} placeholder="Es. REA MI-12345 | Cap. Soc. €10.000" className="text-sm" rows={2} />
              </div>
              <div>
                <Label className="text-xs">Nota predefinita (tutte le fatture)</Label>
                <Input value={notaPiePagina} onChange={e => setNotaPiePagina(e.target.value)} placeholder="Es. Contributo CONAI assolto ove dovuto." className="text-sm" />
              </div>
              <Separator />
              <div className="space-y-3">
                {[
                  { label: 'Mostrare i prezzi unitari nelle righe', val: mostraPrezzi, set: setMostraPrezzi },
                  { label: 'Mostrare lo sconto nelle righe', val: mostraSconto, set: setMostraSconto },
                  { label: 'Mostrare il riepilogo IVA', val: mostraRiepilogoIva, set: setMostraRiepilogoIva },
                  { label: 'Intestazione azienda compatta (solo logo)', val: intestazioneCompatta, set: setIntestazioneCompatta },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <Label className="text-xs">{item.label}</Label>
                    <Switch checked={item.val} onCheckedChange={item.set} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── INTEGRAZIONI ── */}
        <TabsContent value="integrazioni" className="space-y-6 mt-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Sistema di Interscambio (SDI)</h2>
            <p className="text-xs text-muted-foreground mb-4">Configura il provider per l'invio automatico delle fatture elettroniche.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Provider SDI</Label>
                <Select value={providerSDI} onValueChange={setProviderSDI}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aruba">Aruba PEC</SelectItem>
                    <SelectItem value="infocert">InfoCert</SelectItem>
                    <SelectItem value="poste">Poste Italiane</SelectItem>
                    <SelectItem value="manuale">Invio manuale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">API Key / Credenziali</Label>
                <Input type="password" value={apiKeySDI} onChange={e => setApiKeySDI(e.target.value)} placeholder="Inserisci la chiave API..." className="text-sm" />
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast({ title: 'Test connessione', description: 'Connessione al provider SDI riuscita ✓' })}>
              Testa connessione
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Cassetto Fiscale — Agenzia delle Entrate</h2>
            <p className="text-xs text-muted-foreground mb-4">Le fatture inviate tramite SDI sono automaticamente disponibili nel Cassetto Fiscale.</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open('https://ivaservizi.agenziaentrate.gov.it/portale/', '_blank')}>
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Cassetto Fiscale AdE
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open('https://www.agenziaentrate.gov.it/portale/web/guest/fatture-e-corrispettivi', '_blank')}>
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Fatture e Corrispettivi
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1">
              <Info className="h-3 w-3" /> Queste pagine richiedono autenticazione con SPID, CIE o CNS.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Export per Software Contabilità</h2>
            <div className="space-y-3">
              {[
                { label: 'CSV generico', val: exportCSV, set: setExportCSV },
                { label: 'TeamSystem', val: exportTeamSystem, set: setExportTeamSystem },
                { label: 'Zucchetti', val: exportZucchetti, set: setExportZucchetti },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <Label className="text-xs">{item.label}</Label>
                  <Switch checked={item.val} onCheckedChange={item.set} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ── AVANZATE ── */}
        <TabsContent value="avanzate" className="space-y-6 mt-6">
          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Opzioni IVA</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Attiva IVA per cassa (art. 32-bis D.L. 83/2012)</Label>
                  <p className="text-[10px] text-muted-foreground">L'IVA diventa esigibile al momento dell'incasso.</p>
                </div>
                <Switch checked={ivaPerCassa} onCheckedChange={setIvaPerCassa} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Split payment automatico per clienti PA</Label>
                  <p className="text-[10px] text-muted-foreground">Attiva automaticamente la scissione dei pagamenti per le PA.</p>
                </div>
                <Switch checked={splitPaymentAuto} onCheckedChange={setSplitPaymentAuto} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs">Avviso automatico per bollo virtuale</Label>
                  <p className="text-[10px] text-muted-foreground">Calcola e avvisa quando il bollo da €2 è obbligatorio.</p>
                </div>
                <Switch checked={bolloAutomatico} onCheckedChange={setBolloAutomatico} />
              </div>
              <div className="max-w-xs">
                <Label className="text-xs">Soglia bollo virtuale (€)</Label>
                <Input type="number" value={sogliaBollo} onChange={e => setSogliaBollo(e.target.value)} className="text-sm font-mono" step="0.01" />
              </div>
              <div className="max-w-xs">
                <Label className="text-xs">Giorni scadenza default</Label>
                <Select value={giorniScadenza} onValueChange={setGiorniScadenza}>
                  <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Immediato</SelectItem>
                    <SelectItem value="15">15 giorni</SelectItem>
                    <SelectItem value="30">30 giorni</SelectItem>
                    <SelectItem value="60">60 giorni</SelectItem>
                    <SelectItem value="90">90 giorni</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-2">Conservazione Sostitutiva</h2>
            <div className="bg-muted rounded-lg p-3 mb-4 flex items-start gap-2">
              <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Le fatture elettroniche inviate tramite SDI sono automaticamente conservate dal Sistema di Interscambio per 10 anni (art. 39 DPR 633/72).
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Conservazione sostitutiva aggiuntiva</Label>
                <Switch checked={conservazioneSostitutiva} onCheckedChange={setConservazioneSostitutiva} />
              </div>
              <div className="max-w-xs">
                <Label className="text-xs">Anni di conservazione documenti</Label>
                <Input type="number" value={anniConservazione} onChange={e => setAnniConservazione(e.target.value)} className="text-sm font-mono" min={10} />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-4">Guida Stati SDI</h2>
            <div className="space-y-0">
              {SDI_STATES.map(s => (
                <div key={s.code} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <Badge className={`${s.color} font-mono text-xs shrink-0`}>{s.code}</Badge>
                  <div>
                    <p className="font-medium text-sm text-card-foreground">{s.nome}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                    <p className="text-xs text-primary mt-0.5">{s.azione}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pb-8">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 rounded-full px-8">
          <Save className="h-4 w-4 mr-1" /> Salva impostazioni
        </Button>
      </div>
    </div>
  );
};

export default ImpostazioniFatturazione;
