import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="auth-shell">
      <div style={{ textAlign: "center" }}>
        <h1>Page not found</h1>
        <p style={{ color: "var(--ink-soft)", marginTop: 8, marginBottom: 18 }}>
          That page doesn't exist or may have moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
