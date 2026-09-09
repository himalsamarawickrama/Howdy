import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const token = localStorage.getItem("howdy_token") || localStorage.getItem("token");

  if (loading) {
    return (
      <div className="auth-shell">
        <p style={{ color: "var(--ink-soft)" }}>Loading Howdy…</p>
      </div>
    );
  }

  // If there's neither a user object nor a stored JWT, redirect to login
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // Supports both wrapper pattern (<ProtectedRoute><Dashboard /></ProtectedRoute>)
  // and route layout pattern (<Route element={<ProtectedRoute />}><Route path="/dashboard" .../></Route>)
  return children ? children : <Outlet />;
}