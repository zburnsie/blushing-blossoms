import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5034/api/admin-auth/login", {
        password,
      });

      localStorage.setItem("admin-auth", "true");
      navigate("/admin/inquiries");
    } catch {
      setError("Incorrect password");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto" }}>
      <h2>Admin Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit" style={{ marginTop: "12px", width: "100%" }}>
          Login
        </button>
      </form>
    </div>
  );
}
