import { useEffect, useState } from "react";
import ErrorsBox from "../components/ErrorsBox";
import { CreateTimeSlotRequest } from "../types/requests";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../api/axios";

function CreateTimeSlots() {
  const { doctorId } = useParams();
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!startTime) {
      setEndTime("");
      return;
    }

    // Convert startTime string to Date
    const start = new Date(startTime);
    start.setHours(start.getHours() + 1);

    // Format it back to a datetime-local string
    const offset = -start.getTimezoneOffset();
    const localTime = new Date(start.getTime() + offset * 60000);
    const formattedEndTime = localTime.toISOString().slice(0, 16);

    setEndTime(formattedEndTime);
  }, [startTime]);

  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p>Loading user...</p>
  if (!user) return <p>User not found!</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Start Time:", startTime);
    // console.log("End Time:", endTime);
    setLoading(true);
    setErrors([]);

    try {
      const body: CreateTimeSlotRequest = {
        StartTime: startTime + ":00", // e.g., "2025-08-04T16:20:00"
        EndTime: endTime + ":00",
        DoctorId: user.role == "Admin" ? doctorId : undefined,
      };
      await api.post("/timeslots", body);
      navigate("/");
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
      <h2>Create New Time Slot</h2>

      <ErrorsBox errors={errors} />

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Start Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="form-control"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label>End Time</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="form-control"
            required
            disabled={loading || !startTime}
          />
        </div>
        <button className="btn btn-success" disabled={loading}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateTimeSlots;
