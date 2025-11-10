import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { AuthUser, useAuth } from "../../context/AuthContext";
import { validateForm } from "../../utils/ValidateAuthForm";
import { UserLoginDto, UserRole } from "../../types/dtos";
import api from "../../api/axios";
import ErrorsBox from "../../components/ErrorsBox";
import { useAuthStore } from "../../store/auth.store";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const {isAuthenticated, isLoading, errors, logIn} = useAuthStore()

  // If user already logged, navigate to dashboard
  if (isAuthenticated) return <Navigate to={"/"} replace />;

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="mx-auto p-4 rounded border border-2 border-black col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <h2>Login</h2>

        <ErrorsBox errors={errors} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            logIn(email, password);
          }}
        >
          <div className="mb-3">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
              disabled={isLoading}
              type="password"
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={isLoading}>
            Login
          </button>
        </form>

        <p className="mt-4 mb-0">
          Forgot password?{" "}
          <span
            className="link-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
          >
            Click here
          </span>
        </p>
        <p>
          Don't have an account?{" "}
          <span
            className="link-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
