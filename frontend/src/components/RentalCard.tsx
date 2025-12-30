import type { RentalItem } from "../data/rentals";

type Props = {
  item: RentalItem;
  onRent: (item: RentalItem) => void;
};

export default function RentalCard({ item, onRent }: Props) {
  return (
    <div className="rental-card">
      <img src={item.image} alt={item.name} />
      <h3>{item.name}</h3>
      <p>{item.description}</p>

      <button className="rent-btn" onClick={() => onRent(item)}>
        Rent this item
      </button>
    </div>
  );
}
