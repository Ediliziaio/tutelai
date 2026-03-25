import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { DocumentoFiscale } from '@/types/fatturazione';

const formatEuro = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
const formatDate = (d: string) => { try { return new Date(d).toLocaleDateString('it-IT'); } catch { return d; } };

interface Props {
  fatturaOriginale: DocumentoFiscale;
  motivoCredito: string;
  onMotivoChange: (v: string) => void;
  onStornoTotale: () => void;
  onStornoParziale: () => void;
}

const MOTIVI = [
  { value: 'reso', label: 'Reso merce' },
  { value: 'annullamento', label: 'Annullamento servizio' },
  { value: 'errore_fatturazione', label: 'Errore di fatturazione' },
  { value: 'sconto_postvendita', label: 'Sconto post-vendita' },
  { value: 'rimborso', label: 'Rimborso' },
  { value: 'altro', label: 'Altro (specificare nelle note)' },
];

export const NotaCreditoBanner = ({ fatturaOriginale, motivoCredito, onMotivoChange, onStornoTotale, onStornoParziale }: Props) => (
  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
      <div className="flex-1 space-y-3">
        <div>
          <p className="font-semibold text-amber-800 text-sm">Nota di Credito (TD04)</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Storno della fattura <strong>{fatturaOriginale.numero}</strong> del {formatDate(fatturaOriginale.data_emissione)}
            {' — '}Importo originale: <strong>{formatEuro(fatturaOriginale.totale_documento)}</strong>
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <Label className="text-xs text-amber-700">Motivo del credito *</Label>
            <Select value={motivoCredito} onValueChange={onMotivoChange}>
              <SelectTrigger className="h-8 text-xs bg-white border-amber-200"><SelectValue placeholder="Seleziona motivo" /></SelectTrigger>
              <SelectContent>
                {MOTIVI.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={onStornoTotale} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white h-8 text-xs">
            Storno totale automatico
          </Button>
          <Button onClick={onStornoParziale} size="sm" variant="ghost" className="text-amber-700 h-8 text-xs">
            Storno parziale manuale
          </Button>
        </div>
      </div>
    </div>
  </div>
);
