import React, { useState } from "react";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { ResetPasswordRequest } from "../../types/requests";
import api from "../../api/axios";
import ErrorsBox from "../../components/ErrorsBox";
import { validatePassword } from "../../utils/ValidateAuthForm";

function ResetPassword() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = searchParams.get("token");
  if (!token) return <Navigate to={"/"} />;

  // Update user's new pw to backend
  const handleChangePWBtnClick = async () => {
    try {
      if (newPassword.length === 0) return;
      setLoading(true);
      if (!validatePassword(newPassword))
        throw Error("Password needs to be at least 6 characters!");
      const request: ResetPasswordRequest = {
        token: token,
        newPassword: newPassword,
      };
      console.log(request);
      await api.post("/auth/reset-password", request);
      navigate("/login");
    } catch (error: any) {
      console.log(error);
      const serverMessage = error.message || "Password reset request failed!";
      setErrors([serverMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <ErrorsBox errors={errors} />
      <h2>Reset Password</h2>

      <label className="form-label">Enter New Password:</label>
      <input
        className="form-control"
        type="text"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        disabled={loading}
      />
      <button
        disabled={newPassword.length === 0 || loading}
        className="btn btn-primary mt-2"
        onClick={handleChangePWBtnClick}
      >
        Change Password
      </button>
    </div>
  );
}

export default ResetPassword;
