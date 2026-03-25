import { useState, useCallback } from 'react';
import { Plus, Trash2, Copy, ChevronDown, ChevronUp, BookOpen, GripVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UNITA_MISURA_ENUM, ALIQUOTE_IVA, type CodiceUnitaMisura, type CodiceNaturaIVA } from '@/types/fatturazione';
import type { RigaDocumento } from '@/types/fatturazione';
import { calcolaRiga, formatEuro } from './calcoliDocumento';
import { RigaExpanded } from './RigaExpanded';
import { CatalogDialog } from './CatalogDialog';
import { mockArticoli } from '@/data/mockDashboardData';

interface RigheEditorProps {
  righe: RigaDocumento[];
  onChange: (righe: RigaDocumento[]) => void;
}

export function RigheEditor({ righe, onChange }: RigheEditorProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const updateRiga = (id: string, updates: Partial<RigaDocumento>) => {
    onChange(righe.map(r => r.id === id ? calcolaRiga({ ...r, ...updates }) : r));
  };

  const removeRiga = (id: string) => onChange(righe.filter(r => r.id !== id));

  const duplicaRiga = (id: string) => {
    const r = righe.find(r => r.id === id);
    if (!r) return;
    const newR = calcolaRiga({ ...r, id: crypto.randomUUID(), numero_linea: righe.length + 1 });
    onChange([...righe, newR]);
  };

  const addRiga = () => {
    const newR = calcolaRiga({ id: crypto.randomUUID(), numero_linea: righe.length + 1, descrizione: '', quantita: 1, unita_misura: 'pz', prezzo_unitario: 0, aliquota_iva: '22' });
    onChange([...righe, newR]);
  };

  const addFromCatalog = (art: typeof mockArticoli[0], quantita: number) => {
    const newR = calcolaRiga({
      id: crypto.randomUUID(),
      numero_linea: righe.length + 1,
      codice_articolo: art.codice,
      descrizione: art.descrizione,
      quantita,
      unita_misura: art.unita_misura,
      prezzo_unitario: art.prezzo_vendita,
      aliquota_iva: art.aliquota_iva,
      natura_iva: art.natura_iva,
    });
    onChange([...righe, newR]);
  };

  // Drag & drop handlers
  const handleDragStart = useCallback((idx: number) => setDraggedIdx(idx), []);
  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => { e.preventDefault(); setDragOverIdx(idx); }, []);
  const handleDrop = useCallback((idx: number) => {
    if (draggedIdx === null || draggedIdx === idx) { setDraggedIdx(null); setDragOverIdx(null); return; }
    const newRighe = [...righe];
    const [moved] = newRighe.splice(draggedIdx, 1);
    newRighe.splice(idx, 0, moved);
    onChange(newRighe.map((r, i) => ({ ...r, numero_linea: i + 1 })));
    setDraggedIdx(null);
    setDragOverIdx(null);
  }, [draggedIdx, righe, onChange]);
  const handleDragEnd = useCallback(() => { setDraggedIdx(null); setDragOverIdx(null); }, []);

  // Parse IVA
  const getIvaFromCode = (code: string): { aliquota: string; natura?: CodiceNaturaIVA } => {
    const found = ALIQUOTE_IVA.find(a => a.codice === code);
    if (found) return { aliquota: String(found.valore), natura: found.natura || undefined };
    return { aliquota: code };
  };
  const getIvaCode = (aliquota: string, natura?: CodiceNaturaIVA): string => {
    if (natura) { const f = ALIQUOTE_IVA.find(a => a.natura === natura); if (f) return f.codice; }
    const f = ALIQUOTE_IVA.find(a => String(a.valore) === aliquota && !a.natura);
    return f?.codice || aliquota;
  };

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Righe Documento</h3>
      </div>

      {/* Header */}
      <div className="hidden sm:grid grid-cols-[20px_1fr_70px_60px_100px_60px_60px_90px_70px] gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
        <span></span><span>Descrizione</span><span className="text-right">Q.tà</span><span className="text-center">U.M.</span>
        <span className="text-right">Prezzo</span><span className="text-right">Sc.%</span><span className="text-center">IVA</span>
        <span className="text-right">Importo</span><span></span>
      </div>

      {/* Rows */}
      {righe.map((r, idx) => (
        <div key={r.id} onDragOver={(e) => handleDragOver(e, idx)} onDrop={() => handleDrop(idx)}
          className={dragOverIdx === idx && draggedIdx !== idx ? 'border-t-2 border-primary' : ''}>
          <div className="grid grid-cols-1 sm:grid-cols-[20px_1fr_70px_60px_100px_60px_60px_90px_70px] gap-2 items-start py-2 group hover:bg-muted/50 rounded-lg px-1"
            style={{ opacity: draggedIdx === idx ? 0.4 : 1 }}>
            <div draggable onDragStart={() => handleDragStart(idx)} onDragEnd={handleDragEnd}
              className="hidden sm:flex items-center justify-center h-8 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground">
              <GripVertical className="h-3.5 w-3.5" />
            </div>
            <Input value={r.descrizione} onChange={e => updateRiga(r.id, { descrizione: e.target.value })}
              placeholder="Descrizione prodotto o servizio..." className={`h-8 text-xs ${!r.descrizione?.trim() ? 'border-destructive/50' : ''}`} />
            <Input type="number" value={r.quantita} onChange={e => updateRiga(r.id, { quantita: Number(e.target.value) })}
              className="h-8 text-xs text-right" min={0} step={0.01} />
            <Select value={r.unita_misura} onValueChange={v => updateRiga(r.id, { unita_misura: v as CodiceUnitaMisura })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(UNITA_MISURA_ENUM).map(([k]) => (
                  <SelectItem key={k} value={k}>{k}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="number" value={r.prezzo_unitario} onChange={e => updateRiga(r.id, { prezzo_unitario: Number(e.target.value) })}
              className="h-8 text-xs text-right font-mono" min={0} step={0.01} />
            <Input type="number" value={r.sconto_percentuale || 0}
              onChange={e => updateRiga(r.id, { sconto_percentuale: Number(e.target.value), sconto_valore: 0 })}
              className="h-8 text-xs text-right" min={0} max={100} />
            <Select value={getIvaCode(r.aliquota_iva, r.natura_iva)}
              onValueChange={v => { const { aliquota, natura } = getIvaFromCode(v); updateRiga(r.id, { aliquota_iva: aliquota, natura_iva: natura }); }}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALIQUOTE_IVA.map(a => (
                  <SelectItem key={a.codice} value={a.codice}>{a.label.split(' — ')[0]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="h-8 flex items-center justify-end font-mono font-semibold text-xs text-foreground">
              {formatEuro(r.imponibile)}
            </span>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}>
                {expandedId === r.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicaRiga(r.id)}>
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeRiga(r.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          {expandedId === r.id && <RigaExpanded riga={r} onUpdate={(updates) => updateRiga(r.id, updates)} />}
        </div>
      ))}

      {righe.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 italic">Nessuna riga inserita</p>
      )}

      {/* Add row buttons */}
      <div className="flex gap-2 pt-2 flex-wrap">
        <Button onClick={addRiga} variant="ghost" size="sm" className="text-primary">
          <Plus className="h-3.5 w-3.5 mr-1" /> Aggiungi riga
        </Button>
        <Button onClick={() => setCatalogOpen(true)} variant="ghost" size="sm">
          <BookOpen className="h-3.5 w-3.5 mr-1" /> Da catalogo
        </Button>
      </div>

      {/* Catalog dialog */}
      <CatalogDialog open={catalogOpen} onOpenChange={setCatalogOpen} onAdd={addFromCatalog} />
    </div>
  );
}
