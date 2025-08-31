import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserRegisterDto, UserRole } from "../../types/dtos";
import { useAuth } from "../../context/AuthContext";
import { validateForm } from "../../utils/ValidateAuthForm";
import api from "../../api/axios";
import ErrorsBox from "../../components/ErrorsBox";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Patient");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  // If user already logged, navigate to dashboard
  if (user) return <Navigate to={"/"} replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // Check for form errors
    const validationErrors = validateForm(email, password, fullName, role);
    if (validationErrors.length > 0) {
      setLoading(false);
      setErrors(validationErrors);
      return;
    }

    try {
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
    <div className="container mt-5">
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
        <div className="mb-3">
          <label>Role</label>
          <select
            value={role}
            className="form-select"
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={loading}
          >
            <option value={"Patient"}>Patient</option>
            <option value={"Doctor"}>Doctor</option>
            <option value={"Admin"}>Admin</option>
          </select>
        </div>
        <button className="btn btn-primary" disabled={loading}>
          Register
        </button>
      </form>

      <p>Already have an account? <span className="link-primary" style={{cursor: "pointer"}} onClick={() => navigate("/login")}>Login</span></p>
    </div>
  );
};

export default Register;
