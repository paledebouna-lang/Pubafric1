import Link from "next/link";
import { MISSION_FAMILIES } from "@/lib/mission-families";

// Les 9 familles de missions, en pastilles cliquables (renvoient au catalogue détaillé).
export default function FamilyGrid({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {MISSION_FAMILIES.map((f) => (
        <Link
          key={f.id}
          href={`/types-de-missions#${f.id}`}
          className={`flex flex-col items-center gap-2 border px-4 py-6 text-center transition-colors ${
            tone === "dark"
              ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
              : "border-border-soft bg-white text-[#2b2f38] shadow-sm hover:border-brand-blue"
          }`}
        >
          <f.icon size={34} className={tone === "dark" ? "text-brand-gold" : "text-brand-blue"} strokeWidth={1.5} />
          <span className="text-sm font-bold">{f.short}</span>
        </Link>
      ))}
    </div>
  );
}
