import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DayOfWeek, DoctorAvailabilityDto } from "../../../types/dtos";
import api from "../../../api/axios";
import { SetDoctorAvailRequest } from "../../../types/requests";
import ErrorsBox from "../../../components/ErrorsBox";
import {
  formatDate,
  formatTime,
  OPEN_HOURS,
} from "../../../utils/FormatDateAndTime";

const AVAILABLE_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function SetAvailability() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [availabilityThisWeek, setAvailabilityThisWeek] = useState<
    DoctorAvailabilityDto[]
  >([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formReady, setFormReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const DAYS_OF_WEEK_TO_LIST = Object.entries(DayOfWeek).filter(
    ([key, value]) => typeof value === "number"
  );

  //   export type SetDoctorAvailRequest = {
  //     doctorId: number;
  //     daysOfWeek: DayOfWeek[];
  //     startTime: string;
  //     endTime: string;
  //     startDate: string;
  //     endDate?: string;
  //   };

  // Fetch doctor's availability for the current week
  useEffect(() => {
    const getDocAvail = async () => {
      try {
        const response = await api.get(`doctors/${id}/availability/thisweek`);
        console.log(response.data);
        setAvailabilityThisWeek(response.data);
      } catch (error: any) {
        const serverMessage =
          error.response.data || error.message || "Appointment booking failed!";
        setErrors([serverMessage]);
      }
    };

    getDocAvail();
  }, []);

  // If all form inputs are set, set formReady
  useEffect(() => {
    console.log({
      daysOfWeek,
      startDate,
      endDate,
      startTime,
      endTime
    }
    )
    setFormReady(daysOfWeek && startDate && endDate && startTime && endTime ? true : false);
  }, [daysOfWeek, startDate, endDate, startTime, endTime]);

  // Add/remove day of week from state list
  const toggleDayinDaysOfWeek = (day: DayOfWeek) => {
    if (daysOfWeek.includes(day)) {
      console.log(`${day} in daysOfWeek`);
      setDaysOfWeek((prev) => prev.filter((d) => d !== day));
    } else {
      setDaysOfWeek((prev) => [...prev, day]);
    }
  };

  const onFormSubmit = async () => {
    try {
      setErrors([]);
      setLoading(true);

      // Validate request arguments
      if (endTime === startTime)
        throw Error("End time is the same as start time!");
      if (endTime < startTime)
        throw Error("End time is set before start time!");
      if (endDate < startDate)
        throw Error("End date is set before start date!");

      const docAvailRequest: SetDoctorAvailRequest = {
        doctorId: Number(id!!),
        daysOfWeek: daysOfWeek,
        startTime: startTime + ":00",
        endTime: endTime + ":00",
        startDate: startDate,
        endDate: endDate,
      };

      await api.post("/availability", docAvailRequest);
      navigate(-1);   
    } catch (error: any) {
      console.log(error.response.data);
      const message = error.response.data || error.message || "Invalid inputs!";
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex flex-column gap-3">
      <ErrorsBox errors={errors} />

      <div className="d-flex flex-column gap-3 bg-light p-3 rounded border">
        <h3>Availability - This Week</h3>
        {availabilityThisWeek.length === 0 ? (
          <p>No availability set.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Starting</th>
                  <th>Until</th>
                </tr>
              </thead>
              <tbody>
                {availabilityThisWeek.map((a) => (
                  <tr key={a.id}>
                    <td>{a.dayOfWeek}</td>
                    <td>{formatTime(a.startTime)}</td>
                    <td>{formatTime(a.endTime)}</td>
                    <td>{formatDate(a.startDate)}</td>
                    <td>{formatDate(a.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="d-flex flex-column gap-3 bg-light p-3 rounded border">
        <h2>Set New Availability (currently in development)</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit();
          }}
          className="d-flex flex-column gap-4"
        >
          {/* DAYS OF WEEK */}
          <div className="form-group">
            <label className="form-label">Select days</label>
            <div className="d-flex flex-wrap gap-1">
              {DAYS_OF_WEEK_TO_LIST.map(([key, value]) => (
                <button
                  type="button"
                  onClick={() => toggleDayinDaysOfWeek(value as DayOfWeek)}
                  className={`btn btn-outline-secondary ${
                    daysOfWeek.includes(value as DayOfWeek) && "active"
                  }`}
                  disabled={loading}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          {/* START & END TIME */}
          <div className="d-flex flex-wrap gap-3">
            {/* START TIME */}
            <div className="d-flex flex-column">
              <label className="form-label">Start Time</label>
              <select
                className="form-select"
                onChange={(e) => setStartTime(e.target.value)}
              >
                <option value="">Select a time</option>
                {OPEN_HOURS.map((hr) => (
                  <option value={hr}>{formatTime(hr)}</option>
                ))}
              </select>
            </div>

            {/* END TIME */}
            <div className="d-flex flex-column">
              <label className="form-label">End Time</label>
              <select
                className="form-select"
                onChange={(e) => setEndTime(e.target.value)}
              >
                <option value="">Select a time</option>
                {OPEN_HOURS.filter((hr) => hr > startTime).map((hr) => (
                  <option value={hr}>{formatTime(hr)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* START & END DATE */}
          <div className="d-flex flex-wrap gap-3">
            <div className="d-flex flex-column">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="d-flex flex-column">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formReady || loading}
          >
            Submit
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default SetAvailability;
