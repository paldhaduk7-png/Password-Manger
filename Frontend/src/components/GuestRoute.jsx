import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../ContextAPI/AuthContext";

const GuestRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token") || localStorage.getItem("user");

  // If user is already logged in, redirect away from guest/auth pages to Home
  if (user || token) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default GuestRoute;
