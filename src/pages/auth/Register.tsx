import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { UserRegisterDto, UserRole } from "../../types/dtos";
import { useAuth } from "../../context/AuthContext";
import { validateForm } from "../../utils/ValidateAuthForm";
import api from "../../api/axios";
import ErrorsBox from "../../components/ErrorsBox";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  // If user already logged, navigate to dashboard
  if (user) return <Navigate to={"/"} replace />;

  // Register user
  const handleSubmit = async () => {
    try {
      setErrors([]);
      setLoading(true);

      // Check for form errors
      const validationErrors = validateForm(email, password, fullName);
      if (validationErrors.length > 0) {
        setLoading(false);
        setErrors(validationErrors);
        return;
      }

      const role: UserRole = "Patient";
      const dto: UserRegisterDto = {
        FullName: fullName,
        Email: email,
        Password: password,
        Role: role,
      };
      await api.post("/auth/register", dto);
      navigate("/login");
    } catch (err: any) {
      console.log(err);
      const serverMessage = err.message || "Registration failed!";
      setErrors([serverMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="mx-auto bg-light p-4 rounded border border-2 border-black col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <h2>Register</h2>

        <ErrorsBox errors={errors} />

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input
              value={fullName}
              className="form-control"
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              value={email}
              className="form-control"
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
              type="password"
            />
          </div>
          <button className="btn btn-primary" disabled={loading}>
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
