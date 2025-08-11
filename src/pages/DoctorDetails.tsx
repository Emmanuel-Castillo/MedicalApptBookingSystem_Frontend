import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import {
  GetDoctorInfoResponse,
  GetPatientInfoResponse,
} from "../types/responses";
import UserDetails from "../components/UserDetails";
import { useAuth } from "../context/AuthContext";

// Component accessible for Doctors and Admins ONLY
function DoctorDetails() {
  // ADMIN ONLY: Retrieve id from URL params
  const { id } = useParams();

  // DOCTOR ONLY: Retrieve user to see if Doctor. If so, use user.id for data retrieval
  const { user, loadingUser } = useAuth();

  console.log(loadingUser, user)

  const [data, setData] = useState<GetDoctorInfoResponse | null>(null);
  const [loadingData, setLoadingData] = useState(true);
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
      } catch (error) {
        console.error("Failed to fetch user details:", error);
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

  const { doctor, timeSlots } = data;

  return (
    <div>
      <h2>User Details</h2>
      <UserDetails user={doctor} />

      <div className="gap-3 mb-3">
        <h4>Time Slots</h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/timeslots/${doctor.id}`)}
        >
          Create New
        </button>
      </div>

      {timeSlots.length == 0 ? (
        <div className="bg-light p-3 rounded mb-4 border">
          <p>No time slots found.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Booked?</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((ts, idx) => (
                <tr key={ts.id}>
                  <td>{idx + 1}</td>
                  <td>{new Date(ts.startTime).toLocaleString()}</td>
                  <td>{new Date(ts.endTime).toLocaleString()}</td>
                  <td>{ts.isBooked ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorDetails;
