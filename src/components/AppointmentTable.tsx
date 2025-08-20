import React from "react";
import { AppointmentDto } from "../types/dtos";
import { useNavigate } from "react-router-dom";

type AppointmentTableProps = {
  appointments: AppointmentDto[];
  deleteAction: (appt: AppointmentDto) => void;
};
function AppointmentTable({
  appointments,
  deleteAction,
}: AppointmentTableProps) {
  const navigate = useNavigate();
  if (appointments.length == 0)
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
            <th>Doctor</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, idx) => (
            <tr key={appt.id}>
              <td>{idx + 1}</td>
              <td>{appt.timeSlot.doctor.fullName}</td>
              <td>{new Date(appt.timeSlot.startTime).toLocaleString()}</td>
              <td>{new Date(appt.timeSlot.endTime).toLocaleString()}</td>
              <td className="d-flex justify-content-center gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/appointments/${appt.id}`)}
                >
                  View
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteAction(appt)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;
