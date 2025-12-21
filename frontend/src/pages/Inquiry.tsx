import { useState } from "react";
import axios from "axios";

export default function Inquiry() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    instagramHandle: "",
    eventType: "",
    bookingStage: "",
    eventLocation: "",
    eventDate: "",
    colorPalette: "",
    budget: "",
    weddingItems: [] as string[],
    rentalsInterest: "",
    referralSource: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      weddingItems: checked
        ? [...prev.weddingItems, value]
        : prev.weddingItems.filter((item) => item !== value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await axios.post("http://localhost:5034/api/inquiries", formData);
      setSuccess(true);

      setFormData({
        name: "",
        phoneNumber: "",
        email: "",
        instagramHandle: "",
        eventType: "",
        bookingStage: "",
        eventLocation: "",
        eventDate: "",
        colorPalette: "",
        budget: "",
        weddingItems: [],
        rentalsInterest: "",
        referralSource: "",
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <h1>Inquiry</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label>Phone Number</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <label>Instagram Handle (optional)</label>
          <input
            name="instagramHandle"
            value={formData.instagramHandle}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Type of Event</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Wedding</option>
            <option>Funeral</option>
            <option>Corporate Event</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Where are you in the booking process?</label>
          <select
            name="bookingStage"
            value={formData.bookingStage}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option>Ready to book</option>
            <option>Likely to book</option>
            <option>Still looking</option>
          </select>
        </div>

        <div>
          <label>Event Location</label>
          <input
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Event Date</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Color Palette</label>
          <input
            name="colorPalette"
            value={formData.colorPalette}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Budget</label>
          {[
            "500-1000",
            "1000-1500",
            "1500-2000",
            "2000-3000",
            "3000-4000",
            "4000-5000",
            "5000-7000",
            "7000+",
            "other",
          ].map((range) => (
            <label key={range} style={{ display: "block" }}>
              <input
                type="radio"
                name="budget"
                value={range}
                checked={formData.budget === range}
                onChange={handleChange}
              />
              {range === "other" ? "Other" : `$${range.replace("-", "–$")}`}
            </label>
          ))}
        </div>

        <div>
          <label>If wedding, what items are you looking for?</label>
          {[
            "Bridal Bouquet",
            "Boutonnieres",
            "Bridesmaid Bouquets",
            "Centerpieces",
            "Installations",
            "Other",
          ].map((item) => (
            <label key={item} style={{ display: "block" }}>
              <input
                type="checkbox"
                value={item}
                checked={formData.weddingItems.includes(item)}
                onChange={handleCheckboxChange}
              />
              {item}
            </label>
          ))}
        </div>

        <div>
          <label>
            Are you interested in adding event rentals (plates, silverware,
            candles, picture frames, pedestals, etc.)?
          </label>

          <label style={{ display: "block" }}>
            <input
              type="radio"
              name="rentalsInterest"
              value="yes"
              checked={formData.rentalsInterest === "yes"}
              onChange={handleChange}
            />
            Yes
          </label>

          <label style={{ display: "block" }}>
            <input
              type="radio"
              name="rentalsInterest"
              value="no"
              checked={formData.rentalsInterest === "no"}
              onChange={handleChange}
            />
            No
          </label>
        </div>

        <div>
          <label>How did you hear about Blushing Blossoms?</label>
          <input
            name="referralSource"
            value={formData.referralSource}
            onChange={handleChange}
          />
        </div>

        {success && (
          <p style={{ color: "green" }}>
            Thank you! Your inquiry has been sent.
          </p>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </form>
    </div>
  );
}
