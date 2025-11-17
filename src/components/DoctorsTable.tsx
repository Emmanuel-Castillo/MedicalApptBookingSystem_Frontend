import React from "react";
import { useNavigate } from "react-router-dom";
import { DoctorProfileDto, UserDto } from "../types/dtos";
import { useAuthStore } from "../store/auth.store";

type DoctorsTableProps = {
  doctors: DoctorProfileDto[];
};

function DoctorsTable({ doctors }: DoctorsTableProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  if (doctors.length == 0)
    return (
      <div className="bg-light p-3 rounded mb-4 border">
        <p>No appointments found.</p>
      </div>
    );
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Specialty</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((profile, idx) => (
            <tr key={profile.id}>
              <td>{idx + 1}</td>
              <td>{profile.user.fullName}</td>
              <td>{profile.specialty}</td>
              <td>{profile.user.email}</td>
              <td className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/doctors/${profile.userId}`)}
                >
                  View
                </button>
                {user && user.role === "Admin" && (
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/users/${profile.userId}/edit-user`)
                    }
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DoctorsTable;
