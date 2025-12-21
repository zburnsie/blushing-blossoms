import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header style={{ padding: "1rem", borderBottom: "1px solid #eee" }}>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/rentals">Rentals</Link>
          <Link to="/inquiry">Inquiry</Link>
        </nav>
      </header>

      <main style={{ padding: "2rem" }}>
        <Outlet />
      </main>
    </>
  );
}
