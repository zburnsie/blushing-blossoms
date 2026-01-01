import type { RentalItem } from "../data/rentals";
import { useNavigate } from "react-router-dom";

type Props = {
  item: RentalItem;
};

export default function RentalCard({ item }: Props) {
  const navigate = useNavigate();

  function handleRentClick() {
    navigate(`/rentals/request?item=${encodeURIComponent(item.name)}`);
  }

  return (
    <article className="rental-card">
      <div className="rental-imgFrame">
        <img className="rental-img" src={item.image} alt={item.name} />
      </div>

      <div className="rental-body">
        <h3 className="rental-name">{item.name}</h3>
        <p className="rental-desc">{item.description}</p>

        <button className="rent-btn" onClick={handleRentClick}>
          Rent this item
        </button>
      </div>
    </article>
  );
}
