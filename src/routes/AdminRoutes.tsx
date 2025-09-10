import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AllAppointments from "../pages/protected/admin/AllAppointments";
import AllDoctors from "../pages/protected/admin/AllDoctors";
import AddDoctor from "../pages/protected/admin/AddDoctor";
import EditUser from "../pages/protected/admin/EditUser";

function AdminRoutes() {
  return (
    <>
      <Route
        path="/all-appointments"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <AllAppointments />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/all-doctors"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <AllDoctors />
          </PrivateRoute>
        }
      />

      <Route
        path="/add-doctor"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <AddDoctor />
          </PrivateRoute>
        }
      />

      {/* EDIT USER */}
      <Route
        path="/users/:id/edit-user"
        element={
          <PrivateRoute allowedRoles={["Admin"]}>
            <EditUser />
          </PrivateRoute>
        }
      />
    </>
  );
}

export default AdminRoutes
