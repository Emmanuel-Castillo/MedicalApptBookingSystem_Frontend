import React, { useState } from "react";
import { TimeSlotDto } from "../types/dtos";
import { useNavigate } from "react-router-dom";
import { formatDate, formatTime } from "../utils/FormatDateAndTime";
import Modal from "./Modal";
import TimeSlotCard from "./TimeSlotCard";
import api from "../api/axios";
import ErrorsBox from "./ErrorsBox";

type TimeSlotTableProps = {
  timeSlots: TimeSlotDto[];
  patientUse?: boolean;
  selectAction?: (ts: TimeSlotDto) => void;
};

function TimeSlotTable({
  timeSlots,
  patientUse,
  selectAction,
}: TimeSlotTableProps) {
  const [selectedTS, setSelectedTS] = useState<TimeSlotDto | null>();
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  // Send request to backend to delete timeslot w/ id given
  const deleteTimeSlot = async (timeSlotId: number) => {
    try {
      await api.delete(`/timeslots/${timeSlotId}`);
      navigate(0);
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    }
  };

  if (timeSlots.length == 0)
    return (
      <div className="bg-light p-3 rounded mb-4 border">
        <p>No time slots found.</p>
      </div>
    );
  return (
    <>
      {showModal && selectedTS && (
        <Modal
          title={"Delete Time Slot"}
          body={<TimeSlotCard timeSlot={selectedTS} />}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            deleteTimeSlot(selectedTS.id);
          }}
        />
      )}
      <ErrorsBox errors={errors} />
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              {patientUse && <th>Doctor</th>}
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              {!patientUse && <th>Booked?</th>}
              {/* Don't show booked column if table is used for patients booking appointments*/}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((ts) => (
              <tr key={ts.id}>
                <td>{ts.id}</td>
                {patientUse && <td>{ts.doctor.fullName}</td>}
                <td>{formatDate(ts.date)}</td>
                <td>{formatTime(ts.startTime)}</td>
                <td>{formatTime(ts.endTime)}</td>
                {!patientUse && <td>{ts.isBooked ? "Yes" : "No"}</td>}
                <td className="d-flex justify-content-center gap-2">
                  {!patientUse ? (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={() => navigate(`/timeSlots/${ts.id}`)}
                      >
                        View
                      </button>
                      {!ts.isBooked && (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            setShowModal(true);
                            setSelectedTS(ts);
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className={`btn btn-outline-primary ${
                        ts == selectedTS && "active"
                      }`}
                      onClick={() => {
                        setSelectedTS(ts)
                        if (selectAction) selectAction(ts);
                      }}
                    >
                      {ts == selectedTS ? "Selected" : "Select"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TimeSlotTable;
