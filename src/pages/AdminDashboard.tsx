import React, { use, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UserDto, UserRole } from "../types/dtos";
import ErrorsBox from "../components/ErrorsBox";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await api.get("users");
        setUsers(response.data);
      } catch (error: any) {
        console.log(error);
        const serverMessage =
          error.response.data || error.message || "Registration failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingUsers(false);
      }
    };

    getUsers();
  }, []);

  const handleUserClick = (user: UserDto) => {
    switch (user.role) {
      case "Patient":
        navigate(`/patients/${user.id}`);
        break;

      case "Doctor":
        navigate(`/doctors/${user.id}`);
        break;

      default:
        break;
    }
  };

  return (
    <div className="container mt-4">

      <ErrorsBox errors={errors}/>

      <div className="d-flex mb-4">
        <h2>Welcome, {user!.fullName}!</h2>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">All Users</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Full Name</th>
                <th scope="col">Role</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {loadingUsers ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-3">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleUserClick(u)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{u.fullName}</td>
                    <td>{u.role}</td>
                    <td>{u.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
