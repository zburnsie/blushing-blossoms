import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "./Layout.css";

export default function Layout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className={`layout ${isHome ? "is-home" : ""}`}>
      {!isHome && <Navbar />}

      <main className="site-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

