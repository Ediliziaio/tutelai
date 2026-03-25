import { Truck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export interface DatiDDTState {
  causale_trasporto: string;
  porto: 'Franco' | 'Assegnato';
  aspetto_beni: string;
  numero_colli: number;
  peso_kg: number;
  tipo_vettore: 'mittente' | 'destinatario' | 'vettore';
  vettore_denominazione: string;
  vettore_piva: string;
  vettore_targa: string;
}

export const defaultDatiDDT: DatiDDTState = {
  causale_trasporto: 'vendita',
  porto: 'Franco',
  aspetto_beni: '',
  numero_colli: 1,
  peso_kg: 0,
  tipo_vettore: 'mittente',
  vettore_denominazione: '',
  vettore_piva: '',
  vettore_targa: '',
};

const CAUSALI = [
  { value: 'vendita', label: 'Vendita' },
  { value: 'reso', label: 'Reso' },
  { value: 'omaggio', label: 'Omaggio/Campione' },
  { value: 'conto_lavoro', label: 'Conto Lavoro' },
  { value: 'deposito', label: 'Deposito' },
  { value: 'riparazione', label: 'Riparazione' },
  { value: 'altro', label: 'Altro' },
];

interface Props {
  dati: DatiDDTState;
  onChange: (d: DatiDDTState) => void;
}

export const DatiDDT = ({ dati, onChange }: Props) => {
  const [open, setOpen] = useState(true);
  const upd = (partial: Partial<DatiDDTState>) => onChange({ ...dati, ...partial });

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-muted/50 rounded-xl p-4">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Dati Trasporto (DDT)</h3>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Causale trasporto *</Label>
              <Select value={dati.causale_trasporto} onValueChange={v => upd({ causale_trasporto: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CAUSALI.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Porto</Label>
              <Select value={dati.porto} onValueChange={v => upd({ porto: v as any })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Franco">Franco (mittente)</SelectItem>
                  <SelectItem value="Assegnato">Assegnato (destinatario)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Aspetto dei beni</Label>
              <Input className="h-8 text-xs" placeholder="Scatole, Colli..." value={dati.aspetto_beni} onChange={e => upd({ aspetto_beni: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">N° colli</Label>
              <Input type="number" className="h-8 text-xs" min={1} value={dati.numero_colli} onChange={e => upd({ numero_colli: Number(e.target.value) })} />
            </div>
            <div>
              <Label className="text-xs">Peso (kg)</Label>
              <Input type="number" className="h-8 text-xs" min={0} step={0.1} value={dati.peso_kg} onChange={e => upd({ peso_kg: Number(e.target.value) })} />
            </div>
          </div>
          {/* Vettore */}
          <div>
            <Label className="text-xs font-semibold">Vettore</Label>
            <div className="flex gap-2 mt-1">
              {(['mittente', 'destinatario', 'vettore'] as const).map(t => (
                <Button key={t} type="button" size="sm" variant={dati.tipo_vettore === t ? 'default' : 'outline'} className="h-7 text-xs capitalize" onClick={() => upd({ tipo_vettore: t })}>
                  {t === 'vettore' ? 'Vettore terzo' : `Mezzo ${t}`}
                </Button>
              ))}
            </div>
          </div>
          {dati.tipo_vettore === 'vettore' && (
            <div className="grid grid-cols-3 gap-3 bg-background/60 p-3 rounded-lg">
              <div>
                <Label className="text-xs">Denominazione</Label>
                <Input className="h-8 text-xs" value={dati.vettore_denominazione} onChange={e => upd({ vettore_denominazione: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">P.IVA vettore</Label>
                <Input className="h-8 text-xs" value={dati.vettore_piva} onChange={e => upd({ vettore_piva: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">Targa</Label>
                <Input className="h-8 text-xs" value={dati.vettore_targa} onChange={e => upd({ vettore_targa: e.target.value })} />
              </div>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};
