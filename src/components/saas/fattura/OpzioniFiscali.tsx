import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { TIPI_RITENUTA, CAUSALI_RITENUTA, TIPI_CASSA, type CodiceTipoRitenuta, type CodiceCausaleRitenuta, type CodiceTipoCassa } from '@/types/fatturazione';
import { formatEuro, type OpzioniRitenuta, type OpzioniCassa } from './calcoliDocumento';
import { useState } from 'react';

interface OpzioniFiscaliProps {
  bolloVirtuale: boolean;
  bolloObbligatorio: boolean;
  onBolloChange: (v: boolean) => void;
  ivaPerCassa: boolean;
  onIvaPerCassaChange: (v: boolean) => void;
  reverseCharge: boolean;
  onReverseChargeChange: (v: boolean) => void;
  splitPayment: boolean;
  onSplitPaymentChange: (v: boolean) => void;
  showSplitPayment: boolean;
  ritenuta: OpzioniRitenuta;
  onRitenutaChange: (v: OpzioniRitenuta) => void;
  ritenutaImporto: number;
  ritenutaImponibile: number;
  cassa: OpzioniCassa;
  onCassaChange: (v: OpzioniCassa) => void;
}

export function OpzioniFiscali(props: OpzioniFiscaliProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-muted/50 rounded-xl">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4">
          <h3 className="text-sm font-semibold text-foreground">Opzioni Fiscali</h3>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>

        <CollapsibleContent className="px-4 pb-4 space-y-0">
          {/* Bollo */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium">Bollo Virtuale (€2,00)</p>
              <p className="text-xs text-muted-foreground">
                Obbligatorio per fatture esenti IVA con totale &gt; €77,47
                {props.bolloObbligatorio && <span className="text-accent font-medium"> — Obbligatorio</span>}
              </p>
            </div>
            <Switch checked={props.bolloVirtuale} onCheckedChange={props.onBolloChange} />
          </div>

          {/* IVA per cassa */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium">IVA per cassa (art. 32-bis D.L. 83/2012)</p>
              <p className="text-xs text-muted-foreground">IVA esigibile all'effettivo pagamento</p>
            </div>
            <Switch checked={props.ivaPerCassa} onCheckedChange={props.onIvaPerCassaChange} />
          </div>

          {/* Reverse charge */}
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium">Inversione Contabile (Reverse Charge)</p>
              <p className="text-xs text-muted-foreground">Art. 17 DPR 633/72</p>
            </div>
            <Switch checked={props.reverseCharge} onCheckedChange={props.onReverseChargeChange} />
          </div>

          {/* Split payment */}
          {props.showSplitPayment && (
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="text-sm font-medium">Scissione Pagamenti (Split Payment)</p>
                <p className="text-xs text-muted-foreground">Art. 17-ter — IVA versata dalla PA</p>
              </div>
              <Switch checked={props.splitPayment} onCheckedChange={props.onSplitPaymentChange} />
            </div>
          )}

          {/* Ritenuta */}
          <div className="py-3 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium">Ritenuta d'acconto</p>
                <p className="text-xs text-muted-foreground">Trattenuta dal committente</p>
              </div>
              <Switch checked={props.ritenuta.attiva} onCheckedChange={v => props.onRitenutaChange({ ...props.ritenuta, attiva: v })} />
            </div>
            {props.ritenuta.attiva && (
              <div className="grid grid-cols-3 gap-3 bg-muted p-3 rounded-lg">
                <div>
                  <Label className="text-xs">Tipo</Label>
                  <Select value={props.ritenuta.tipo} onValueChange={v => props.onRitenutaChange({ ...props.ritenuta, tipo: v as CodiceTipoRitenuta })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIPI_RITENUTA).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{k} — {v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Aliquota %</Label>
                  <Input type="number" value={props.ritenuta.aliquota} onChange={e => props.onRitenutaChange({ ...props.ritenuta, aliquota: Number(e.target.value) })} className="h-8 text-xs" />
                </div>
                <div>
                  <Label className="text-xs">Causale</Label>
                  <Select value={props.ritenuta.causale} onValueChange={v => props.onRitenutaChange({ ...props.ritenuta, causale: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CAUSALI_RITENUTA).slice(0, 10).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{k} — {v.substring(0, 40)}...</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-3 bg-accent/10 border border-accent/20 rounded p-2">
                  <p className="text-xs text-accent-foreground">
                    Ritenuta: <strong>{formatEuro(props.ritenutaImporto)}</strong>
                    {' '}su imponibile <strong>{formatEuro(props.ritenutaImponibile)}</strong>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cassa previdenziale */}
          <div className="py-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-medium">Cassa Previdenziale</p>
                <p className="text-xs text-muted-foreground">Contributo da aggiungere all'imponibile</p>
              </div>
              <Switch checked={props.cassa.attiva} onCheckedChange={v => props.onCassaChange({ ...props.cassa, attiva: v })} />
            </div>
            {props.cassa.attiva && (
              <div className="grid grid-cols-2 gap-3 bg-muted p-3 rounded-lg">
                <div>
                  <Label className="text-xs">Tipo cassa</Label>
                  <Select value={props.cassa.tipo} onValueChange={v => props.onCassaChange({ ...props.cassa, tipo: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(TIPI_CASSA).slice(0, 10).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{k} — {v.substring(0, 35)}...</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Aliquota %</Label>
                  <Input type="number" value={props.cassa.aliquota} onChange={e => props.onCassaChange({ ...props.cassa, aliquota: Number(e.target.value) })} className="h-8 text-xs" />
                </div>
                <div>
                  <Label className="text-xs">IVA su cassa %</Label>
                  <Input value={props.cassa.aliquota_iva} onChange={e => props.onCassaChange({ ...props.cassa, aliquota_iva: e.target.value })} className="h-8 text-xs" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={props.cassa.soggetta_ritenuta} onCheckedChange={v => props.onCassaChange({ ...props.cassa, soggetta_ritenuta: v })} />
                  <Label className="text-xs">Soggetta a ritenuta</Label>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
