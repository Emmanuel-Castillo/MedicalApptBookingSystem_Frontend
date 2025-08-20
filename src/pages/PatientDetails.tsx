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

// Component accessible for Patients and Admins ONLY
function PatientDetails() {
  // FOR ADMIN: Retrieve patient id from url param
  const { id } = useParams();

  // FOR PATIENT: Retrieve user for their id ONLY IF they are a Patient
  const { user, loadingUser } = useAuth();

  const [data, setData] = useState<GetPatientInfoResponse | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<AppointmentDto | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const navigate = useNavigate();

  // Invoke useEffect ONCE user has been loaded
  useEffect(() => {
    const getPatientDetails = async () => {
      try {
        if (!user) return null;

        let patientId: string;

        // If curr user is Admin, use id URL param
        if (user.role == "Admin" && id != null) patientId = id;
        // Else, curr user must be a Patient, so use their user.id instead
        else patientId = user.id;

        const response = await api.get(`/users/patients/${patientId}`);
        setData(response.data);
      } catch (error: any) {
        const serverMessage =
          error.response.data || error.message || "Appointment booking failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingData(false);
      }
    };

    // Invoke getPatientDetails once user has been retrieved!
    if (user) getPatientDetails();
  }, [user]);

  if (loadingUser) return <p>Loading user...</p>;
  if (!user) return <p>User not found!</p>;
  if (loadingData) return <div>Loading patient details...</div>;
  if (!data) return <div>Patient details not found.</div>;

  const { patient, appointments } = data;

  const onClickDeleteAppt = (appt: AppointmentDto) => {
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

      <div className="bg-light p-3 rounded border mb-5">
        <div className="d-flex flex-wrap align-items-center mb-3">
          <h2 className="me-5">User Details</h2>
          {user.role == "Admin" && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/editUser/${patient.id}`)}
            >
              Edit User
            </button>
          )}
        </div>
        <UserDetails user={patient} />
      </div>

      <div className="col">
        <div className="d-flex flex-wrap mb-2 align-items-center mb-3">
          <h4 className="me-4">Appointments</h4>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/book/${patient.id}`)}
            >
              Create New
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/users/${patient.id}/appointments`)}
            >
              View All
            </button>
          </div>
        </div>
        <h6>Booked - This Week</h6>
        <AppointmentTable
          appointments={appointments}
          deleteAction={(appt: AppointmentDto) => onClickDeleteAppt(appt)}
        />
      </div>
    </div>
  );
}

export default PatientDetails;
