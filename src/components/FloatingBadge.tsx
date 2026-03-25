export default function FloatingBadge() {
  return (
    <div className="mt-4 animate-float-slow inline-block bg-card rounded-full shadow-lg border border-border px-4 py-2">
      <span className="text-sm font-subtitle font-semibold">
        💰 Risparmio medio: <span className="text-secondary font-bold">60%</span> sui costi di gestione
      </span>
    </div>
  );
}
