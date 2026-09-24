import type { Metadata } from "next";
import Link from "next/link";
import { getLegal, LEGAL_LAST_UPDATE } from "@/lib/legal";
import { ENTREPRISE_FEE_PERCENT, INTERNAUTE_FEE_PERCENT } from "@/lib/fees";
import { REFERRAL_COMMISSION_PERCENT } from "@/lib/referral";
import { MAX_CONCURRENT_CLAIMS, MIN_PAYOUT_FCFA, MISSION_DEADLINE_HOURS } from "@/lib/rules";
import { MAX_QUIZ_ATTEMPTS } from "@/lib/mission-content";
import { formatMoney } from "@/lib/currency";
import { VERIFICATION_CODE_TTL_MINUTES } from "@/lib/moderation";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation et de vente | PubAFric",
  description:
    "Les conditions générales d'utilisation (internautes) et de vente (entreprises) de la plateforme PubAFric.",
};

type Block = { sub?: string; paras?: string[]; list?: string[] };
type Section = { id: string; title: string; blocks: Block[] };

function buildSections(contact: string): Section[] {
  return [
    {
      id: "definitions",
      title: "1. Définitions et présentation du site",
      blocks: [
        {
          sub: "1.1 Définitions",
          list: [
            "« PubAfric » ou « la Plateforme » : le site et les services de mise en relation édités par PubAfric (voir les mentions légales).",
            "« Internaute » : la personne physique âgée d'au moins 18 ans, inscrite sur la Plateforme, qui réalise des micro-missions proposées par des Entreprises.",
            "« Entreprise » : le professionnel (commerçant, profession libérale, société, association) inscrit sur la Plateforme pour proposer des micro-missions.",
            "« Utilisateur » : toute personne inscrite, qu'elle soit Internaute ou Entreprise. Le « Visiteur » est la personne qui consulte les pages publiques sans être inscrite.",
            "« Micro-mission » ou « Mission » : une demande ponctuelle, précise et de courte durée, publiée par une Entreprise, comprenant un titre, un cahier des charges (instructions et preuve attendue), une rémunération en FCFA, un nombre de places et un délai.",
            "« Compte-rendu » : le message et les preuves (texte, photo, vidéo, lien, réponses à un questionnaire ou à un quiz) par lesquels l'Internaute justifie qu'il a réalisé une Mission.",
            "« Portefeuille » ou « Crédits » : le solde virtuel, exprimé en FCFA, associé à chaque compte. Il n'a de valeur que sur la Plateforme jusqu'à son retrait.",
            "« Administrateur » : le membre habilité de l'équipe PubAfric qui modère la Plateforme, valide les dépôts et les retraits et arbitre les litiges.",
            "« Données personnelles » : toute information permettant d'identifier, directement ou indirectement, une personne physique.",
          ],
        },
        {
          sub: "1.2 Présentation de la Plateforme",
          paras: [
            "PubAfric met en relation des Internautes qui souhaitent arrondir leurs fins de mois avec des Entreprises qui ont de petites tâches à confier : sondages, avis, tests, photos et vidéos, visites, partages sur les réseaux sociaux, saisie de données, idées créatives, etc. La liste des familles de missions est consultable sur la page « Types de missions ».",
            "PubAfric est un intermédiaire technique : elle publie les Missions, met à disposition les outils de réalisation et de validation, gère le Portefeuille et le paiement, et arbitre les litiges. L'Internaute reste libre de choisir ses Missions et son rythme. Aucun lien de subordination n'existe entre l'Internaute, l'Entreprise et PubAfric, qui agissent de façon indépendante et volontaire.",
          ],
        },
      ],
    },
    {
      id: "objet",
      title: "2. Objet",
      blocks: [
        {
          paras: [
            "Les présentes Conditions Générales d'Utilisation (CGU) et Conditions Générales de Vente (CGV) définissent les conditions dans lesquelles PubAfric met ses services à disposition des Utilisateurs et les droits et obligations de chacun. Les CGU concernent tous les Utilisateurs ; les stipulations relatives à la facturation (article 5) concernent plus particulièrement les Entreprises.",
            "L'inscription et l'utilisation de la Plateforme emportent acceptation pleine et entière des présentes conditions, qui prévalent sur tout autre document. L'Utilisateur est invité à en conserver une copie.",
            "PubAfric peut modifier les présentes conditions. Toute modification substantielle est signalée aux Utilisateurs (par message ou dans leur espace personnel) et ne s'applique pas aux missions déjà validées. L'Utilisateur qui refuse les nouvelles conditions peut fermer son compte après retrait de son solde. Sauf preuve contraire, les données enregistrées par PubAfric font foi des opérations réalisées sur la Plateforme.",
          ],
        },
      ],
    },
    {
      id: "acces",
      title: "3. Conditions d'accès aux services",
      blocks: [
        {
          sub: "3.1 Accès et équipement",
          paras: [
            "La consultation des pages publiques est gratuite. L'inscription est gratuite pour les Internautes comme pour les Entreprises. Les équipements (téléphone, ordinateur, connexion internet) et les frais de communication sont à la charge de l'Utilisateur. PubAfric s'efforce d'assurer la disponibilité du service mais n'est tenue qu'à une obligation de moyens : des interruptions pour maintenance ou pour des raisons techniques indépendantes de sa volonté sont possibles.",
          ],
        },
        {
          sub: "3.2 Inscription et compte",
          list: [
            "L'inscription se fait avec une adresse email ou un numéro de téléphone et un mot de passe, ou avec un compte Google lorsque cette option est proposée.",
            "L'Internaute déclare avoir au moins 18 ans. L'Entreprise déclare agir pour son activité professionnelle et disposer du pouvoir d'engager la structure qu'elle représente.",
            `Un code de confirmation (valable ${VERIFICATION_CODE_TTL_MINUTES} minutes) est envoyé lors de l'inscription : tant que le compte n'est pas confirmé, certaines actions (prendre ou publier une mission, retirer de l'argent) sont bloquées.`,
            "Chaque adresse email et chaque numéro de téléphone ne peut être associé qu'à un seul compte. Une personne ne peut détenir qu'un compte Internaute.",
            "L'Utilisateur fournit des informations exactes, les tient à jour et garde son mot de passe confidentiel. Il est responsable de toute action réalisée depuis son compte.",
          ],
        },
      ],
    },
    {
      id: "fonctionnement",
      title: "4. Fonctionnement des micro-missions et validation",
      blocks: [
        {
          sub: "4.1 Rédaction et publication par l'Entreprise",
          paras: ["L'Entreprise qui publie une Mission s'engage à :"],
          list: [
            "ne proposer que des tâches courtes, ponctuelles et licites ;",
            "rédiger un cahier des charges précis et sans ambiguïté (format de la photo, nombre de mots, lien à visiter, preuve attendue, etc.) ;",
            "proposer une rémunération cohérente avec le temps nécessaire ; PubAfric met à disposition des modèles de missions et des prix conseillés ;",
            "ne demander aucun paiement, aucune avance d'argent, aucun mot de passe ni aucune donnée bancaire à l'Internaute ;",
            "ne publier aucune Mission contraire à la loi, aux bonnes mœurs ou à l'article 7.3 (contenus interdits).",
          ],
        },
        {
          paras: [
            "PubAfric peut refuser, modifier ou retirer une Mission qui ne respecte pas ces règles. Une Mission peut aussi être proposée par PubAfric pour son propre compte ou pour un partenaire ; elle est alors traitée comme celle d'une Entreprise.",
          ],
        },
        {
          sub: "4.2 Réalisation par l'Internaute",
          list: [
            "L'Internaute choisit librement les Missions qui lui conviennent et peut prendre une même Mission une seule fois.",
            `Il peut avoir ${MAX_CONCURRENT_CLAIMS} Missions en cours au maximum en même temps.`,
            `Dès qu'il prend une Mission, un compte à rebours démarre (${MISSION_DEADLINE_HOURS} h par défaut, ou le délai indiqué sur la Mission). Passé ce délai, la Mission expire et la place est libérée.`,
            "Il peut se rétracter tant qu'il n'a rien envoyé : la place est alors libérée pour un autre Internaute.",
            "Il réalise la Mission conformément au cahier des charges et en toute légalité, et reste responsable du contenu de son Compte-rendu.",
            "Pour les Missions sur les réseaux sociaux, il inscrit dans sa publication le code de vérification qui lui est attribué.",
          ],
        },
        {
          sub: "4.3 Missions exécutées sur la Plateforme (quiz et questionnaires)",
          paras: [
            `Certaines Missions se réalisent directement sur PubAfric. Dans un quiz (par exemple après une vidéo publicitaire), l'Internaute regarde le contenu pendant la durée indiquée, puis répond aux questions ; chaque bonne réponse remplit une jauge et la Mission est validée et payée automatiquement lorsque la jauge atteint 100 %. En cas d'échec, l'Internaute doit revoir le contenu avant de reprendre ses réponses, dans la limite de ${MAX_QUIZ_ATTEMPTS} essais ; passé ce nombre, la Mission est perdue. Dans un questionnaire, les réponses sont enregistrées et transmises à l'Entreprise, qui peut avoir choisi de les payer automatiquement.`,
            "Les tentatives visant à contourner ces mécanismes (réponses au hasard automatisées, saut du contenu, comptes multiples) sont interdites et peuvent entraîner la suspension du compte.",
          ],
        },
        {
          sub: "4.4 Validation du Compte-rendu",
          list: [
            "Une Mission n'est payée que si elle est validée. L'Entreprise est informée de chaque Compte-rendu et est invitée à se prononcer dans un délai de 7 jours ; au-delà, PubAfric peut intervenir pour statuer.",
            "L'Entreprise valide tout Compte-rendu conforme au cahier des charges. Elle peut le refuser, en motivant sa décision, s'il ne respecte pas les instructions.",
            "En cas de refus, l'Internaute ne reçoit pas la rémunération de cette Mission ; il peut contester la décision (article 11.2).",
            "La validation crédite le Portefeuille de l'Internaute du montant promis diminué des frais prévus à l'article 5.",
          ],
        },
        {
          sub: "4.5 Retrait des gains",
          paras: [
            `L'Internaute peut demander le retrait de son solde, vers un numéro Mobile Money qu'il indique, dès qu'il atteint ${formatMoney(MIN_PAYOUT_FCFA)}. La demande est examinée par un Administrateur, qui effectue ensuite le versement réel ; PubAfric peut différer ou refuser un retrait en cas de suspicion de fraude ou de compte suspendu. Les frais éventuels de l'opérateur Mobile Money sont ceux de l'opérateur.`,
          ],
        },
        {
          sub: "4.6 Parrainage",
          paras: [
            `Chaque Internaute dispose d'un code et d'un lien de parrainage. Lorsqu'un filleul inscrit avec ce lien obtient la validation d'une Mission, le parrain reçoit ${REFERRAL_COMMISSION_PERCENT} % du gain net du filleul, financés par PubAfric et sans réduire le gain du filleul. Un parrain ne peut parrainer ni lui-même ni un compte qu'il contrôle ; les abus entraînent la perte des commissions et la suspension du compte.`,
          ],
        },
      ],
    },
    {
      id: "facturation",
      title: "5. Facturation et paiement (conditions de vente aux Entreprises)",
      blocks: [
        {
          sub: "5.1 Portefeuille de l'Entreprise",
          paras: [
            "L'Entreprise approvisionne son Portefeuille par un paiement réel (virement, Mobile Money ou autre moyen proposé par PubAfric). Le montant est crédité après confirmation de la réception des fonds par un Administrateur. Aucune donnée de carte bancaire n'est demandée sur la Plateforme. Les prix sont exprimés en francs CFA (FCFA).",
          ],
        },
        {
          sub: "5.2 Prix et frais de service",
          list: [
            `L'Entreprise fixe la récompense de chaque Internaute. PubAfric ajoute ${ENTREPRISE_FEE_PERCENT} % de frais de service : le coût total d'une Mission validée est donc la récompense + ${ENTREPRISE_FEE_PERCENT} % (arrondi aux 5 FCFA supérieurs).`,
            "Le coût est débité du Portefeuille de l'Entreprise uniquement au moment où un Compte-rendu est validé, pour la place concernée. Si le solde est insuffisant, la validation est impossible : l'Entreprise doit d'abord recharger son Portefeuille.",
            `Sur le gain de l'Internaute, PubAfric retient ${INTERNAUTE_FEE_PERCENT} % de frais de service.`,
            "Ces frais rémunèrent le fonctionnement, la modération et la sécurité de la Plateforme ; ils ne sont pas remboursables une fois la Mission validée.",
          ],
        },
        {
          sub: "5.3 Modification et retrait de fonds",
          paras: [
            "Les places déjà réservées par un Internaute ne peuvent plus être modifiées de façon à changer le travail demandé. L'Entreprise peut demander le retrait du solde non utilisé de son Portefeuille ; la demande est examinée par un Administrateur avant versement.",
            `Un justificatif ou une facture des frais de service peut être demandé à ${contact}.`,
          ],
        },
      ],
    },
    {
      id: "impots",
      title: "6. Impôts et obligations fiscales",
      blocks: [
        {
          paras: [
            "Les sommes perçues par un Internaute pour les Missions réalisées constituent des revenus dont il est seul responsable. Il lui appartient de les déclarer et d'acquitter les impôts et cotisations éventuellement applicables en vertu de la législation de son pays de résidence.",
            "L'Entreprise est responsable de ses propres obligations fiscales et comptables, notamment en matière de TVA et de déductibilité des sommes engagées.",
            "PubAfric n'est pas responsable des manquements d'un Utilisateur à ses obligations fiscales. Si PubAfric devait s'acquitter d'un impôt, d'une taxe ou d'une pénalité en raison d'un montant versé à un Internaute ou reçu d'une Entreprise, elle pourrait en demander le remboursement à l'Utilisateur concerné. Pour prévenir les abus, PubAfric peut plafonner les gains ou les retraits d'un compte sur une période donnée.",
          ],
        },
      ],
    },
    {
      id: "droits",
      title: "7. Droits et obligations des parties",
      blocks: [
        {
          sub: "7.1 Obligations de l'Utilisateur",
          list: [
            "fournir des informations réelles, exactes et à jour ; ne pas utiliser de faux nom ni d'adresse appartenant à un tiers ;",
            "ne créer qu'un seul compte et ne pas céder ou prêter son compte ;",
            "ne pas perturber le fonctionnement de la Plateforme (virus, programmes automatisés, tentatives d'intrusion) ni l'utilisation normale par les autres Utilisateurs ;",
            "ne pas fabriquer de fausses preuves (captures modifiées, faux avis, faux témoignages) ;",
            "respecter les personnes : ne pas filmer ni photographier de personnes identifiables sans leur accord, respecter la vie privée, le droit à l'image et les droits de propriété intellectuelle de chacun ;",
            "être seul responsable de tous les contenus, messages et liens qu'il diffuse.",
          ],
        },
        {
          sub: "7.2 Obligations de PubAfric",
          paras: [
            "PubAfric fournit à distance, par voie électronique, les services décrits ci-dessus avec une obligation de moyens. Elle n'est pas responsable du contenu des Missions et des Comptes-rendus, de leur exactitude ni des dommages résultant de leur utilisation, ni des conséquences d'une indisponibilité temporaire du service. Elle peut sous-traiter tout ou partie du service à des prestataires techniques.",
          ],
        },
        {
          sub: "7.3 Contenus et missions interdits",
          paras: ["Sont notamment interdites les Missions ou contenus :"],
          list: [
            "contraires à la loi, à l'ordre public ou aux bonnes mœurs (contenus haineux, violents, discriminatoires, pornographiques, diffamatoires) ;",
            "incitant à la fraude, à l'usurpation d'identité, au piratage, au harcèlement ou à la désinformation ;",
            "demandant à l'Internaute d'avancer de l'argent, de communiquer des codes secrets, des mots de passe, des données bancaires ou des documents d'identité ;",
            "de nature pyramidale, de recrutement déguisé ou de vente forcée, ainsi que les paris et jeux d'argent non autorisés ;",
            "portant sur des produits illicites ou réglementés (armes, stupéfiants, médicaments sans autorisation).",
          ],
        },
        {
          sub: "7.4 Suspension et bannissement",
          paras: [
            "En cas de manquement aux présentes conditions, de fraude ou de comportement abusif, PubAfric peut suspendre un compte, retenir les gains issus de missions frauduleuses et retirer des contenus. Un compte suspendu reste consultable mais ne peut plus effectuer d'action. Le titulaire peut demander une révision de la suspension depuis le bandeau affiché dans son espace ; un Administrateur examine sa demande.",
          ],
        },
      ],
    },
    {
      id: "propriete",
      title: "8. Propriété intellectuelle",
      blocks: [
        {
          paras: [
            "Les éléments de la Plateforme (marque, logo, charte graphique, textes, illustrations, structure et code) sont la propriété de PubAfric ou de ses concédants et sont protégés. Toute reproduction ou exploitation non autorisée est interdite.",
            "L'Utilisateur garantit qu'il dispose des droits nécessaires sur les contenus qu'il transmet (photos, vidéos, textes, visuels) et qu'ils ne portent atteinte à aucun droit de tiers. Pour les créations demandées par une Mission (textes, visuels, idées, vidéos), l'Internaute cède à l'Entreprise, à titre non exclusif ou exclusif selon ce que précise la Mission, les droits d'utilisation nécessaires à l'usage prévu par le cahier des charges, à compter de la validation et du paiement. Faute de précision, la cession est limitée à l'usage prévu par la Mission.",
            "Lorsqu'un contenu montre une personne identifiable, l'Utilisateur déclare avoir obtenu son accord écrit ou explicite pour cet usage. PubAfric peut retirer tout contenu qui semble porter atteinte aux droits d'un tiers.",
          ],
        },
      ],
    },
    {
      id: "donnees",
      title: "9. Sécurisation et protection des données personnelles",
      blocks: [
        {
          paras: [
            "PubAfric traite les données personnelles strictement nécessaires au service (identité, coordonnées, historique des Missions, informations de Portefeuille et de retrait, profil facultatif) pour gérer les comptes, les Missions, les paiements, la sécurité et la lutte contre la fraude. Ces données ne sont ni vendues ni cédées à des tiers à des fins commerciales ; elles ne sont communiquées qu'aux prestataires techniques nécessaires (hébergement, envoi de messages) et, pour une Mission donnée, à l'Entreprise concernée (nom de l'Internaute et contenu de son Compte-rendu).",
            "Le traitement est effectué conformément à la législation ivoirienne relative à la protection des données à caractère personnel (notamment la loi n° 2013-450 du 19 juin 2013) et sous le contrôle de l'ARTCI. Les données peuvent être hébergées chez des prestataires dont les serveurs sont situés hors de Côte d'Ivoire ; PubAfric veille à ce qu'ils offrent des garanties de sécurité appropriées.",
            `Chaque Utilisateur dispose d'un droit d'accès, de rectification, d'opposition et de suppression de ses données, ainsi que d'un droit à la limitation du traitement, qu'il peut exercer en écrivant à ${contact}. Les données nécessaires aux obligations comptables ou à la prévention de la fraude peuvent être conservées le temps requis.`,
            "PubAfric n'utilise que des cookies techniques strictement nécessaires (maintien de la session de connexion) ; aucun cookie publicitaire ni de traçage tiers n'est déposé. Des mesures techniques et organisationnelles (mots de passe chiffrés, accès restreints, échanges sécurisés) protègent les données ; aucun système n'étant infaillible, l'Utilisateur doit lui aussi protéger ses accès.",
          ],
        },
      ],
    },
    {
      id: "duree",
      title: "10. Durée et résiliation",
      blocks: [
        {
          paras: [
            "Les présentes conditions s'appliquent tant que l'Utilisateur dispose d'un compte. L'Utilisateur peut cesser d'utiliser la Plateforme et demander la fermeture de son compte à tout moment, après avoir retiré son solde ; les Missions en cours et les litiges ouverts sont menés à leur terme.",
            "PubAfric peut fermer un compte inactif depuis longtemps (après information de l'Utilisateur et restitution du solde éventuel) ou en cas de manquement grave aux conditions. Les stipulations relatives aux paiements, à la propriété intellectuelle, à la responsabilité et aux litiges survivent à la fermeture du compte.",
          ],
        },
      ],
    },
    {
      id: "litiges",
      title: "11. Litiges",
      blocks: [
        {
          sub: "11.1 Réclamations",
          paras: [`Toute question ou réclamation peut être adressée à ${contact}. PubAfric s'efforce de répondre dans les meilleurs délais.`],
        },
        {
          sub: "11.2 Contestation d'un refus de validation",
          paras: [
            "Lorsqu'un Compte-rendu est refusé, l'Internaute peut ouvrir une contestation en expliquant pourquoi son travail est conforme. Un Administrateur examine les instructions, les preuves et les arguments de chacun, et rend une décision. Si le travail est conforme, il peut ordonner le paiement de la Mission sur le Portefeuille de l'Entreprise ; dans le cas contraire, le refus est confirmé. Cette décision met fin au litige sur la Mission concernée, sans préjudice des recours prévus par la loi.",
          ],
        },
        {
          sub: "11.3 Règlement amiable et juridiction",
          paras: [
            "Les présentes conditions sont régies par le droit ivoirien. En cas de différend, les parties recherchent d'abord une solution amiable. À défaut, le litige relève des juridictions compétentes d'Abidjan (Côte d'Ivoire), sous réserve des règles impératives de compétence applicables aux consommateurs.",
          ],
        },
      ],
    },
    {
      id: "divers",
      title: "12. Dispositions diverses",
      blocks: [
        {
          paras: [
            "Si une stipulation des présentes conditions est déclarée nulle ou inapplicable, les autres stipulations restent en vigueur. Le fait pour PubAfric de ne pas se prévaloir d'un manquement ne vaut pas renonciation à s'en prévaloir ultérieurement.",
            "PubAfric peut céder ou transférer ses droits et obligations à une société de son groupe ou à un successeur, sous réserve d'en informer les Utilisateurs. La version en vigueur des présentes conditions est celle publiée sur cette page à la date de l'action concernée.",
          ],
        },
      ],
    },
  ];
}

