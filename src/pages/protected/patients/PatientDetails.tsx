import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { GetPatientInfoResponse } from "../../../types/responses";
import { AppointmentDto } from "../../../types/dtos";
import api from "../../../api/axios";
import ErrorsBox from "../../../components/ErrorsBox";
import UserDetails from "../../../components/PatientProfileDetails";
import AppointmentTable from "../../../components/AppointmentTable";
import Modal from "../../../components/Modal";
import AppointmentBox from "../../../components/AppointmentBox";
import PatientProfileDetails from "../../../components/PatientProfileDetails";

// Component accessible for Patients and Admins ONLY
function PatientDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patientInfo, setPatientInfo] = useState<GetPatientInfoResponse | null>(null);
  const [loadingPatientInfo, setLoadingPatientInfo] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  // Invoke useEffect components mounts
  useEffect(() => {
    const getPatientDetails = async () => {
      try {
        let patientId: string;

        // If curr user is Admin, use id URL param
        if (user!.role == "Admin" && id != null) patientId = id;
        // Else, curr user must be a Patient, so use their user.id instead
        else patientId = user!.id;

        const response = await api.get(`/patients/${patientId}`);
        setPatientInfo(response.data);
      } catch (error: any) {
        const serverMessage =
          error.response.data || error.message || "Appointment booking failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingPatientInfo(false);
      }
    };

    getPatientDetails();
  }, []);

  if (loadingPatientInfo) return <div>Loading patient details...</div>;
  if (!patientInfo) return <div>Patient details not found.</div>;

  const { patientProfile, appointmentsThisWeek } = patientInfo;
  const { user: patient } = patientProfile

  return (
    <div className="container mt-5 d-flex flex-column gap-3">
      <ErrorsBox errors={errors}/>

      <PatientProfileDetails profile={patientProfile} allowNavigation={user!.role === "Admin"}/>

      <div className="col">
        <div className="d-flex flex-wrap mb-2 align-items-center mb-3">
          <h4 className="me-4">Appointments</h4>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/patients/${patient.id}/book-appointment`)}
            >
              Create New
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/patients/${patient.id}/appointments`)}
            >
              View All
            </button>
          </div>
        </div>
        <h6>Booked - This Week</h6>
        <AppointmentTable
          appointments={appointmentsThisWeek}
        />
      </div>
    </div>
  );
}

export default PatientDetails;
