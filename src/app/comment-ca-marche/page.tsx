import type { Metadata } from "next";
import { ClipboardList, Settings, ThumbsUp, Banknote, type LucideIcon } from "lucide-react";
import { formatMoney } from "@/lib/currency";
import {
  ENTREPRISE_FEE_PERCENT,
  INTERNAUTE_FEE_PERCENT,
  entrepriseCost,
  internauteNet,
} from "@/lib/fees";
import { REFERRAL_COMMISSION_PERCENT } from "@/lib/referral";
import { MAX_CONCURRENT_CLAIMS, MIN_PAYOUT_FCFA, MISSION_DEADLINE_HOURS } from "@/lib/rules";

export const metadata: Metadata = {
  title: "Comment ça marche ? | PubAFric",
  description:
    "Le guide complet de PubAFric : comment une entreprise publie une mission, comment un internaute la réalise, est validé et payé.",
};

const EXAMPLE_REWARD = 1000;
const exampleCost = entrepriseCost(EXAMPLE_REWARD);
const exampleNet = internauteNet(EXAMPLE_REWARD);
const exampleReferral = Math.round((exampleNet * REFERRAL_COMMISSION_PERCENT) / 100);

type Block = { heading: string; items: string[] };
type Step = {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  entreprise: Block;
  internaute: Block;
  tips: string[];
};

