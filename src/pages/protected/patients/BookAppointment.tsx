import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { GetAvailableTimeSlotsResponse } from "../../../types/responses";
import { TimeSlotDto } from "../../../types/dtos";
import api from "../../../api/axios";
import { BookAppointmentRequest } from "../../../types/requests";
import Modal from "../../../components/Modal";
import TimeSlotCard from "../../../components/TimeSlotCard";
import ErrorsBox from "../../../components/ErrorsBox";
import TimeSlotTable from "../../../components/TimeSlotTable";

function BookAppointment() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [availableTSData, setAvailableTSData] =
    useState<GetAvailableTimeSlotsResponse | null>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotDto | null>();
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [loadingInModal, setLoadingInModal] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // API time slot pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // API call
  const fetchAvailableTimeSlots = async () => {
    try {
      const response = await api.get(`/timeslots/available?pageNumber=${page}&pageSize=${pageSize}`);
      setAvailableTSData(response.data as GetAvailableTimeSlotsResponse);
    } catch (error: any) {
      console.log(error);
      const serverMessage =
        error.response.data || error.message || "Registration failed!";
      setErrors([serverMessage]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  useEffect(() => {
    fetchAvailableTimeSlots();
  }, []);

  useEffect(() => {
    fetchAvailableTimeSlots()
  }, [page, pageSize])

  if (loadingTimeSlots) return <div>Loading available time slots...</div>;
  if (!availableTSData) return <div>Available time slot data not found!</div>;
  const { availableTimeSlotDtos, totalCount } = availableTSData;

  const selectTSRow = (ts: TimeSlotDto) => {
    setSelectedSlot(ts);
  };

  const handleBook = async (selectedSlotId: number) => {
    try {
      setLoadingInModal(true);
      const dto: BookAppointmentRequest = {
        TimeSlotId: selectedSlotId,
        PatientId: user!.role == "Admin" ? id : undefined,
      };
      const response = await api.post("/appointments", dto);
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
      {showModal && selectedSlot && (
        <Modal
          onConfirm={() => {
            // handleBook(selectedSlot.id)
          } }
          onCancel={() => setShowModal(false)}
          title={"Confirm Booking"}
          body={<TimeSlotCard timeSlot={selectedSlot}/>}
          confirmText={"Yes, Book It"}
          loading={loadingInModal}
        />
      )}

      <ErrorsBox errors={errors} />

      <div className="d-flex flex-wrap mb-3">
        <h2 className="me-5">Select an available time slot</h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={page * pageSize >= totalCount}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <TimeSlotTable
        timeSlots={availableTimeSlotDtos}
        patientUse={true}
        selectAction={selectTSRow}
      />
      <div className="mt-4 text-end">
        <button
          className="btn btn-primary"
          disabled={!selectedSlot}
          onClick={() => setShowModal(true)}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default BookAppointment;
