import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface RiferimentiAllegatiProps {
  showPA: boolean;
  cig: string;
  onCigChange: (v: string) => void;
  cup: string;
  onCupChange: (v: string) => void;
  codiceCommessa: string;
  onCodiceCommessaChange: (v: string) => void;
  noteDocumento: string;
  onNoteDocumentoChange: (v: string) => void;
  noteInterne: string;
  onNoteInterneChange: (v: string) => void;
}

export function RiferimentiAllegati(props: RiferimentiAllegatiProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="bg-muted/50 rounded-xl">
        <CollapsibleTrigger className="w-full flex items-center justify-between p-4">
          <h3 className="text-sm font-semibold text-foreground">Riferimenti e Note</h3>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-4 space-y-3">
          {/* CIG/CUP (PA) */}
          {props.showPA && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">CIG *</Label>
                <Input value={props.cig} onChange={e => props.onCigChange(e.target.value)} placeholder="Codice Gara" maxLength={10} className="h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs">CUP</Label>
                <Input value={props.cup} onChange={e => props.onCupChange(e.target.value)} placeholder="Codice Progetto" maxLength={15} className="h-8 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Codice Commessa</Label>
                <Input value={props.codiceCommessa} onChange={e => props.onCodiceCommessaChange(e.target.value)} className="h-8 text-xs" />
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs">Note in fattura</Label>
            <Textarea value={props.noteDocumento} onChange={e => props.onNoteDocumentoChange(e.target.value)} rows={2} placeholder="Testo libero che appare in calce alla fattura..." className="text-xs" />
          </div>
          <div>
            <Label className="text-xs">Note interne (non visibili al cliente)</Label>
            <Textarea value={props.noteInterne} onChange={e => props.onNoteInterneChange(e.target.value)} rows={2} className="text-xs" />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
