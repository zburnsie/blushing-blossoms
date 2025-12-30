import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
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
            <Link to="/pricing">Pricing</Link>
            <Link to="/admin/inquiries" className="admin-link">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
