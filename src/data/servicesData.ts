import { FileText, Building, Euro, Phone, Mail, Bot, Clock, Shield, Zap, CheckCircle, TrendingUp, Users, HeadphonesIcon, FileCheck, BrainCircuit, CalendarCheck, AlertTriangle, Banknote } from "lucide-react";

export interface ServiceData {
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  badge: string;
  icon: any;
  problems: { title: string; desc: string }[];
  steps: { step: string; title: string; desc: string }[];
  benefits: { icon: any; title: string; desc: string }[];
  comparison: { label: string; internal: string; impresaLeggera: string }[];
  ctaText: string;
}

export const servicesData: ServiceData[] = [
  {
    slug: "creazione-fatture",
    title: "Creazione Fatture",
    headline: "Basta perdere ore a fare fatture.",
    subheadline: "Gestiamo l'intero ciclo di fatturazione elettronica per te. Tu lavori, noi fatturiamo. Conforme SDI, zero errori, zero stress.",
    badge: "Da €X a pratica",
    icon: FileText,
    problems: [
      { title: "Perdi 2+ ore al giorno", desc: "A compilare, controllare e inviare fatture elettroniche invece di lavorare sui cantieri o con i clienti." },
      { title: "Errori e scarti SDI", desc: "Fatture rifiutate, codici fiscali sbagliati, formati non conformi. Ogni errore ti costa tempo e credibilità." },
      { title: "Scadenze dimenticate", desc: "Clienti che non pagano perché la fattura non è mai partita. Incassi in ritardo che mettono in crisi la cassa." },
      { title: "Il commercialista non basta", desc: "Ti manda i dati ma non gestisce il flusso quotidiano. Serve qualcuno che lo faccia ogni giorno, per te." },
    ],
    steps: [
      { step: "01", title: "Ci invii i dati", desc: "Via WhatsApp, email o il nostro portale. Bastano i dati essenziali: cliente, importo, descrizione." },
      { step: "02", title: "Noi creiamo e inviamo", desc: "Generiamo la fattura elettronica conforme SDI, la inviamo e monitoriamo l'esito." },
      { step: "03", title: "Tu incassi", desc: "Ricevi notifica di consegna e puoi concentrarti sul tuo lavoro. Noi gestiamo anche i solleciti." },
    ],
    benefits: [
      { icon: Shield, title: "100% Conforme SDI", desc: "Ogni fattura rispetta gli standard dell'Agenzia delle Entrate." },
      { icon: Clock, title: "Emissione in 4 ore", desc: "Dalla ricezione dei dati alla fattura inviata, in mezza giornata." },
      { icon: CheckCircle, title: "Zero errori di compilazione", desc: "Controllo doppio su ogni dato prima dell'invio." },
      { icon: Zap, title: "Note di credito incluse", desc: "Gestiamo anche stornì, rettifiche e note di variazione." },
      { icon: TrendingUp, title: "Scadenzario automatico", desc: "Monitoriamo chi deve pagare e quando, con alert automatici." },
      { icon: Users, title: "Supporto dedicato", desc: "Un referente che conosce la tua azienda e i tuoi clienti." },
    ],
    comparison: [
      { label: "Costo mensile", internal: "€1.500-2.500/mese (dipendente)", impresaLeggera: "Da €X a pratica" },
      { label: "Tempo di setup", internal: "2-3 mesi (assunzione + formazione)", impresaLeggera: "24 ore" },
      { label: "Errori fatturazione", internal: "5-15% delle fatture", impresaLeggera: "< 0,5%" },
      { label: "Gestione scadenze", internal: "Manuale, spesso dimenticata", impresaLeggera: "Automatica con alert" },
      { label: "Flessibilità", internal: "Costo fisso anche se non fatturo", impresaLeggera: "Paghi solo quello che usi" },
    ],
    ctaText: "Inizia a fatturare senza stress",
  },
  {
    slug: "pratiche-enea",
    title: "Pratiche ENEA per l'Edilizia",
    headline: "Pratiche ENEA in 48 ore. Senza impazzire.",
    subheadline: "Certificazioni energetiche, detrazioni fiscali 110%, 90%, 70% e 65%. Noi le elaboriamo, tu incassi i benefici.",
    badge: "Da €X a pratica",
    icon: Building,
    problems: [
      { title: "Burocrazia infinita", desc: "Il portale ENEA cambia continuamente. Moduli, codici, allegati: un labirinto che ti ruba giornate intere." },
      { title: "Rischio di rigetto", desc: "Una virgola sbagliata e la pratica viene respinta. Perdi settimane e rischi di far perdere le detrazioni al cliente." },
      { title: "Il cliente ti pressa", desc: "Vuole le detrazioni subito. Se la pratica è in ritardo, la colpa ricade su di te." },
      { title: "Non è il tuo mestiere", desc: "Sei un professionista dell'edilizia, non un burocrate. Il tuo tempo vale di più sul cantiere." },
    ],
    steps: [
      { step: "01", title: "Ci invii la documentazione", desc: "Foto, dati catastali, schede tecniche. Ti diamo una checklist chiara di quello che serve." },
      { step: "02", title: "Elaboriamo la pratica", desc: "Il nostro team specializzato compila e invia la pratica ENEA entro 48 ore lavorative." },
      { step: "03", title: "Pratica approvata", desc: "Ricevi conferma e documentazione completa. Il tuo cliente ottiene le sue detrazioni." },
    ],
    benefits: [
      { icon: Clock, title: "48 ore lavorative", desc: "Dalla ricezione dei documenti alla pratica completata e inviata." },
      { icon: Shield, title: "Tasso approvazione 98%", desc: "Grazie al nostro controllo qualità rigoroso su ogni pratica." },
      { icon: FileCheck, title: "Tutte le detrazioni", desc: "110%, 90%, 70%, 65%. Conosciamo ogni tipologia e requisito." },
      { icon: CheckCircle, title: "Checklist guidata", desc: "Ti diciamo esattamente cosa serve. Niente documenti mancanti." },
      { icon: Zap, title: "Aggiornamento normativo", desc: "Siamo sempre aggiornati sulle ultime modifiche ENEA." },
      { icon: Users, title: "Supporto al tuo cliente", desc: "Possiamo interfacciarci direttamente con il committente se serve." },
    ],
    comparison: [
      { label: "Tempo per pratica", internal: "3-5 giorni lavorativi", impresaLeggera: "48 ore" },
      { label: "Tasso di errore", internal: "15-25%", impresaLeggera: "< 2%" },
      { label: "Costo opportunità", internal: "Giornate fuori cantiere", impresaLeggera: "Zero tempo perso" },
      { label: "Aggiornamento normativo", internal: "A carico tuo", impresaLeggera: "Sempre incluso" },
      { label: "Rischio rigetto", internal: "Alto senza esperienza", impresaLeggera: "Minimo, con revisione" },
    ],
    ctaText: "Invia la tua prima pratica ENEA",
  },
  {
    slug: "pratiche-finanziamento",
    title: "Pratiche di Finanziamento",
    headline: "Le Pratiche di Finanziamento dei Tuoi Clienti? Le Facciamo Noi.",
    subheadline: "Raccogliamo i documenti, accediamo ai portali, compiliamo e inviamo le pratiche di credito al consumo. Tu chiudi il contratto, noi facciamo il resto.",
    badge: "Da €X a pratica",
    icon: Euro,
    problems: [
      { title: "Ore perse sui portali", desc: "Cofidis, Agos, Compass, Findomestic... Ogni finanziaria ha il suo portale, le sue regole, i suoi formati. E tu ci perdi mezza giornata per ogni pratica." },
      { title: "Errori che bloccano l'erogazione", desc: "Un campo sbagliato, un documento mancante e la pratica si blocca. Il cliente aspetta, si innervosisce, e rischi di perdere la vendita." },
      { title: "Rincorri i clienti per i documenti", desc: "Carta d'identità scaduta, busta paga del mese sbagliato, codice fiscale illeggibile. Passi più tempo a raccogliere carte che a vendere." },
      { title: "Non puoi dedicarci un dipendente", desc: "Un impiegato solo per le pratiche costa €25.000+/anno. Ma non puoi farle tu: ogni ora sui portali è un'ora che non vendi." },
    ],
    steps: [
      { step: "01", title: "Ci dai accesso ai portali", desc: "Configuriamo le credenziali delle finanziarie con cui lavori. Setup una tantum, poi ci pensiamo noi." },
      { step: "02", title: "Il cliente firma, noi carichiamo", desc: "Raccogliamo i documenti, compiliamo i moduli, carichiamo tutto sui portali. Tu ti concentri sulla vendita." },
      { step: "03", title: "Monitoriamo fino all'erogazione", desc: "Seguiamo lo stato della pratica, gestiamo le integrazioni richieste e ti aggiorniamo in tempo reale." },
    ],
    benefits: [
      { icon: Zap, title: "Evasione in 24 ore", desc: "Dalla ricezione dei documenti alla pratica caricata sul portale, in una giornata lavorativa." },
      { icon: Shield, title: "Zero errori di compilazione", desc: "Controllo doppio su ogni campo e documento prima del caricamento." },
      { icon: TrendingUp, title: "Più pratiche = più vendite", desc: "Liberandoti dalla burocrazia, puoi chiudere più contratti ogni settimana." },
      { icon: Users, title: "Nessun dipendente dedicato", desc: "Paghi solo le pratiche che fai. Nessun costo fisso, nessun rischio." },
      { icon: CheckCircle, title: "Monitoraggio stato pratiche", desc: "Dashboard aggiornata in tempo reale su ogni pratica: inviata, in lavorazione, approvata, erogata." },
      { icon: Clock, title: "Report settimanale", desc: "Ogni settimana ricevi un riepilogo completo: pratiche inviate, approvate, in attesa, erogate." },
    ],
    comparison: [
      { label: "Tempo per pratica", internal: "45-90 minuti (fai-da-te)", impresaLeggera: "Zero (facciamo noi)" },
      { label: "Errori compilazione", internal: "15-25% delle pratiche", impresaLeggera: "< 1%" },
      { label: "Pratiche gestibili/mese", internal: "15-20 (se hai tempo)", impresaLeggera: "Illimitate" },
      { label: "Costo annuo", internal: "€25.000+ (dipendente dedicato)", impresaLeggera: "Da €X a pratica" },
      { label: "Monitoraggio stato", internal: "Manuale, portale per portale", impresaLeggera: "Dashboard unica in tempo reale" },
    ],
    ctaText: "Delega le Pratiche di Finanziamento",
  },
  {
    slug: "call-center",
    title: "Call Center Professionale",
    headline: "Il tuo telefono squilla. Noi rispondiamo.",
    subheadline: "Il tuo numero, i tuoi clienti, la nostra professionalità. Gestione chiamate, appuntamenti, qualifica lead e customer service.",
    badge: "Da €X al giorno",
    icon: Phone,
    problems: [
      { title: "Chiamate perse = clienti persi", desc: "Ogni chiamata senza risposta è un potenziale cliente che va dalla concorrenza. E non torna." },
      { title: "Non puoi rispondere in cantiere", desc: "Hai le mani sporche, il trapano in mano, sei su un ponteggio. Il telefono squilla e tu non puoi rispondere." },
      { title: "Segretaria troppo costosa", desc: "Assumere qualcuno solo per le chiamate costa €25.000+/anno tra stipendio, contributi e TFR." },
      { title: "Immagine poco professionale", desc: "Segreteria telefonica automatica? Il cliente riaggancia. Vuole parlare con una persona, subito." },
    ],
    steps: [
      { step: "01", title: "Deviazione chiamate", desc: "Configuri il trasferimento di chiamata sul tuo numero. I tuoi clienti non noteranno la differenza." },
      { step: "02", title: "Noi rispondiamo a nome tuo", desc: "Operatori formati rispondono con il nome della tua azienda, seguendo il tuo script personalizzato." },
      { step: "03", title: "Tu ricevi il report", desc: "Ogni chiamata viene registrata. Ricevi un riepilogo in tempo reale via app o WhatsApp." },
    ],
    benefits: [
      { icon: HeadphonesIcon, title: "Risposta entro 3 squilli", desc: "I tuoi clienti parlano sempre con una persona reale, mai con una macchina." },
      { icon: Users, title: "A nome della tua azienda", desc: "Script personalizzato, tono di voce concordato. Sembriamo il tuo team." },
      { icon: CalendarCheck, title: "Gestione appuntamenti", desc: "Prenotiamo direttamente nella tua agenda, senza passaggi intermedi." },
      { icon: Zap, title: "Qualifica lead", desc: "Filtriamo le chiamate: sai subito chi è un cliente serio e chi no." },
      { icon: Clock, title: "Report in tempo reale", desc: "Ogni chiamata documentata e inviata istantaneamente." },
      { icon: TrendingUp, title: "Zero chiamate perse", desc: "Copertura negli orari che scegli tu, anche il sabato." },
    ],
    comparison: [
      { label: "Costo annuo", internal: "€25.000+ (dipendente)", impresaLeggera: "Da €X al giorno" },
      { label: "Disponibilità", internal: "Solo orario ufficio", impresaLeggera: "Orari flessibili, anche sabato" },
      { label: "Formazione", internal: "Settimane", impresaLeggera: "Operativi in 24 ore" },
      { label: "Ferie e malattia", internal: "Servizio interrotto", impresaLeggera: "Copertura garantita sempre" },
      { label: "Scalabilità", internal: "1 persona = 1 linea", impresaLeggera: "Multi-operatore, nessuna attesa" },
    ],
    ctaText: "Attiva il tuo Call Center",
  },
  {
    slug: "gestione-corrispondenza",
    title: "Gestione Corrispondenza e Scadenze",
    headline: "Mai più una scadenza dimenticata.",
    subheadline: "Raccomandate, notifiche, scadenze fiscali e amministrative. Monitoriamo tutto e ti avvisiamo in tempo reale.",
    badge: "Incluso nel piano",
    icon: Mail,
    problems: [
      { title: "Scadenze che sfuggono", desc: "F24, INPS, INAIL, Camera di Commercio... ogni mese c'è qualcosa da pagare o da comunicare. E se te lo dimentichi, paghi multa." },
      { title: "PEC intasata e ignorata", desc: "Hai 347 email PEC non lette. Tra quelle c'è una notifica importante? Non lo sai finché non è troppo tardi." },
      { title: "Raccomandate perse", desc: "La raccomandata è arrivata ma tu eri in cantiere. Ora hai 10 giorni per rispondere e ne sono già passati 8." },
      { title: "Nessuno monitora per te", desc: "Il commercialista fa i conti, non le scadenze operative quotidiane. Serve qualcuno che tenga tutto sotto controllo." },
    ],
    steps: [
      { step: "01", title: "Ci dai gli accessi", desc: "PEC, portali fiscali, casella postale. Configuriamo tutto in modo sicuro e riservato." },
      { step: "02", title: "Monitoriamo tutto", desc: "Ogni giorno controlliamo PEC, raccomandate, scadenze. Cataloghiamo e archiviamo." },
      { step: "03", title: "Ti avvisiamo per tempo", desc: "Alert via WhatsApp o email con anticipo sufficiente per agire. Nessuna sorpresa." },
    ],
    benefits: [
      { icon: Shield, title: "Zero multe per ritardo", desc: "Monitoriamo ogni scadenza e ti avvisiamo con largo anticipo." },
      { icon: Mail, title: "PEC sempre sotto controllo", desc: "Leggiamo, cataloghiamo e ti segnaliamo solo ciò che conta." },
      { icon: Clock, title: "Alert in tempo reale", desc: "Notifiche istantanee per comunicazioni urgenti o scadenze imminenti." },
      { icon: FileCheck, title: "Archiviazione digitale", desc: "Ogni documento catalogato e recuperabile in pochi secondi." },
      { icon: CheckCircle, title: "Raccomandate gestite", desc: "Riceviamo, scansioniamo e ti inoltriamo tutto immediatamente." },
      { icon: Zap, title: "Incluso nel piano", desc: "Nessun costo aggiuntivo se hai un piano attivo con noi." },
    ],
    comparison: [
      { label: "Rischio multa/sanzione", internal: "Alto (dimenticanze frequenti)", impresaLeggera: "Praticamente zero" },
      { label: "Tempo dedicato", internal: "1-2 ore/giorno", impresaLeggera: "Zero (facciamo noi)" },
      { label: "PEC monitorata", internal: "Quando ti ricordi", impresaLeggera: "Ogni giorno, più volte" },
      { label: "Archiviazione", internal: "Cartacea, caotica", impresaLeggera: "Digitale, ordinata, cercabile" },
      { label: "Costo", internal: "Tempo + rischio sanzioni", impresaLeggera: "Incluso nel piano" },
    ],
    ctaText: "Metti in sicurezza le tue scadenze",
  },
  {
    slug: "segreteria-virtuale",
    title: "Segreteria Virtuale + AI",
    headline: "La tua assistente. Sempre disponibile. Potenziata dall'AI.",
    subheadline: "Gestione agenda, email, follow-up automatici. Una segretaria virtuale che non va mai in ferie e impara i tuoi processi.",
    badge: "NOVITÀ",
    icon: Bot,
    problems: [
      { title: "Sei il tuttofare della tua azienda", desc: "Rispondi alle email, fissi appuntamenti, fai follow-up. E intanto il lavoro vero si accumula." },
      { title: "I follow-up non partono mai", desc: "Quel preventivo che dovevi ricontattare? Quella email a cui dovevi rispondere? Perse nel caos quotidiano." },
      { title: "L'agenda è un disastro", desc: "Appuntamenti sovrapposti, clienti che aspettano conferma, riunioni che saltano." },
      { title: "Una segretaria costa troppo", desc: "E una part-time non copre tutto. Hai bisogno di qualcuno sempre disponibile, senza i costi fissi." },
    ],
    steps: [
      { step: "01", title: "Setup personalizzato", desc: "Configuriamo la segreteria sui tuoi strumenti: Google Calendar, email, WhatsApp, CRM." },
      { step: "02", title: "AI + team umano", desc: "L'intelligenza artificiale gestisce le attività ripetitive. Il team umano interviene per le decisioni." },
      { step: "03", title: "Tu ti concentri sul business", desc: "L'agenda si riempie da sola, i follow-up partono automaticamente, le email hanno risposta." },
    ],
    benefits: [
      { icon: BrainCircuit, title: "Potenziata dall'AI", desc: "Automazioni intelligenti che imparano i tuoi processi e migliorano nel tempo." },
      { icon: CalendarCheck, title: "Gestione agenda completa", desc: "Appuntamenti, promemoria, conferme. Tutto automatizzato." },
      { icon: Mail, title: "Email gestite", desc: "Risposte predefinite, smistamento, flag per le urgenze." },
      { icon: Zap, title: "Follow-up automatici", desc: "Mai più un preventivo dimenticato. Il sistema ricontatta per te." },
      { icon: Clock, title: "Disponibile 24/7", desc: "L'AI non dorme. Le richieste vengono gestite anche fuori orario." },
      { icon: Users, title: "Backup umano", desc: "Per le situazioni complesse, interviene un operatore esperto." },
    ],
    comparison: [
      { label: "Costo annuo", internal: "€20.000-30.000 (segretaria)", impresaLeggera: "Frazione del costo" },
      { label: "Disponibilità", internal: "8 ore/giorno, 5 giorni", impresaLeggera: "24/7 con AI" },
      { label: "Follow-up", internal: "Manuali e dimenticati", impresaLeggera: "Automatici e puntuali" },
      { label: "Scalabilità", internal: "Limitata a 1 persona", impresaLeggera: "Illimitata" },
      { label: "Ferie e malattia", internal: "Servizio interrotto", impresaLeggera: "Mai interrotto" },
    ],
    ctaText: "Attiva la tua Segreteria AI",
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find((s) => s.slug === slug);
}
