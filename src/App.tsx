import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/protected/Home";
import DoctorDetails from "./pages/protected/doctors/DoctorDetails";
import AllTimeSlots from "./pages/protected/doctors/AllTimeSlots";
import TimeSlotDetails from "./pages/protected/doctors/TimeSlotDetails";
import CreateTimeSlots from "./pages/protected/doctors/CreateTimeSlots";
import PatientDetails from "./pages/protected/patients/PatientDetails";
import AppointmentDetails from "./pages/protected/patients/AppointmentDetails";
import BookAppointment from "./pages/protected/patients/BookAppointment";
import SetAvailability from "./pages/protected/doctors/SetAvailability";
import ForgotPassword from "./pages/auth/ForgotPassword";
import PasswordChangeRequested from "./pages/auth/PasswordChangeRequested";
import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import AllAppointments from "./pages/protected/admin/AllAppointments";
import PatientsAppointments from "./pages/protected/patients/PatientAppointments";
import AllDoctors from "./pages/protected/admin/AllDoctors";
import AddDoctor from "./pages/protected/admin/AddDoctor";
import EditUser from "./pages/protected/admin/EditUser";

function App() {
  return (
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

            <Route
              path="/all-appointments"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AllAppointments/>
                </PrivateRoute>
              }
            />
            <Route
              path="/all-doctors"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AllDoctors/>
                </PrivateRoute>
              }
            />
            <Route
              path="/add-doctor"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AddDoctor/>
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
              path="/doctors/:id/timeSlots"
              element={<PrivateRoute allowedRoles={["Admin", "Doctor"]}>
                <AllTimeSlots/>
              </PrivateRoute>}
            />

            {/* VIEW TIME SLOT */}
            <Route
              path="/timeSlots/:id"
              element={
                <PrivateRoute allowedRoles={["Admin", "Doctor"]}>
                  <TimeSlotDetails/>
                </PrivateRoute>
              }
            />

            {/* CREATE TIMESLOTS PAGE */}
            <Route
              path="doctors/:id/timeSlots/create"
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
              path="/patients/:id/appointments"
              element={
                <PrivateRoute allowedRoles={["Admin", "Patient"]}>
                  <PatientsAppointments/>
                </PrivateRoute>
              }
            />

            {/* BOOK APPOINTMENTS PAGE */}
            <Route
              path="patients/:id/book-appointment"
              element={
                <PrivateRoute allowedRoles={["Admin", "Patient"]}>
                  <BookAppointment />
                </PrivateRoute>
              }
            />

            {/* EDIT USER */}
            <Route
              path="/users/:id/edit-user"
              element={
                <PrivateRoute allowedRoles={['Admin']}>
                  <EditUser />
                </PrivateRoute>
              }
            />

            {/* SET DOCTOR'S AVAILABILITY */}
            <Route
              path="doctors/:id/availability"
              element={
                <PrivateRoute allowedRoles={['Admin', 'Doctor']}>
                  <SetAvailability/>
                </PrivateRoute>
              }
            />
          </Route>
            
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/pw-reset-requested" element={<PasswordChangeRequested/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
  );
}

export default App;
