import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthUser, useAuth } from "../../context/AuthContext";
import { validateForm } from "../../utils/ValidateAuthForm";
import { UserLoginDto, UserRole } from "../../types/dtos";
import api from "../../api/axios";
import ErrorsBox from "../../components/ErrorsBox";

// Used to parse JWT token claims
const ROLE_CLAIM_URL =
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
const OTHER_CLAIMS_URL =
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();
  const { user, logIn } = useAuth();

  // If user already logged, navigate to dashboard
  if (user) return <Navigate to={"/"} replace />;

  // Log in user
  const handleSubmit = async () => {
    // Login user
    try {
      setErrors([]);
      setLoading(true);

      // Check for form errors
      const validationErrors = validateForm(email, password);
      if (validationErrors.length > 0) {
        setLoading(false);
        setErrors(validationErrors);
        return;
      }
      const dto: UserLoginDto = {
        Email: email,
        Password: password,
      };

      const response = await api.post("/auth/login", dto);
      const token = response.data.token;

      // Decode JWT token to retrieve user data
      const decoded: any = jwtDecode(token);
      const userData: AuthUser = {
        id: decoded[`${OTHER_CLAIMS_URL}/nameidentifier`],
        fullName: decoded[`${OTHER_CLAIMS_URL}/name`],
        email: decoded[`${OTHER_CLAIMS_URL}/emailaddress`],
        role: decoded[ROLE_CLAIM_URL] as UserRole,
        token: token,
      };

      logIn(userData);
    } catch (err: any) {
      console.log(err);
      const serverMessage =
        err.response.data || err.message || "Registration failed!";
      setErrors([serverMessage]);
    } finally {
      setLoading(false);
      return;
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="mx-auto bg-light p-4 rounded border border-2 border-black col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
        <h2>Login</h2>

        <ErrorsBox errors={errors} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-3">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
              disabled={loading}
              type="password"
            />
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
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
