import { useEffect, useRef } from "react";
import "../styles/Gallery.css";

const IMAGE_COUNT = 56;

const images = Array.from({ length: IMAGE_COUNT }, (_, i) => {
  const n = i + 1;
  return `/images/GalleryImages/gal${n}.JPG`;
});

export default function Gallery() {
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;

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
      { threshold: 0.12, rootMargin: "150px 0px" }
    );

    itemsRef.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="gallery-page">
      <div className="gallery-wrap">
        <h1 className="gallery-title">Gallery</h1>

        <section className="masonry">
          {images.map((src, i) => (
            <figure
              className="masonry-item"
              key={src}
              ref={(el) => {
                itemsRef.current[i] = el;
              }}
            >
              <img
                className="masonry-img"
                src={src}
                alt="Blushing Blossoms gallery"
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </section>
      </div>
    </div>
  );
}
