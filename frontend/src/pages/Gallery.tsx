import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Gallery.css";
import {
  getWeddingFolders,
  driveImageUrl,
  type WeddingFolder,
} from "../services/driveService";

export default function Gallery() {
  const [weddings, setWeddings] = useState<WeddingFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const cards = await getWeddingFolders();
        setWeddings(cards);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Fade-in cards as they scroll into view
  useEffect(() => {
    if (weddings.length === 0) return;

    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) {
      cardsRef.current.forEach((el) => el?.classList.add("is-visible"));
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
      { threshold: 0.08, rootMargin: "80px 0px" }
    );

    cardsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [weddings]);

  return (
    <div className="gallery-page">
      <div className="gallery-wrap">
        <h1 className="gallery-title">Gallery</h1>
        <p className="gallery-subtitle">A look into the weddings and events we've had the joy of designing for.</p>

        {loading && <p className="gallery-status">Loading...</p>}
        {error && <p className="gallery-status">Unable to load gallery right now. Please check back soon.</p>}

        {!loading && !error && weddings.length === 0 && (
          <p className="gallery-status">Gallery coming soon.</p>
        )}

        {!loading && !error && weddings.length > 0 && (
          <div className="wedding-grid">
            {weddings.map((wedding, i) => (
              <Link
                key={wedding.id}
                to={`/gallery/${wedding.id}`}
                state={{ name: wedding.name }}
                className="wedding-card"
                ref={(el) => { cardsRef.current[i] = el; }}
              >
                <div className="wedding-card-img">
                  {wedding.coverImageId ? (
                    <img
                      src={driveImageUrl(wedding.coverImageId)}
                      alt={wedding.name}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="wedding-card-placeholder" />
                  )}
                </div>
                <div className="wedding-card-info">
                  <h2 className="wedding-card-name">{wedding.name.replace(/^\d+-/, "")}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
