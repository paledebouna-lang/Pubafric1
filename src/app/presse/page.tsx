import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/currency";

export default async function PressePage() {
  const [userCount, entrepriseCount, missionCount, validatedClaims, paidOut] = await Promise.all([
    prisma.user.count({ where: { role: { not: "ADMIN" } } }),
    prisma.user.count({ where: { role: "ENTREPRISE" } }),
    prisma.mission.count(),
    prisma.missionClaim.count({ where: { status: "VALIDEE" } }),
    prisma.creditTransaction.aggregate({
      where: { type: "CREDIT_MISSION" },
      _sum: { amountCents: true },
    }),
  ]);

  const stats = [
    { label: "Utilisateurs inscrits", value: userCount.toLocaleString("fr-FR") },
    { label: "Entreprises partenaires", value: entrepriseCount.toLocaleString("fr-FR") },
    { label: "Missions publiées", value: missionCount.toLocaleString("fr-FR") },
    { label: "Missions réalisées", value: validatedClaims.toLocaleString("fr-FR") },
    { label: "Reversé aux internautes", value: formatMoney(paidOut._sum.amountCents ?? 0) },
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-bold tracking-widest text-brand-red">[ ESPACE PRESSE ]</p>
      <h1 className="mt-4 text-2xl font-extrabold text-[#2b2f38] md:text-3xl">
        PubAFric en quelques chiffres
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-[#7c8797]">
        PubAFric est une plateforme qui met en relation des internautes souhaitant gagner de
        l&apos;argent avec des entreprises souhaitant faire connaître leurs produits et services
        via des micro-missions rémunérées : avis, tests, partages sur les réseaux sociaux,
        vidéos, participation à des évènements locaux, et bien plus.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="border border-border-soft bg-white p-4 text-center">
            <p className="text-xl font-extrabold text-brand-blue">{s.value}</p>
            <p className="mt-1 text-xs font-semibold tracking-wide text-[#7c8797]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-7">
        <div>
          <h2 className="text-sm font-bold text-[#2b2f38]">Notre mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">
            Offrir un revenu d&apos;appoint accessible à toute personne disposant d&apos;une
            connexion internet, tout en donnant aux entreprises un moyen simple et abordable de
            faire connaître leurs offres auprès d&apos;une communauté active.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#2b2f38]">Kit presse</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">
            Logo, éléments de langage et visuels de la marque sont disponibles sur simple demande
            auprès de notre équipe communication.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-[#2b2f38]">Contact presse</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#7c8797]">
            Pour toute demande d&apos;interview, de visuel ou d&apos;information complémentaire,
            écrivez-nous à{" "}
            <a href="mailto:presse@pubafric.com" className="font-semibold text-brand-blue">
              presse@pubafric.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
