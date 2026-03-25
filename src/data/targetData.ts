import { User, Users, Building2, Factory, HardHat, Wrench, DoorOpen, Pencil, Calculator, Stethoscope, Scale, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface TargetSegment {
  slug: string;
  title: string;
  icon: LucideIcon;
  category: "dimensione" | "settore" | "settore-edilizia";
  headline: string;
  subheadline: string;
  problems: { title: string; desc: string }[];
  caseStudy: {
    name: string;
    role: string;
    location: string;
    before: { label: string; value: string }[];
    after: { label: string; value: string }[];
    quote: string;
  };
  services: string[]; // slugs from servicesData
  cta: string;
}

export const targetSegments: TargetSegment[] = [
  // ── DIMENSIONE ──
  {
    slug: "libero-professionista",
    title: "Libero Professionista",
    icon: User,
    category: "dimensione",
    headline: "Sei Solo. E il Tuo Back-Office Ti Sta Mangiando Vivo.",
    subheadline: "Geometri, architetti, ingegneri: passate il 40% del tempo su pratiche e burocrazia. Quel tempo vale €35.000/anno. Li state buttando.",
    problems: [
      { title: "Fatture arretrate", desc: "Il venerdì sera siete ancora a fare fatture invece di godervi il weekend. E ogni fattura in ritardo è un pagamento in ritardo." },
      { title: "Pratiche ENEA infinite", desc: "Ogni pratica vi porta via 3-4 ore. Con 10 pratiche al mese, sono 40 ore perse — una settimana intera di lavoro." },
      { title: "Telefono che squilla sempre", desc: "Mentre siete in sopralluogo, perdete 3 chiamate su 5. Ogni chiamata persa è un cliente che va dalla concorrenza." },
      { title: "Scadenze dimenticate", desc: "Multe, penali, clienti arrabbiati. Tutto perché non avete un sistema che vi ricorda le scadenze." },
    ],
    caseStudy: {
      name: "Luca B.",
      role: "Geometra",
      location: "Brescia",
      before: [
        { label: "Ore/mese su burocrazia", value: "68" },
        { label: "Pratiche ENEA in ritardo", value: "35%" },
        { label: "Chiamate perse/settimana", value: "12" },
        { label: "Costo back-office annuo", value: "€38.000" },
      ],
      after: [
        { label: "Ore/mese su burocrazia", value: "8" },
        { label: "Pratiche ENEA in ritardo", value: "0%" },
        { label: "Chiamate perse/settimana", value: "0" },
        { label: "Costo back-office annuo", value: "€9.600" },
      ],
      quote: "Ho recuperato 60 ore al mese. Ora faccio sopralluoghi, non scartoffie.",
    },
    services: ["creazione-fatture", "pratiche-enea", "segreteria-virtuale", "gestione-corrispondenza"],
    cta: "Scopri Quanto Tempo Stai Perdendo →",
  },
  {
    slug: "micro-impresa",
    title: "Micro Impresa (1-5 dip.)",
    icon: Users,
    category: "dimensione",
    headline: "Hai 1-5 Dipendenti. Ma il Tuo Back-Office Ne Richiede Altri 2.",
    subheadline: "Assumere un'impiegata costa €28.000/anno + contributi. Noi facciamo lo stesso lavoro per meno di €800/mese. Fai i conti.",
    problems: [
      { title: "Costo del personale amministrativo", desc: "Un'impiegata part-time vi costa €1.800/mese con contributi. E quando è in ferie o in malattia, il lavoro si ferma." },
      { title: "Fatturazione caotica", desc: "Fatture inviate in ritardo, importi sbagliati, XML rifiutati dallo SDI. Ogni errore vi costa tempo e credibilità." },
      { title: "Nessun sistema organizzato", desc: "Pratiche su WhatsApp, fatture su Excel, scadenze su Post-it. Questo non è un sistema, è un disastro annunciato." },
      { title: "Crescita bloccata", desc: "Volete crescere ma non potete: il back-office non regge. Ogni nuovo cliente aggiunge caos." },
    ],
    caseStudy: {
      name: "Roberto M.",
      role: "Titolare impresa edile",
      location: "Padova",
      before: [
        { label: "Dipendenti amministrativi", value: "1 part-time" },
        { label: "Costo annuo back-office", value: "€32.000" },
        { label: "Errori fatturazione/mese", value: "8" },
        { label: "Tempo risposta clienti", value: "48h" },
      ],
      after: [
        { label: "Dipendenti amministrativi", value: "0" },
        { label: "Costo annuo back-office", value: "€8.400" },
        { label: "Errori fatturazione/mese", value: "0" },
        { label: "Tempo risposta clienti", value: "2h" },
      ],
      quote: "Ho eliminato un costo fisso di €32.000 e il servizio è pure migliorato. Non torno indietro.",
    },
    services: ["creazione-fatture", "pratiche-enea", "call-center", "segreteria-virtuale", "gestione-corrispondenza"],
    cta: "Calcola Quanto Risparmi Rispetto a un Dipendente →",
  },
  {
    slug: "piccola-impresa",
    title: "Piccola Impresa (6-20 dip.)",
    icon: Building2,
    category: "dimensione",
    headline: "Cresci in Cantiere, Non in Ufficio. Scala Senza Assumere.",
    subheadline: "Da 6 a 20 dipendenti servono processi, non persone in più. Noi siamo il reparto amministrativo che si adatta al tuo volume.",
    problems: [
      { title: "Il back-office non scala", desc: "Più cantieri aprite, più carta generate. Ma il vostro ufficio è sempre lo stesso: 1-2 persone sommerse." },
      { title: "Pratiche di finanziamento lente", desc: "Ogni richiesta di finanziamento richiede 15+ documenti. I vostri clienti aspettano settimane e voi perdete vendite." },
      { title: "Call center inesistente", desc: "I clienti chiamano e nessuno risponde. Quando riuscite a richiamare, hanno già firmato con un altro." },
      { title: "KPI? Quali KPI?", desc: "Non sapete quante pratiche avete aperte, quante fatture sono insolute, qual è il vostro margine reale per cantiere." },
    ],
    caseStudy: {
      name: "Alessandra T.",
      role: "Titolare serramenti",
      location: "Torino",
      before: [
        { label: "Pratiche gestite/mese", value: "35" },
        { label: "Tempo medio evasione", value: "12 giorni" },
        { label: "Clienti persi per ritardi", value: "6/mese" },
        { label: "Margine netto", value: "8%" },
      ],
      after: [
        { label: "Pratiche gestite/mese", value: "80+" },
        { label: "Tempo medio evasione", value: "3 giorni" },
        { label: "Clienti persi per ritardi", value: "0/mese" },
        { label: "Margine netto", value: "14%" },
      ],
      quote: "Abbiamo raddoppiato i cantieri senza assumere nessuno in ufficio. I margini sono tornati a due cifre.",
    },
    services: ["creazione-fatture", "pratiche-enea", "pratiche-finanziamento", "call-center", "segreteria-virtuale", "gestione-corrispondenza"],
    cta: "Scopri Come Raddoppiare i Cantieri Senza Costi Fissi →",
  },
  {
    slug: "media-impresa",
    title: "Media Impresa (21-50+)",
    icon: Factory,
    category: "dimensione",
    headline: "Il Tuo Ufficio Amministrativo Ti Costa €180.000/Anno. Noi Lo Facciamo per Un Quinto.",
    subheadline: "A questo livello, ogni inefficienza si moltiplica. Un back-office esternalizzato non è un lusso — è l'unica scelta razionale.",
    problems: [
      { title: "Costi fissi esplosivi", desc: "3-4 persone in amministrazione, software, formazione, turnover. Stai pagando una struttura che lavora al 60% della capacità." },
      { title: "Compliance e scadenze critiche", desc: "Con decine di cantieri aperti, una scadenza dimenticata può costare migliaia di euro in penali." },
      { title: "Integrazione sistemi", desc: "Gestionale, fatturazione, CRM, ENEA: sistemi che non parlano tra loro. Dati duplicati, errori, tempo perso." },
      { title: "Difficoltà a trovare personale", desc: "Trovare e trattenere personale amministrativo competente è sempre più difficile e costoso." },
    ],
    caseStudy: {
      name: "Ing. Davide R.",
      role: "CEO impresa edile",
      location: "Milano",
      before: [
        { label: "Personale amministrativo", value: "4 persone" },
        { label: "Costo annuo reparto", value: "€185.000" },
        { label: "Pratiche con errori", value: "12%" },
        { label: "Tempo chiusura mese", value: "15 giorni" },
      ],
      after: [
        { label: "Personale amministrativo", value: "1 coordinatore" },
        { label: "Costo annuo reparto", value: "€42.000" },
        { label: "Pratiche con errori", value: "0.5%" },
        { label: "Tempo chiusura mese", value: "3 giorni" },
      ],
      quote: "Abbiamo tagliato €143.000/anno di costi fissi e la qualità è aumentata. Il board è entusiasta.",
    },
    services: ["creazione-fatture", "pratiche-enea", "pratiche-finanziamento", "call-center", "segreteria-virtuale", "gestione-corrispondenza"],
    cta: "Richiedi un'Analisi Costi Gratuita →",
  },

  // ── SETTORE: MACRO-CATEGORIE ──
  {
    slug: "edilizia-costruzioni",
    title: "Edilizia & Costruzioni",
    icon: HardHat,
    category: "settore",
    headline: "Sei in Cantiere Dalle 7. La Burocrazia Non Dovrebbe Aspettarti Alle 20.",
    subheadline: "Imprese edili, impiantisti, serramentisti, studi tecnici: il lavoro è in cantiere. Noi ci occupiamo di tutto il resto — pratiche ENEA, fatture, finanziamenti, segreteria.",
    problems: [
      { title: "Pratiche ENEA obbligatorie", desc: "Ogni intervento di efficientamento richiede la comunicazione ENEA. Con 20+ cantieri, sono centinaia di pratiche all'anno." },
      { title: "Finanziamenti per i clienti", desc: "I vostri clienti vogliono pagare a rate. Ma gestire le pratiche di finanziamento vi porta via ore e competenze che non avete." },
      { title: "Fatturazione SAL complessa", desc: "Fatturare per Stato Avanzamento Lavori è complesso: importi variabili, ritenute, split payment. Un errore e il pagamento slitta di mesi." },
      { title: "Gestione subappaltatori", desc: "Coordinare fatture, pagamenti e documentazione di 5-10 subappaltatori per cantiere è un incubo amministrativo." },
    ],
    caseStudy: {
      name: "Impresa Edile Rossi",
      role: "Ristrutturazioni",
      location: "Verona",
      before: [
        { label: "Ore/settimana burocrazia", value: "18" },
        { label: "Pratiche ENEA in ritardo", value: "40%" },
        { label: "Tempo incasso medio", value: "75 giorni" },
        { label: "Fatture con errori", value: "15%" },
      ],
      after: [
        { label: "Ore/settimana burocrazia", value: "2" },
        { label: "Pratiche ENEA in ritardo", value: "0%" },
        { label: "Tempo incasso medio", value: "32 giorni" },
        { label: "Fatture con errori", value: "0%" },
      ],
      quote: "Abbiamo dimezzato i tempi di incasso. Solo questo ha cambiato il cashflow dell'azienda.",
    },
    services: ["creazione-fatture", "pratiche-enea", "pratiche-finanziamento", "gestione-corrispondenza"],
    cta: "Libera il Tuo Cantiere dalla Burocrazia →",
  },
  {
    slug: "commercialisti-consulenti",
    title: "Commercialisti e Consulenti",
    icon: Calculator,
    category: "settore",
    headline: "Il Tuo Studio Fattura €150/Ora. Ne Sprechi 40 a Fare l'Impiegato.",
    subheadline: "Studi commerciali, consulenti del lavoro, tributaristi: ogni ora su segreteria, PEC e scadenze è un'ora che non fatturate. Fate i conti — vi costa €72.000/anno.",
    problems: [
      { title: "Dichiarazioni e scadenze fiscali", desc: "730, Unico, IVA trimestrale, F24: il calendario fiscale non perdona. Un ritardo = sanzione per il vostro cliente e danno reputazionale per voi." },
      { title: "Gestione PEC e corrispondenza", desc: "50+ PEC al giorno tra Agenzia delle Entrate, INPS, Camera di Commercio. Le aprite la sera, di fretta, rischiando di perdere comunicazioni urgenti." },
      { title: "Segreteria sommersa", desc: "Appuntamenti, chiamate clienti, raccolta documenti. La vostra segretaria gestisce 200+ clienti — e gli errori si moltiplicano." },
      { title: "Fatturazione dello studio", desc: "Cassa previdenza commercialisti, ritenute, bollo: la vostra stessa fatturazione è più complessa di quella dei clienti." },
    ],
    caseStudy: {
      name: "Studio Comm. Ricci & Associati",
      role: "Commercialisti",
      location: "Roma",
      before: [
        { label: "Ore/mese su segreteria", value: "85" },
        { label: "PEC arretrate", value: "35/settimana" },
        { label: "Clienti gestiti per persona", value: "45" },
        { label: "Costo segreteria annuo", value: "€38.000" },
      ],
      after: [
        { label: "Ore/mese su segreteria", value: "10" },
        { label: "PEC arretrate", value: "0" },
        { label: "Clienti gestiti per persona", value: "80" },
        { label: "Costo segreteria annuo", value: "€12.000" },
      ],
      quote: "Abbiamo quasi raddoppiato i clienti per collaboratore. Il fatturato dello studio è cresciuto del 45% senza nuove assunzioni.",
    },
    services: ["creazione-fatture", "gestione-corrispondenza", "segreteria-virtuale", "call-center"],
    cta: "Recupera le Ore che Stai Regalando →",
  },
  {
    slug: "medici-studi-medici",
    title: "Medici e Studi Medici",
    icon: Stethoscope,
    category: "settore",
    headline: "Ogni Minuto Fuori dallo Studio Ti Costa €3. La Burocrazia Te Ne Ruba 90 al Giorno.",
    subheadline: "Dentisti, fisioterapisti, poliambulatori: il vostro valore è nella visita, non nella fattura. Eppure spendete 1.5 ore/giorno su burocrazia sanitaria.",
    problems: [
      { title: "Fatturazione sanitaria complessa", desc: "Fatture con esenzioni, codici prestazione, tessera sanitaria, Sistema TS: ogni errore blocca il rimborso o genera controlli." },
      { title: "Gestione appuntamenti caotica", desc: "No-show al 15%, sovrapposizioni, pazienti che chiamano per spostare. Ogni slot vuoto vi costa €80-150 di mancato incasso." },
      { title: "Recall pazienti inesistente", desc: "Il paziente che non torna per il controllo semestrale è fatturato perso. Senza un sistema di recall, perdete il 30% dei ritorni." },
      { title: "PEC e corrispondenza istituzionale", desc: "ASL, Ordine, assicurazioni, fornitori: la posta certificata si accumula e le scadenze burocratiche non aspettano." },
    ],
    caseStudy: {
      name: "Dott. Elena M.",
      role: "Dentista, studio associato",
      location: "Napoli",
      before: [
        { label: "Ore/settimana su admin", value: "12" },
        { label: "No-show pazienti", value: "18%" },
        { label: "Fatture con errori TS", value: "8%" },
        { label: "Pazienti recall persi", value: "35%" },
      ],
      after: [
        { label: "Ore/settimana su admin", value: "1" },
        { label: "No-show pazienti", value: "4%" },
        { label: "Fatture con errori TS", value: "0%" },
        { label: "Pazienti recall recuperati", value: "85%" },
      ],
      quote: "Ho recuperato 11 ore a settimana e il 85% dei pazienti torna per i controlli. Il fatturato è salito del 32%.",
    },
    services: ["creazione-fatture", "segreteria-virtuale", "call-center", "gestione-corrispondenza"],
    cta: "Scopri Quanto Ti Costa la Burocrazia Sanitaria →",
  },
  {
    slug: "avvocati-studi-legali",
    title: "Avvocati e Studi Legali",
    icon: Scale,
    category: "settore",
    headline: "Le Tue Ore Fatturabili Valgono €200. Stai Usando €48.000/Anno per Fare il Segretario.",
    subheadline: "Avvocati, notai, studi legali associati: ogni ora spesa su PEC del tribunale, scadenze processuali e fatturazione con Cassa Forense è un'ora non fatturata al cliente.",
    problems: [
      { title: "Scadenze processuali critiche", desc: "Termini perentori, depositi telematici, notifiche via PEC: una scadenza mancata può costare la causa al vostro cliente — e la vostra reputazione." },
      { title: "PEC tribunali e corrispondenza", desc: "Decine di PEC al giorno da tribunali, controparti, cancellerie. Ogni comunicazione richiede protocollo, archiviazione, risposta tempestiva." },
      { title: "Fatturazione con Cassa Forense", desc: "Contributo integrativo 4%, ritenuta d'acconto, bollo, anticipazioni escluse da IVA: la fattura dell'avvocato è un rompicapo normativo." },
      { title: "Segreteria e gestione agenda", desc: "Udienze, riunioni, scadenze, nuovi clienti: senza una segreteria dedicata ed efficiente, perdete il controllo dello studio." },
    ],
    caseStudy: {
      name: "Avv. Stefano L.",
      role: "Studio legale civile",
      location: "Genova",
      before: [
        { label: "Ore/mese non fatturabili", value: "52" },
        { label: "PEC arretrate", value: "25/settimana" },
        { label: "Scadenze a rischio/anno", value: "8" },
        { label: "Costo segreteria annuo", value: "€42.000" },
      ],
      after: [
        { label: "Ore/mese non fatturabili", value: "6" },
        { label: "PEC arretrate", value: "0" },
        { label: "Scadenze a rischio/anno", value: "0" },
        { label: "Costo segreteria annuo", value: "€14.400" },
      ],
      quote: "Ho recuperato 46 ore al mese di tempo fatturabile. A €200/ora, fate voi i conti. Lo studio si è ripagato in 2 settimane.",
    },
    services: ["creazione-fatture", "gestione-corrispondenza", "segreteria-virtuale", "call-center"],
    cta: "Recupera le Tue Ore Fatturabili →",
  },
  {
    slug: "commercio-retail",
    title: "Commercio e Retail",
    icon: ShoppingCart,
    category: "settore",
    headline: "Ogni Fattura in Ritardo Ti Costa un Cliente. E Non Lo Sai Nemmeno.",
    subheadline: "Negozi, e-commerce, grossisti, distributori: volumi alti di fatturazione, fornitori da gestire, clienti da seguire. Il back-office non può essere il vostro collo di bottiglia.",
    problems: [
      { title: "Fatturazione ad alto volume", desc: "50, 100, 200 fatture al mese: ogni errore si moltiplica. Un XML rifiutato dallo SDI blocca il pagamento e irrita il cliente." },
      { title: "Gestione fornitori", desc: "Ordini, DDT, fatture passive, riconciliazioni: con 20+ fornitori, il controllo è impossibile senza un sistema dedicato." },
      { title: "Corrispondenza e reclami", desc: "Resi, contestazioni, richieste informazioni: la posta si accumula e i clienti insoddisfatti non aspettano." },
      { title: "Call center clienti", desc: "\"Dov'è il mio ordine?\" \"Posso avere la fattura?\" \"Vorrei un reso.\" Ogni chiamata non gestita è un cliente perso." },
    ],
    caseStudy: {
      name: "Ferramenta Colombo",
      role: "Grossista e dettaglio",
      location: "Bergamo",
      before: [
        { label: "Fatture/mese", value: "180" },
        { label: "Errori fatturazione", value: "12%" },
        { label: "Chiamate perse/giorno", value: "15" },
        { label: "Tempo gestione fornitori", value: "25h/mese" },
      ],
      after: [
        { label: "Fatture/mese", value: "180 (tutte delegate)" },
        { label: "Errori fatturazione", value: "0.2%" },
        { label: "Chiamate perse/giorno", value: "0" },
        { label: "Tempo gestione fornitori", value: "3h/mese" },
      ],
      quote: "Non perdiamo più un cliente per colpa di una fattura sbagliata. E al telefono risponde sempre qualcuno.",
    },
    services: ["creazione-fatture", "call-center", "gestione-corrispondenza", "segreteria-virtuale"],
    cta: "Smetti di Perdere Clienti per Colpa del Back-Office →",
  },

  // ── SETTORE-EDILIZIA (sotto-settori) ──
  {
    slug: "edilizia-ristrutturazioni",
    title: "Edilizia e Ristrutturazioni",
    icon: HardHat,
    category: "settore-edilizia",
    headline: "Sei in Cantiere Dalle 7. La Burocrazia Non Dovrebbe Aspettarti Alle 20.",
    subheadline: "Ristrutturazioni, nuove costruzioni, manutenzioni: il lavoro è in cantiere, non dietro una scrivania. Eppure passate 15+ ore/settimana su carta.",
    problems: [
      { title: "Pratiche ENEA obbligatorie", desc: "Ogni intervento di efficientamento richiede la comunicazione ENEA. Con 20+ cantieri, sono centinaia di pratiche all'anno." },
      { title: "Finanziamenti per i clienti", desc: "I vostri clienti vogliono pagare a rate. Ma gestire le pratiche di finanziamento vi porta via ore e competenze che non avete." },
      { title: "Fatturazione SAL", desc: "Fatturare per Stato Avanzamento Lavori è complesso: importi variabili, ritenute, split payment. Un errore e il pagamento slitta di mesi." },
      { title: "Gestione subappaltatori", desc: "Coordinare fatture, pagamenti e documentazione di 5-10 subappaltatori per cantiere è un incubo amministrativo." },
    ],
    caseStudy: {
      name: "Impresa Edile Rossi",
      role: "Ristrutturazioni",
      location: "Verona",
      before: [
        { label: "Ore/settimana burocrazia", value: "18" },
        { label: "Pratiche ENEA in ritardo", value: "40%" },
        { label: "Tempo incasso medio", value: "75 giorni" },
        { label: "Fatture con errori", value: "15%" },
      ],
      after: [
        { label: "Ore/settimana burocrazia", value: "2" },
        { label: "Pratiche ENEA in ritardo", value: "0%" },
        { label: "Tempo incasso medio", value: "32 giorni" },
        { label: "Fatture con errori", value: "0%" },
      ],
      quote: "Abbiamo dimezzato i tempi di incasso. Solo questo ha cambiato il cashflow dell'azienda.",
    },
    services: ["creazione-fatture", "pratiche-enea", "pratiche-finanziamento", "gestione-corrispondenza"],
    cta: "Libera il Tuo Cantiere dalla Burocrazia →",
  },
  {
    slug: "impiantisti",
    title: "Impiantisti",
    icon: Wrench,
    category: "settore-edilizia",
    headline: "Idraulico, Elettricista, Climatizzatore: Il Tuo Tempo Vale €80/Ora. Stai Sprecando €54.000/Anno in Scartoffie.",
    subheadline: "Ogni ora che passi a fare fatture, compilare ENEA o rispondere al telefono è un'ora che non fatturi al cliente. Fai i conti.",
    problems: [
      { title: "Fatture dal furgone", desc: "Finite un intervento alle 18, e poi dovete fare la fattura. Dal telefono, con errori, di fretta. Non è sostenibile." },
      { title: "ENEA per ogni caldaia e condizionatore", desc: "Ogni installazione di climatizzatore o caldaia richiede la pratica ENEA. Sono 3 ore a pratica. Con 15 installazioni al mese..." },
      { title: "Clienti che chiamano in continuazione", desc: "\"Quando venite?\" \"Quanto costa?\" \"Avete finito?\". Mentre siete sotto un lavandino, il telefono non smette di suonare." },
      { title: "Preventivi e solleciti", desc: "Fare preventivi la sera, sollecitare pagamenti il weekend. Il lavoro amministrativo non finisce mai." },
    ],
    caseStudy: {
      name: "Marco V.",
      role: "Elettricista",
      location: "Bologna",
      before: [
        { label: "Interventi/giorno", value: "3" },
        { label: "Ore/giorno su admin", value: "3" },
        { label: "Chiamate perse/giorno", value: "5" },
        { label: "Fatturato annuo", value: "€95.000" },
      ],
      after: [
        { label: "Interventi/giorno", value: "5" },
        { label: "Ore/giorno su admin", value: "0" },
        { label: "Chiamate perse/giorno", value: "0" },
        { label: "Fatturato annuo", value: "€158.000" },
      ],
      quote: "Faccio 2 interventi in più al giorno. Il fatturato è salito del 66% in 6 mesi.",
    },
    services: ["creazione-fatture", "pratiche-enea", "call-center", "segreteria-virtuale"],
    cta: "Calcola Quanto Fatturato Stai Perdendo →",
  },
  {
    slug: "serramentisti-posatori",
    title: "Serramentisti e Posatori",
    icon: DoorOpen,
    category: "settore-edilizia",
    headline: "Ogni Finestra Installata Genera 47 Minuti di Burocrazia. Moltiplica per 200 Installazioni/Anno.",
    subheadline: "Pratiche ENEA obbligatorie, finanziamenti richiesti dal cliente, fatturazione complessa con acconti e saldi. Tutto questo non è il vostro lavoro.",
    problems: [
      { title: "ENEA obbligatoria per ogni infisso", desc: "La sostituzione di serramenti richiede SEMPRE la comunicazione ENEA. Con centinaia di installazioni, è un volume enorme." },
      { title: "Finanziamenti richiesti dal 70% dei clienti", desc: "I vostri clienti vogliono il finanziamento. Ma gestire le pratiche con le finanziarie vi porta via mezza giornata per richiesta." },
      { title: "Acconti, saldi e SAL", desc: "Fatturazione in 3-4 tranche per ogni lavoro: acconto, materiali, posa, saldo. Moltiplicatelo per 20 cantieri aperti." },
      { title: "Showroom + cantiere + ufficio", desc: "Dovete stare in showroom per vendere, in cantiere per posare, in ufficio per amministrare. Non potete triplicarvi." },
    ],
    caseStudy: {
      name: "Serramenti Bianchi Srl",
      role: "Produzione e posa",
      location: "Treviso",
      before: [
        { label: "Pratiche ENEA/mese", value: "25" },
        { label: "Ore admin/mese", value: "80" },
        { label: "Finanziamenti gestiti", value: "30%" },
        { label: "Margine netto", value: "7%" },
      ],
      after: [
        { label: "Pratiche ENEA/mese", value: "25 (tutte delegate)" },
        { label: "Ore admin/mese", value: "5" },
        { label: "Finanziamenti gestiti", value: "95%" },
        { label: "Margine netto", value: "13%" },
      ],
      quote: "Abbiamo iniziato ad offrire il finanziamento a tutti i clienti. Le vendite sono esplose.",
    },
    services: ["pratiche-enea", "pratiche-finanziamento", "creazione-fatture", "call-center", "gestione-corrispondenza"],
    cta: "Delega Tutta la Burocrazia dei Serramenti →",
  },
  {
    slug: "studi-tecnici",
    title: "Studi Tecnici",
    icon: Pencil,
    category: "settore-edilizia",
    headline: "La Tua Tariffa Oraria È €75. Stai Usando €22.500/Anno di Quel Tempo per Fare l'Impiegato.",
    subheadline: "Geometri, architetti, ingegneri, periti: il vostro valore è nel progetto, non nella pratica. Ogni ora su burocrazia è un'ora non fatturata.",
    problems: [
      { title: "Pratiche ENEA per i vostri clienti", desc: "I vostri committenti si aspettano che gestiate anche l'ENEA. Ma non è il vostro core business e vi porta via tempo prezioso." },
      { title: "Gestione corrispondenza e scadenze", desc: "PEC, raccomandate, scadenze catastali, visure. Una dimenticanza può costare migliaia di euro al vostro cliente — e la vostra reputazione." },
      { title: "Fatturazione professionale", desc: "Cassa previdenza, ritenuta d'acconto, split payment PA, bollo virtuale. La fatturazione dei professionisti è un incubo normativo." },
      { title: "Segreteria e gestione agenda", desc: "Appuntamenti, sopralluoghi, riunioni, deadline. Senza una segreteria dedicata, perdete il controllo." },
    ],
    caseStudy: {
      name: "Studio Tecnico Ferretti",
      role: "Geometri associati",
      location: "Firenze",
      before: [
        { label: "Ore/mese non fatturabili", value: "45" },
        { label: "Fatturato perso/anno", value: "€40.500" },
        { label: "Pratiche in ritardo", value: "20%" },
        { label: "Clienti gestiti", value: "35" },
      ],
      after: [
        { label: "Ore/mese non fatturabili", value: "8" },
        { label: "Fatturato recuperato/anno", value: "€33.300" },
        { label: "Pratiche in ritardo", value: "0%" },
        { label: "Clienti gestiti", value: "55" },
      ],
      quote: "Abbiamo preso 20 clienti in più senza assumere. Il fatturato è cresciuto del 57%.",
    },
    services: ["pratiche-enea", "creazione-fatture", "gestione-corrispondenza", "segreteria-virtuale"],
    cta: "Recupera le Tue Ore Fatturabili →",
  },
];

export function getTargetBySlug(slug: string): TargetSegment | undefined {
  return targetSegments.find((t) => t.slug === slug);
}

export function getTargetsByCategory(cat: "dimensione" | "settore" | "settore-edilizia"): TargetSegment[] {
  return targetSegments.filter((t) => t.category === cat);
}

export function getEdiliziaSubsectors(): TargetSegment[] {
  return targetSegments.filter((t) => t.category === "settore-edilizia");
}
