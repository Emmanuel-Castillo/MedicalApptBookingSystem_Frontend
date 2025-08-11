import React from "react";
import { AppointmentDto } from "../types/dtos";

type AppointmentBoxProps = {
  appt: AppointmentDto;
  showNotes?: boolean;
};

function AppointmentBox({ appt, showNotes }: AppointmentBoxProps) {
  const { patient, timeSlot, notes } = appt;
  const { doctor, endTime, startTime } = timeSlot;
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-4">Appointment Details</h3>

        <div className="mb-3">
          <h5 className="mb-1 text-secondary">Patient</h5>
          <p className="mb-0 fw-medium">{patient.fullName}</p>
        </div>

        <div className="mb-3">
          <h5 className="mb-1 text-secondary">Appointment Time</h5>
          <p className="mb-0">
            {new Date(startTime).toLocaleString()} –{" "}
            {new Date(endTime).toLocaleString()}
          </p>
        </div>

        <div className="mb-3">
          <h5 className="mb-1 text-secondary">Doctor</h5>
          <p className="mb-0 fw-medium">{doctor.fullName}</p>
        </div>

        {showNotes && (
          <div className="mt-4">
            <h5 className="mb-2 text-secondary">Notes</h5>
            <p className="mb-0">
              {notes ? (
                notes
              ) : (
                <em className="text-muted">No notes provided.</em>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentBox;
