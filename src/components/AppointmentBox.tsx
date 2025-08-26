import React, { useEffect, useState } from "react";
import { AppointmentDto } from "../types/dtos";
import Modal from "./Modal";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { UpdateApptNotesRequest } from "../types/requests";

type AppointmentBoxProps = {
  appt: AppointmentDto;
  editNotes?: boolean;
  showNotes?: boolean;
  title?: string;
};

function AppointmentBox({
  appt,
  editNotes,
  showNotes,
  title,
}: AppointmentBoxProps) {
  const { patient, timeSlot, notes } = appt;
  const { doctor, endTime, startTime } = timeSlot;
  const navigate = useNavigate();

  // For use case of updating notes in appt
  const [updatedNotes, setUpdatedNotes] = useState(notes);
  const [enableUpdateNotesBtn, setEnableUpdateNotesBtn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Set enabled for update notes button if change detected
  useEffect(() => {
    setEnableUpdateNotesBtn(
      notes == null && updatedNotes == ""
        ? false
        : updatedNotes !== notes
        ? true
        : false
    );
  }, [updatedNotes]);

  const updateNotes = async () => {
    try {
      const request : UpdateApptNotesRequest = {
        updatedNotes: updatedNotes
      }
      const response = await api.post(`/appointments/${appt.id}/notes`, request);
      navigate(0);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div className="card shadow-sm">
      {showModal && (
        <Modal
          body={
            <div className="d-flex flex-column gap-2">
              <h5>Prev Notes</h5>
              <p>{notes ? notes : "No notes provided."}</p>
              <h5>Updated Notes</h5>
              <p>{updatedNotes}</p>
            </div>
          }
          confirmText="Yes, Update Notes"
          onCancel={() => setShowModal(false)}
          onConfirm={() => updateNotes()}
          title="Confirm Notes Update"
        />
      )}
      <div className="card-body">
        <h3 className="card-title mb-4">{title || "Appointment Details"}</h3>

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
            {editNotes ? (
              <div className="d-flex flex-column gap-1">
                <textarea
                  className="form-control"
                  placeholder={"No notes provided"}
                  value={updatedNotes}
                  onChange={(e) => setUpdatedNotes(e.target.value)}
                  aria-multiline
                />
                <button
                  className="btn w-25 btn-primary"
                  onClick={() => setShowModal(true)}
                  disabled={!enableUpdateNotesBtn || loading}
                >
                  Update Notes
                </button>
              </div>
            ) : (
              <p className="mb-0">
                {notes ? (
                  notes
                ) : (
                  <em className="text-muted">No notes provided.</em>
                )}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppointmentBox;
