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
      <p>Your account must be approved for admin access in the database.</p>
      <Link to="/dashboard" className="lq-btn lq-btn-primary">
        Return to your dashboard
      </Link>
    </main>
  );
}
export default function AdminRoute({ children }) {
  return (
    <ProtectedRoute loginPath="/admin/login">
      <AdminAccess>{children}</AdminAccess>
    </ProtectedRoute>
  );
}
