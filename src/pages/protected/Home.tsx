import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import DoctorDetails from "./doctors/DoctorDetails";
import PatientDetails from "./patients/PatientDetails";
import AdminDashboard from "./admin/AdminDashboard";

function Home() {
  const { user } = useAuth();

  switch (user!.role) {
    case "Admin":
      return <AdminDashboard />;
    case "Doctor":
      return <DoctorDetails />;
    case "Patient":
      return <PatientDetails />;
  }
}

export default Home;
