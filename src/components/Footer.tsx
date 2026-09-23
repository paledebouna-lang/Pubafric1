import Link from "next/link";
import KenteBar from "./KenteBar";

const COLUMNS = [
  {
    title: "GAGNER DE L'ARGENT",
    links: [
      { label: "Nos missions", href: "/toutes-les-missions" },
      { label: "Devenir internaute", href: "/inscription" },
    ],
  },
  {
    title: "NOUS CONNAÎTRE",
    links: [
      { label: "Comment ça marche", href: "/comment-ca-marche" },
      { label: "PubAFric en 7 questions", href: "/a-propos" },
    ],
  },
  {
    title: "LÉGAL",
    links: [
      { label: "Conditions générales d'utilisation", href: "/cgu" },
      { label: "Mentions légales", href: "/mentions-legales" },
    ],
  },
];

// Les liens de réseaux sociaux ne s'affichent que si l'adresse est renseignée
// (variables d'environnement SOCIAL_*_URL) : pas de bouton mort dans le pied de page.
function getSocials() {
  return [
    { label: "WhatsApp", href: process.env.SOCIAL_WHATSAPP_URL },
    { label: "Facebook", href: process.env.SOCIAL_FACEBOOK_URL },
    { label: "TikTok", href: process.env.SOCIAL_TIKTOK_URL },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));
}

export default function Footer() {
  const socials = getSocials();

  return (
    <footer className="bg-[#2b2f38] text-[#c3c8d1]">
      <KenteBar />
      <div className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-blanc.svg" alt="PubAfric" width={160} height={40} className="h-10 w-auto" />
        </div>

        <div className="mx-auto mt-10 grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold tracking-widest text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {socials.length > 0 && (
            <div>
              <h3 className="text-xs font-bold tracking-widest text-white">RETROUVEZ-NOUS SUR</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-[#8b93a3]">
          <p>Copyright PubAFric © {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
