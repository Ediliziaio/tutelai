import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RigaDocumento } from '@/types/fatturazione';

interface RigaExpandedProps {
  riga: RigaDocumento;
  onUpdate: (updates: Partial<RigaDocumento>) => void;
}

export function RigaExpanded({ riga: r, onUpdate }: RigaExpandedProps) {
  return (
    <div className="bg-muted border-l-2 border-primary/30 ml-1 sm:ml-4 p-3 mb-2 rounded-r-lg space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Codice articolo</Label>
          <Input value={r.codice_articolo || ''} onChange={e => onUpdate({ codice_articolo: e.target.value })} placeholder="ART001" className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs">Sconto in €</Label>
          <Input type="number" value={r.sconto_valore || 0} onChange={e => onUpdate({ sconto_valore: Number(e.target.value), sconto_percentuale: 0 })} className="h-8 text-xs" min={0} />
        </div>
        <div>
          <Label className="text-xs">Riferimento amministrazione</Label>
          <Input value={r.riferimento_amministrazione || ''} onChange={e => onUpdate({ riferimento_amministrazione: e.target.value })} placeholder="Es. commessa XYZ" className="h-8 text-xs" />
        </div>
        <div>
          <Label className="text-xs">Tipo cessione</Label>
          <Select value={r.tipo_cessione || ''} onValueChange={v => onUpdate({ tipo_cessione: (v || undefined) as any })}>
            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Standard" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Standard</SelectItem>
              <SelectItem value="SC">Sconto/Abbuono</SelectItem>
              <SelectItem value="PR">Provvigione</SelectItem>
              <SelectItem value="AB">Abbuono</SelectItem>
              <SelectItem value="AC">Acconto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-full">
          <Label className="text-xs">Note riga</Label>
          <Textarea value={r.note_riga || ''} onChange={e => onUpdate({ note_riga: e.target.value })} rows={2} placeholder="Note visibili in fattura per questa riga" className="text-xs" />
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={r.ritenuta || false} onCheckedChange={c => onUpdate({ ritenuta: c })} />
          <Label className="text-xs">Soggetto a ritenuta d'acconto</Label>
        </div>
      </div>
    </div>
  );
}
