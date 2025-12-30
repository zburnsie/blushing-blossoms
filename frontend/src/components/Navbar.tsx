import { Link } from "react-router-dom";
import "./Layout.css"; // reuse your existing header styles

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <img src="/images/Logo.png" alt="Blushing Blossoms" />
        </Link>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/rentals">Rentals</Link>
          <Link to="/inquiry">Inquiry</Link>
          <Link to="/admin/inquiries" className="admin-link">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