const STEPS: Step[] = [
  {
    id: "etape-1",
    icon: ClipboardList,
    title: "1. L'entreprise propose une mission",
    summary:
      "Une micro-mission est une petite tâche précise, avec un prix fixé à l'avance, que n'importe quel internaute peut réaliser avec son téléphone.",
    entreprise: {
      heading: "Si vous êtes une entreprise",
      items: [
        "Créez un compte « Business » (gratuit) et confirmez votre email ou votre numéro de téléphone.",
        "Approvisionnez votre portefeuille : vous faites un dépôt (virement ou Mobile Money) puis un administrateur PubAFric le crédite après vérification. Aucune carte bancaire n'est demandée sur le site.",
        "Depuis votre espace entreprise, créez une mission : choisissez une catégorie (réseaux sociaux, avis et tests, sondage, terrain, création de contenu, saisie…), donnez un titre clair, une description et des instructions étape par étape.",
        "Fixez la récompense par internaute, le nombre de places recherchées et le délai accordé pour réaliser la tâche.",
        "Précisez la preuve attendue : capture d'écran, photo, vidéo, lien de publication ou simple compte-rendu écrit.",
        `Le coût est connu avant de publier : la récompense + ${ENTREPRISE_FEE_PERCENT} % de frais PubAFric. Il n'est débité qu'au moment où vous validez un compte-rendu — pas avant.`,
      ],
    },
    internaute: {
      heading: "Si vous êtes internaute",
      items: [
        "Vous n'avez rien à publier : parcourez simplement la page « Missions » pour voir ce qui est disponible.",
        "Chaque carte affiche le titre, la description, les instructions, la preuve demandée, le temps estimé, la récompense et le lieu (en ligne ou sur le terrain).",
        "Filtrez par catégorie pour ne voir que les tâches qui vous conviennent.",
        "Lisez toujours les instructions en entier avant de vous lancer : la validation dépend uniquement de leur bon respect.",
      ],
    },
    tips: [
      "Une mission bien rédigée reçoit des comptes-rendus plus faciles à valider.",
      "Une mission n'est visible du public qu'une fois publiée.",
    ],
  },
  {
    id: "etape-2",
    icon: Settings,
    title: "2. L'internaute disponible l'effectue",
    summary:
      "Faisable de chez soi ou près de chez soi : il suffit d'avoir un téléphone, une connexion et un peu de temps.",
    entreprise: {
      heading: "Si vous êtes une entreprise",
      items: [
        "Dès qu'un internaute prend votre mission, une place est réservée pour lui et un compte à rebours démarre.",
        "Vous suivez chaque internaute depuis votre espace entreprise : qui a pris la mission, qui a envoyé son compte-rendu.",
        "Si l'internaute dépasse le délai, sa place est automatiquement libérée et un autre peut la reprendre.",
      ],
    },
    internaute: {
      heading: "Si vous êtes internaute",
      items: [
        "Créez votre compte « Internaute » (gratuit) et confirmez votre email ou téléphone. Vous pouvez aussi vous inscrire en un clic avec votre compte Google.",
        "Ouvrez une mission qui vous plaît et prenez-la : la place est à vous.",
        `Un compte à rebours démarre (${MISSION_DEADLINE_HOURS} h par défaut, ou le délai indiqué sur la mission). Passé ce délai, la mission est annulée pour vous.`,
        `Vous pouvez avoir ${MAX_CONCURRENT_CLAIMS} missions en cours en même temps, pas plus : terminez-en une avant d'en prendre une nouvelle.`,
        "Pour les missions de réseaux sociaux, un code de vérification personnel vous est donné : il doit apparaître dans votre publication, c'est ce qui prouve que c'est bien vous.",
        "Renseignez vos comptes sociaux dans votre profil si la mission en a besoin (Instagram, TikTok, Facebook, X).",
      ],
    },
    tips: [
      "Prenez uniquement les missions que vous pouvez terminer dans le délai.",
      "Les missions « terrain » indiquent le lieu : ne les prenez que si vous êtes sur place.",
    ],
  },
  {
    id: "etape-3",
    icon: ThumbsUp,
    title: "3. L'entreprise valide son compte-rendu",
    summary:
      "Le compte-rendu est la preuve que la tâche est faite. L'entreprise le vérifie, puis l'accepte ou le refuse.",
    entreprise: {
      heading: "Si vous êtes une entreprise",
      items: [
        "Vous recevez le compte-rendu de l'internaute avec ses preuves : texte, image, vidéo, lien.",
        "Comparez avec vos instructions et validez si tout est conforme. Le paiement part immédiatement.",
        "En cas de doute, refusez : l'internaute pourra contester la décision.",
        "Ne laissez pas traîner : plus vous validez vite, plus vos missions attirent de bons internautes.",
      ],
    },
    internaute: {
      heading: "Si vous êtes internaute",
      items: [
        "Depuis la page « Missions », ouvrez la mission en cours et envoyez votre compte-rendu.",
        "Décrivez précisément ce que vous avez fait, ajoutez la photo, la vidéo ou le lien demandé.",
        "Envoyez avant la fin du compte à rebours. Une fois envoyé, le statut passe à « Soumise ».",
        "Si l'entreprise refuse à tort, contestez la décision en expliquant votre point de vue : un administrateur PubAFric tranche et peut forcer le paiement si le travail a bien été fait.",
      ],
    },
    tips: [
      "Des preuves nettes (captures lisibles, photos claires) évitent presque tous les refus.",
      "Ne fabriquez jamais de fausses preuves : cela conduit au bannissement du compte.",
    ],
  },
  {
    id: "etape-4",
    icon: Banknote,
    title: "4. L'internaute cumule et reçoit l'argent",
    summary: `Chaque mission validée s'ajoute à votre portefeuille. Le retrait est possible à partir de ${formatMoney(MIN_PAYOUT_FCFA)} cumulés.`,
    entreprise: {
      heading: "Si vous êtes une entreprise",
      items: [
        `À la validation, le montant promis + ${ENTREPRISE_FEE_PERCENT} % de frais est débité de votre portefeuille de façon automatique.`,
        `Exemple : pour une récompense de ${formatMoney(EXAMPLE_REWARD)}, vous payez ${formatMoney(exampleCost)} au total.`,
        "Rechargez votre portefeuille à tout moment depuis « Crédits ». Vous pouvez aussi demander le retrait d'un solde inutilisé.",
      ],
    },
    internaute: {
      heading: "Si vous êtes internaute",
      items: [
        `PubAFric retient ${INTERNAUTE_FEE_PERCENT} % de frais sur votre gain. Exemple : pour une mission à ${formatMoney(EXAMPLE_REWARD)}, vous recevez ${formatMoney(exampleNet)}.`,
        `Dès que votre solde atteint ${formatMoney(MIN_PAYOUT_FCFA)}, allez sur « Crédits » et demandez un retrait en indiquant votre numéro Mobile Money.`,
        "Un administrateur vérifie la demande puis envoie l'argent sur votre numéro.",
        `Parrainage : partagez votre lien personnel (page Profil). Quand un filleul réalise une mission validée, vous gagnez ${REFERRAL_COMMISSION_PERCENT} % de son gain net (soit ${formatMoney(exampleReferral)} sur ${formatMoney(exampleNet)}), sans limite de durée. Cela ne réduit pas le gain du filleul.`,
      ],
    },
    tips: [
      "Vérifiez bien votre numéro Mobile Money avant de valider le retrait.",
      "Aucune carte bancaire n'est jamais demandée sur PubAFric.",
    ],
  },
];

const FAQ = [
  {
    q: "Est-ce que l'inscription est payante ?",
    a: "Non. Créer un compte est gratuit, que vous soyez internaute ou entreprise. Les seuls frais sont prélevés sur les missions validées.",
  },
  {
    q: "Combien de temps pour être payé ?",
    a: "Le gain est crédité dès la validation par l'entreprise. Le versement Mobile Money intervient après la vérification de votre demande de retrait par un administrateur.",
  },
  {
    q: "Que faire si l'entreprise refuse mon travail à tort ?",
    a: "Contestez la décision depuis la page « Missions ». Un administrateur PubAFric examine les preuves et tranche : si le travail est conforme, il est payé.",
  },
  {
    q: "Mon compte peut-il être suspendu ?",
    a: "Oui, en cas de fraude (fausses preuves, comptes multiples, contenus interdits). Vous pouvez demander la révision d'une suspension depuis le bandeau affiché en haut de l'écran.",
  },
];

