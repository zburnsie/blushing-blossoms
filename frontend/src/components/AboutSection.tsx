import { Link } from "react-router-dom";
import "./AboutSection.css";

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-container">
        <img className="about-layover" src="/images/BlushFlower.png" alt="" aria-hidden="true" />

        {/* Image */}
        <Link to="/" className="about-image">
          <img
            src="/images/AshlynClose.png"
            alt="Ashlyn from Blushing Blossoms"
          />
        </Link>

        {/* Text */}
        <div className="about-text">
          <h2>
            <span>Blushing Blossoms</span> 
            <span style={{ fontFamily: '"Amsterdam 3", cursive' }}>  .Co</span>
          </h2>


          <p>
            Founded by Ashlyn Burnside, BlushingBlossoms.co is a floral design
            studio creating florals for weddings, events, and everyday moments.
            What began as a personal creative outlet has grown into a small
            business built on thoughtful design and care.
          </p>

          <p>
            Florals at BlushingBlossoms.co are designed with depth and texture,
            using shape, movement, and natural elements to create layered,
            expressive arrangements. Each design reflects the couple it is for,
            highlighting their style and telling their love story through
            flowers.
          </p>

          <p>
            Our goal is to create floral designs that feel intentional, personal,
            and true to the people and moments they celebrate.
          </p>
        </div>
      </div>
    </section>
  );
}
