import CopyButton from "./CopyButton";
import { resolveResourceUrl, type Resource } from "@/lib/mission-content";

// Tout ce dont l'internaute a besoin pour réaliser la mission : textes à copier, liens, visuels.
export default function MissionResources({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-sm font-bold uppercase tracking-widest text-brand-red">
        Ressources fournies
      </h2>
      <div className="mt-3 flex flex-col gap-4">
        {resources.map((r) => {
          const url = r.url ? resolveResourceUrl(r.url) : null;
          return (
            <div key={r.label} className="border border-border-soft bg-muted-bg p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-[#2b2f38]">{r.label}</p>
              {r.text && (
                <div className="mt-2 flex items-start gap-3">
                  <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-[#4a5262]">{r.text}</p>
                  <CopyButton text={r.text} />
                </div>
              )}
              {r.url &&
                (url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block break-all text-sm font-semibold text-brand-blue underline"
                  >
                    {url}
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-semibold text-brand-coral">
                    Lien bientôt disponible — revenez un peu plus tard.
                  </p>
                ))}
              {r.image && (
                <div className="mt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.label} className="max-h-72 w-auto border border-border-soft" />
                  <a href={r.image} download className="mt-2 inline-block text-sm font-semibold text-brand-blue underline">
                    Télécharger le visuel
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
