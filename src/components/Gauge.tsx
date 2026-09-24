// Jauge de progression (quiz : chaque bonne réponse la remplit).
export default function Gauge({ percent, label }: { percent: number; label?: string }) {
  const p = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-bold text-[#2b2f38]">
        <span>{label ?? "Bonnes réponses"}</span>
        <span>{p} %</span>
      </div>
      <div
        className="mt-1 h-4 w-full overflow-hidden rounded-full bg-[#e7e9ee]"
        role="progressbar"
        aria-valuenow={p}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-700 ${p === 100 ? "bg-brand-teal" : "bg-brand-gold"}`}
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}
