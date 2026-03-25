// ============================================================
// FatturaPA 1.2 XML Generator
// Conforme alle specifiche SDI — D.Lgs. 127/2015
// ============================================================

import type {
  AnagraficaAzienda,
  ClienteSnapshot,
  RigaDocumento,
  RiepilogoIVA,
  ScadenzaPagamento,
  CodiceTipoDocumento,
  CodiceMetodoPagamento,
  CodiceTipoRitenuta,
  CodiceCausaleRitenuta,
  CodiceTipoCassa,
} from '@/types/fatturazione';
import { escapeXML, xmlNum } from './xmlHelpers';

export interface XMLDocumentData {
  tipo_documento_sdi: CodiceTipoDocumento;
  numero: string;
  numero_progressivo: number;
  data_emissione: string;
  valuta?: string;

  cliente_snapshot: ClienteSnapshot;

  righe: RigaDocumento[];
  riepilogo_iva: RiepilogoIVA[];

  // Totali
  totale_documento: number;
  arrotondamento?: number;

  // Bollo
  bollo_virtuale?: boolean;
  bollo_importo?: number;

  // Ritenuta
  ritenuta_attiva?: boolean;
  ritenuta_tipo?: CodiceTipoRitenuta;
  ritenuta_aliquota?: number;
  ritenuta_importo?: number;
  ritenuta_causale?: CodiceCausaleRitenuta;

  // Cassa previdenziale
  cassa_attiva?: boolean;
  cassa_tipo?: CodiceTipoCassa;
  cassa_aliquota?: number;
  cassa_importo?: number;
  cassa_imponibile?: number;
  cassa_aliquota_iva?: string;
  cassa_ritenuta?: boolean;

  // Sconto globale
  sconto_globale_valore?: number;

  // Causali
  causale?: string[];

  // Art. 73
  art_73?: boolean;

  // Pagamento
  metodo_pagamento_codice?: CodiceMetodoPagamento;
  scadenze_pagamento: ScadenzaPagamento[];
  iban_pagamento?: string;
  bic_pagamento?: string;
  nome_banca?: string;

  // Riferimenti
  cig?: string;
  cup?: string;

  // Allegati
  allegati?: { nome: string; tipo_mime: string; base64: string }[];
}

