import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Inquiry = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  eventType: string;
  bookingStage: string;
  eventLocation: string;
  eventDate: string;
  budget: string;
  weddingItems: string | null;
  referralSource: string;
  createdAt: string;
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔒 ADMIN AUTH CHECK
  useEffect(() => {
    const isAuthed = localStorage.getItem("admin-auth");
    if (!isAuthed) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // 📥 FETCH INQUIRIES
  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      const response = await axios.get("http://localhost:5034/api/inquiries");
      setInquiries(response.data);
    } catch {
      setError("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this inquiry?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5034/api/inquiries/${id}`);

      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch {
      alert("Failed to delete inquiry");
    }
  }

  if (loading) return <p>Loading inquiries...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h1>Admin – Inquiries</h1>

      {inquiries.length === 0 && <p>No inquiries yet.</p>}

      {inquiries.map((inq) => (
        <div
          key={inq.id}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "16px",
            borderRadius: "6px",
          }}
        >
          <p>
            <strong>Name:</strong> {inq.name}
          </p>
          <p>
            <strong>Email:</strong> {inq.email}
          </p>
          <p>
            <strong>Phone:</strong> {inq.phoneNumber}
          </p>
          <p>
            <strong>Event Type:</strong> {inq.eventType}
          </p>
          <p>
            <strong>Event Date:</strong> {inq.eventDate}
          </p>
          <p>
            <strong>Budget:</strong> {inq.budget}
          </p>
          <p>
            <strong>Wedding Items:</strong> {inq.weddingItems ?? "N/A"}
          </p>
          <p>
            <strong>Referral:</strong> {inq.referralSource}
          </p>
          <p>
            <strong>Submitted:</strong>{" "}
            {new Date(inq.createdAt).toLocaleString()}
          </p>

          <button
            onClick={() => handleDelete(inq.id)}
            style={{
              marginTop: "10px",
              backgroundColor: "#c0392b",
              color: "white",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "4px",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
