import "../styles/Pricing.css";
import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {/* Header */}
        <div className="pricing-header">
          <h1>Pricing & Floral Basics</h1>
          <p className="subtitle">
            Transparent starting points for our most requested floral pieces.
            All designs are customized to your vision, season, and event size.
          </p>
        </div>

        {/* Floral Design */}
        <section className="pricing-section">
          <h2>Floral Design</h2>

          <div className="pricing-list">
            <div className="pricing-item">
              <span>Bridal Bouquet</span>
              <span className="price">$350 – $475</span>
            </div>

            <div className="pricing-item">
              <span>Groom Boutonniere</span>
              <span className="price">$20+</span>
            </div>

            <div className="pricing-item">
              <span>Groomsmen Boutonnieres</span>
              <span className="price">$15+</span>
            </div>

            <div className="pricing-item">
              <span>Bridesmaid Bouquets</span>
              <span className="price">$60+</span>
            </div>

            <div className="pricing-item">
              <span>Corsages</span>
              <span className="price">$40+</span>
            </div>

            <div className="pricing-item">
              <span>Bud Vases</span>
              <span className="price">$7+ each</span>
            </div>

            <div className="pricing-item">
              <span>Welcome Arrangements</span>
              <span className="price">$60 – $300</span>
            </div>
          </div>
        </section>

        {/* Cake Flowers */}
        <section className="pricing-section">
          <h2>Cake Flowers</h2>

          <div className="pricing-list">
            <div className="pricing-item">
              <span>Cake Meadow</span>
              <span className="price">$300+</span>
            </div>

            <div className="pricing-item">
              <span>Cake Flowers</span>
              <span className="price">$30+</span>
            </div>
          </div>
        </section>

        {/* Centerpieces */}
        <section className="pricing-section">
          <h2>Centerpieces</h2>

          <div className="pricing-list">
            <div className="pricing-item">
              <span>Large Centerpieces</span>
              <span className="price">$170+</span>
            </div>

            <div className="pricing-item">
              <span>Small Centerpieces</span>
              <span className="price">$75+</span>
            </div>

            <div className="pricing-item">
              <span>Bud Vases</span>
              <span className="price">$7 each</span>
            </div>
          </div>
        </section>

        {/* Installations */}
        <section className="pricing-section">
          <h2>Installations</h2>

          <div className="pricing-list">
            <div className="pricing-item">
              <span>Full Arch Installation (Heavy Bloom)</span>
              <span className="price">$2,300+</span>
            </div>

            <div className="pricing-item">
              <span>Pedestal Arrangements</span>
              <span className="price">$500 each (pedestals not included)</span>
            </div>

            <div className="pricing-item">
              <span>Half Arch Installation (Medium Bloom)</span>
              <span className="price">$1,700+</span>
            </div>

            <div className="pricing-item">
              <span>Column Installation (Medium Bloom)</span>
              <span className="price">$1,000+</span>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="pricing-note">
          Pricing varies based on flower selection, seasonality, event location,
          and design complexity. Final quotes are provided after consultation.
        </p>

        {/* CTA */}
        <div className="pricing-cta">
          <Link to="/inquiry" className="pricing-btn">
            Request a Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
