import type { RentalItem } from "../data/rentals";
import { useNavigate } from "react-router-dom";

type Props = {
  item: RentalItem;
  onRent: (item: RentalItem) => void;
};

export default function RentalCard({ item }: Props) {
  const navigate = useNavigate();

  function handleRentClick() {
    navigate(`/rentals/request?item=${encodeURIComponent(item.name)}`);
  }

  return (
    <div className="rental-card">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>

      <button className="rent-btn" onClick={handleRentClick}>
        Rent this item
      </button>
    </div>
  );
}
