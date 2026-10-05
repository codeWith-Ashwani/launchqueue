import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, loginPath = "/login" }) {
  const { founder, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  if (!founder) {
    return <Navigate to={loginPath} replace />;
  }

  return children;
}
