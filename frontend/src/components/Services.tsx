import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Services.css";

type Service = {
  kicker: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
  images: { src: string}[];
};

export default function Services() {
  // One shared index so all 3 sections rotate in sync every 4 seconds.
  // (If you want each service to rotate independently, tell me and I’ll adjust.)
  const [slideIndex, setSlideIndex] = useState(0);

  const services: Service[] = useMemo(
  () => [
    {
      kicker: "Full Service",
      title: "Weddings",
      description:
        "From bouquets and boutonnieres to ceremony and reception installations, we design wedding florals that reflect your story — refined, romantic, and never cookie-cutter.",
      ctaLabel: "View Gallery",
      ctaTo: "/gallery",
      images: [
        { src: "/images/services/weddings1.JPG"},
        { src: "/images/services/weddings2.JPG"},
        { src: "/images/services/weddings3.JPG"},
      ],
    },
    {
      kicker: "Florals for Gatherings",
      title: "Events",
      description:
        "Florals for showers, parties, funerals, and corporate events. We’ll create designs that fit your space, your mood, and your moment — effortless and beautiful.",
      ctaLabel: "Inquire",
      ctaTo: "/inquiry",
      images: [
        { src: "/images/services/events1.JPG"},
        { src: "/images/services/events2.JPG"},
        { src: "/images/services/events3.JPG"},
      ],
    },
    {
      kicker: "Seasonal Arrangements",
      title: "Arrangements",
      description:
        "Thoughtfully designed, seasonal arrangements offered for special moments like Mother’s Day and Valentine’s Day. Each collection features a small selection of refined designs, created to feel elevated, timeless, and gift-ready.",
      ctaLabel: "View Seasonal Offerings",
      ctaTo: "/inquiry",
      images: [
        { src: "/images/services/arrangements1.JPG"},
        { src: "/images/services/arrangements2.JPG"},
        { src: "/images/services/arrangements3.JPG"},
      ],
    },
  ],
  []
);


  // Rotate every 4 seconds
  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;

    const maxSlides = Math.max(...services.map((s) => s.images.length));
    const id = window.setInterval(() => {
      setSlideIndex((i) => (i + 1) % maxSlides);
    }, 4000);

    return () => window.clearInterval(id);
  }, [services]);

  return (
    <section className="services" aria-label="Services">
      <div className="services-inner">
        {services.map((service, idx) => {
          const isReverse = idx % 2 === 1; // alternate layout
          const img = service.images[slideIndex % service.images.length];

          return (
            <article
              key={service.title}
              className={`service ${isReverse ? "service--reverse" : ""}`}
            >
              {/* TEXT */}
              <div className="service-text">
                <p className="service-kicker">{service.kicker}</p>
                <h2 className="service-title">{service.title}</h2>
                <p className="service-desc">{service.description}</p>

                {service.ctaLabel && service.ctaTo && (
                  <Link className="service-btn" to={service.ctaTo}>
                    {service.ctaLabel}
                  </Link>
                )}
              </div>

              {/* IMAGE */}
              <div className="service-media" aria-label={`${service.title} photos`}>
                <div className="service-imgFrame">
                    {service.images.map((image, imageIdx) => {
                        const isActive = imageIdx === (slideIndex % service.images.length);

                        return (
                        <img
                            key={image.src}
                            className={`service-img ${isActive ? "is-active" : ""}`}
                            src={image.src}
                            loading="lazy"
                        />
                        );
                    })}
                </div>

                {/* Optional: small dots indicator */}
                <div className="service-dots" aria-hidden="true">
                  {service.images.map((_, dotIdx) => {
                    const active = dotIdx === (slideIndex % service.images.length);
                    return (
                      <span
                        key={dotIdx}
                        className={`service-dot ${active ? "is-active" : ""}`}
                      />
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
