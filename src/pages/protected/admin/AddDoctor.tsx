import React, { useState } from "react";
import { UserRegisterDto, UserRole } from "../../../types/dtos";
import api from "../../../api/axios";
import { useNavigate } from "react-router";
import { validateForm } from "../../../utils/ValidateAuthForm";

function AddDoctor() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const createNewDoctor = async () => {
    try {
      const errors = validateForm(email, password, fullName);
      if (errors.length > 0) return;

      const role: UserRole = "Doctor";
      const dto: UserRegisterDto = {
        FullName: fullName,
        Email: email,
        Password: password,
        Role: role,
      };
      const response = await api.post("/auth/register", dto);
      if (response.status == 200) {
        navigate("/all-doctors");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Doctor</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNewDoctor();
        }}
        className="d-flex flex-column gap-3"
      >
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            className="form-control"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="text"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="text"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>
        <button className="btn w-25 btn-primary" type="submit">
          Create
        </button>
      </form>
    </div>
  );
}

export default AddDoctor;
