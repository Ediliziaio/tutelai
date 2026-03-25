import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { ValidationError } from '@/lib/validators/fatturaValidator';

interface ValidationIndicatorProps {
  errors: ValidationError[];
}

const SEZIONE_LABELS: Record<string, string> = {
  cliente: 'Cliente',
  documento: 'Documento',
  righe: 'Righe',
  pagamento: 'Pagamento',
  riferimenti: 'Riferimenti',
};

export function ValidationIndicator({ errors }: ValidationIndicatorProps) {
  if (errors.length === 0) {
    return (
      <div className="hidden sm:flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Pronto</span>
      </div>
    );
  }

  const grouped = errors.reduce<Record<string, ValidationError[]>>((acc, e) => {
    (acc[e.sezione] ??= []).push(e);
    return acc;
  }, {});

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-destructive/10 transition-colors">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          <Badge variant="destructive" className="text-[10px] h-4 px-1.5 rounded-full">
            {errors.length}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="p-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Errori di validazione</p>
          <p className="text-xs text-muted-foreground">{errors.length} {errors.length === 1 ? 'problema' : 'problemi'} da risolvere</p>
        </div>
        <div className="max-h-64 overflow-y-auto p-2 space-y-2">
          {Object.entries(grouped).map(([sezione, errs]) => (
            <div key={sezione}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">
                {SEZIONE_LABELS[sezione] || sezione}
              </p>
              {errs.map((e, i) => (
                <div key={i} className="flex items-start gap-2 px-1 py-1">
                  <AlertTriangle className="h-3 w-3 text-destructive shrink-0 mt-0.5" />
                  <span className="text-xs text-foreground">{e.messaggio}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
