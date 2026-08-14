import { put } from "@vercel/blob";
import path from "path";
import { randomUUID } from "crypto";

export type MediaItem = { type: "image" | "video" | "link"; url: string };

// Serverless hosting (Vercel) has no persistent local disk, so uploads go to
// Vercel Blob storage instead. Requires BLOB_READ_WRITE_TOKEN to be set.
export async function saveUploadedFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const ext = path.extname(file.name) || "";
  const filename = `${randomUUID()}${ext}`;
  const blob = await put(filename, file, { access: "public" });

  return blob.url;
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
