import "../styles/Rentals.css";
import RentalCard from "../components/RentalCard";
import { rentalItems, type RentalItem } from "../data/rentals";

export default function Rentals() {
  function handleRentClick(item: RentalItem) {
    // For now, just log it
    console.log("Renting:", item.name);
  }

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Rentals</h1>

      <p style={{ textAlign: "center", marginBottom: "3rem" }}>
        We offer a curated collection of rental items to elevate your event.
        Browse available pieces below and request rentals directly.
      </p>

      <div className="rental-grid">
        {rentalItems.map((item) => (
          <RentalCard key={item.id} item={item} onRent={handleRentClick} />
        ))}
      </div>
    </div>
  );
}
