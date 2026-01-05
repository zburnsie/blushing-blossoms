import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { rentalItems } from "../data/rentals";
import "../styles/RentalRequest.css";

type Status = "idle" | "success" | "error";

type SelectedItem = {
  qty: number;
  variants?: Record<string, number>;
};

export default function RentalRequest() {
  const [searchParams] = useSearchParams();
  const itemFromUrl = searchParams.get("item");
  const qtyFromUrl = Number(searchParams.get("qty")) || 1;

  const [status, setStatus] = useState<Status>("idle");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventDate: "",
    notes: "",
    selectedItems: {} as Record<string, SelectedItem>,
  });

  /* ------------------ Prefill from Rentals page ------------------ */
  useEffect(() => {
    if (!itemFromUrl) return;

    const found = rentalItems.find((r) => r.name === itemFromUrl);
    if (!found) return;

    setFormData((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [found.name]: found.variants
          ? {
              qty: qtyFromUrl,
              variants: Object.fromEntries(
                found.variants.map((v) => [v.label, 0])
              ),
            }
          : { qty: Math.min(qtyFromUrl, found.maxQty) },
      },
    }));
  }, [itemFromUrl, qtyFromUrl]);

  /* ------------------ Helpers ------------------ */
  function toggleItem(itemName: string, item: any) {
    setFormData((prev) => {
      const updated = { ...prev.selectedItems };

      if (updated[itemName]) {
        delete updated[itemName];
      } else {
        updated[itemName] = item.variants
          ? {
              qty: 0,
              variants: Object.fromEntries(
                item.variants.map((v: any) => [v.label, 0])
              ),
            }
          : { qty: 1 };
      }

      return { ...prev, selectedItems: updated };
    });
  }

  function updateQty(itemName: string, qty: number, max: number) {
    setFormData((prev) => ({
      ...prev,
      selectedItems: {
        ...prev.selectedItems,
        [itemName]: {
          ...prev.selectedItems[itemName],
          qty: Math.min(max, Math.max(1, qty)),
        },
      },
    }));
  }

  function updateVariantQty(
    itemName: string,
    variant: string,
    qty: number,
    max: number
  ) {
    setFormData((prev) => {
      const current = prev.selectedItems[itemName];
      const updatedVariants = {
        ...current.variants!,
        [variant]: Math.min(max, Math.max(0, qty)),
      };

      return {
        ...prev,
        selectedItems: {
          ...prev.selectedItems,
          [itemName]: {
            qty: Object.values(updatedVariants).reduce((a, b) => a + b, 0),
            variants: updatedVariants,
          },
        },
      };
    });
  }

  const grandTotal = Object.entries(formData.selectedItems).reduce(
    (sum, [name, data]) => {
      const item = rentalItems.find((r) => r.name === name);
      if (!item) return sum;
      return sum + item.price * data.qty;
    },
    0
  );

  /* ------------------ Submit ------------------ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");

    try {
      const itemsString = Object.entries(formData.selectedItems)
        .map(([name, data]) => {
          if (data.variants) {
            const variants = Object.entries(data.variants)
              .filter(([, q]) => q > 0)
              .map(([v, q]) => `${v} x${q}`)
              .join(", ");
            return `${name}: ${variants}`;
          }
          return `${name} (x${data.qty})`;
        })
        .join(" | ");

      const res = await fetch("http://localhost:5034/api/rental-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          eventDate: formData.eventDate,
          items: itemsString,
          notes: `Grand Total: $${grandTotal}\n${formData.notes}`,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        eventDate: "",
        notes: "",
        selectedItems: {},
      });
    } catch {
      setStatus("error");
    }
  }

  /* ------------------ Render ------------------ */
  return (
    <div className="rental-request-page">
      <div className="form-container">
        <div className="heading-wrap">
          <h1>Rental Request</h1>
          <p className="subtitle">
            Review your items, select quantities, and submit your request.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-field">
            <label className="form-label">Event Date</label>
            <input
              className="form-input"
              type="date"
              required
              value={formData.eventDate}
              onChange={(e) =>
                setFormData({ ...formData, eventDate: e.target.value })
              }
            />
          </div>

          <div className="form-field checkbox-stack">
            <p className="form-label">Items to Rent</p>

            {rentalItems.map((item) => {
              const selected = formData.selectedItems[item.name];

              return (
                <div key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleItem(item.name, item)}
                    />
                    {item.name}
                  </label>

                  {selected && !item.variants && (
                    <input
                      type="number"
                      min={1}
                      max={item.maxQty}
                      value={selected.qty}
                      onChange={(e) =>
                        updateQty(
                          item.name,
                          Number(e.target.value),
                          item.maxQty
                        )
                      }
                    />
                  )}

                  {selected && item.variants && (
                    <div className="rental-variants">
                      {item.variants.map((v) => (
                        <div key={v.label} className="variant-row">
                          <label>{v.label}</label>
                          <input
                            type="number"
                            min={0}
                            max={v.maxQty}
                            value={selected.variants?.[v.label] || 0}
                            onChange={(e) =>
                              updateVariantQty(
                                item.name,
                                v.label,
                                Number(e.target.value),
                                v.maxQty
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="form-field">
            <strong>Grand Total: ${grandTotal}</strong>
          </div>

          <div className="form-field">
            <label className="form-label">Notes</label>
            <textarea
              className="form-input"
              rows={4}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="submit-wrap">
            <button className="submit-btn">Submit Rental Request</button>

            {status === "success" && (
              <p className="success">
                Rental request sent! We’ll be in touch soon.
              </p>
            )}
            {status === "error" && (
              <p className="error">Something went wrong. Please try again.</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
