import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { TimeSlotDto } from "../types/dtos";
import TimeSlotTable from "../components/TimeSlotTable";
import ErrorsBox from "../components/ErrorsBox";
import Modal from "../components/Modal";
import TimeSlotCard from "../components/TimeSlotCard";
import { GetAllTimeSlotsResponse } from "../types/responses";

function AllTimeSlots() {
  const { doctorId } = useParams();
  const { user, loadingUser } = useAuth();

  const [timeSlotsData, setTimeSlotsData] =
    useState<GetAllTimeSlotsResponse | null>();
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedTS, setSelectedTS] = useState<TimeSlotDto | null>();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // API time slot pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch api data on first mount when user is fetched
  useEffect(() => {
    if (!doctorId) return;
    const fetchAllTimeSlots = async () => {
      try {
        const response = await api.get(
          `/timeslots/all/${doctorId}?pageNumber=${page}&pageSize=${pageSize}`
        );
        setTimeSlotsData(response.data as GetAllTimeSlotsResponse);
      } catch (error: any) {
        console.log(error);
        const serverMessage =
          error.response.data || error.message || "Registration failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAllTimeSlots();
  }, [user]);

  // When request prev or next page of time slots, call api w/ different parameters
  useEffect(() => {
    const fetchDifferentPage = async () => {
      try {
        const response = await api.get(
          `/timeslots/all/${doctorId}?pageNumber=${page}&pageSize=${pageSize}`
        );
        setTimeSlotsData(response.data as GetAllTimeSlotsResponse);
      } catch (error: any) {
        console.log(error);
        const serverMessage =
          error.response.data || error.message || "Registration failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDifferentPage();
  }, [page, pageSize]);

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

  if (loadingUser) return <p>Loading user...</p>;
  if (!user) return <p>User not found!</p>;
  if (loadingData) return <p>Loading time slot data...</p>;
  if (!timeSlotsData) return <p>Time slot data not found!</p>;

  const { timeSlotDtos, totalCount } = timeSlotsData;

  return (
    <div className="mt-5">
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
        deleteAction={(ts: TimeSlotDto) => {
          setSelectedTS(ts);
          setShowModal(true);
        }}
      />
    </div>
  );
}

export default AllTimeSlots;
