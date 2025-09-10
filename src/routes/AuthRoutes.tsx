import { Route } from "react-router-dom";
import ForgotPassword from "../pages/auth/ForgotPassword";
import PasswordChangeRequested from "../pages/auth/PasswordChangeRequested";
import ResetPassword from "../pages/auth/ResetPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

function AuthRoutes() {
  return (
    <>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/pw-reset-requested" element={<PasswordChangeRequested />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </>
  );
}

export default AuthRoutes;