export const generateFatturaPAXML = (
  doc: XMLDocumentData,
  azienda: AnagraficaAzienda
): string => {
  const isPA = doc.cliente_snapshot.tipo_cliente === 'PA';
  const formatoTrasmissione = isPA ? 'FPA12' : 'FPR12';
  const codiceDestinatario = doc.cliente_snapshot.codice_sdi || '0000000';
  const progressivo = String(doc.numero_progressivo).padStart(5, '0');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<p:FatturaElettronica versione="${formatoTrasmissione}"
  xmlns:ds="http://www.w3.org/2000/09/xmldsig#"
  xmlns:p="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2 http://www.fatturapa.gov.it/export/fatturazione/sdi/fatturapa/v1.2/Schema_del_file_xml_FatturaPA_versione_1.2.xsd">

  <FatturaElettronicaHeader>
    <DatiTrasmissione>
      <IdTrasmittente>
        <IdPaese>IT</IdPaese>
        <IdCodice>${azienda.partita_iva}</IdCodice>
      </IdTrasmittente>
      <ProgressivoInvio>${progressivo}</ProgressivoInvio>
      <FormatoTrasmissione>${formatoTrasmissione}</FormatoTrasmissione>
      <CodiceDestinatario>${codiceDestinatario}</CodiceDestinatario>${
        doc.cliente_snapshot.pec && codiceDestinatario === '0000000'
          ? `\n      <PECDestinatario>${escapeXML(doc.cliente_snapshot.pec)}</PECDestinatario>`
          : ''
      }
    </DatiTrasmissione>

    <CedentePrestatore>
      <DatiAnagrafici>
        <IdFiscaleIVA>
          <IdPaese>IT</IdPaese>
          <IdCodice>${azienda.partita_iva}</IdCodice>
        </IdFiscaleIVA>
        <CodiceFiscale>${azienda.codice_fiscale}</CodiceFiscale>
        <Anagrafica>
          <Denominazione>${escapeXML(azienda.ragione_sociale)}</Denominazione>
        </Anagrafica>
        <RegimeFiscale>${azienda.regime_fiscale}</RegimeFiscale>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${escapeXML(azienda.indirizzo_via)}</Indirizzo>${
          azienda.indirizzo_numero_civico
            ? `\n        <NumeroCivico>${escapeXML(azienda.indirizzo_numero_civico)}</NumeroCivico>`
            : ''
        }
        <CAP>${azienda.indirizzo_cap}</CAP>
        <Comune>${escapeXML(azienda.indirizzo_comune)}</Comune>
        <Provincia>${azienda.indirizzo_provincia}</Provincia>
        <Nazione>${azienda.indirizzo_nazione}</Nazione>
      </Sede>${
        azienda.codice_rea
          ? `\n      <IscrizioneREA>
        <Ufficio>${azienda.indirizzo_provincia}</Ufficio>
        <NumeroREA>${azienda.codice_rea}</NumeroREA>${
            azienda.capitale_sociale
              ? `\n        <CapitaleSociale>${xmlNum(azienda.capitale_sociale)}</CapitaleSociale>`
              : ''
          }
        <StatoLiquidazione>LN</StatoLiquidazione>
      </IscrizioneREA>`
          : ''
      }${
        azienda.pec
          ? `\n      <Contatti>\n        <PEC>${escapeXML(azienda.pec)}</PEC>\n      </Contatti>`
          : ''
      }
    </CedentePrestatore>

    <CessionarioCommittente>
      <DatiAnagrafici>${
        doc.cliente_snapshot.partita_iva
          ? `\n        <IdFiscaleIVA>
          <IdPaese>IT</IdPaese>
          <IdCodice>${doc.cliente_snapshot.partita_iva}</IdCodice>
        </IdFiscaleIVA>`
          : ''
      }${
        doc.cliente_snapshot.codice_fiscale
          ? `\n        <CodiceFiscale>${doc.cliente_snapshot.codice_fiscale}</CodiceFiscale>`
          : ''
      }
        <Anagrafica>
          <Denominazione>${escapeXML(doc.cliente_snapshot.ragione_sociale)}</Denominazione>
        </Anagrafica>
      </DatiAnagrafici>
      <Sede>
        <Indirizzo>${escapeXML(doc.cliente_snapshot.indirizzo_via || '')}</Indirizzo>
        <CAP>${doc.cliente_snapshot.indirizzo_cap || '00000'}</CAP>
        <Comune>${escapeXML(doc.cliente_snapshot.indirizzo_comune || '')}</Comune>${
          doc.cliente_snapshot.indirizzo_provincia
            ? `\n        <Provincia>${doc.cliente_snapshot.indirizzo_provincia}</Provincia>`
            : ''
        }
        <Nazione>${doc.cliente_snapshot.indirizzo_nazione || 'IT'}</Nazione>
      </Sede>
    </CessionarioCommittente>

  </FatturaElettronicaHeader>

  <FatturaElettronicaBody>
    <DatiGenerali>
      <DatiGeneraliDocumento>
        <TipoDocumento>${doc.tipo_documento_sdi}</TipoDocumento>
        <Divisa>${doc.valuta || 'EUR'}</Divisa>
        <Data>${doc.data_emissione}</Data>
        <Numero>${escapeXML(doc.numero)}</Numero>${renderRitenuta(doc)}${renderBollo(doc)}${renderCassa(doc)}${renderScontoGlobale(doc)}
        <ImportoTotaleDocumento>${xmlNum(doc.totale_documento)}</ImportoTotaleDocumento>${
          doc.arrotondamento ? `\n        <Arrotondamento>${xmlNum(doc.arrotondamento)}</Arrotondamento>` : ''
        }${
          doc.causale?.map(c => `\n        <Causale>${escapeXML(c)}</Causale>`).join('') || ''
        }${doc.art_73 ? '\n        <Art73>SI</Art73>' : ''}
      </DatiGeneraliDocumento>${renderRiferimentiOrdine(doc)}
    </DatiGenerali>

    <DatiBeniServizi>
${doc.righe.map(renderRiga).join('\n')}
${doc.riepilogo_iva.map(renderRiepilogo).join('\n')}
    </DatiBeniServizi>

    <DatiPagamento>
      <CondizioniPagamento>${doc.scadenze_pagamento.length > 1 ? 'TP02' : 'TP01'}</CondizioniPagamento>
${doc.scadenze_pagamento.map(s => renderScadenza(s, doc)).join('\n')}
    </DatiPagamento>
${renderAllegati(doc)}
  </FatturaElettronicaBody>

</p:FatturaElettronica>`;

  return xml;
};

// ── Render helpers ──

function renderRitenuta(doc: XMLDocumentData): string {
  if (!doc.ritenuta_attiva || !doc.ritenuta_importo) return '';
  return `
        <DatiRitenuta>
          <TipoRitenuta>${doc.ritenuta_tipo || 'RT01'}</TipoRitenuta>
          <ImportoRitenuta>${xmlNum(doc.ritenuta_importo)}</ImportoRitenuta>
          <AliquotaRitenuta>${xmlNum(doc.ritenuta_aliquota || 20)}</AliquotaRitenuta>
          <CausalePagamento>${doc.ritenuta_causale || 'A'}</CausalePagamento>
        </DatiRitenuta>`;
}

function renderBollo(doc: XMLDocumentData): string {
  if (!doc.bollo_virtuale) return '';
  return `
        <DatiBollo>
          <BolloVirtuale>SI</BolloVirtuale>
          <ImportoBollo>${xmlNum(doc.bollo_importo || 2)}</ImportoBollo>
        </DatiBollo>`;
}

function renderCassa(doc: XMLDocumentData): string {
  if (!doc.cassa_attiva || !doc.cassa_importo) return '';
  return `
        <DatiCassaPrevidenziale>
          <TipoCassa>${doc.cassa_tipo || 'TC22'}</TipoCassa>
          <AlCassa>${xmlNum(doc.cassa_aliquota || 4)}</AlCassa>
          <ImportoContributoCassa>${xmlNum(doc.cassa_importo)}</ImportoContributoCassa>
          <ImponibileCassa>${xmlNum(doc.cassa_imponibile || 0)}</ImponibileCassa>
          <AliquotaIVA>${doc.cassa_aliquota_iva || '22.00'}</AliquotaIVA>
          <Ritenuta>${doc.cassa_ritenuta ? 'SI' : 'NO'}</Ritenuta>
        </DatiCassaPrevidenziale>`;
}

function renderScontoGlobale(doc: XMLDocumentData): string {
  if (!doc.sconto_globale_valore || doc.sconto_globale_valore <= 0) return '';
  return `
        <ScontoMaggiorazione>
          <Tipo>SC</Tipo>
          <Importo>${xmlNum(doc.sconto_globale_valore)}</Importo>
        </ScontoMaggiorazione>`;
}

function renderRiferimentiOrdine(doc: XMLDocumentData): string {
  if (!doc.cig && !doc.cup) return '';
  return `
      <DatiOrdineAcquisto>
        <RiferimentoNumeroLinea>1</RiferimentoNumeroLinea>
        <IdDocumento>N/A</IdDocumento>${
          doc.cig ? `\n        <CodiceCIG>${doc.cig}</CodiceCIG>` : ''
        }${
          doc.cup ? `\n        <CodiceCUP>${doc.cup}</CodiceCUP>` : ''
        }
      </DatiOrdineAcquisto>`;
}

function renderRiga(riga: RigaDocumento): string {
  return `      <DettaglioLinee>
        <NumeroLinea>${riga.numero_linea}</NumeroLinea>${
          riga.tipo_cessione ? `\n        <TipoCessionePrestazione>${riga.tipo_cessione}</TipoCessionePrestazione>` : ''
        }${
          riga.codice_articolo
            ? `\n        <CodiceArticolo>\n          <CodiceTipo>${riga.codice_tipo || 'ART'}</CodiceTipo>\n          <CodiceValore>${escapeXML(riga.codice_articolo)}</CodiceValore>\n        </CodiceArticolo>`
            : ''
        }
        <Descrizione>${escapeXML(riga.descrizione)}</Descrizione>
        <Quantita>${xmlNum(riga.quantita)}</Quantita>
        <UnitaMisura>${riga.unita_misura}</UnitaMisura>
        <PrezzoUnitario>${xmlNum(riga.prezzo_unitario, 4)}</PrezzoUnitario>${
          (riga.sconto_percentuale ?? 0) > 0
            ? `\n        <ScontoMaggiorazione>\n          <Tipo>SC</Tipo>\n          <Percentuale>${xmlNum(riga.sconto_percentuale!)}</Percentuale>\n        </ScontoMaggiorazione>`
            : ''
        }
        <PrezzoTotale>${xmlNum(riga.imponibile)}</PrezzoTotale>
        <AliquotaIVA>${riga.aliquota_iva}.00</AliquotaIVA>${
          riga.ritenuta ? '\n        <Ritenuta>SI</Ritenuta>' : ''
        }${
          riga.natura_iva ? `\n        <Natura>${riga.natura_iva}</Natura>` : ''
        }${
          riga.riferimento_amministrazione
            ? `\n        <RiferimentoAmministrazione>${escapeXML(riga.riferimento_amministrazione)}</RiferimentoAmministrazione>`
            : ''
        }
      </DettaglioLinee>`;
}

function renderRiepilogo(r: RiepilogoIVA): string {
  return `      <DatiRiepilogo>
        <AliquotaIVA>${r.aliquota}.00</AliquotaIVA>${
          r.natura ? `\n        <Natura>${r.natura}</Natura>` : ''
        }${
          r.riferimento_normativo ? `\n        <RiferimentoNormativo>${escapeXML(r.riferimento_normativo)}</RiferimentoNormativo>` : ''
        }
        <ImponibileImporto>${xmlNum(r.imponibile)}</ImponibileImporto>
        <Imposta>${xmlNum(r.imposta)}</Imposta>
        <EsigibilitaIVA>${r.esigibilita}</EsigibilitaIVA>
      </DatiRiepilogo>`;
}

function renderScadenza(s: ScadenzaPagamento, doc: XMLDocumentData): string {
  return `      <DettaglioPagamento>${
    doc.metodo_pagamento_codice
      ? `\n        <ModalitaPagamento>${doc.metodo_pagamento_codice}</ModalitaPagamento>`
      : ''
  }
        <DataScadenzaPagamento>${s.data_scadenza}</DataScadenzaPagamento>
        <ImportoPagamento>${xmlNum(s.importo)}</ImportoPagamento>${
          doc.iban_pagamento
            ? `\n        <IBAN>${doc.iban_pagamento.replace(/\s/g, '')}</IBAN>`
            : ''
        }${
          doc.bic_pagamento
            ? `\n        <BIC>${doc.bic_pagamento}</BIC>`
            : ''
        }${
          doc.nome_banca
            ? `\n        <IstitutoFinanziario>${escapeXML(doc.nome_banca)}</IstitutoFinanziario>`
            : ''
        }
      </DettaglioPagamento>`;
}

function renderAllegati(doc: XMLDocumentData): string {
  if (!doc.allegati?.length) return '';
  return doc.allegati.map(a => `
    <Allegati>
      <NomeAttachment>${escapeXML(a.nome)}</NomeAttachment>
      <FormatoAttachment>${escapeXML(a.tipo_mime)}</FormatoAttachment>
      <Attachment>${a.base64}</Attachment>
    </Allegati>`).join('');
}
