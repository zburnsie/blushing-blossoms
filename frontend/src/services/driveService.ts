const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string;
const BASE = "https://www.googleapis.com/drive/v3/files";

export interface WeddingFolder {
  id: string;
  name: string;
}

export interface DriveFile {
  id: string;
  name: string;
}

/** List all subfolders inside a parent Drive folder (each subfolder = one wedding). */
export async function getWeddingFolders(rootFolderId: string): Promise<WeddingFolder[]> {
  const params = new URLSearchParams({
    q: `'${rootFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: "files(id,name)",
    orderBy: "name",
    key: API_KEY,
  });

  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  const data = await res.json();
  return (data.files ?? []) as WeddingFolder[];
}

/** List image files inside a folder. Pass pageSize to limit (e.g. 1 for cover). */
export async function getFolderImages(folderId: string, pageSize?: number): Promise<DriveFile[]> {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
    fields: "files(id,name)",
    orderBy: "name",
    key: API_KEY,
  });
  if (pageSize) params.set("pageSize", String(pageSize));

  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`Drive API error: ${res.status}`);
  const data = await res.json();
  return (data.files ?? []) as DriveFile[];
}

/** Direct CDN URL for a publicly-shared Drive image. */
export function driveImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

/** Smaller thumbnail URL — good for cards and lazy loading. */
export function driveThumbnailUrl(fileId: string, width = 800): string {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}
