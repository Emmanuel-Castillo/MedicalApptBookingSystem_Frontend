import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DayOfWeek, DoctorAvailabilityDto } from "../../../types/dtos";
import api from "../../../api/axios";
import { SetDoctorAvailRequest } from "../../../types/requests";
import ErrorsBox from "../../../components/ErrorsBox";

const AVAILABLE_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function SetAvailability() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [availabilityThisWeek, setAvailabilityThisWeek] = useState<DoctorAvailabilityDto[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([]);
  const [startTimeHr, setStartTimeHr] = useState(6); // Default start time is 6:00AM
  const [startTimeIsPm, setStartTimeIsPm] = useState(false);
  const [endTimeHr, setEndTimeHr] = useState(6); // Default end time is 6:00PM
  const [endTimeIsPm, setEndTimeIsPm] = useState(true);
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
  // startTime, endTime, startTimeIsPm, and endTimeIsPm will always be truthy
  useEffect(() => {
    if (daysOfWeek && startDate && endDate) setFormReady(true);
    else setFormReady(false);
  }, [daysOfWeek, startDate, endDate]);

  // Add/remove day of week from state list
  const toggleDayinDaysOfWeek = (day: DayOfWeek) => {
    if (daysOfWeek.includes(day)) {
      console.log(`${day} in daysOfWeek`);
      setDaysOfWeek((prev) => prev.filter((d) => d !== day));
    } else {
      setDaysOfWeek((prev) => [...prev, day]);
    }
  };

  // Utility function to setup Dto
  // Setting hour value into a formatted string "HH:mm:ss"
  function formatTimeForDto(hour: number, isPm: boolean): string {
    let adjusted = hour % 12; // convert 12 -> 0
    if (isPm) adjusted += 12;
    return adjusted.toString().padStart(2, "0") + ":00:00";
  }

  const onFormSubmit = async () => {
    try {
      setErrors([]);
      setLoading(true);

      // Validate request arguments
      if (endTimeIsPm === startTimeIsPm) {
        if (endTimeHr === startTimeHr)
          throw Error("End time is the same as start time!");
        if (endTimeHr < startTimeHr)
          throw Error("End time is set before start time!");
      }
      if (endDate < startDate) {
        throw Error("End date is set before start date!");
      }

      const docAvailRequest: SetDoctorAvailRequest = {
        doctorId: Number(id!!),
        daysOfWeek: daysOfWeek,
        startTime: formatTimeForDto(startTimeHr, startTimeIsPm),
        endTime: formatTimeForDto(endTimeHr, endTimeIsPm),
        startDate: startDate,
        endDate: endDate,
      };

      await api.post("/availability", docAvailRequest);
      navigate(-1);
    } catch (error: any) {
      console.log(error.response.data)
      const message = error.response.data || error.message || "Invalid inputs!";
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  // Utility function to display received availability times to AM/PM format
  function formatGivenTime(time24h: string) {
    const [hourString, minute, second] = time24h.split(":");
    let hour = parseInt(hourString, 10);
    const ampm = hour > 12 ? "PM" : "AM";

    // Adjust hour for 12-hour format
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour; // Convert 0 (midnight) to 12

    return `${hour}:${minute} ${ampm}`;
  }

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
                    <td>{formatGivenTime(a.startTime)}</td>
                    <td>{formatGivenTime(a.endTime)}</td>
                    <td>{new Date(a.startDate).toLocaleDateString()}</td>
                    <td>{new Date(a.endDate).toLocaleDateString()}</td>
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
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <select
                  className="form-select-sm"
                  onChange={(e) => setStartTimeHr(Number(e.target.value))}
                  defaultValue={startTimeHr}
                >
                  {AVAILABLE_HOURS.map((hr) => (
                    <option key={hr} value={hr}>
                      {hr}:00
                    </option>
                  ))}
                </select>

                <div className="d-flex align-items-center gap-1">
                  <input
                    type="radio"
                    name="StartTimeTOD"
                    id="StartTimeAM"
                    checked={!startTimeIsPm}
                    onChange={() => setStartTimeIsPm(false)}
                  />
                  <label htmlFor="StartTimeAM" className="mb-0">
                    AM
                  </label>
                </div>

                <div className="d-flex align-items-center gap-1">
                  <input
                    type="radio"
                    name="StartTimeTOD"
                    id="StartTimePM"
                    checked={startTimeIsPm}
                    onChange={() => setStartTimeIsPm(true)}
                  />
                  <label htmlFor="StartTimePM" className="mb-0">
                    PM
                  </label>
                </div>
              </div>
            </div>

            {/* END TIME */}
            <div className="form-group">
              <label className="form-label">End Time</label>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <select
                  className="form-select-sm"
                  onSelect={(e) => setEndTimeHr(Number(e.currentTarget.value))}
                  defaultValue={endTimeHr}
                >
                  {AVAILABLE_HOURS.map((hr) => (
                    <option key={hr} value={hr}>
                      {hr}:00
                    </option>
                  ))}
                </select>

                <div className="d-flex align-items-center gap-1">
                  <input
                    type="radio"
                    name="EndTimeTOD"
                    id="EndTimeAM"
                    checked={!endTimeIsPm}
                    onChange={() => setEndTimeIsPm(false)}
                  />
                  <label className="mb-0" htmlFor="EndTimeAM">
                    AM
                  </label>
                </div>
                <div className="d-flex align-items-center gap-1">
                  <input
                    type="radio"
                    name="EndTimeTOD"
                    id="EndTimePM"
                    checked={endTimeIsPm}
                    onChange={() => setEndTimeIsPm(true)}
                  />
                  <label className="mb-0" htmlFor="EndTimePM">
                    PM
                  </label>
                </div>
              </div>
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
