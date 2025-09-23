import React from 'react'
import { TimeSlotDto } from '../types/dtos';
import { formatDate, formatTime } from '../utils/FormatDateAndTime';

type TimeSlotCardProps = {
    timeSlot: TimeSlotDto;
}
function TimeSlotCard({timeSlot} : TimeSlotCardProps) {
  return (
    <div className="card shadow-sm ">
      <div className="card-body d-flex flex-column gap-3">
        <h3 className="card-title">Time Slot Details</h3>

        <div>
          <h5 className="mb-1 text-secondary">Doctor</h5>
          <p className="mb-0 fw-medium">{timeSlot.doctor.user.fullName}</p>
        </div>

        <div>
          <h5 className='mb-1 text-secondary'>Date</h5>
          <p className='mb-0'>{formatDate(timeSlot.date)}</p>
        </div>

        <div>
          <h5 className="mb-1 text-secondary">Time</h5>
          <p className="mb-0">
            {formatTime(timeSlot.startTime)} –{" "}
            {formatTime(timeSlot.endTime)}
          </p>
        </div>

      </div>
    </div>
  )
}

export default TimeSlotCard