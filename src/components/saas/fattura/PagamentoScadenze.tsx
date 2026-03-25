import { useState, useMemo } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { it } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { METODI_PAGAMENTO_SDI, type CodiceMetodoPagamento, type ScadenzaPagamento } from '@/types/fatturazione';
import { formatEuro, round2 } from './calcoliDocumento';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { validateIBAN } from '@/lib/utils/ibanValidator';

interface PagamentoScadenzeProps {
  metodoPagamento: CodiceMetodoPagamento;
  onMetodoChange: (v: CodiceMetodoPagamento) => void;
  iban: string;
  onIbanChange: (v: string) => void;
  bic: string;
  onBicChange: (v: string) => void;
  intestatario: string;
  onIntestatarioChange: (v: string) => void;
  nomeBanca: string;
  onNomeBancaChange: (v: string) => void;
  scadenze: ScadenzaPagamento[];
  onScadenzeChange: (v: ScadenzaPagamento[]) => void;
  totaleDaPagare: number;
  dataEmissione: Date;
}

const PRESETS = ['30gg', '60gg', '90gg', '30/60gg', '30/60/90gg'] as const;

export function PagamentoScadenze(props: PagamentoScadenzeProps) {
  const isBonifico = props.metodoPagamento === 'MP05';
  const ibanValidation = useMemo(() => validateIBAN(props.iban), [props.iban]);

  const applicaPreset = (preset: string) => {
    const days = preset.replace('gg', '').split('/').map(Number);
    const importoRata = round2(props.totaleDaPagare / days.length);
    const newScadenze: ScadenzaPagamento[] = days.map((d, i) => ({
      numero_rata: i + 1,
      data_scadenza: format(addDays(props.dataEmissione, d), 'yyyy-MM-dd'),
      importo: i === days.length - 1 ? round2(props.totaleDaPagare - importoRata * (days.length - 1)) : importoRata,
      metodo_pagamento: props.metodoPagamento,
      iban: isBonifico ? props.iban : undefined,
      pagato: false,
    }));
    props.onScadenzeChange(newScadenze);
  };

  const addScadenza = () => {
    props.onScadenzeChange([...props.scadenze, {
      numero_rata: props.scadenze.length + 1,
      data_scadenza: format(addDays(props.dataEmissione, 30), 'yyyy-MM-dd'),
      importo: 0,
      metodo_pagamento: props.metodoPagamento,
      pagato: false,
    }]);
  };

  const updateScadenza = (i: number, updates: Partial<ScadenzaPagamento>) => {
    props.onScadenzeChange(props.scadenze.map((s, idx) => idx === i ? { ...s, ...updates } : s));
  };

  const removeScadenza = (i: number) => {
    props.onScadenzeChange(props.scadenze.filter((_, idx) => idx !== i));
  };

  const distribuisci = () => {
    if (props.scadenze.length === 0) return;
    const importoRata = round2(props.totaleDaPagare / props.scadenze.length);
    props.onScadenzeChange(props.scadenze.map((s, i) => ({
      ...s,
      importo: i === props.scadenze.length - 1 ? round2(props.totaleDaPagare - importoRata * (props.scadenze.length - 1)) : importoRata,
    })));
  };

  const totScadenze = round2(props.scadenze.reduce((s, r) => s + r.importo, 0));
  const mismatch = props.scadenze.length > 0 && Math.abs(totScadenze - props.totaleDaPagare) > 0.01;

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Modalità di Pagamento</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">Metodo pagamento *</Label>
          <Select value={props.metodoPagamento} onValueChange={v => props.onMetodoChange(v as CodiceMetodoPagamento)}>
            <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['MP05', 'MP01', 'MP02', 'MP08', 'MP09', 'MP12', 'MP19', 'MP23'] as CodiceMetodoPagamento[]).map(k => (
                <SelectItem key={k} value={k}>{k} — {METODI_PAGAMENTO_SDI[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* IBAN */}
      {isBonifico && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-primary/5 border border-primary/10 rounded-lg p-3">
          <div>
            <Label className="text-xs">IBAN</Label>
            <Input value={props.iban} onChange={e => props.onIbanChange(e.target.value)} className={cn("font-mono uppercase text-xs h-8", !ibanValidation.valid && props.iban && "border-destructive")} maxLength={34} />
            {!ibanValidation.valid && props.iban && (
              <p className="text-[10px] text-destructive mt-0.5">{ibanValidation.error}</p>
            )}
          </div>
          <div>
            <Label className="text-xs">Intestatario conto</Label>
            <Input value={props.intestatario} onChange={e => props.onIntestatarioChange(e.target.value)} className="text-xs h-8" />
          </div>
          <div>
            <Label className="text-xs">BIC/SWIFT</Label>
            <Input value={props.bic} onChange={e => props.onBicChange(e.target.value)} className="font-mono uppercase text-xs h-8" />
          </div>
          <div>
            <Label className="text-xs">Nome Banca</Label>
            <Input value={props.nomeBanca} onChange={e => props.onNomeBancaChange(e.target.value)} className="text-xs h-8" />
          </div>
        </div>
      )}

      {/* Scadenze */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Scadenze di pagamento</p>
          <Button onClick={addScadenza} variant="ghost" size="sm"><Plus className="h-3.5 w-3.5 mr-1" /> Aggiungi rata</Button>
        </div>

        {/* Preset */}
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => applicaPreset(p)}
              className="text-xs px-2.5 py-1 border border-border rounded-full hover:bg-primary/10 hover:border-primary/30 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Rate */}
        {props.scadenze.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_auto] gap-2 items-end bg-muted p-3 rounded-lg">
            <div>
              <Label className="text-xs">Rata {i + 1} — Scadenza</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal h-8 text-xs">
                    <CalendarIcon className="mr-2 h-3 w-3" />
                    {s.data_scadenza ? format(new Date(s.data_scadenza), 'dd/MM/yyyy', { locale: it }) : 'Seleziona'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={s.data_scadenza ? new Date(s.data_scadenza) : undefined} onSelect={d => d && updateScadenza(i, { data_scadenza: format(d, 'yyyy-MM-dd') })} className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs">Importo €</Label>
              <Input type="number" value={s.importo} onChange={e => updateScadenza(i, { importo: Number(e.target.value) })} className="h-8 text-xs font-mono" />
            </div>
            <div className="flex gap-1 items-end pb-0.5">
              {s.pagato ? (
                <Badge className="bg-secondary/10 text-secondary"><Check className="h-3 w-3 mr-1" /> Pagata</Badge>
              ) : (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => updateScadenza(i, { pagato: true, pagato_at: new Date().toISOString() })}>
                  Segna pagata
                </Button>
              )}
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeScadenza(i)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}

        {/* Mismatch warning */}
        {mismatch && (
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-3 flex items-center justify-between">
            <p className="text-xs text-accent-foreground">
              Totale rate ({formatEuro(totScadenze)}) ≠ Totale da pagare ({formatEuro(props.totaleDaPagare)})
            </p>
            <Button onClick={distribuisci} size="sm" variant="outline" className="text-xs">Distribuisci</Button>
          </div>
        )}
      </div>
    </div>
  );
}