export default function CguPage() {
  const legal = getLegal();
  const sections = buildSections(legal.email);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-bold tracking-widest text-brand-red">[ MENTIONS CONTRACTUELLES ]</p>
      <h1 className="mt-4 text-2xl font-extrabold text-[#2b2f38] md:text-3xl">
        Conditions générales d&apos;utilisation et de vente
      </h1>
      <p className="mt-2 text-xs text-[#9aa2b1]">Dernière mise à jour : {LEGAL_LAST_UPDATE}</p>

      <p className="mt-6 text-sm leading-relaxed text-[#4a5262]">
        Les présentes conditions ont une valeur contractuelle : lisez-les attentivement avant de
        cocher la case d&apos;acceptation lors de votre inscription. Elles complètent les{" "}
        <Link href="/mentions-legales" className="font-semibold text-brand-blue underline">
          mentions légales
        </Link>{" "}
        (identité de l&apos;éditeur, hébergement).
      </p>

      <nav aria-label="Sommaire" className="mt-8 border border-border-soft bg-muted-bg p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-red">Sommaire</p>
        <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-brand-blue hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 flex flex-col gap-10">
        {sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-base font-extrabold uppercase tracking-wide text-brand-red">{s.title}</h2>
            {s.blocks.map((b, i) => (
              <div key={i} className="mt-4">
                {b.sub && <h3 className="text-sm font-bold text-[#2b2f38]">{b.sub}</h3>}
                {b.paras?.map((p) => (
                  <p key={p} className="mt-2 text-sm leading-relaxed text-[#4a5262]">
                    {p}
                  </p>
                ))}
                {b.list && (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-[#4a5262]">
                    {b.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
      </div>
    </main>
  );
}
