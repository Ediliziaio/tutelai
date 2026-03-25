import { cn } from '@/lib/utils';

type StatusType =
  | 'completata' | 'pagata'
  | 'in_corso' | 'in_revisione'
  | 'in_attesa' | 'inviata'
  | 'scaduta'
  | 'bozza' | 'da_fare'
  | 'annullata'
  | 'completato'
  | 'attivo' | 'trial' | 'sospeso' | 'churned';

const statusStyles: Record<string, string> = {
  completata: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pagata: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completato: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  attivo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  in_corso: 'bg-sky-50 text-sky-700 border-sky-200',
  in_revisione: 'bg-violet-50 text-violet-700 border-violet-200',
  in_attesa: 'bg-amber-50 text-amber-700 border-amber-200',
  inviata: 'bg-amber-50 text-amber-700 border-amber-200',
  trial: 'bg-amber-50 text-amber-700 border-amber-200',
  scaduta: 'bg-red-50 text-red-700 border-red-200',
  bozza: 'bg-slate-100 text-slate-600 border-slate-200',
  da_fare: 'bg-slate-100 text-slate-600 border-slate-200',
  annullata: 'bg-slate-50 text-slate-400 border-slate-200',
  sospeso: 'bg-slate-50 text-slate-400 border-slate-200',
  churned: 'bg-red-50 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  completata: 'Completata',
  pagata: 'Pagata',
  completato: 'Completato',
  attivo: 'Attivo',
  in_corso: 'In Corso',
  in_revisione: 'In Revisione',
  in_attesa: 'In Attesa',
  inviata: 'Inviata',
  trial: 'Trial',
  scaduta: 'Scaduta',
  bozza: 'Bozza',
  da_fare: 'Da Fare',
  annullata: 'Annullata',
  sospeso: 'Sospeso',
  churned: 'Churned',
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide font-mono-accent',
      statusStyles[status] ?? 'bg-slate-100 text-slate-600 border-slate-200',
      className
    )}
  >
    {statusLabels[status] ?? status}
  </span>
);
