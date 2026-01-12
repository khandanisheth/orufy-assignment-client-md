import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = localStorage.getItem("auth");

  return auth ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
