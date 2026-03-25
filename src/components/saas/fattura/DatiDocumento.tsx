import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TIPI_DOCUMENTO_FATTURAPA, type CodiceTipoDocumento } from '@/types/fatturazione';
import { cn } from '@/lib/utils';

interface DatiDocumentoProps {
  tipoDocumento: CodiceTipoDocumento;
  numero: string;
  serie: string;
  dataEmissione: Date;
  dataScadenza: Date;
  onChangeTipo: (v: CodiceTipoDocumento) => void;
  onChangeNumero: (v: string) => void;
  onChangeSerie: (v: string) => void;
  onChangeDataEmissione: (d: Date) => void;
  onChangeDataScadenza: (d: Date) => void;
}

const TIPI_PRINCIPALI: CodiceTipoDocumento[] = ['TD01', 'TD04', 'TD05', 'TD06', 'TD24', 'TD16'];

export function DatiDocumento(props: DatiDocumentoProps) {
  const isScaduta = props.dataScadenza < new Date();

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Dati Documento</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Tipo Documento *</Label>
          <Select value={props.tipoDocumento} onValueChange={v => props.onChangeTipo(v as CodiceTipoDocumento)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {TIPI_PRINCIPALI.map(k => (
                <SelectItem key={k} value={k}>{k} — {TIPI_DOCUMENTO_FATTURAPA[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Numero *</Label>
          <Input value={props.numero} readOnly className="font-mono bg-muted" placeholder="Auto-generato" />
        </div>
        <div>
          <Label className="text-xs">Serie</Label>
          <Input value={props.serie} onChange={e => props.onChangeSerie(e.target.value)} placeholder="A" maxLength={3} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">Data Emissione *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(props.dataEmissione, 'dd/MM/yyyy', { locale: it })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={props.dataEmissione} onSelect={d => d && props.onChangeDataEmissione(d)} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs">Data Scadenza</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-full justify-start text-left font-normal", isScaduta && "border-destructive text-destructive")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(props.dataScadenza, 'dd/MM/yyyy', { locale: it })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={props.dataScadenza} onSelect={d => d && props.onChangeDataScadenza(d)} className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label className="text-xs">Valuta</Label>
          <Select defaultValue="EUR">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR — Euro</SelectItem>
              <SelectItem value="USD">USD — Dollaro</SelectItem>
              <SelectItem value="GBP">GBP — Sterlina</SelectItem>
              <SelectItem value="CHF">CHF — Franco Svizzero</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
