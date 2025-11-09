import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import PatientDetails from "../pages/protected/patients/PatientDetails";
import AppointmentDetails from "../pages/protected/patients/AppointmentDetails";
import PatientsAppointments from "../pages/protected/patients/PatientAppointments";
import BookAppointment from "../pages/protected/patients/BookAppointment";

function PatientRoutes() {
  return (
    <>
      {/* PATIENTS PAGE */}
      <Route
        path="/patients/:id"
        element={
          <PrivateRoute allowedRoles={["Admin", "Patient"]}>
            <PatientDetails />
          </PrivateRoute>
        }
      />
      
      {/* APPOINTMENT PAGE */}
      <Route
        path="/appointments/:id"
        element={
          <PrivateRoute allowedRoles={["Admin", "Patient"]}>
            <AppointmentDetails />
          </PrivateRoute>
        }
      />

      {/* VIEW PATIENT'S APPOINTMENTS */}
      <Route
        path="/patients/:id/appointments"
        element={
          <PrivateRoute allowedRoles={["Admin", "Patient"]}>
            <PatientsAppointments />
          </PrivateRoute>
        }
      />

      {/* BOOK APPOINTMENTS PAGE */}
      <Route
        path="/patients/book-appointment"
        element={
          <PrivateRoute allowedRoles={["Admin", "Patient"]}>
            <BookAppointment />
          </PrivateRoute>
        }
      />
    </>
  );
}

export default PatientRoutes;
