/**
 * DDT signature areas for print layout.
 */
export function DDTSignatures() {
  return (
    <div className="grid grid-cols-2 gap-8 mt-8 print:mt-12">
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Firma Mittente</p>
        <div className="h-16 border border-border rounded-lg bg-muted/30 flex items-end justify-center pb-2">
          <div className="w-40 border-b border-muted-foreground/30" />
        </div>
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Firma Destinatario (ricevuta merce)</p>
        <div className="h-16 border border-border rounded-lg bg-muted/30 flex items-end justify-center pb-2">
          <div className="w-40 border-b border-muted-foreground/30" />
        </div>
      </div>
    </div>
  );
}
