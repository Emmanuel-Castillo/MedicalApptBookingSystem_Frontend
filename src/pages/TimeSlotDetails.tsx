import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { TimeSlotDto } from "../types/dtos";
import api from "../api/axios";
import ErrorsBox from "../components/ErrorsBox";
import TimeSlotCard from "../components/TimeSlotCard";
import { GetTimeSlotResponse } from "../types/responses";
import AppointmentBox from "../components/AppointmentBox";

function TimeSlotDetails() {
  const { timeSlotId } = useParams();
  const { user, loadingUser } = useAuth();

  const [timeSlotData, setTimeSlotData] = useState<GetTimeSlotResponse | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchApptData = async () => {
      try {
        const response = await api.get(`/timeslots/${timeSlotId}`);
        setTimeSlotData(response.data as GetTimeSlotResponse);
      } catch (error: any) {
        console.log(error);
        const serverMessage =
          error.response.data || error.message || "Registration failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchApptData();
  }, [user]);

  if (loadingUser) return <p>Loading user...</p>;
  if (!user) return <p>User not found!</p>;
  if (loadingData) return <p>Loading time slot data...</p>;
  if (!timeSlotData) return <p>Time slot data not found!</p>;

  const { timeSlot, appointment } = timeSlotData;

  return (
    <div className="d-flex flex-column mt-5 gap-5">
      <ErrorsBox errors={errors} />

      <TimeSlotCard timeSlot={timeSlot} />

      {appointment && <AppointmentBox appt={appointment} showNotes title="Booked Appointment"/>}
    </div>
  );
}

export default TimeSlotDetails;
