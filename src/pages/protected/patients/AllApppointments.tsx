import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetPatientsAppointmentsResponse } from "../../../types/responses";
import { AppointmentDto } from "../../../types/dtos";
import ErrorsBox from "../../../components/ErrorsBox";
import Modal from "../../../components/Modal";
import AppointmentBox from "../../../components/AppointmentBox";
import api from "../../../api/axios";
import AppointmentTable from "../../../components/AppointmentTable";

function AllAppointments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointmentsData, setAppointmentsData] =
    useState<GetPatientsAppointmentsResponse | null>();
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<AppointmentDto | null>();
  const [showModal, setShowModal] = useState(false);

  // API time slot pagination states
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Callback function to retrieve list of time slots
  // using page # and page size
  const fetchPageOfAllAppts = async () => {
      try {
        if (!id) return
        const response = await api.get(
          `/patients/${id}/appointments?pageNumber=${page}&pageSize=${pageSize}`
        );
        setAppointmentsData(response.data as GetPatientsAppointmentsResponse);
      } catch (error: any) {
        console.log(error);
        const serverMessage =
          error.response.data || error.message || "Fetching all time slots failed!";
        setErrors([serverMessage]);
      } finally {
        setLoadingData(false);
      }
    };

  // Fetch api data when component is mounted
  // Grabs the first 10 appointments from all 
  useEffect(() => {
    fetchPageOfAllAppts();
  }, []);

  // When request prev or next page, refetch different page of data
  useEffect(() => {
    fetchPageOfAllAppts()
  }, [page, pageSize]);

  const deleteTimeSlot = async (apptId: number) => {
    try {
      await api.delete(`/appointments/${apptId}`);
      navigate(0);
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    }
  };

  if (loadingData) return <p>Loading time slot data...</p>;
  if (!appointmentsData) return <p>Time slot data not found!</p>;

  const { appointments, totalCount } = appointmentsData;

  return (
    <div className="mt-5">
      <ErrorsBox errors={errors} />
      {showModal && selectedAppt && (
        <Modal
          title={"Delete Appointment"}
          body={<AppointmentBox appt={selectedAppt}/>}
          confirmText={"Yes, Delete It"}
          onCancel={() => setShowModal(false)}
          onConfirm={() => {
            deleteTimeSlot(selectedAppt.id);
          }}
        />
      )}

      <div className="d-flex flex-wrap mb-3">
        <h2 className="me-5">All Appointments</h2>
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

      <AppointmentTable
        appointments={appointments}
        deleteAction={(appt: AppointmentDto) => {
            setSelectedAppt(appt)
            setShowModal(true)
        }}
      />
    </div>
  );
}

export default AllAppointments;
