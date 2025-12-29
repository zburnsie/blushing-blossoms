import { FaInstagram, FaPinterestP } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Social Icons */}
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
            href="https://pinterest.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pinterest"
          >
            <FaPinterestP />
          </a>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <p>(801) 555-1234</p>
          <p>hello@blushingblossoms.com</p>
        </div>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Blushing Blossoms
      </p>
    </footer>
  );
}
