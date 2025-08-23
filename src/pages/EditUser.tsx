import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { UserDto } from "../types/dtos";
import ErrorsBox from "../components/ErrorsBox";
import { ChangeUserRequest } from "../types/requests";

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loadingUserDto, setLoadingUserDto] = useState(true);
  const [formFullName, setFormFullName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [originalFullName, setOriginalFullName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [changedCred, setChangedCred] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Grab User info
  useEffect(() => {
    const grabUserDetails = async () => {
      try {
        const response = await api.get(`/users/${id}`);
        const userDto = response.data as UserDto;
        setOriginalFullName(userDto.fullName);
        setOriginalEmail(userDto.email);
        setFormFullName(userDto.fullName);
        setFormEmail(userDto.email);
      } catch (error: any) {
        console.log(error);
        const serverMessage =
          error.response.data || error.message || "Registration failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingUserDto(false);
      }
    };

    grabUserDetails();
  }, []);

  // Set changedCred if form credentials are different than the original. Otherwise, reset changedCred
  useEffect(() => {
    setChangedCred(
      formFullName !== originalFullName || formEmail !== originalEmail
    );
  }, [formFullName, formEmail, originalFullName, originalEmail]);

  if (loadingUserDto) return <div>Fetching user...</div>;
  if (!formFullName || !formEmail) return <div>User not found!</div>;

  const onFormSubmit = async () => {
    try {
      const changeUserRequest: ChangeUserRequest = {
        id: id!!,
        newFullName: formFullName,
        newEmail: formEmail,
      };
      const response = await api.post("/users", changeUserRequest);
      if (response.status == 200) navigate("/");
    } catch (error: any) {
      console.log(error);
      const serverMessage =
        error.response.data || error.message || "Registration failed!";
      setErrors([serverMessage]);
    }
  };

  return (
    <div className="container mt-5 ">
      <ErrorsBox errors={errors} />

      <form
        className="d-flex flex-column gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onFormSubmit();
        }}
      >
        <div className="gap-3">
          <h3>Full Name:</h3>
          <input
            className="form-control"
            type="text"
            value={formFullName}
            onChange={(e) => {
              setFormFullName(e.target.value);
            }}
          />
        </div>

        <div className="gap-3">
          <h3>Email:</h3>
          <input
            className="form-control"
            type="email"
            value={formEmail}
            onChange={(e) => {
              setFormEmail(e.target.value);
            }}
          />
        </div>

        <div className="w-50 d-flex gap-3">
          <button
            className={`btn ${!changedCred ? "btn-disabled" : "btn-primary"}`}
            disabled={!changedCred}
            type="submit"
          >
            Update
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditUser;
