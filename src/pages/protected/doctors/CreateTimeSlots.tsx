import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { CreateTimeSlotRequest } from "../../../types/requests";
import api from "../../../api/axios";
import ErrorsBox from "../../../components/ErrorsBox";
import { formatTime, OPEN_HOURS } from "../../../utils/FormatDateAndTime";
import { useAuthStore } from "../../../store/auth.store";

function CreateTimeSlots() {
  const { id: doctorId } = useParams();

  const [date, setDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [formReady, setFormReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  const changeTimes = (value: string) => {
    const idx = OPEN_HOURS.indexOf(value)
    if (idx === -1) return

    setStartTime(value)
    setEndTime(OPEN_HOURS[idx + 1])
  }

  useEffect(() => {console.log("startTime", startTime, "endTime", endTime)}, [startTime, endTime])

  // Set formReady if all inputs are not null
  useEffect(() => {
    setFormReady(date && startTime && endTime ? true : false);
  }, [date, startTime, endTime]);

  // Send CreateTimeSlotRequest Dto to backend
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrors([]);
      if (!doctorId) throw Error("Doctor Id is not passed through URL params!")

      const body: CreateTimeSlotRequest = {
        Date: date,
        StartTime: startTime + ":00", // e.g., "16:00:00"
        EndTime: endTime + ":00",
        DoctorId: doctorId,
      };

      console.log(body);
      await api.post("/timeslots", body);
      navigate(-1);
    } catch (error: any) {
      console.log(error);
      const serverMessage =
        error.response.data || error.message || "Time slot creation failed!";
      setErrors([serverMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="mx-auto col-12 col-sm-10 col-md-8 col-lg-6 col-xl-6">
        <h2>Create New Time Slot</h2>

        <ErrorsBox errors={errors} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            formReady && handleSubmit();
          }}
          className="d-flex flex-column gap-3 "
        >
          <div>
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label>Start Time</label>
            <select
              value={startTime}
              onChange={(e) => changeTimes(e.target.value)}
              className="form-control"
              required
              disabled={loading}
            >
              <option value="">Select a time</option>
              {OPEN_HOURS.map((hr, index) => 
                {if (index < OPEN_HOURS.length - 1) return <option value={hr}>{formatTime(hr)}</option>}
              )}
            </select>
          </div>

          <div>
            <label>End Time</label>
            <select
              value={endTime}
              className="form-control"
              required
              disabled={true}
            >
              <option value="">Select a time</option>
              {OPEN_HOURS.filter((hr) => hr > startTime).map((hr) => (
                <option value={hr}>{formatTime(hr)}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-success" disabled={!formReady || loading}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTimeSlots;
