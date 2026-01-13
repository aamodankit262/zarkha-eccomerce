import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const ProtectedRoute = () => {
  const { isLogin, token } = useAuthStore();
  const location = useLocation();

  // not logged in
  if (!isLogin || !token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
