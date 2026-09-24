import {
  Keyboard,
  ChartPie,
  Share2,
  MapPin,
  Lightbulb,
  Megaphone,
  Camera,
  ClipboardPen,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

// Les 9 grandes familles de missions présentées au public (page « Types de missions »,
// pages Internautes et Entreprises). Chaque modèle de mission du catalogue appartient à une
// famille ; côté base de données, les missions gardent leur catégorie (voir categories.ts).

export type MissionFamily = {
  id: string;
  label: string;
  short: string; // libellé court des pastilles
  icon: LucideIcon;
  description: string;
  cover: string; // scène de MissionCover
};

export const MISSION_FAMILIES: MissionFamily[] = [
  {
    id: "saisie",
    label: "Saisie de données",
    short: "Saisie de données",
    icon: Keyboard,
    description:
      "Recopier, trier, corriger ou rechercher des informations : des tâches de bureau faisables depuis un téléphone.",
    cover: "TROUVER_LISTE",
  },
  {
    id: "etudes",
    label: "Études et sondages",
    short: "Études, sondages",
    icon: ChartPie,
    description:
      "Répondre à des questionnaires, donner son avis sur un site, un nom de marque ou une publicité pour aider les entreprises à mieux comprendre leurs clients.",
    cover: "REPONDRE_ETUDE",
  },
  {
    id: "reseaux",
    label: "Réseaux sociaux",
    short: "Réseaux sociaux",
    icon: Share2,
    description:
      "Partager, suivre, recommander ou voter sur WhatsApp, Facebook, TikTok, Instagram, YouTube ou X pour faire connaître une marque.",
    cover: "RESEAU_SOCIAL",
  },
  {
    id: "visites",
    label: "Visites et déplacements",
    short: "Visites, déplacements",
    icon: MapPin,
    description:
      "Se rendre dans un commerce ou un lieu près de chez soi : relevé de prix, client mystère, vérification d'affichage.",
    cover: "EVENEMENT_LOCAL",
  },
  {
    id: "creativite",
    label: "Créativité",
    short: "Créativité",
    icon: Lightbulb,
    description:
      "Trouver un nom, un slogan, une idée de buzz ou de nouveau produit : l'imagination de la communauté au service des marques.",
    cover: "IDEE",
  },
  {
    id: "buzz",
    label: "Buzz",
    short: "Buzz",
    icon: Megaphone,
    description:
      "Créer de la visibilité : porter un vêtement de marque, distribuer des flyers, s'inscrire, télécharger une application ou participer à un concours.",
    cover: "TSHIRT",
  },
  {
    id: "photos",
    label: "Photos et vidéos",
    short: "Photos, vidéos",
    icon: Camera,
    description:
      "Filmer ou photographier un lieu, un objet, une situation ou un déballage de produit avec son téléphone.",
    cover: "VIDEO",
  },
  {
    id: "comptes-rendus",
    label: "Comptes-rendus",
    short: "Comptes-rendus",
    icon: ClipboardPen,
    description:
      "Raconter un évènement, résumer une émission, un film ou une visite, ou apporter un témoignage sur un produit ou un service.",
    cover: "DONNER_AVIS",
  },
  {
    id: "tests",
    label: "Tests",
    short: "Tests",
    icon: FlaskConical,
    description:
      "Essayer un produit, un service, un site ou une application et dire honnêtement ce qui fonctionne et ce qui bloque.",
    cover: "INSCRIPTION_SITE",
  },
];

export function getFamily(id: string): MissionFamily | undefined {
  return MISSION_FAMILIES.find((f) => f.id === id);
}
