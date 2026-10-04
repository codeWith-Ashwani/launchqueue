import { Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
function AdminAccess({ children }) {
  const { founder } = useAuth();
  return founder?.isAdmin ? (
    children
  ) : (
    <main className="platform-container platform-access-denied">
      <h1>Administrator access required</h1>
      <p>This area is available to the LaunchQueue administrator.</p>
      <Link to="/dashboard" className="lq-btn lq-btn-primary">
        Return to your dashboard
      </Link>
    </main>
  );
}
export default function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <AdminAccess>{children}</AdminAccess>
    </ProtectedRoute>
  );
}
