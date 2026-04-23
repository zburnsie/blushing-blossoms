import { useState } from "react";
import "../styles/About.css";

const FAVORITES: string[] = Array.from({ length: 20 }, (_, i) => `fav${i + 1}.jpg`);

export default function About() {
  const [current, setCurrent] = useState(0);

  function prev() {
    setCurrent((c) => (c - 1 + FAVORITES.length) % FAVORITES.length);
  }

  function next() {
    setCurrent((c) => (c + 1) % FAVORITES.length);
  }

  return (
    <div className="about-page">

      {/* ── BIO SECTION ── */}
      <section className="about-bio">
        <div className="about-bio-inner">

          {/* LEFT: photo */}
          <div className="about-bio-img-wrap">
            <img
              src="/images/AboutImages/AshlynAbout.JPG"
              alt="Ashlyn Burnside"
              className="about-bio-img"
            />
          </div>

          {/* RIGHT: text */}
          <div className="about-bio-text">

            {/* Flower + logo layered together */}
            <div className="about-logo-wrap">
              <img
                src="/images/BlushFlower.png"
                alt=""
                aria-hidden="true"
                className="about-flower-mark"
              />
              <img
                src="/images/AboutBlushingBlossoms.png"
                alt="Blushing Blossoms & Co."
                className="about-logo"
              />
            </div>

            <p className="about-greeting">Hi, I'm Ashlyn — and I'm so glad you're here!</p>

            <p>
              My love for flowers started long before I ever dreamed of owning a
              business. I remember watching my siblings order corsages from the
              flower shop and being completely captivated by them — I loved them
              so much that I began creating my own using silk flowers and ribbon,
              completely unaware that those small creative moments would turn into
              something so meaningful later on.
            </p>

            <p>
              That love only grew when I began working at a flower shop, where I
              rediscovered just how much joy floral design brings me. In February
              of 2024, I turned that passion into my own business, with the goal
              of creating florals that feel elegant, colorful, and full of life.
            </p>

            <p>
              Today, I specialize in designing for brides who want flowers that
              are both classy and vibrant — arrangements that feel refined, but
              still have movement and personality. I believe your wedding flowers
              should not only be beautiful, but should also reflect who you are
              and how you want your day to feel.
            </p>

            <p>
              Having designed florals for over 30 full-service weddings, I
              understand how to take a vision and bring it to life while managing
              every detail with care. I'm passionate about creating a stress-free
              experience — walking you through each step, paying attention to
              even the smallest details, and making sure you feel completely
              confident and taken care of throughout the entire process.
            </p>

            <p>
              To me, flowers are more than just décor — they're part of the
              moments you'll remember forever. It would truly be an honor to be a
              part of your day and create something beautiful together.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAVORITES CAROUSEL ── */}
      {FAVORITES.length > 0 && (
        <section className="about-favs">
          <div className="about-favs-inner">
            <p className="about-favs-kicker">A Few of My Favorites</p>
            <h2 className="about-favs-title">Ashlyn's Favorites</h2>

            <div className="about-carousel">
              <div className="about-carousel-stage">
                <button
                  className="about-carousel-btn about-carousel-btn--prev"
                  onClick={prev}
                  aria-label="Previous photo"
                >
                  ‹
                </button>

                <div className="about-carousel-frame">
                  {FAVORITES.map((file, i) => (
                    <div
                      key={file}
                      className={`about-carousel-slide ${i === current ? "active" : ""}`}
                    >
                      <img
                        src={`/images/AboutImages/Favorites/${file}`}
                        alt={`Ashlyn's favorite ${i + 1}`}
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                    </div>
                  ))}
                </div>

                <button
                  className="about-carousel-btn about-carousel-btn--next"
                  onClick={next}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </div>

              {/* Dot indicators */}
              <div className="about-carousel-dots">
                {FAVORITES.map((_, i) => (
                  <button
                    key={i}
                    className={`about-carousel-dot ${i === current ? "active" : ""}`}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to photo ${i + 1}`}
                  />
                ))}
              </div>

              {/* Thumbnail strip */}
              <div className="about-carousel-thumbs">
                {FAVORITES.map((file, i) => (
                  <button
                    key={file}
                    className={`about-carousel-thumb ${i === current ? "active" : ""}`}
                    onClick={() => setCurrent(i)}
                  >
                    <img
                      src={`/images/AboutImages/Favorites/${file}`}
                      alt=""
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
