import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export const PublicRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (session) {
    toast.error("You dont have permission to this route");
    return <Navigate to="/" replace />;
  }

  return children;
};
