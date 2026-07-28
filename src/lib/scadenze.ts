// Scadenze normative AI Act (Reg. UE 2024/1689) e Legge 132/2025.
//
// Il copy del sito NON deve contenere formule temporali scritte a mano
// ("tra pochi mesi", "mancano settimane"): invecchiano in silenzio.
// Usare sempre gli helper di questo file, che si ricalcolano da soli.

/** 2 agosto 2026 — data di applicazione generale del Regolamento (art. 113). */
export const APPLICAZIONE_GENERALE = new Date("2026-08-02T00:00:00+02:00");

const MS_GIORNO = 86_400_000;

/** Giorni interi che mancano alla data. Negativo se già passata. */
export function giorniA(data: Date, oggi = new Date()): number {
  const d0 = Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
  const d1 = Date.UTC(data.getFullYear(), data.getMonth(), data.getDate());
  return Math.round((d1 - d0) / MS_GIORNO);
}

/**
 * Formula temporale in italiano, corretta prima e dopo la scadenza.
 * Es. "mancano 5 giorni", "è domani", "è oggi", "è in vigore da 12 giorni".
 */
export function conteggio(data: Date, oggi = new Date()): string {
  const g = giorniA(data, oggi);
  if (g > 60) return `mancano ${g} giorni`;
  if (g > 1) return `mancano ${g} giorni`;
  if (g === 1) return "è domani";
  if (g === 0) return "è oggi";
  if (g === -1) return "è in vigore da ieri";
  return `è in vigore da ${Math.abs(g)} giorni`;
}

/** Etichetta breve per badge e pill. Es. "Fra 5 giorni", "In vigore". */
export function etichettaBreve(data: Date, oggi = new Date()): string {
  const g = giorniA(data, oggi);
  if (g > 1) return `Fra ${g} giorni`;
  if (g === 1) return "Domani";
  if (g === 0) return "Oggi";
  return "In vigore";
}

/** true finché la scadenza non è passata. */
export function inArrivo(data: Date, oggi = new Date()): boolean {
  return giorniA(data, oggi) >= 0;
}
