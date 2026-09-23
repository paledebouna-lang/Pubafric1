"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export type MobileLink = { label: string; href: string };

// Menu du téléphone : sans lui, l'en-tête n'affichait ni les liens ni l'état de connexion
// sur petit écran. Il se referme tout seul dès qu'on change de page.
export default function MobileMenu({
  links,
  userName,
  children,
}: {
  links: MobileLink[];
  userName: string | null;
  children?: React.ReactNode;
}) {
  // Le menu est "ouvert sur une page" : dès que la page change, il se referme de lui-même.
  const pathname = usePathname();
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        onClick={() => setOpenAt(open ? null : pathname)}
        className="flex items-center gap-2 border border-[#d7dbe3] px-3 py-2 text-[#2b2f38]"
      >
        {userName && (
          <span className="max-w-[7rem] truncate text-xs font-semibold">{userName}</span>
        )}
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-b-4 border-brand-red bg-white px-6 pb-6 pt-2 shadow-lg">
          {userName && (
            <p className="border-b border-border-soft py-3 text-sm text-[#7c8797]">
              Connecté en tant que <span className="font-bold text-[#2b2f38]">{userName}</span>
            </p>
          )}
          <nav className="flex flex-col">
            {links.map((link) => (
              <a
                key={link.href + link.label}
                href={link.href}
                className="border-b border-border-soft py-3 text-sm font-semibold tracking-wide text-[#2b2f38]"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4">{children}</div>
        </div>
      )}
    </div>
  );
}
