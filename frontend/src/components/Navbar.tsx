import { useState } from "react";
import { Link } from "react-router-dom";
import "./Layout.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner header-left-nav">
        {/* LEFT GROUP */}
        <div className="nav-left">
          <Link to="/" className="nav-logo" onClick={close}>
            <img src="/images/NavLogo.png" alt="Blushing Blossoms & Co." />
          </Link>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About</Link>
            <Link to="/rentals">Rentals</Link>
            <Link to="/inquiry">Inquiry</Link>
            <Link to="/pricing">Pricing</Link>
          </nav>
        </div>

        {/* RIGHT CTA */}
        <div className="nav-right">
          <Link to="/inquiry" className="contact-btn">
            Contact
          </Link>
        </div>

        {/* HAMBURGER (mobile only) */}
        <button
          className={`nav-hamburger ${open ? "is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      <div className={`nav-mobile ${open ? "is-open" : ""}`}>
        <nav className="nav-mobile-links">
          <Link to="/" onClick={close}>Home</Link>
          <Link to="/gallery" onClick={close}>Gallery</Link>
          <Link to="/about" onClick={close}>About</Link>
          <Link to="/rentals" onClick={close}>Rentals</Link>
          <Link to="/inquiry" onClick={close}>Inquiry</Link>
          <Link to="/pricing" onClick={close}>Pricing</Link>
          <Link to="/inquiry" className="nav-mobile-cta" onClick={close}>Contact</Link>
        </nav>
      </div>
    </header>
  );
}
