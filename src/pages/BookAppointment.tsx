import React, { useEffect, useState } from "react";
import { TimeSlotDto } from "../types/dtos";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Modal from "../components/Modal";
import ErrorsBox from "../components/ErrorsBox";
import { BookAppointmentRequest } from "../types/requests";
import { useAuth } from "../context/AuthContext";

function BookAppointment() {
  const { patientId } = useParams();
  const [timeSlots, setTimeSlots] = useState<TimeSlotDto[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>();
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loadingInModal, setLoadingInModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const response = await api.get("/timeslots/available");
        setTimeSlots(response.data);
      } catch (error: any) {
        console.log(error);
        const serverMessage =
          error.response.data || error.message || "Registration failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingTimeSlots(false);
      }
    };

    fetchAvailableTimeSlots();
  }, []);

  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p>Loading user...</p>;
  if (!user) return <p>User not found!</p>;
  if (loadingTimeSlots) return <div>Loading available time slots...</div>;

  const handleBook = async () => {
    if (!selectedSlotId) return;

    try {
      setLoadingInModal(true);
      const dto: BookAppointmentRequest = {
        TimeSlotId: selectedSlotId,
        PatientId: user.role == "Admin" ? patientId : undefined,
      };
      const response = await api.post("/appointments/book", dto);
      if (response.status == 200) {
        navigate("/");
      }
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    } finally {
      setLoadingInModal(false);
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5">
      {showModal && (
        <Modal
          onConfirm={handleBook}
          onCancel={() => setShowModal(false)}
          title={"Confirm Booking"}
          body={"Are you sure you want to book this appointment?"}
          confirmText={"Yes, Book It"}
          loading={loadingInModal}
        />
      )}

      <ErrorsBox errors={errors} />

      <h2 className="mb-4">Select an available time slot</h2>
      {timeSlots.length === 0 ? (
        <p>No available time slots.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {timeSlots.map((slot) => (
            <div className="col" key={slot.id}>
              <div
                className={`card ${
                  selectedSlotId === slot.id ? "border-primary" : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="card-body"
                  onClick={() =>
                    setSelectedSlotId((prev) =>
                      prev === slot.id ? null : slot.id
                    )
                  }
                >
                  <h5 className="card-title">{slot.doctor.fullName}</h5>
                  <p className="card-text">
                    <strong>Start:</strong>{" "}
                    {new Date(slot.startTime).toLocaleString()}
                    <br />
                    <strong>End:</strong>{" "}
                    {new Date(slot.endTime).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4 text-end">
            <button
              className="btn btn-primary"
              disabled={!selectedSlotId}
              onClick={() => setShowModal(true)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
