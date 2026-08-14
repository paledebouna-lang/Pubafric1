import Link from "next/link";
import { Share2, MessageCircle, Link2, Mail } from "lucide-react";
import KenteBar from "./KenteBar";

const COLUMNS = [
  {
    title: "GAGNER DE L'ARGENT",
    links: [
      { label: "Nos missions", href: "/toutes-les-missions" },
      { label: "Nos partenaires", href: "/partenaires" },
      { label: "Devenir tasker", href: "/inscription" },
    ],
  },
  {
    title: "NOUS CONNAÎTRE",
    links: [
      { label: "PubAFric en 7 questions", href: "/a-propos" },
      { label: "Espace presse", href: "/presse" },
      { label: "Nous rejoindre", href: "/inscription" },
    ],
  },
  {
    title: "LÉGAL",
    links: [
      { label: "Conditions générales d'utilisation", href: "/cgu" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
  {
    title: "RETROUVEZ-NOUS SUR",
    links: [],
  },
];

const SOCIALS = [
  { icon: Share2, href: "#" },
  { icon: MessageCircle, href: "#" },
  { icon: Link2, href: "#" },
  { icon: Mail, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#2b2f38] text-[#c3c8d1]">
      <KenteBar />
      <div className="px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-bold tracking-widest text-white">{col.title}</h3>
            {col.links.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-4 flex gap-3">
                {SOCIALS.map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand-red"
                  >
                    <s.icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-[#8b93a3]">
        <p>Copyright PubAFric © {new Date().getFullYear()} | Pour tout renseignement, veuillez nous contacter...</p>
      </div>
      </div>
    </footer>
  );
}
