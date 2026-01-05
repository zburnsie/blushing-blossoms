import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Inquiry from "./pages/Inquiry";
import Gallery from "./pages/Gallery";
import Rentals from "./pages/Rentals";
import AdminInquiries from "./pages/AdminInquiries";
import AdminLogin from "./pages/AdminLogin";
import Pricing from "./pages/Pricing";
import RentalRequest from "./pages/RentalRequest";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "gallery", element: <Gallery /> },
      { path: "rentals", element: <Rentals /> },
      { path: "inquiry", element: <Inquiry /> },
      { path: "pricing", element: <Pricing /> },
      { path: "rentals/request", element: <RentalRequest /> },
      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/inquiries", element: <AdminInquiries /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
