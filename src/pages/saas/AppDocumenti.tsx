import { useState, useMemo } from 'react';
import { FileText, Download, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/saas/StatusBadge';
import { EmptyState } from '@/components/saas/EmptyState';
import { toast } from '@/hooks/use-toast';

interface MockDoc {
  id: string;
  nome: string;
  tipo: 'fattura' | 'ricevuta' | 'ddt' | 'preventivo' | 'altro';
  data: string;
  dimensione: string;
}

const mockDocs: MockDoc[] = [
  { id: '1', nome: 'Fattura FT-2025-0012.pdf', tipo: 'fattura', data: '2025-03-10', dimensione: '245 KB' },
  { id: '2', nome: 'DDT-2025-0003.pdf', tipo: 'ddt', data: '2025-03-08', dimensione: '180 KB' },
  { id: '3', nome: 'Preventivo PRF-2025-0005.pdf', tipo: 'preventivo', data: '2025-03-05', dimensione: '312 KB' },
  { id: '4', nome: 'Fattura FT-2025-0011.pdf', tipo: 'fattura', data: '2025-02-28', dimensione: '198 KB' },
  { id: '5', nome: 'Ricevuta pagamento febbraio.pdf', tipo: 'ricevuta', data: '2025-02-15', dimensione: '95 KB' },
  { id: '6', nome: 'DDT-2025-0002.pdf', tipo: 'ddt', data: '2025-02-10', dimensione: '210 KB' },
  { id: '7', nome: 'Fattura FT-2025-0008.pdf', tipo: 'fattura', data: '2025-01-20', dimensione: '267 KB' },
  { id: '8', nome: 'Contratto servizio annuale.pdf', tipo: 'altro', data: '2025-01-05', dimensione: '1.2 MB' },
];

const tipoLabels: Record<string, string> = {
  fattura: 'Fattura',
  ricevuta: 'Ricevuta',
  ddt: 'DDT',
  preventivo: 'Preventivo',
  altro: 'Altro',
};

const fmtDate = (d: string) => {
  try { return new Date(d).toLocaleDateString('it-IT'); } catch { return d; }
};

const AppDocumenti = () => {
  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('tutti');

  const filtered = useMemo(() =>
    mockDocs.filter(d => {
      if (tipoFilter !== 'tutti' && d.tipo !== tipoFilter) return false;
      if (search && !d.nome.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
  , [search, tipoFilter]);

  const handleDownload = (doc: MockDoc) => {
    toast({ title: 'Download avviato', description: `Scaricamento di ${doc.nome}…` });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <p className="text-xs text-muted-foreground font-medium">Area Cliente › Documenti</p>
        <h1 className="text-2xl font-bold text-foreground">Documenti</h1>
        <p className="text-sm text-muted-foreground mt-1">Archivio di fatture, DDT, preventivi e altri documenti.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca documento…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tutti">Tutti i tipi</SelectItem>
            <SelectItem value="fattura">Fatture</SelectItem>
            <SelectItem value="ricevuta">Ricevute</SelectItem>
            <SelectItem value="ddt">DDT</SelectItem>
            <SelectItem value="preventivo">Preventivi</SelectItem>
            <SelectItem value="altro">Altro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nessun documento trovato"
          description="Prova a modificare i filtri di ricerca."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(doc => (
            <div key={doc.id} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:bg-muted/30 transition-colors">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.nome}</p>
                <p className="text-xs text-muted-foreground">{tipoLabels[doc.tipo]} · {fmtDate(doc.data)} · {doc.dimensione}</p>
              </div>
              <Button size="sm" variant="outline" className="shrink-0 h-8 text-xs" onClick={() => handleDownload(doc)}>
                <Download className="h-3.5 w-3.5 mr-1" /> Scarica
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppDocumenti;
