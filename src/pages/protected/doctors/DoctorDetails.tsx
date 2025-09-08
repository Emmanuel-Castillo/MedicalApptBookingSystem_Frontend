import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { GetDoctorInfoResponse } from "../../../types/responses";
import { TimeSlotDto } from "../../../types/dtos";
import api from "../../../api/axios";
import Modal from "../../../components/Modal";
import TimeSlotCard from "../../../components/TimeSlotCard";
import ErrorsBox from "../../../components/ErrorsBox";
import UserDetails from "../../../components/PatientProfileDetails";
import TimeSlotTable from "../../../components/TimeSlotTable";
import DoctorProfileDetails from "../../../components/DoctorProfileDetails";

// Component accessible for Doctors and Admins ONLY
function DoctorDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctorInfo, setDoctorInfo] = useState<GetDoctorInfoResponse | null>(null);
  const [loadingDoctorInfo, setLoadingDoctorInfo] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedTS, setSelectedTS] = useState<TimeSlotDto | null>();
  const [errors, setErrors] = useState<string[]>([])

  // Fetch doctor's information once user has been loaded
  // getDoctorDetails requires user to not be null, and to check the user's role and id
  useEffect(() => {
    const getDoctorDetails = async () => {
      try {
        let doctorId: string;

        // If admin, assign URL id param to doctorId
        if (user!.role == "Admin" && id != null) doctorId = id;
        // Else, assign the curr user id to doctorId
        else doctorId = user!.id;

        const response = await api.get(`/doctors/${doctorId}`);
        setDoctorInfo(response.data as GetDoctorInfoResponse);
      } catch (error: any) {
        console.error("Failed to fetch user details:", error);
        const serverMessage =
        error.response.data || error.message || "Fetching doctor's data failed!";
      setErrors([serverMessage]);
      } finally {
        setLoadingDoctorInfo(false);
      }
    };

    getDoctorDetails();
  }, []);

  if (loadingDoctorInfo) return <div>Loading doctor details...</div>;
  if (!doctorInfo) return <div>Doctor details not found!</div>;

  // Callback function to delete time slot
  // Refreshes page once it's done
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

  const { doctorProfile, bookedTimeSlotsNextTwoWeeks } = doctorInfo;
  const { user: doctor } = doctorProfile

  return (
    <div className="container mt-4">
      {showModal && selectedTS && (
        <Modal
          title={"Delete Time Slot"}
          body={<TimeSlotCard timeSlot={selectedTS}/>}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {deleteTimeSlot(selectedTS.id)}}
        />
      )}

      <ErrorsBox errors={errors}/>

      <DoctorProfileDetails profile={doctorProfile} allowNavigation={user!.role === "Admin"}/>

      <div className="col">
        <div className="d-flex flex-wrap mb-2 align-items-center mb-3">
          <h4 className="me-4">Time Slots</h4>
          <div className="d-flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/doctors/${doctor.id}/timeSlots`)}
            >
              View All
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/doctors/${doctor.id}/timeSlots/create`)}
            >
              Create New
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/doctors/${doctor.id}/availability`)}
            >
              Set Availability
            </button>
          </div>
        </div>
        <h6>Booked - Next Two Weeks</h6>
        <TimeSlotTable timeSlots={bookedTimeSlotsNextTwoWeeks} />
      </div>
    </div>
  );
}

export default DoctorDetails;
