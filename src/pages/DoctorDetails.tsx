import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import {
  GetDoctorInfoResponse,
} from "../types/responses";
import UserDetails from "../components/UserDetails";
import { useAuth } from "../context/AuthContext";
import TimeSlotTable from "../components/TimeSlotTable";
import Modal from "../components/Modal";
import { TimeSlotDto } from "../types/dtos";
import TimeSlotCard from "../components/TimeSlotCard";

// Component accessible for Doctors and Admins ONLY
function DoctorDetails() {
  const { id } = useParams();
  const { user, loadingUser } = useAuth();

  const [data, setData] = useState<GetDoctorInfoResponse | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTS, setSelectedTS] = useState<TimeSlotDto | null>();
  const [errors, setErrors] = useState<string[]>([])
  const navigate = useNavigate();

  // Fetch doctor's information once user has been loaded
  useEffect(() => {
    const getDoctorDetails = async () => {
      try {
        if (!user) return null;

        let doctorId: string;

        // If admin, assign URL id param to doctorId
        if (user.role == "Admin" && id != null) doctorId = id;
        // Else, assign the curr user id to doctorId
        else doctorId = user.id;

        const response = await api.get(`/users/doctors/${doctorId}`);
        setData(response.data);
      } catch (error: any) {
        console.error("Failed to fetch user details:", error);
        const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
      } finally {
        setLoadingData(false);
      }
    };

    if (user) getDoctorDetails();
  }, [user]);

  if (loadingUser) return <p>Loading user...</p>;
  if (!user) return <p>User not found!</p>;
  if (loadingData) return <div>Loading doctor details...</div>;
  if (!data) return <div>Doctor details not found!</div>;

  const deleteTimeSlot = async (timeSlotId: number) => {
    try {
      await api.delete(`/timeslots/${timeSlotId}`)
      navigate(0)
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    }
  }

  const { doctor, timeSlots } = data;

  return (
    <div className="d-flex flex-column gap-3">
      {showModal && selectedTS && (
        <Modal
          title={"Delete Time Slot"}
          body={<TimeSlotCard timeSlot={selectedTS}/>}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {deleteTimeSlot(selectedTS.id)}}
        />
      )}

      <div className="bg-light p-3 rounded border mb-5">
        <div className="d-flex flex-wrap align-items-center mb-3">
          <h2 className="me-5">User Details</h2>
          {user.role == "Admin" && (
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/editUser/${doctor.id}`)}
            >
              Edit User
            </button>
          )}
        </div>

        <UserDetails user={doctor} />
      </div>

      <div className="col">
        <div className="d-flex flex-wrap mb-2 align-items-center mb-3">
          <h4 className="me-4">Time Slots</h4>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/timeSlots/all/${doctor.id}`)}
            >
              View All
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/timeslots/create/${doctor.id}`)}
            >
              Create New
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/availability/${doctor.id}`)}
            >
              Set Availability
            </button>
          </div>
        </div>
        <h6>Booked - Upcoming</h6>
        <TimeSlotTable timeSlots={timeSlots.filter((ts) => ts.isBooked)} />
      </div>

      <div className="col">
        <h6>All - This Week</h6>
        <TimeSlotTable
          timeSlots={timeSlots}
          deleteAction={(ts: TimeSlotDto) => {
            setShowModal(true);
            setSelectedTS(ts);
          }}
        />
      </div>
    </div>
  );
}

export default DoctorDetails;
