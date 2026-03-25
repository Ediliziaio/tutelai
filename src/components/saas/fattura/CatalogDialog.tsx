import { useState, useMemo } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockArticoli } from '@/data/mockDashboardData';
import { formatEuro } from './calcoliDocumento';

interface CatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (art: typeof mockArticoli[0], quantita: number) => void;
}

export function CatalogDialog({ open, onOpenChange, onAdd }: CatalogDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const articoliAttivi = useMemo(() => mockArticoli.filter(a => a.attivo), []);
  const categories = useMemo(() => [...new Set(articoliAttivi.map(a => a.categoria).filter(Boolean))], [articoliAttivi]);

  const filtered = useMemo(() => {
    let items = articoliAttivi;
    if (selectedCategory) items = items.filter(a => a.categoria === selectedCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(a =>
        a.descrizione.toLowerCase().includes(q) ||
        a.codice.toLowerCase().includes(q) ||
        a.sottocategoria?.toLowerCase().includes(q)
      );
    }
    return items;
  }, [articoliAttivi, search, selectedCategory]);

  const getQty = (id: string) => quantities[id] ?? 1;
  const setQty = (id: string, n: number) => setQuantities(p => ({ ...p, [id]: Math.max(1, n) }));

  const handleAdd = (art: typeof mockArticoli[0]) => {
    onAdd(art, getQty(art.id));
    setQuantities(p => { const n = { ...p }; delete n[art.id]; return n; });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Catalogo Articoli</DialogTitle></DialogHeader>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca per codice, descrizione..."
            className="pl-9"
            autoFocus
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-1.5 flex-wrap">
          <Badge
            variant={selectedCategory === null ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedCategory(null)}
          >
            Tutti
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat!)}
            >
              {cat}
            </Badge>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-1.5 max-h-80 overflow-y-auto">
          {filtered.map(art => (
            <div
              key={art.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{art.descrizione}</p>
                <p className="text-xs text-muted-foreground">
                  {art.codice} · {art.unita_misura} · IVA {art.aliquota_iva}%
                  {art.sottocategoria && ` · ${art.sottocategoria}`}
                </p>
              </div>
              <span className="font-mono font-semibold text-foreground text-sm shrink-0">
                {formatEuro(art.prezzo_vendita)}
              </span>
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setQty(art.id, getQty(art.id) - 1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs font-mono w-6 text-center">{getQty(art.id)}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setQty(art.id, getQty(art.id) + 1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" onClick={() => handleAdd(art)}>
                Aggiungi
              </Button>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6 italic">Nessun articolo trovato</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
