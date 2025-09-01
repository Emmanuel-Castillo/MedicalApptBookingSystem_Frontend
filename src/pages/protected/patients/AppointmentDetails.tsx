import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { AppointmentDto } from "../../../types/dtos";
import api from "../../../api/axios";
import ErrorsBox from "../../../components/ErrorsBox";
import AppointmentBox from "../../../components/AppointmentBox";

function AppointmentDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [appointmentData, setAppointmentData] = useState<AppointmentDto | null>(
    null
  );
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchApptData = async () => {
      try {
        const response = await api.get(`/appointments/${id}`);
        setAppointmentData(response.data as AppointmentDto);
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

  if (!user) return <p>User not found!</p>;
  if (loadingData) return <p>Loading appointment data...</p>;
  if (!appointmentData) return <p>Appointment data not found!</p>;

  return (
    <div className="container mt-5">
      <ErrorsBox errors={errors} />

      <AppointmentBox appt={appointmentData} showNotes={true}/>
    </div>
  );
}

export default AppointmentDetails;
