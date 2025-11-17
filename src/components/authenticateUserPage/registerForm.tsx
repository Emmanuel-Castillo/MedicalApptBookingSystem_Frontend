import React, { useEffect, useState } from "react";
import { UserRole } from "../../types/dtos";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import ErrorsBox from "../ErrorsBox";

type RegisterFormProps = {
  toggleFormType: () => void;
};
const RegisterForm = ({ toggleFormType }: RegisterFormProps) => {
  const [form, setForm] = useState<{
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
  }>({
    fullName: "",
    email: "",
    password: "",
    role: "Patient",
  });
  const { register, isLoading, errors, updateErrors } = useAuthStore();

  useEffect(() => {
    updateErrors([]);
  }, []);
  return (
    <div className="p-4 rounded border border-2 border-black col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
      <h2>Register</h2>

      <ErrorsBox errors={errors} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const { fullName, email, password, role } = form;
          register(email, password, fullName, role);
        }}
      >
        <div className="mb-3">
          <label>Full Name</label>
          <input
            value={form.fullName}
            className="form-control"
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            value={form.email}
            className="form-control"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            disabled={isLoading}
            type="email"
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            value={form.password}
            className="form-control"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as UserRole })
            }
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

      <p className="mt-4">
        Already have an account?{" "}
        <span
          className="link-primary"
          style={{ cursor: "pointer" }}
          onClick={toggleFormType}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default RegisterForm;
