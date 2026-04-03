import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import "../styles/Gallery.css";
import { getFolderImages, driveImageUrl } from "../services/driveService";

export default function WeddingGallery() {
  const { folderId } = useParams<{ folderId: string }>();
  const location = useLocation();
  const weddingName = (location.state as { name?: string })?.name ?? "Wedding";

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!folderId) return;

    async function load() {
      try {
        const files = await getFolderImages(folderId!);
        setImages(files.map((f) => driveImageUrl(f.id)));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [folderId]);

  // Fade-in animation on scroll
  useEffect(() => {
    if (images.length === 0) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      itemsRef.current.forEach((el) => el?.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px 0px" }
    );

    itemsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [images]);

  return (
    <div className="gallery-page">
      <div className="gallery-wrap">
        <Link to="/gallery" className="gallery-back">← Back to Gallery</Link>

        <h1 className="gallery-title">{weddingName}</h1>

        {loading && <p className="gallery-status">Loading photos...</p>}
        {error && <p className="gallery-status">Unable to load photos. Please try again later.</p>}

        {!loading && !error && images.length === 0 && (
          <p className="gallery-status">No photos yet.</p>
        )}

        {!loading && !error && images.length > 0 && (
          <section className="masonry">
            {images.map((src, i) => (
              <figure
                className="masonry-item"
                key={src}
                ref={(el) => { itemsRef.current[i] = el; }}
              >
                <img
                  className="masonry-img"
                  src={src}
                  alt={`${weddingName} photo ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
