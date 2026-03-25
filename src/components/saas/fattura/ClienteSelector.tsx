import { useState, useMemo } from 'react';
import { Search, X, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { mockAnagrafiche } from '@/data/mockDashboardData';
import type { Anagrafica, ClienteSnapshot } from '@/types/fatturazione';

interface ClienteSelectorProps {
  clienteSnapshot: ClienteSnapshot | null;
  onSelect: (anagrafica: Anagrafica, snapshot: ClienteSnapshot) => void;
  onClear: () => void;
}

function getDisplayName(a: Anagrafica) {
  return a.ragione_sociale || [a.nome, a.cognome].filter(Boolean).join(' ') || 'N/D';
}

function buildSnapshot(a: Anagrafica): ClienteSnapshot {
  return {
    ragione_sociale: getDisplayName(a),
    nome: a.nome,
    cognome: a.cognome,
    partita_iva: a.partita_iva,
    codice_fiscale: a.codice_fiscale,
    codice_sdi: a.codice_sdi,
    pec: a.pec,
    indirizzo_via: a.indirizzo_via,
    indirizzo_cap: a.indirizzo_cap,
    indirizzo_comune: a.indirizzo_comune,
    indirizzo_provincia: a.indirizzo_provincia,
    indirizzo_nazione: a.indirizzo_nazione || 'IT',
    tipo_cliente: a.tipo_cliente,
    cig: a.cig,
    cup: a.cup,
  };
}

const tipoBadgeColors: Record<string, string> = {
  B2B: 'bg-primary/10 text-primary',
  B2C: 'bg-secondary/10 text-secondary',
  PA: 'bg-accent/10 text-accent-foreground',
  Estero: 'bg-muted text-muted-foreground',
};

export function ClienteSelector({ clienteSnapshot, onSelect, onClear }: ClienteSelectorProps) {
  const [search, setSearch] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return mockAnagrafiche.filter(a => a.attivo).slice(0, 8);
    const q = search.toLowerCase();
    return mockAnagrafiche
      .filter(a => a.attivo)
      .filter(a =>
        getDisplayName(a).toLowerCase().includes(q) ||
        a.partita_iva?.toLowerCase().includes(q) ||
        a.codice_fiscale?.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [search]);

  // Collapsed state — client selected
  if (clienteSnapshot) {
    const initials = clienteSnapshot.ragione_sociale
      .split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

    return (
      <div className="bg-gradient-to-r from-muted/50 to-background border border-border rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{clienteSnapshot.ragione_sociale}</p>
            <p className="text-xs text-muted-foreground font-mono">
              {clienteSnapshot.partita_iva || clienteSnapshot.codice_fiscale}
              {clienteSnapshot.codice_sdi && ` · SDI: ${clienteSnapshot.codice_sdi}`}
            </p>
            {clienteSnapshot.indirizzo_via && (
              <p className="text-xs text-muted-foreground">
                {[clienteSnapshot.indirizzo_via, clienteSnapshot.indirizzo_cap, clienteSnapshot.indirizzo_comune, clienteSnapshot.indirizzo_provincia].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
          <Badge className={tipoBadgeColors[clienteSnapshot.tipo_cliente] || ''} variant="secondary">
            {clienteSnapshot.tipo_cliente}
          </Badge>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            Cambia
          </Button>
        </div>

        <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors">
            Dettagli fiscali
            {detailsOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
            {clienteSnapshot.pec && <p><span className="text-muted-foreground/60">PEC:</span> {clienteSnapshot.pec}</p>}
            {clienteSnapshot.codice_sdi && <p><span className="text-muted-foreground/60">SDI:</span> {clienteSnapshot.codice_sdi}</p>}
            {clienteSnapshot.codice_fiscale && <p><span className="text-muted-foreground/60">C.F.:</span> {clienteSnapshot.codice_fiscale}</p>}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  // Expanded state — search
  return (
    <div className="border-2 border-dashed border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cerca per nome, P.IVA, Codice Fiscale..."
          className="pl-9"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1">
        {filtered.map(a => (
          <button
            key={a.id}
            onClick={() => onSelect(a, buildSnapshot(a))}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-background border border-transparent hover:border-border transition-colors text-left"
          >
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{getDisplayName(a)}</p>
              <p className="text-xs text-muted-foreground font-mono">{a.partita_iva || a.codice_fiscale}</p>
            </div>
            <Badge className={tipoBadgeColors[a.tipo_cliente] || ''} variant="secondary">
              {a.tipo_cliente}
            </Badge>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Nessun risultato trovato</p>
        )}
      </div>
    </div>
  );
}
