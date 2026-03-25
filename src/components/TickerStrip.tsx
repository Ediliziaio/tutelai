const items = [
  "\"Finalmente mi sono tolto un peso enorme\" – Marco, Artigiano Milano",
  "Risparmio medio del 60% sui costi amministrativi",
  "+500 pratiche gestite",
  "Attivi in tutta Italia",
  "0€ costi fissi mensili",
  "\"Non tornerei mai indietro\" – Sara, Titolare PMI Bologna",
  "Pratiche ENEA elaborate in 48h",
];

export default function TickerStrip() {
  const content = items.map((t) => `  ✦  ${t}`).join("");
  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        <span className="font-subtitle text-sm font-medium">{content}</span>
        <span className="font-subtitle text-sm font-medium">{content}</span>
      </div>
    </div>
  );
}
