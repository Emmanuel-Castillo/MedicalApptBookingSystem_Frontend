import React, { useState } from "react";
import { AppointmentDto } from "../types/dtos";
import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "../utils/FormatDateAndTime";
import api from "../api/axios";
import Modal from "./Modal";
import AppointmentBox from "./AppointmentBox";
import ErrorsBox from "./ErrorsBox";

type AppointmentTableProps = {
  appointments: AppointmentDto[];
  includePatient?: boolean;
};
function AppointmentTable({
  appointments,
  includePatient,
}: AppointmentTableProps) {
  const [selectedAppt, setSelectedAppt] = useState<AppointmentDto | null>();
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const deleteAppointment = async (apptId: number) => {
    try {
      await api.delete(`/appointments/${apptId}`);
      navigate(0);
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    }
  };

  if (appointments.length == 0)
    return (
      <div className="bg-light p-3 rounded mb-4 border">
        <p>No appointments found.</p>
      </div>
    );
  return (
    <>
      {showModal && selectedAppt && (
        <Modal
          title={"Delete Appointment"}
          body={<AppointmentBox appt={selectedAppt} />}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            deleteAppointment(selectedAppt.id);
          }}
        />
      )}
      <ErrorsBox errors={errors} />
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              {includePatient && <th>Patient</th>}
              <th>Doctor</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt, idx) => (
              <tr key={appt.id}>
                <td>{idx + 1}</td>
                {includePatient && <td>{appt.patient.fullName}</td>}
                <td>{appt.timeSlot.doctor.fullName}</td>
                <td>{formatDate(appt.timeSlot.date)}</td>
                <td>{formatTime(appt.timeSlot.startTime)}</td>
                <td>{formatTime(appt.timeSlot.endTime)}</td>
                <td className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/appointments/${appt.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setSelectedAppt(appt);
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AppointmentTable;
