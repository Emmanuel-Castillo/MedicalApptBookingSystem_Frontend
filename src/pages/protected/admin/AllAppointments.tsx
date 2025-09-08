import React, { useEffect, useState } from "react";
import { AppointmentDto } from "../../../types/dtos";
import api from "../../../api/axios";
import { GetAllAppointmentsResponse } from "../../../types/responses";
import AppointmentTable from "../../../components/AppointmentTable";
import Paginator from "../../../components/Paginator";
import { useNavigate } from "react-router-dom";
import ErrorsBox from "../../../components/ErrorsBox";

function AllAppointments() {
  const [loadingData, setLoadingData] = useState(true)
  const [appointmentsData, setAppointmentsData] =
    useState<GetAllAppointmentsResponse | null>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [errors, setErrors] = useState<string[]>([])

  const fetchAppointments = async () => {
    try {
      const response = await api.get(
        `/appointments?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      console.log(response);
      setAppointmentsData(response.data);
    } catch (error: any) {
      const serverMessage =
        error.response.data || error.message || "Appointment booking failed!";
      setErrors([serverMessage]);
    } finally {
      setLoadingData(false)
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [pageNumber, pageSize]);

  if (loadingData) return <div>Loading data...</div>;
  if (!appointmentsData) return <div>No appointment data found!</div>

  const { listAppointmentDto, totalCount } = appointmentsData;

  return (
    <div className="container mt-4">
      <ErrorsBox errors={errors}/>

      <div className="mb-3">
        <h2>All Appointments</h2>
        <Paginator
          page={pageNumber}
          pageSize={pageSize}
          setPage={setPageNumber}
          totalCount={totalCount}
        />
      </div>

      <AppointmentTable
        appointments={listAppointmentDto}
        includePatient
      />
    </div>
  );
}

export default AllAppointments;
