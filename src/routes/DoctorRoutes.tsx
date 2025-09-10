import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import DoctorDetails from "../pages/protected/doctors/DoctorDetails";
import AllTimeSlots from "../pages/protected/doctors/AllTimeSlots";
import TimeSlotDetails from "../pages/protected/doctors/TimeSlotDetails";
import CreateTimeSlots from "../pages/protected/doctors/CreateTimeSlots";
import SetAvailability from "../pages/protected/doctors/SetAvailability";

function DoctorRoutes() {
  return (
    <>
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
        element={
          <PrivateRoute allowedRoles={["Admin", "Doctor"]}>
            <AllTimeSlots />
          </PrivateRoute>
        }
      />

      {/* VIEW TIME SLOT */}
      <Route
        path="/timeSlots/:id"
        element={
          <PrivateRoute allowedRoles={["Admin", "Doctor"]}>
            <TimeSlotDetails />
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

      {/* SET DOCTOR'S AVAILABILITY */}
      <Route
        path="doctors/:id/availability"
        element={
          <PrivateRoute allowedRoles={["Admin", "Doctor"]}>
            <SetAvailability />
          </PrivateRoute>
        }
      />
    </>
  );
}

export default DoctorRoutes;
