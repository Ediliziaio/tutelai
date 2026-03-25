import type { TotaliDocumento, ErroreValidazione, OpzioniRitenuta } from './calcoliDocumento';
import { formatEuro } from './calcoliDocumento';

interface TotaliSidebarProps {
  totali: TotaliDocumento;
  ritenuta: OpzioniRitenuta;
  cassaAttiva: boolean;
  bolloVirtuale: boolean;
  errori: ErroreValidazione[];
}

export function TotaliSidebar({ totali, ritenuta, cassaAttiva, bolloVirtuale, errori }: TotaliSidebarProps) {
  return (
    <div className="sticky bottom-0 bg-background border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)] p-5 -mx-4 lg:-mx-6 px-4 lg:px-6">
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotale</span>
          <span className="font-mono">{formatEuro(totali.subtotale)}</span>
        </div>

        {totali.sconto_globale > 0 && (
          <div className="flex justify-between text-destructive">
            <span>Sconto</span>
            <span className="font-mono">- {formatEuro(totali.sconto_globale)}</span>
          </div>
        )}

        {cassaAttiva && totali.cassa_importo > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Cassa previdenziale</span>
            <span className="font-mono">+ {formatEuro(totali.cassa_importo)}</span>
          </div>
        )}

        {totali.riepilogo_iva.map((r, i) => (
          <div key={i} className="flex justify-between text-muted-foreground">
            <span>IVA {r.aliquota === '0' ? `(${r.natura || 'N/D'})` : `${r.aliquota}%`}</span>
            <span className="font-mono">{formatEuro(r.imposta)}</span>
          </div>
        ))}

        {bolloVirtuale && (
          <div className="flex justify-between text-muted-foreground">
            <span>Bollo virtuale</span>
            <span className="font-mono">€ 2,00</span>
          </div>
        )}

        <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
          <span>Totale documento</span>
          <span className="font-mono text-foreground">{formatEuro(totali.totale_documento)}</span>
        </div>

        {ritenuta.attiva && totali.ritenuta_importo > 0 && (
          <>
            <div className="flex justify-between text-destructive text-xs">
              <span>Ritenuta d'acconto ({ritenuta.aliquota}%)</span>
              <span className="font-mono">- {formatEuro(totali.ritenuta_importo)}</span>
            </div>
            <div className="flex justify-between font-semibold text-primary">
              <span>Netto da pagare</span>
              <span className="font-mono">{formatEuro(totali.totale_da_pagare)}</span>
            </div>
          </>
        )}
      </div>

      {errori.length > 0 && (
        <div className="mt-3 bg-destructive/10 border border-destructive/30 rounded-lg p-3">
          <ul className="text-xs space-y-1 text-destructive">
            {errori.map((e, i) => <li key={i}>⚠ {e.messaggio}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
