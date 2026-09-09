import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import OfferingsPage from "./pages/OfferingsPage";
import FaqsPage from "./pages/FaqsPage";
import CustomersPage from "./pages/CustomersPage";
import ConversationsPage from "./pages/ConversationsPage";
import RequestsPage from "./pages/RequestsPage";
import BusinessSettingsPage from "./pages/BusinessSettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="offerings" element={<OfferingsPage />} />
        <Route path="faqs" element={<FaqsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="conversations" element={<ConversationsPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="settings" element={<BusinessSettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
