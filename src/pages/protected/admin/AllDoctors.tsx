import React, { useEffect, useState } from "react";
import { DoctorProfileDto, UserDto } from "../../../types/dtos";
import api from "../../../api/axios";
import DoctorsTable from "../../../components/DoctorsTable";

function AllDoctors() {
  const [doctors, setDoctors] = useState<DoctorProfileDto[]>([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
        setDoctors(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };

    fetchDoctors()
  }, []);

  return (
    <div className="container mt-5">
      <h2>All Doctors</h2>

      <DoctorsTable doctors={doctors}/>
    </div>
  );
}

export default AllDoctors;
