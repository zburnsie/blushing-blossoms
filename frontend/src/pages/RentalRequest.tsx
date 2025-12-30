import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { rentalItems } from "../data/rentals";
import "../styles/RentalRequest.css";

type Status = "idle" | "success" | "error";

export default function RentalRequest() {
  const [searchParams] = useSearchParams();
  const item = searchParams.get("item");

  const [status, setStatus] = useState<Status>("idle");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eventDate: "",
    quantity: "",
    notes: "",
    selectedItems: [] as string[],
  });

  // Preselect item from URL
  useEffect(() => {
    if (item) {
      setFormData((prev) => ({
        ...prev,
        selectedItems: [item],
      }));
    }
  }, [item]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleCheckboxChange(itemName: string) {
    setFormData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.includes(itemName)
        ? prev.selectedItems.filter((i) => i !== itemName)
        : [...prev.selectedItems, itemName],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");

    try {
      const res = await fetch("http://localhost:5034/api/rental-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          eventDate: formData.eventDate,
          quantity: formData.quantity,
          items: formData.selectedItems.join(", "),
          notes: formData.notes,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");

      // Reset form after success
      setFormData({
        name: "",
        email: "",
        eventDate: "",
        quantity: "",
        notes: "",
        selectedItems: [],
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="rental-request-page">
      <div className="form-container">
        <h1>Rental Request</h1>

        {item && (
          <p className="selected-item">
            Item selected: <strong>{item}</strong>
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
          />

          <input
            name="quantity"
            placeholder="Quantity needed"
            value={formData.quantity}
            onChange={handleChange}
          />

          <div className="checkbox-group">
            <label className="checkbox-label">Items to Rent</label>
            {rentalItems.map((r) => (
              <label key={r.id} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={formData.selectedItems.includes(r.name)}
                  onChange={() => handleCheckboxChange(r.name)}
                />
                {r.name}
              </label>
            ))}
          </div>

          <textarea
            name="notes"
            rows={4}
            placeholder="Anything else we should know?"
            value={formData.notes}
            onChange={handleChange}
          />

          <button type="submit" className="rent-btn">
            Submit Rental Request
          </button>

          {status === "success" && (
            <p className="success">
              Rental request sent! We’ll be in touch soon.
            </p>
          )}

          {status === "error" && (
            <p className="error">Something went wrong. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
