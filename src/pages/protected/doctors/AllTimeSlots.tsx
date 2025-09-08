import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetDoctorsTimeSlotsResponse } from "../../../types/responses";
import { TimeSlotDto } from "../../../types/dtos";
import api from "../../../api/axios";
import ErrorsBox from "../../../components/ErrorsBox";
import Modal from "../../../components/Modal";
import TimeSlotCard from "../../../components/TimeSlotCard";
import TimeSlotTable from "../../../components/TimeSlotTable";

function AllTimeSlots() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [timeSlotData, setTimeSlotData] =
    useState<GetDoctorsTimeSlotsResponse | null>();
  const [loadingTimeSlotData, setLoadingTimeSlotData] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedTS, setSelectedTS] = useState<TimeSlotDto | null>();
  const [showModal, setShowModal] = useState(false);

  // API time slot pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Callback function to retrieve list of time slots
  // using page # and page size
  const fetchPageOfAllTimeSlots = async () => {
    try {
      const response = await api.get(
        `doctors/${id}/timeslots?pageNumber=${page}&pageSize=${pageSize}`
      );
      setTimeSlotData(response.data);
    } catch (error: any) {
      const serverMessage =
        error.response.data ||
        error.message ||
        "Fetching all time slots failed!";
      setErrors([serverMessage]);
    } finally {
      setLoadingTimeSlotData(false);
    }
  };

  // Fetch api data when component is mounted
  // Grabs the first 10 time slots from all
  useEffect(() => {
    fetchPageOfAllTimeSlots();
  }, []);

  // When request prev or next page of time slots, fetch time slots using same function
  useEffect(() => {
    fetchPageOfAllTimeSlots();
  }, [page, pageSize]);

  // Send request to backend to delete timeslot w/ id given
  const deleteTimeSlot = async (timeSlotId: number) => {
    try {
      await api.delete(`/timeslots/${timeSlotId}`);
      navigate(0);
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    }
  };

  if (loadingTimeSlotData) return <p>Loading time slot data...</p>;
  if (!timeSlotData)
    return (
      <>
        <ErrorsBox errors={errors} />
        <p>Time slot data not found!</p>
      </>
    );

  const { timeSlotDtos, totalCount } = timeSlotData;

  return (
    <div className="container mt-5">
      <ErrorsBox errors={errors} />
      {showModal && selectedTS && (
        <Modal
          title={"Delete Time Slot"}
          body={<TimeSlotCard timeSlot={selectedTS} />}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            deleteTimeSlot(selectedTS.id);
          }}
        />
      )}

      <div className="d-flex flex-wrap mb-3">
        <h2 className="me-5">All Time Slots</h2>
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
        timeSlots={timeSlotDtos}
      />
    </div>
  );
}

export default AllTimeSlots;
