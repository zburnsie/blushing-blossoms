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
        <div className="heading-wrap">
          <h1>Rental Request</h1>

          {item ? (
            <p className="subtitle">
              Selected item: <strong>{item}</strong>
            </p>
          ) : (
            <p className="subtitle">
              Tell us what you’d like to rent and we’ll confirm availability.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="form-input"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-input"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="eventDate">
              Event Date
            </label>
            <input
              id="eventDate"
              className="form-input"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="quantity">
              Quantity Needed
            </label>
            <input
              id="quantity"
              className="form-input"
              name="quantity"
              placeholder="Quantity needed"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="form-field checkbox-stack">
            <p className="form-label">Items to Rent</p>

            {rentalItems.map((r) => (
              <label key={r.id}>
                <input
                  type="checkbox"
                  checked={formData.selectedItems.includes(r.name)}
                  onChange={() => handleCheckboxChange(r.name)}
                />
                {r.name}
              </label>
            ))}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              className="form-input"
              name="notes"
              rows={4}
              placeholder="Anything else we should know?"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="submit-wrap">
            <button type="submit" className="submit-btn">
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
          </div>
        </form>
      </div>
    </div>
  );
}
