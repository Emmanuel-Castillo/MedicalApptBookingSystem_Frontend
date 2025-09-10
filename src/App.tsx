import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/protected/Home";
import AuthRoutes from "./routes/AuthRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import PatientRoutes from "./routes/PatientRoutes";

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
        {AdminRoutes()}
        {PatientRoutes()}
        {DoctorRoutes()}
      </Route>

      {AuthRoutes()}
    </Routes>
  );
}

export default App;
