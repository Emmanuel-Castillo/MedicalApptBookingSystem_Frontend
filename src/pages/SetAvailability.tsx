import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DayOfWeek, DoctorAvailabilityDto } from "../types/dtos";
import api from "../api/axios";
import ErrorsBox from "../components/ErrorsBox";
import { SetDoctorAvailRequest } from "../types/requests";

const AVAILABLE_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function SetAvailability() {
  const { id } = useParams();
  const [availabilities, setAvailabilities] = useState<DoctorAvailabilityDto[]>(
    []
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>([]);
  const [startTimeHr, setStartTimeHr] = useState("");
  const [endTimeHr, setEndTimeHr] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formReady, setFormReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //   export type SetDoctorAvailRequest = {
  //     doctorId: number;
  //     daysOfWeek: DayOfWeek[];
  //     startTime: string;
  //     endTime: string;
  //     startDate: string;
  //     endDate?: string;
  //   };

  useEffect(() => {
    const getDocAvail = async () => {
      try {
        const response = await api.get(`/availability/${id}`);
        console.log(response.data);
        setAvailabilities(response.data);
      } catch (error: any) {
        const serverMessage =
          error.response.data || error.message || "Appointment booking failed!";
        setErrors([serverMessage]);
      }
    };

    getDocAvail();
  }, []);

  useEffect(() => {
    if (daysOfWeek && startTimeHr && endTimeHr && startDate) setFormReady(true);
    else setFormReady(false);
  }, [daysOfWeek, startTimeHr, endTimeHr, startDate]);

  const toggleDayinDaysOfWeek = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const { value, checked } = e.currentTarget;
    if (!checked) {
      setDaysOfWeek((prev) =>
        prev.filter((day) => day !== (value as unknown as DayOfWeek))
      );
    } else {
      setDaysOfWeek((prev) => [...prev, value as unknown as DayOfWeek]);
    }
  };

  const onFormSubmit = async () => {
    try {
      setErrors([]);
      setLoading(true);

      // Validate request arguments
      if (endTimeHr < startTimeHr) {
        throw Error("End time is set before start time!");
      }

      if (Number(endTimeHr) - Number(startTimeHr) < 1) {
        throw Error(
          "End time should be at least an hour after the start time!"
        );
      }

      if (endDate && endDate < startDate) {
        throw Error("End date is set before start date!");
      }

      const docAvailRequest: SetDoctorAvailRequest = {
        doctorId: id!!,
        daysOfWeek: daysOfWeek,
        startTime: startTimeHr,
        endTime: endTimeHr,
        startDate: startDate,
        endDate: endDate,
      };

      console.log(docAvailRequest);
      await api.post("/availability", docAvailRequest);
      navigate(-1);
    } catch (error: any) {
      const message = error.message || "Invalid inputs!";
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 d-flex flex-column gap-3">
      <ErrorsBox errors={errors} />

      <div className="d-flex flex-column gap-3 bg-light p-3 rounded border">
        <h3>Current Availability</h3>
        {availabilities.length === 0 ? (
          <p>No availability set.</p>
        ) : (
          availabilities.map((a) => (
            <div className="card">
              <div className="card-body">
                <p>{a.id}</p>
                <p>{a.dayOfWeek}</p>
                <p>{a.startTime}</p>
                <p>{a.endTime}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="d-flex flex-column gap-3 bg-light p-3 rounded border">
        <h2>Set New Availability (currently in development)</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // onFormSubmit();
          }}
          className="d-flex flex-column gap-1"
        >
          <div className="d-flex flex-wrap gap-3">
            <div className="d-flex gap-1">
              <label>Monday</label>
              <input
                type="checkbox"
                value={DayOfWeek.MONDAY}
                onClick={(e) => toggleDayinDaysOfWeek(e)}
                disabled={loading}
              />
            </div>
            <div className="d-flex  gap-1">
              <label>Tuesday</label>
              <input
                type="checkbox"
                value={DayOfWeek.TUESDAY}
                onClick={(e) => toggleDayinDaysOfWeek(e)}
                disabled={loading}
              />
            </div>
            <div className="d-flex gap-1">
              <label>Wednesday</label>
              <input
                type="checkbox"
                value={DayOfWeek.WEDNESDAY}
                onClick={(e) => toggleDayinDaysOfWeek(e)}
                disabled={loading}
              />
            </div>
            <div className="d-flex gap-1">
              <label>Thursday</label>
              <input
                type="checkbox"
                value={DayOfWeek.THURSDAY}
                onClick={(e) => toggleDayinDaysOfWeek(e)}
                disabled={loading}
              />
            </div>
            <div className="d-flex gap-1">
              <label>Friday</label>
              <input
                type="checkbox"
                value={DayOfWeek.FRIDAY}
                onClick={(e) => toggleDayinDaysOfWeek(e)}
                disabled={loading}
              />
            </div>
          </div>

          <label>Start Time</label>
          <div className="d-flex gap-2 align-items-center">
            <select onSelect={(e) => setStartTimeHr(e.currentTarget.value)}>
              {AVAILABLE_HOURS.map((hr) => (
                <option value={hr}>{hr}</option>
              ))}
            </select>
            <label>:00</label>
            <label htmlFor="StartTimeAM" defaultChecked>AM</label>
            <input type="radio" name="StartTimeTOD" id="StartTimeAM" />
            <label htmlFor="StartTimePM">PM</label>
            <input type="radio" name="StartTimeTOD" id="StartTimePM" />
          </div>

          <label>End Time</label>
          <div className="d-flex gap-2 align-items-center">
            <select onSelect={(e) => setEndTimeHr(e.currentTarget.value)}>
              {AVAILABLE_HOURS.map((hr) => (
                <option value={hr}>{hr}</option>
              ))}
            </select>
            <label>:00</label>
            <label htmlFor="EndTimeAM" defaultChecked>AM</label>
            <input type="radio" name="EndTimeTOD" id="EndTimeAM" />
            <label htmlFor="EndTimePM">PM</label>
            <input type="radio" name="EndTimeTOD" id="EndTimePM" />
          </div>

          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
            
          />
          <label>End Date (optional)</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />

          <button
            type="submit"
            className="btn btn-primary"
            // disabled={!formReady || loading}
              disabled
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
