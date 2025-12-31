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

        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <p>BlushingBlossoms.co@gmail.com</p>
        </div>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Blushing Blossoms
      </p>
    </footer>
  );
}
