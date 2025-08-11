import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import DoctorDetails from "./DoctorDetails";
import PatientDetails from "./PatientDetails";
import { Navigate } from "react-router-dom";

function Home() {
  const { user, loadingUser } = useAuth();

  if (loadingUser) return <p>Loading user...</p>
  if (!user) return <Navigate to={"/login"}/>

  switch (user.role) {
    case "Admin":
      return <AdminDashboard />;
    case "Doctor":
      return <DoctorDetails />;
    case "Patient":
      return <PatientDetails />;
  }
}

export default Home;
