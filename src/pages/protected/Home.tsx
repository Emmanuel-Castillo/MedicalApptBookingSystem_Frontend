import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DoctorDetails from "./doctors/DoctorDetails";
import PatientDetails from "./patients/PatientDetails";
import AdminDashboard from "./admin/AdminDashboard";
import { useAuthStore } from "../../store/auth.store";

function Home() {
  const { user } = useAuthStore();

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
