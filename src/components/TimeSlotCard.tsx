import React from 'react'
import { TimeSlotDto } from '../types/dtos';

type TimeSlotCardProps = {
    timeSlot: TimeSlotDto;
}
function TimeSlotCard({timeSlot} : TimeSlotCardProps) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-4">Time Slot Details</h3>

        <div className="mb-3">
          <h5 className="mb-1 text-secondary">Doctor</h5>
          <p className="mb-0 fw-medium">{timeSlot.doctor.fullName}</p>
        </div>

        <div className="mb-3">
          <h5 className="mb-1 text-secondary">Appointment Time</h5>
          <p className="mb-0">
            {new Date(timeSlot.startTime).toLocaleString()} –{" "}
            {new Date(timeSlot.endTime).toLocaleString()}
          </p>
        </div>

      </div>
    </div>
  )
}

export default TimeSlotCard