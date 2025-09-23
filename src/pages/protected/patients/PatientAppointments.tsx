import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetPatientsAppointmentsResponse } from "../../../types/responses";
import ErrorsBox from "../../../components/ErrorsBox";
import api from "../../../api/axios";
import AppointmentTable from "../../../components/AppointmentTable";

function PatientsAppointments() {
  const { id } = useParams();

  const [appointmentsData, setAppointmentsData] =
    useState<GetPatientsAppointmentsResponse | null>();
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

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

  if (loadingData) return <p>Loading time slot data...</p>;
  if (!appointmentsData) return <p>Time slot data not found!</p>;

  const { appointments, totalCount } = appointmentsData;

  return (
    <div className="container mt-5">
      <ErrorsBox errors={errors} />

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
      />
    </div>
  );
}

export default PatientsAppointments;
