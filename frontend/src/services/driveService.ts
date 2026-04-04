const API_BASE = import.meta.env.VITE_API_BASE_URL as string;

export interface WeddingFolder {
  id: string;
  name: string;
  coverImageId?: string;
}

export interface DriveFile {
  id: string;
  name: string;
}

export async function getWeddingFolders(): Promise<WeddingFolder[]> {
  const res = await fetch(`${API_BASE}/api/gallery`);
  if (!res.ok) throw new Error(`Gallery API error: ${res.status}`);
  return res.json();
}

export async function getFolderImages(folderId: string): Promise<DriveFile[]> {
  const res = await fetch(`${API_BASE}/api/gallery/${folderId}`);
  if (!res.ok) throw new Error(`Gallery API error: ${res.status}`);
  return res.json();
}

/** Direct URL for a publicly-shared Drive image. */
export function driveImageUrl(fileId: string): string {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}
