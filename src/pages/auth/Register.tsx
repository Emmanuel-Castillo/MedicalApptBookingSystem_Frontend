import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { UserRegisterDto, UserRole } from "../../types/dtos";
import { useAuth } from "../../context/AuthContext";
import { validateForm } from "../../utils/ValidateAuthForm";
import api from "../../api/axios";
import ErrorsBox from "../../components/ErrorsBox";
import { useAuthStore } from "../../store/auth.store";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Patient");

  const navigate = useNavigate();
  const { isAuthenticated, user, register, isLoading, errors } = useAuthStore();

  // If user already logged, navigate to dashboard
  if (isAuthenticated && user) return <Navigate to={"/"} replace />;

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="mx-auto p-4 rounded border border-2 border-black col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <h2>Register</h2>

        <ErrorsBox errors={errors} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            register(email, password, fullName, role);
          }}
        >
          <div className="mb-3">
            <label>Full Name</label>
            <input
              value={fullName}
              className="form-control"
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              value={email}
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              type="email"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              value={password}
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              type="password"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role">Role:</label>
            <select
              name="role"
              id="role"
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button className="btn btn-primary" disabled={isLoading}>
            Register
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <span
            className="link-primary"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
