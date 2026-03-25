import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import type { DocumentoFiscale } from '@/types/fatturazione';

const fmtCur = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fattura: DocumentoFiscale | null;
}

export const RegistraIncassoPanel = ({ open, onOpenChange, fattura }: Props) => {
  const residuo = fattura ? fattura.totale_da_pagare - (fattura.importo_pagato ?? 0) : 0;
  const [importo, setImporto] = useState(residuo);
  const [metodo, setMetodo] = useState('bonifico');
  const [riferimento, setRiferimento] = useState('');
  const [note, setNote] = useState('');

  // Reset on open
  const handleOpen = (v: boolean) => {
    if (v && fattura) {
      const r = fattura.totale_da_pagare - (fattura.importo_pagato ?? 0);
      setImporto(r);
      setMetodo('bonifico');
      setRiferimento('');
      setNote('');
    }
    onOpenChange(v);
  };

  const handleSubmit = () => {
    if (!fattura || importo <= 0) return;
    const isParziale = importo < residuo;
    toast({
      title: `✓ Incasso di ${fmtCur(importo)} registrato`,
      description: `Fattura ${fattura.numero}${isParziale ? ' — incasso parziale' : ' — saldata'}`,
    });
    onOpenChange(false);
  };

  if (!fattura) return null;

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-lg">Registra Incasso</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          {/* Fattura info */}
          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
            <p className="text-xs text-muted-foreground">Fattura collegata</p>
            <p className="font-mono text-sm font-semibold">{fattura.numero}</p>
            <p className="text-xs text-muted-foreground">{fattura.cliente_snapshot.ragione_sociale}</p>
            <p className="text-xs">Residuo da incassare: <strong className="text-primary">{fmtCur(residuo)}</strong></p>
          </div>

          <div>
            <Label className="text-xs">Importo incassato *</Label>
            <Input type="number" value={importo} onChange={e => setImporto(Number(e.target.value))} min={0} max={residuo} step={0.01} className="font-mono" />
            {importo > 0 && importo < residuo && (
              <p className="text-xs text-amber-600 mt-1">Incasso parziale — residuo: {fmtCur(residuo - importo)}</p>
            )}
          </div>

          <div>
            <Label className="text-xs">Metodo di pagamento</Label>
            <Select value={metodo} onValueChange={setMetodo}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bonifico">Bonifico bancario</SelectItem>
                <SelectItem value="contanti">Contanti</SelectItem>
                <SelectItem value="assegno">Assegno</SelectItem>
                <SelectItem value="carta">Carta di pagamento</SelectItem>
                <SelectItem value="riba">RI.BA.</SelectItem>
                <SelectItem value="sdd">SDD / RID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Riferimento (CRO / IBAN mittente)</Label>
            <Input value={riferimento} onChange={e => setRiferimento(e.target.value)} placeholder="Es. CRO 04210..." />
          </div>

          <div>
            <Label className="text-xs">Note</Label>
            <Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={importo <= 0}>
            Registra Incasso
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
