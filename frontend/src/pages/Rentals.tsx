import "../styles/Rentals.css";
import RentalCard from "../components/RentalCard";
import { rentalItems } from "../data/rentals";

export default function Rentals() {
  return (
    <div className="rentals-page">
      <div className="rentals-container">
        <div className="rentals-heading">
          <h1 className="rent-title">Rentals</h1>

          <p className="rent-text">
            We offer a curated collection of rental pieces to elevate your event.
            Browse available items below and request rentals directly.
          </p>
        </div>

        <div className="rental-grid">
          {rentalItems.map((item) => (
            <RentalCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