function BlockCard({ block, accent }: { block: Block; accent: "blue" | "teal" }) {
  const color = accent === "blue" ? "text-brand-blue" : "text-brand-teal";
  const dot = accent === "blue" ? "bg-brand-blue" : "bg-brand-teal";
  return (
    <div className="border border-border-soft bg-white p-5">
      <h3 className={`text-xs font-bold uppercase tracking-widest ${color}`}>{block.heading}</h3>
      <ul className="mt-4 flex flex-col gap-3">
        {block.items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-[#4a5262]">
            <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function CommentCaMarchePage() {
  return (
    <main className="bg-muted-bg px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-sm font-bold tracking-widest text-brand-red">
          [ COMMENT ÇA MARCHE ? ]
        </p>
        <h1 className="mt-4 text-center text-2xl font-extrabold text-brand-blue md:text-3xl">
          LE GUIDE COMPLET, ÉTAPE PAR ÉTAPE
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-[#7c8797]">
          Que vous soyez une entreprise qui cherche à faire réaliser des micro-tâches ou un
          internaute qui souhaite gagner de l&apos;argent, voici tout ce qu&apos;il faut savoir.
        </p>

        <nav aria-label="Étapes" className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <a
              key={step.id}
              href={`#${step.id}`}
              className="flex items-center gap-3 border border-border-soft bg-white px-4 py-3 text-sm font-semibold text-[#2b2f38] shadow-sm transition-colors hover:border-brand-blue"
            >
              <step.icon size={22} className="shrink-0 text-brand-blue" strokeWidth={1.5} />
              {step.title}
            </a>
          ))}
        </nav>

        <div className="mt-14 flex flex-col gap-14">
          {STEPS.map((step) => (
            <section key={step.id} id={step.id} className="scroll-mt-24">
              <div className="flex items-start gap-4">
                <step.icon size={40} className="shrink-0 text-brand-blue" strokeWidth={1.5} />
                <div>
                  <h2 className="text-lg font-extrabold uppercase tracking-wide text-[#2b2f38]">
                    {step.title}
                  </h2>
                  <p className="mt-2 text-sm text-[#7c8797]">{step.summary}</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <BlockCard block={step.entreprise} accent="blue" />
                <BlockCard block={step.internaute} accent="teal" />
              </div>

              <div className="mt-4 border-l-4 border-brand-gold bg-white px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
                  Bon à savoir
                </p>
                <ul className="mt-2 list-disc pl-5 text-sm text-[#4a5262]">
                  {step.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-16 border border-border-soft bg-white p-6">
          <h2 className="text-lg font-extrabold uppercase tracking-wide text-[#2b2f38]">
            Un exemple chiffré
          </h2>
          <p className="mt-2 text-sm text-[#7c8797]">
            Mission publiée avec une récompense de {formatMoney(EXAMPLE_REWARD)}.
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">L&apos;entreprise paie</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-blue">{formatMoney(exampleCost)}</dd>
              <dd className="text-xs text-[#7c8797]">
                récompense + {ENTREPRISE_FEE_PERCENT} % de frais
              </dd>
            </div>
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">L&apos;internaute reçoit</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-teal">{formatMoney(exampleNet)}</dd>
              <dd className="text-xs text-[#7c8797]">
                récompense − {INTERNAUTE_FEE_PERCENT} % de frais
              </dd>
            </div>
            <div className="bg-muted-bg p-4">
              <dt className="text-xs font-bold uppercase text-[#7c8797]">Le parrain gagne</dt>
              <dd className="mt-1 text-lg font-extrabold text-brand-gold">{formatMoney(exampleReferral)}</dd>
              <dd className="text-xs text-[#7c8797]">
                {REFERRAL_COMMISSION_PERCENT} % du gain net du filleul
              </dd>
            </div>
          </dl>
        </section>

        <section className="mt-14">
          <h2 className="text-lg font-extrabold uppercase tracking-wide text-[#2b2f38]">
            Questions fréquentes
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {FAQ.map((item) => (
              <details key={item.q} className="border border-border-soft bg-white px-5 py-4">
                <summary className="cursor-pointer text-sm font-bold text-[#2b2f38]">{item.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-[#7c8797]">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm text-[#7c8797]">
            Plus de réponses dans{" "}
            <a href="/a-propos" className="font-semibold text-brand-blue">
              PubAFric en 7 questions
            </a>
            .
          </p>
        </section>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <a
            href="/inscription"
            className="bg-brand-teal px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-brand-teal/90"
          >
            CRÉER MON COMPTE
          </a>
          <a
            href="/toutes-les-missions"
            className="bg-brand-blue px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-brand-blue-dark"
          >
            VOIR LES MISSIONS
          </a>
        </div>
      </div>
    </main>
  );
}
