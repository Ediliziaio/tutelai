/**
 * IBAN validation with ISO 13616 mod-97 checksum.
 */
export function validateIBAN(iban: string): { valid: boolean; error?: string } {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  if (!cleaned) return { valid: true }; // empty is ok (optional field)
  if (cleaned.length < 15 || cleaned.length > 34) return { valid: false, error: 'Lunghezza IBAN non valida' };
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(cleaned)) return { valid: false, error: 'Formato IBAN non valido' };

  // Italian IBAN must be 27 chars
  if (cleaned.startsWith('IT') && cleaned.length !== 27) {
    return { valid: false, error: 'IBAN italiano deve avere 27 caratteri' };
  }

  // ISO 13616 mod-97 check
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, ch => String(ch.charCodeAt(0) - 55));

  // BigInt-free mod97
  let remainder = '';
  for (const digit of numeric) {
    remainder += digit;
    const num = parseInt(remainder, 10);
    remainder = String(num % 97);
  }

  if (parseInt(remainder, 10) !== 1) {
    return { valid: false, error: 'Checksum IBAN non valido' };
  }

  return { valid: true };
}
