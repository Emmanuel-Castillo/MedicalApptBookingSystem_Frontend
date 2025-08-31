import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordRequest } from "../../types/requests";
import ErrorsBox from "../../components/ErrorsBox";
import api from "../../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleClickForgotPassword = async () => {
    try {
      setLoading(true)
      if (email.length == 0) return;
      const request: ForgotPasswordRequest = {
        email: email,
      };
      await api.post(`/auth/forgot-password`, request);
      navigate("/pw-reset-requested")
    } catch (error: any) {
      console.log(error);
      const serverMessage =
        error.response.data || error.message || "Password reset request failed!";
      setErrors([serverMessage]);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="container mt-5">
      <ErrorsBox errors={errors} />
      <h2>Forgot password?</h2>

      <label className="form-label">Enter the email associated with your account to change your password.</label>
      <input
        className="form-control"
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button
        disabled={email.length === 0 || loading}
        className="btn btn-primary mt-2"
        onClick={handleClickForgotPassword}
      >
        Request Password Reset
      </button>
    </div>
  );
}

export default ForgotPassword;
