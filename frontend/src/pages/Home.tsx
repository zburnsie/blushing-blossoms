import { useEffect, useState } from "react";
import "../styles/Home.css";
import AboutBlushingBlossoms from "../components/AboutBlushingBlossoms";
import Navbar from "../components/Navbar";
import Services from "../components/Services";
import ReviewBanner from "../components/ReviewBanner";
import { Link } from "react-router-dom";
import { FaInstagram, FaPinterestP } from "react-icons/fa";


const HERO_IMAGES = [
  "/images/hero1.JPG",
  "/images/hero2.JPG",
  "/images/hero3.JPG",
  "/images/hero4.JPG",
  "/images/hero5.JPG",
  "/images/hero6.JPG",
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Hero slideshow
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
      <section className="hero">
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className={`hero-bg ${i === activeIndex ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}

        <div className="hero-dark-overlay" />

        <div className="hero-social">
          <a href="https://www.instagram.com/blushingblossoms.co/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://pin.it/36MmGCGYh" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
            <FaPinterestP />
          </a>
        </div>

        <div className="hero-content">
          <img
            className="hero-logo"
            src="/images/WhiteTranspLogo.png"
            alt="Blushing Blossoms & Co."
          />
        </div>
      </section>



      {/* NAV — sticky via CSS after hero scrolls away */}
      <div className="nav-wrap">
        <Navbar />
      </div>

      <section className="home-intro">
  
        <br></br>
        <p className="home-intro-kicker">Utah County Florist</p>
        <h2 className="home-intro-title">
          Wedding florals that feel personal, <br/> elevated, and timeless.
        </h2>
        <br></br>

        <Link to="/inquiry" className="home-intro-btn">
          Inquire About Your Date
        </Link>
      </section>



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