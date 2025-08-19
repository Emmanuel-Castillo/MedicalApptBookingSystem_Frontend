import React from "react";
import { TimeSlotDto } from "../types/dtos";
import { useNavigate } from "react-router-dom";

type TimeSlotTableProps = {
  timeSlots: TimeSlotDto[];
  deleteAction?: (ts: TimeSlotDto) => void;
};
function TimeSlotTable({ timeSlots, deleteAction }: TimeSlotTableProps) {
    const navigate = useNavigate()
  if (timeSlots.length == 0)
    return (
      <div className="bg-light p-3 rounded mb-4 border">
        <p>No time slots found.</p>
      </div>
    );
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Booked?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timeSlots.map((ts) => (
            <tr key={ts.id}>
              <td>{ts.id}</td>
              <td>{new Date(ts.startTime).toLocaleString()}</td>
              <td>{new Date(ts.endTime).toLocaleString()}</td>
              <td>{ts.isBooked ? "Yes" : "No"}</td>
              <td className="d-flex justify-content-center gap-2">
                <button className="btn btn-secondary" onClick={() => navigate(`/timeSlots/${ts.id}`)}>
                  View
                </button>
                {!ts.isBooked && deleteAction && (
                  <button className="btn btn-danger" onClick={() => deleteAction(ts)}>
                    Delete
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

export default TimeSlotTable;
