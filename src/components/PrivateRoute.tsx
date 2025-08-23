import { JSX } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { UserRole } from "../types/dtos";

type PrivateRouteProps = {
  children: JSX.Element;
  allowedRoles?: UserRole[];
};

// PrivateRoute exists to prevent unaunthenticated users from entering
// This functional component can also prevent entrance to authenticated users w/out an allowedRole
// allowedRoles is a list of roles that allow authenticated users to enter the route
// if their role is included in the list
function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user } = useAuth();

  // user is checked as non-null by ProtectedLayout
  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return <Navigate to={"/login"} replace />;
  }
  return children;
}

export default PrivateRoute;
