import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Inquiry from "./pages/Inquiry";
import Gallery from "./pages/Gallery";
import Rentals from "./pages/Rentals";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/inquiry" element={<Inquiry />} />
      </Route>
    </Routes>
  );
}

export default App;
