import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "../styles/Gallery.css";
import { getFolderImages, driveImageUrl } from "../services/driveService";

const CONCURRENT = 3;

export default function WeddingGallery() {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();
  const rawName = (location.state as { name?: string })?.name ?? "Wedding";
  const weddingName = rawName.replace(/^\d+-/, "");

  const [fileIds, setFileIds] = useState<string[]>([]);
  const [srcs, setSrcs] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const nextQueue = useRef(0);
  const fileIdsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!folderId) return;
    async function load() {
      try {
        const files = await getFolderImages(folderId!);
        const ids = files.map((f) => f.id);
        fileIdsRef.current = ids;
        setFileIds(ids);
        // Start with nulls — no requests yet
        setSrcs(new Array(ids.length).fill(null));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [folderId]);

  // Fire first batch once IDs arrive
  useEffect(() => {
    if (fileIds.length === 0) return;
    const initial = Math.min(CONCURRENT, fileIds.length);
    nextQueue.current = initial;
    setSrcs((prev) => {
      const next = [...prev];
      for (let i = 0; i < initial; i++) {
        next[i] = driveImageUrl(fileIds[i]);
      }
      return next;
    });
  }, [fileIds]);

  function advance(index: number) {
    // Fade in the image that just loaded
    itemsRef.current[index]?.classList.add("is-visible");

    // Load the next one in the queue
    const nextIdx = nextQueue.current;
    if (nextIdx < fileIdsRef.current.length) {
      nextQueue.current = nextIdx + 1;
      setSrcs((prev) => {
        const next = [...prev];
        next[nextIdx] = driveImageUrl(fileIdsRef.current[nextIdx]);
        return next;
      });
    }
  }

  function handleLoad(e: React.SyntheticEvent<HTMLImageElement>, index: number) {
    // Ignore if the loaded src was a placeholder (data: or blob:)
    const loadedSrc = (e.target as HTMLImageElement).src;
    if (loadedSrc.startsWith("data:") || loadedSrc.startsWith("blob:")) return;
    advance(index);
  }

  function handleError(index: number) {
    advance(index);
  }

  return (
    <div className="gallery-page">
      <div className="gallery-wrap">
        <Link to="/gallery" className="gallery-back">← Back to Gallery</Link>
        <h1 className="gallery-title">{weddingName}</h1>

        {loading && <p className="gallery-status">Loading photos...</p>}
        {error && <p className="gallery-status">Unable to load photos. Please try again later.</p>}
        {!loading && !error && fileIds.length === 0 && (
          <p className="gallery-status">No photos yet.</p>
        )}

        {!loading && !error && fileIds.length > 0 && (
          <section className="masonry">
            {srcs.map((src, i) => (
              <figure
                className="masonry-item is-visible"
                key={i}
                ref={(el) => { itemsRef.current[i] = el; }}
              >
                {src && (
                  <img
                    className="masonry-img"
                    src={src}
                    alt={`${weddingName} photo ${i + 1}`}
                    decoding="async"
                    onLoad={(e) => handleLoad(e, i)}
                    onError={() => handleError(i)}
                  />
                )}
              </figure>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
