// ============================================================
// XML Helpers for FatturaPA generation
// ============================================================

/** Escape XML special characters */
export const escapeXML = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** Map internal tipo_documento_sdi code to label */
export const getTipoDocumentoCodice = (tipo?: string): string => {
  return tipo || 'TD01';
};

/** Format number with fixed decimals for XML */
export const xmlNum = (val: number, decimals = 2): string =>
  val.toFixed(decimals);

/** Conditionally render an XML tag */
export const xmlTag = (tag: string, value?: string | number | null, decimals?: number): string => {
  if (value === undefined || value === null || value === '') return '';
  const formatted = typeof value === 'number'
    ? value.toFixed(decimals ?? 2)
    : escapeXML(String(value));
  return `<${tag}>${formatted}</${tag}>`;
};

/** Wrap content in a tag only if content is non-empty */
export const xmlWrap = (tag: string, content: string): string => {
  const trimmed = content.trim();
  if (!trimmed) return '';
  return `<${tag}>\n${trimmed}\n</${tag}>`;
};
