import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { GetPatientInfoResponse } from "../types/responses";
import UserDetails from "../components/UserDetails";
import { useAuth } from "../context/AuthContext";
import { AppointmentDto } from "../types/dtos";
import Modal from "../components/Modal";
import AppointmentBox from "../components/AppointmentBox";
import AppointmentTable from "../components/AppointmentTable";
import ErrorsBox from "../components/ErrorsBox";

// Component accessible for Patients and Admins ONLY
function PatientDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patientInfo, setPatientInfo] = useState<GetPatientInfoResponse | null>(null);
  const [loadingPatientInfo, setLoadingPatientInfo] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<AppointmentDto | null>(null);
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

  const { patient: Patient, appointmentsThisWeek: AppointmentsThisWeek } = patientInfo;

  const onClickDeleteBtn = (appt: AppointmentDto) => {
    setSelectedAppt(appt);
    setShowModal(true);
  };

  const confirmDeleteApptInModal = async (appt: AppointmentDto) => {
    try {
      await api.delete(`appointments/${appt.id}`);
      navigate(0);
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    }
  };

  return (
    <div className="d-flex flex-column gap-3">
      {showModal && selectedAppt && (
        <Modal
          title={"Delete Appointment"}
          body={<AppointmentBox appt={selectedAppt} />}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={() => confirmDeleteApptInModal(selectedAppt)}
        />
      )}

      <ErrorsBox errors={errors}/>

      <div className="bg-light p-3 rounded border mb-5">
        <div className="d-flex flex-wrap align-items-center mb-3">
          <h2 className="me-5">User Details</h2>
          {user!.role == "Admin" && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/users/${Patient.id}/edit-user`)}
            >
              Edit User
            </button>
          )}
        </div>
        <UserDetails user={Patient} />
      </div>

      <div className="col">
        <div className="d-flex flex-wrap mb-2 align-items-center mb-3">
          <h4 className="me-4">Appointments</h4>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/patients/${Patient.id}/book-appointment`)}
            >
              Create New
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/patients/${Patient.id}/appointments`)}
            >
              View All
            </button>
          </div>
        </div>
        <h6>Booked - This Week</h6>
        <AppointmentTable
          appointments={AppointmentsThisWeek}
          deleteAction={(appt: AppointmentDto) => onClickDeleteBtn(appt)}
        />
      </div>
    </div>
  );
}

export default PatientDetails;
