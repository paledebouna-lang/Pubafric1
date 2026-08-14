export default function SlotsGauge({ occupied, total }: { occupied: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((occupied / total) * 100)) : 0;
  const full = occupied >= total;

  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-muted-bg">
        <div
          className={`h-full rounded-full transition-all ${full ? "bg-brand-teal" : "bg-brand-blue"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-semibold text-[#7c8797]">
        {occupied}/{total}
      </span>
    </div>
  );
}
