import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

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
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-heading">
          <h1>Admin Login</h1>
          <p className="subtitle">Authorized access only</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label className="admin-login-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="admin-login-input"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <div className="admin-login-actions">
            <button type="submit" className="admin-login-btn">
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
