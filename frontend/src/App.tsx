import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Inquiry from "./pages/Inquiry";
import Gallery from "./pages/Gallery";
import Rentals from "./pages/Rentals";
import AdminInquiries from "./pages/AdminInquiries";
import AdminLogin from "./pages/AdminLogin";
import Pricing from "./pages/Pricing";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/inquiry" element={<Inquiry />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route path="/admin/inquiries" element={<AdminInquiries />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/inquiries" element={<AdminInquiries />} />
      </Route>
    </Routes>
  );
}

export default App;
