import { useEffect, useRef, useState } from "react";
import "./Home.css";
import AboutSection from "../components/AboutSection";
import Navbar from "../components/Navbar";


const HERO_IMAGES = [
  "/images/hero1.JPG",
  "/images/hero2.JPG",
  "/images/hero3.JPG",
  "/images/hero4.JPG",
  "/images/hero5.JPG",
  "/images/hero6.JPG",
];

export default function Home() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [navSticky, setNavSticky] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  // 1) Sticky nav AFTER hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNavSticky(!entry.isIntersecting),
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2) Hero slideshow
  useEffect(() => {
    if (HERO_IMAGES.length < 2) return;

    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4500); // change every 4.5s

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="home-page">
      {/* HERO */}
      <section ref={heroRef} className="hero">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`hero-bg ${i === activeIndex ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}

        <div className="hero-dark-overlay" />

        <div className="hero-content">
          <img
            className="hero-logo"
            src="/images/WhiteTranspLogo.png"
            alt="Blushing Blossoms & Co."
          />
        </div>
      </section>



      {/* NAV (becomes sticky after hero) */}
      <div className={`nav-wrap ${navSticky ? "is-sticky" : ""}`}>
        <Navbar />
      </div>

      <div className="home-bio">
        <h2>UTAH FLORIST</h2>
      </div>

      {/* PAGE CONTENT */}
      <main className="home-content">
        <AboutSection />
      </main>
    </div>
  );
}