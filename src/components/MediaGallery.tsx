import { LinkIcon } from "lucide-react";
import type { MediaItem } from "@/lib/upload";

export default function MediaGallery({ items }: { items: MediaItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item, i) => {
        if (item.type === "image") {
          // eslint-disable-next-line @next/next/no-img-element
          return (
            <img
              key={i}
              src={item.url}
              alt="Pièce jointe"
              className="h-20 w-20 rounded object-cover"
            />
          );
        }
        if (item.type === "video") {
          return (
            <video key={i} src={item.url} controls className="h-20 rounded" />
          );
        }
        return (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded border border-border-soft px-2 py-1 text-xs text-brand-blue hover:underline"
          >
            <LinkIcon size={12} /> Lien
          </a>
        );
      })}
    </div>
  );
}
