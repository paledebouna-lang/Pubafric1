import Link from "next/link";
import { auth } from "@/auth";
import LogoutButton from "./LogoutButton";

const NAV_LINKS = [
  { label: "Internautes", href: "#internautes" },
  { label: "Entreprises", href: "#entreprises" },
];

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-brand-red bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex flex-col leading-none">
          <span className="flex items-center gap-1 text-2xl font-extrabold tracking-tight">
            <span className="text-brand-red">P</span>
            <span className="text-[#2b2f38]">ubAFric</span>
          </span>
          <span className="mt-0.5 hidden text-[10px] font-semibold uppercase tracking-widest text-brand-gold sm:block">
            Vos missions, votre Afrique
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold tracking-wide text-[#2b2f38] md:flex">
          {!session?.user &&
            NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="transition-colors hover:text-brand-red">
                {link.label.toUpperCase()}
              </a>
            ))}
          <Link href="/toutes-les-missions" className="transition-colors hover:text-brand-red">
            MICROS MISSIONS
          </Link>
          {session?.user?.role !== "INTERNAUTE" && (
            <Link href="/taskers" className="transition-colors hover:text-brand-red">
              NOS TASKERS
            </Link>
          )}
          <Link href="/partenaires" className="transition-colors hover:text-brand-red">
            PARTENAIRES
          </Link>
          {session?.user && session.user.role === "ADMIN" && (
            <Link href="/admin" className="transition-colors hover:text-brand-red">
              ADMINISTRATION
            </Link>
          )}
          {session?.user && session.user.role !== "ADMIN" && (
            <>
              <Link
                href={session.user.role === "ENTREPRISE" ? "/entreprise/missions" : "/missions"}
                className="transition-colors hover:text-brand-red"
              >
                {session.user.role === "ENTREPRISE" ? "MES MISSIONS" : "PRENDRE UNE MISSION"}
              </Link>
              <Link
                href={session.user.role === "ENTREPRISE" ? "/entreprise/credits" : "/credits"}
                className="transition-colors hover:text-brand-red"
              >
                MES CRÉDITS
              </Link>
            </>
          )}
        </nav>

        {session?.user ? (
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/profil"
              className="text-sm font-semibold text-[#2b2f38] transition-colors hover:text-brand-red"
            >
              {session.user.name}
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/connexion"
            className="hidden rounded-sm border border-[#d7dbe3] px-4 py-2 text-sm font-semibold text-[#2b2f38] transition-colors hover:border-brand-red hover:text-brand-red md:inline-block"
          >
            SE CONNECTER
          </Link>
        )}
      </div>
    </header>
  );
}
