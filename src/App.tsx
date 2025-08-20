import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import PatientDetails from "./pages/PatientDetails";
import BookAppointment from "./pages/BookAppointment";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorDetails from "./pages/DoctorDetails";
import CreateTimeSlots from "./pages/CreateTimeSlots";
import Home from "./pages/Home";
import AppointmentDetails from "./pages/AppointmentDetails";
import EditUser from "./pages/EditUser";
import SetAvailability from "./pages/SetAvailability";
import TimeSlotDetails from "./pages/TimeSlotDetails";
import AllTimeSlots from "./pages/AllTimeSlots";
import AllAppointments from "./pages/AllApppointments";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* NAVBAR ACCROSS ALL AUTHORIZED PAGES */}
          <Route element={<ProtectedLayout />}>
            {/* HOME */}
            <Route
              path="/"
              element={
                <PrivateRoute allowedRoles={["Admin", "Doctor", "Patient"]}>
                  <Home />
                </PrivateRoute>
              }
            />
            {/* DOCTORS PAGE */}
            <Route
              path="/doctors/:id"
              element={
                <PrivateRoute allowedRoles={["Admin", "Doctor"]}>
                  <DoctorDetails />
                </PrivateRoute>
              }
            />

            {/* VIEW ALL TIME SLOTS */}
            <Route
              path="/timeSlots/all/:doctorId"
              element={<PrivateRoute allowedRoles={["Admin", "Doctor"]}>
                <AllTimeSlots/>
              </PrivateRoute>}
            />

            {/* VIEW TIME SLOT */}
            <Route
              path="/timeSlots/:timeSlotId"
              element={
                <PrivateRoute allowedRoles={["Admin", "Doctor"]}>
                  <TimeSlotDetails/>
                </PrivateRoute>
              }
            />

            {/* CREATE TIMESLOTS PAGE */}
            <Route
              path="/timeSlots/create/:doctorId"
              element={
                <PrivateRoute allowedRoles={["Admin", "Doctor"]}>
                  <CreateTimeSlots />
                </PrivateRoute>
              }
            />

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
              path="/users/:patientId/appointments"
              element={
                <PrivateRoute allowedRoles={["Admin", "Patient"]}>
                  <AllAppointments/>
                </PrivateRoute>
              }
            />

            {/* BOOK APPOINTMENTS PAGE */}
            <Route
              path="/book/:patientId"
              element={
                <PrivateRoute allowedRoles={["Admin", "Patient"]}>
                  <BookAppointment />
                </PrivateRoute>
              }
            />

            {/* EDIT USER */}
            <Route
              path="/editUser/:userId"
              element={
                <PrivateRoute allowedRoles={['Admin']}>
                  <EditUser />
                </PrivateRoute>
              }
            />

            {/* SET DOCTOR'S AVAILABILITY */}
            <Route
              path="/availability/:id"
              element={
                <PrivateRoute allowedRoles={['Admin', 'Doctor']}>
                  <SetAvailability/>
                </PrivateRoute>
              }
            />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
