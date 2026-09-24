import { parseResources, parseTodo, resolveResourceUrl } from "@/lib/mission-content";

// Ce qu'il manque encore avant de publier une mission : informations réelles à fournir par
// PubAfric ou le partenaire (liste "todoJson"), et liens de ressources dont la variable
// d'environnement n'est pas renseignée.
export function missionTodos(m: { todoJson: string | null; resourcesJson: string | null }): string[] {
  const todos = parseTodo(m.todoJson);
  for (const r of parseResources(m.resourcesJson)) {
    if (r.url && !resolveResourceUrl(r.url)) {
      const name = r.url.startsWith("env:") ? r.url.slice(4) : r.url;
      todos.push(`« ${r.label} » : renseigner ${name} dans Vercel`);
    }
  }
  return todos;
}
