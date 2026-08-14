import {
  ListChecks,
  ThumbsUp,
  Tag,
  UserPlus,
  ClipboardCheck,
  Share2,
  Video,
  Sparkles,
  Gamepad2,
  Palette,
  Music,
  MapPin,
  type LucideIcon,
} from "lucide-react";

export type MissionCategory = {
  value: string;
  label: string;
  icon: LucideIcon;
};

// Taxonomy inspired by hitmeeting.com's mission types, extended with
// formats that resonate with a younger audience (challenges, contenu créatif, jeux...).
export const MISSION_CATEGORIES: MissionCategory[] = [
  { value: "TROUVER_LISTE", label: "Trouver une liste de...", icon: ListChecks },
  { value: "DONNER_AVIS", label: "Donner son avis sur un nom, une marque", icon: ThumbsUp },
  { value: "RECOMMANDER", label: "Recommander un site, un produit, un service", icon: Tag },
  { value: "INSCRIPTION_SITE", label: "S'inscrire sur un site", icon: UserPlus },
  { value: "REPONDRE_ETUDE", label: "Répondre à une étude", icon: ClipboardCheck },
  { value: "RESEAU_SOCIAL", label: "Suivre ou partager sur un réseau social", icon: Share2 },
  { value: "VIDEO", label: "Faire une vidéo (déballage, lieu...)", icon: Video },
  { value: "DEFI_CHALLENGE", label: "Relever un défi / challenge TikTok, Reels", icon: Gamepad2 },
  { value: "CONTENU_CREATIF", label: "Créer un contenu créatif (photo, design...)", icon: Palette },
  { value: "EVENEMENT_LOCAL", label: "Participer à un évènement ou une animation locale", icon: MapPin },
  { value: "MUSIQUE_STREAM", label: "Écouter, streamer ou noter un contenu (musique, appli...)", icon: Music },
  { value: "AUTRE", label: "Autre mission", icon: Sparkles },
];

export function getCategory(value: string): MissionCategory {
  return MISSION_CATEGORIES.find((c) => c.value === value) ?? MISSION_CATEGORIES[MISSION_CATEGORIES.length - 1];
}
