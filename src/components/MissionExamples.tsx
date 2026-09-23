import { Shirt, Lightbulb, Video } from "lucide-react";

const EXAMPLES = [
  {
    icon: Shirt,
    title: "PORTER UN VÊTEMENT PUBLICITAIRE",
    subtitle: "Exemple d'instructions",
  },
  {
    icon: Lightbulb,
    title: "TROUVER UNE IDÉE DE MARQUE, DE NOM",
    subtitle: "Exemple d'instructions",
  },
  {
    icon: Video,
    title: "FAIRE UNE VIDÉO D'UN ENDROIT",
    subtitle: "Exemple d'instructions",
  },
];

export default function MissionExamples() {
  return (
    <section className="bg-brand-blue px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-sm font-bold tracking-widest">[ EXEMPLES DE MISSIONS ]</p>
        <h2 className="mt-6 text-2xl font-bold md:text-3xl">
          ET VOUS, QUELLES MISSIONS ALLEZ-VOUS NOUS CONFIER ?
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <div key={ex.title} className="flex flex-col items-center gap-4">
              <div className="flex h-40 w-full items-center justify-center bg-white/10">
                <ex.icon size={56} strokeWidth={1.25} />
              </div>
              <p className="text-sm font-bold tracking-wide">{ex.title}</p>
              <p className="text-xs text-white/80">{ex.subtitle}</p>
            </div>
          ))}
        </div>

        <a
          href="#missions"
          className="mt-14 inline-block bg-brand-gold px-8 py-3 text-sm font-bold tracking-wide text-white shadow-sm transition-colors hover:bg-brand-gold/90"
        >
          VOIR LES AUTRES EXEMPLES
        </a>
      </div>
    </section>
  );
}
