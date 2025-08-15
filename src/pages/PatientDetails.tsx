import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { GetPatientInfoResponse } from "../types/responses";
import UserDetails from "../components/UserDetails";
import { useAuth } from "../context/AuthContext";
import { AppointmentDto } from "../types/dtos";
import Modal from "../components/Modal";
import AppointmentBox from "../components/AppointmentBox";

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
      } catch (error) {
        console.error("Failed to fetch user details:", error);
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

  const confirmDeleteApptInModal = () => {
    console.log(selectedAppt);
  };

  return (
    <div className="d-flex flex-column gap-3">
      {showModal && selectedAppt && (
        <Modal
          title={"Delete Appointment"}
          body={<AppointmentBox appt={selectedAppt} />}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={confirmDeleteApptInModal}
        />
      )}

      <div className="gap-1 bg-light p-3 rounded-3">
        <div className="d-flex gap-2">
          <h2>User Details</h2>
          {user.role == "Admin" && (
            <button
              className="btn btn-primary mb-3"
              onClick={() => navigate(`/editUser/${patient.id}`)}
            >
              Edit User
            </button>
          )}
        </div>
        <UserDetails user={patient} />
      </div>

      <div className="d-flex gap-2">
        <h4>Appointments</h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/book/${patient.id}`)}
        >
          Create New
        </button>
      </div>

      {appointments.length == 0 ? (
        <div className="bg-light p-3 rounded mb-4 border">
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt, idx) => (
                <tr key={appt.id}>
                  <td>{idx + 1}</td>
                  <td>{appt.timeSlot.doctor.fullName}</td>
                  <td>{new Date(appt.timeSlot.startTime).toLocaleString()}</td>
                  <td>{new Date(appt.timeSlot.endTime).toLocaleString()}</td>
                  <td className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/appointments/${appt.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => onClickDeleteAppt(appt)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;
