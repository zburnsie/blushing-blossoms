import { FaInstagram, FaPinterestP } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* LEFT: Socials */}
        <div className="footer-socials">
          <a
            href="https://www.instagram.com/blushingblossoms.co/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>

          <a
            href="https://pin.it/36MmGCGYh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
          >
            <FaPinterestP />
          </a>
        </div>

        {/* CENTER: Flower mark */}
        <div className="footer-logo">
          <img
            src="/images/BlushFlower.png"
            alt="Blushing Blossoms floral mark"
          />
        </div>

        {/* RIGHT: Contact + Admin */}
        <div className="footer-contact">
          <a
              href="mailto:BlushingBlossoms.co@gmail.com?subject=Floral%20Inquiry"
              className="footer-email"
            >
              BlushingBlossoms.co@gmail.com
          </a>


          <Link to="/admin/inquiries" className="footer-admin">
            Admin
          </Link>
        </div>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Blushing Blossoms
      </p>
    </footer>
  );
}
