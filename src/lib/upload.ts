import { put } from "@vercel/blob";
import path from "path";
import { randomUUID } from "crypto";

export type MediaItem = { type: "image" | "video" | "link"; url: string };

// Serverless hosting (Vercel) has no persistent local disk, so uploads go to
// Vercel Blob storage instead. Requires BLOB_READ_WRITE_TOKEN to be set, and a PUBLIC store.

// Erreur d'envoi destinée à l'utilisateur : le message est affiché tel quel.
export class UploadError extends Error {}

// Une requête Vercel est limitée à 4,5 Mo : au-delà, le fichier n'arrive jamais jusqu'ici.
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export async function saveUploadedFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (file.size > MAX_UPLOAD_BYTES) {
    const mo = (file.size / (1024 * 1024)).toFixed(1).replace(".", ",");
    throw new UploadError(
      `Fichier trop lourd (${mo} Mo) : 4 Mo maximum. Réduisez-le, ou indiquez un lien (YouTube, Drive…) à la place.`
    );
  }

  const ext = path.extname(file.name) || "";
  const filename = `${randomUUID()}${ext}`;
  try {
    const blob = await put(filename, file, { access: "public" });
    return blob.url;
  } catch (error) {
    console.error("Échec de l'envoi vers Vercel Blob :", error);
    throw new UploadError(
      "L'envoi du fichier a échoué. Réessayez dans un instant, ou indiquez un lien à la place."
    );
  }
}

export function buildMediaList({
  imageUrl,
  videoUrl,
  link,
}: {
  imageUrl?: string | null;
  videoUrl?: string | null;
  link?: string | null;
}): MediaItem[] {
  const items: MediaItem[] = [];
  if (imageUrl) items.push({ type: "image", url: imageUrl });
  if (videoUrl) items.push({ type: "video", url: videoUrl });
  if (link) items.push({ type: "link", url: link });
  return items;
}

export function parseMediaJson(json: string | null): MediaItem[] {
  if (!json) return [];
  try {
    return JSON.parse(json) as MediaItem[];
  } catch {
    return [];
  }
}
