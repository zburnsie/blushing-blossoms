import { useState } from "react";
import axios from "axios";
import "../styles/Inquiry.css";

// Items that require a "how many?" answer when selected
const COUNTED_ITEMS = [
  { item: "Bridesmaid Bouquets", field: "bridesmaidBouquetsCount", label: "HOW MANY BRIDESMAID BOUQUETS?", placeholder: "e.g. 4" },
  { item: "Boutonnieres", field: "boutonnieresCount", label: "HOW MANY BOUTONNIERES?", placeholder: "e.g. 5" },
  { item: "Corsages", field: "corsagesCount", label: "HOW MANY CORSAGES?", placeholder: "e.g. 2" },
  { item: "Centerpieces", field: "centerpiecesCount", label: "HOW MANY CENTERPIECES?", placeholder: "e.g. 10" },
] as const;

const WEDDING_ITEMS = [
  "Bridal Bouquet",
  "Bridesmaid Bouquets",
  "Boutonnieres",
  "Corsages",
  "Centerpieces",
  "Installations",
  "Other",
];

const EMPTY_FORM = {
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
  bridesmaidBouquetsCount: "",
  boutonnieresCount: "",
  corsagesCount: "",
  centerpiecesCount: "",
  installationDetails: "",
  rentalsInterest: "",
  referralSource: "",
};

export default function Inquiry() {
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        weddingItems: checked
          ? [...prev.weddingItems, value]
          : prev.weddingItems.filter((item) => item !== value),
      };
      // Clear the follow-up answer when an item is unchecked
      if (!checked) {
        const counted = COUNTED_ITEMS.find((c) => c.item === value);
        if (counted) next[counted.field] = "";
        if (value === "Installations") next.installationDetails = "";
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const toCount = (v: string) => (v === "" ? null : Number(v));
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries`, {
        ...formData,
        bridesmaidBouquetsCount: toCount(formData.bridesmaidBouquetsCount),
        boutonnieresCount: toCount(formData.boutonnieresCount),
        corsagesCount: toCount(formData.corsagesCount),
        centerpiecesCount: toCount(formData.centerpiecesCount),
        installationDetails: formData.installationDetails.trim() || null,
      });
      setSuccess(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="inquiry-page">
      <div className="inquiry-layout">
        {/* LEFT: images */}
        <div className="inquiry-images">
          <div className="side-img-frame">
            <img src="/images/InquiryImages/inquiry1.JPG" alt="" />
          </div>
          <div className="side-img-frame">
            <img src="/images/InquiryImages/inquiry3.JPG" alt="" />
          </div>
          <div className="side-img-frame">
            <img src="/images/InquiryImages/inquiry4.JPG" alt="" />
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="inquiry-form-side">
      <div className="form-container">
        <div className="heading-wrap">
          <h1>Inquiry</h1>
          <p className="subtitle">We'd love to hear about your special day</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">
              NAME <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              PHONE NUMBER <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              EMAIL <span className="required">*</span>
            </label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">INSTAGRAM HANDLE (OPTIONAL)</label>
            <input
              className="form-input"
              name="instagramHandle"
              value={formData.instagramHandle}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              TYPE OF EVENT <span className="required">*</span>
            </label>
            <select
              className="form-input"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>Wedding</option>
              <option>Funeral</option>
              <option>Corporate Event</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              WHERE ARE YOU IN THE BOOKING PROCESS?{" "}
              <span className="required">*</span>
            </label>
            <select
              className="form-input"
              name="bookingStage"
              value={formData.bookingStage}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option>Ready to book</option>
              <option>Likely to book</option>
              <option>Still looking</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">
              EVENT LOCATION <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="eventLocation"
              value={formData.eventLocation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              EVENT DATE <span className="required">*</span>
            </label>
            <input
              className="form-input"
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              COLOR PALETTE <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="colorPalette"
              value={formData.colorPalette}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">
              BUDGET <span className="required">*</span>
            </label>
            <div className="radio-stack">
              {[
                "2000-3000",
                "3000-4000",
                "4000-5000",
                "5000-7000",
                "7000+",
                "other",
              ].map((range) => (
                <label key={range}>
                  <input
                    type="radio"
                    name="budget"
                    value={range}
                    checked={formData.budget === range}
                    onChange={handleChange}
                    required
                  />
                  {range === "other" ? "Other" : `$${range.replace("-", "–$")}`}
                </label>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">
              IF WEDDING, WHAT ITEMS ARE YOU LOOKING FOR?{" "}
              <span className="required">*</span>
            </label>
            <div className="checkbox-stack">
              {WEDDING_ITEMS.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    value={item}
                    checked={formData.weddingItems.includes(item)}
                    onChange={handleCheckboxChange}
                    required={formData.weddingItems.length === 0}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          {COUNTED_ITEMS.filter((c) => formData.weddingItems.includes(c.item)).map((c) => (
            <div className="form-field" key={c.field}>
              <label className="form-label">
                {c.label} <span className="required">*</span>
              </label>
              <input
                className="form-input"
                type="number"
                min="1"
                step="1"
                name={c.field}
                value={formData[c.field]}
                onChange={handleChange}
                placeholder={c.placeholder}
                required
              />
            </div>
          ))}

          {formData.weddingItems.includes("Installations") && (
            <div className="form-field">
              <label className="form-label">
                WHAT KIND OF INSTALLATIONS ARE YOU INTERESTED IN? (OPTIONAL)
              </label>
              <textarea
                className="form-input"
                name="installationDetails"
                value={formData.installationDetails}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. arch, hanging installation, aisle meadows... or let us know if you're not sure yet"
              />
            </div>
          )}

          <div className="form-field">
            <label className="form-label">
              INTERESTED IN EVENT RENTALS? <span className="required">*</span>
            </label>
            <div className="radio-stack">
              <label>
                <input
                  type="radio"
                  name="rentalsInterest"
                  value="yes"
                  checked={formData.rentalsInterest === "yes"}
                  onChange={handleChange}
                  required
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="rentalsInterest"
                  value="no"
                  checked={formData.rentalsInterest === "no"}
                  onChange={handleChange}
                  required
                />
                No
              </label>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">
              HOW DID YOU HEAR ABOUT BLUSHING BLOSSOMS?{" "}
              <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="referralSource"
              value={formData.referralSource}
              onChange={handleChange}
              required
            />
          </div>

          {success && (
            <p className="success">Thank you! Your inquiry has been sent.</p>
          )}
          {error && <p className="error">{error}</p>}

          <div className="submit-wrap">
            <button type="submit" disabled={submitting} className="submit-btn">
              {submitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
        </div>{/* end inquiry-form-side */}
      </div>{/* end inquiry-layout */}
    </div>
  );
}
