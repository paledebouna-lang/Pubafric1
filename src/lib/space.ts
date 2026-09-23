// Page d'accueil "Mon espace" selon le rôle d'un utilisateur connecté.
export function spaceHref(role: string | undefined): string {
  if (role === "ENTREPRISE") return "/entreprise/missions";
  if (role === "ADMIN") return "/admin";
  return "/missions";
}

export function spaceLabel(role: string | undefined): string {
  if (role === "ENTREPRISE") return "MES MISSIONS";
  if (role === "ADMIN") return "ADMINISTRATION";
  return "PRENDRE UNE MISSION";
}
