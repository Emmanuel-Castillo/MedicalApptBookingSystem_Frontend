import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Navigate, useNavigate } from "react-router-dom";
import ErrorsBox from "../ErrorsBox";
import { emit } from "process";

type LoginFormProps = {
  toggleFormType: () => void;
};
const LoginForm = ({ toggleFormType }: LoginFormProps) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { isLoading, errors, logIn, updateErrors } =
    useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    updateErrors([]);
  }, []);

  return (
    <div className="p-4 rounded border border-2 border-black col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
      <h2>Login</h2>
      <ErrorsBox errors={errors} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { email, password } = form;
          logIn(email, password);
        }}
      >
        <div className="mb-3">
          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-control"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
          onClick={toggleFormType}
        >
          Signup
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
