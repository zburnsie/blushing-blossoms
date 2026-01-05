import { useState } from "react";
import type { RentalItem } from "../data/rentals";
import { useNavigate } from "react-router-dom";

type Props = {
  item: RentalItem;
};

export default function RentalCard({ item }: Props) {
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [variantQtys, setVariantQtys] = useState(
    item.variants ? item.variants.map(() => 0) : []
  );

  const totalQty = item.variants
    ? variantQtys.reduce((a, b) => a + b, 0)
    : quantity;

  const lineTotal = item.price * totalQty;

  function handleRentClick() {
    if (totalQty < 1 || totalQty > item.maxQty) return;

    navigate(
      `/rentals/request?item=${encodeURIComponent(item.name)}&qty=${totalQty}`
    );
  }

  return (
    <article className="rental-card">
      <div className="rental-imgFrame">
        <img className="rental-img" src={item.image} alt={item.name} />
      </div>

      <div className="rental-body">
        <h3 className="rental-name">{item.name}</h3>
        <p className="rental-desc">{item.description}</p>

        {item.metadata && <p className="rental-meta">{item.metadata}</p>}

        <p className="rental-price">
          ${item.price} {item.unitLabel}
        </p>

        {item.variants ? (
          <div className="rental-variants">
            {item.variants.map((variant, index) => (
              <div key={variant.label} className="variant-row">
                <label>
                  {variant.label} (max {variant.maxQty})
                </label>
                <input
                  type="number"
                  min={0}
                  max={variant.maxQty}
                  value={variantQtys[index]}
                  onChange={(e) => {
                    const value = Math.min(
                      variant.maxQty,
                      Math.max(0, Number(e.target.value))
                    );
                    const updated = [...variantQtys];
                    updated[index] = value;
                    setVariantQtys(updated);
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rental-qty">
            <label>Qty (max {item.maxQty})</label>
            <input
              type="number"
              min={1}
              max={item.maxQty}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.min(item.maxQty, Math.max(1, Number(e.target.value)))
                )
              }
            />
          </div>
        )}

        <p className="rental-total">
          Total: <strong>${lineTotal}</strong>
        </p>

        <button className="rent-btn" onClick={handleRentClick}>
          Rent this item
        </button>
      </div>
    </article>
  );
}
