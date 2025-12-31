import { useEffect, useRef, useState } from "react";
import "./Home.css";
import AboutBlushingBlossoms from "../components/AboutBlushingBlossoms";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import ReviewBanner from "../components/ReviewBanner";
import { Link } from "react-router-dom";


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
        <h3>Thoughtful florals for weddings and meaningful moments <br/>
            Serving Utah County & surrounding areas</h3>

        <p>A local Utah County florist
Blushing Blossoms is based in Utah and proudly serves Utah County and surrounding areas. Each design is created with intention, seasonality, and your story in mind.</p>
          
         

      </div>

      {/* PAGE CONTENT */}
      <main className="home-content">
        <Services />
        <ReviewBanner
          quote="Blushing Blossoms was AMAZING! They made my Pinterest board come to life!"
          author="Braylee | Wedding"
          backgroundImage="/images/review-banner.JPG"
        />
        <AboutBlushingBlossoms />

      </main>

      <section className="home-cta">
        <h2 className="home-cta-title">Let’s create something beautiful together</h2>
        <p className="home-cta-text">
          Inquire below to share your vision and check availability for your wedding or event.
        </p>

        <Link to="/inquiry" className="home-cta-btn">
          Inquire About Your Event
        </Link>
      </section>


    </div>
  );
}