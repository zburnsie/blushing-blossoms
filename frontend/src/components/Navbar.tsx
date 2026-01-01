import { Link } from "react-router-dom";
import "./Layout.css";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner header-left-nav">
        {/* LEFT GROUP */}
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src="/images/NavLogo.png" alt="Blushing Blossoms & Co." />
          </Link>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/gallery">Gallery</Link>
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
      </div>
    </header>
  );
}
