import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import ProtectedLayout from "./components/ProtectedLayout";
import Home from "./pages/protected/Home";
import AuthRoutes from "./routes/AuthRoutes";
import DoctorRoutes from "./routes/DoctorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import PatientRoutes from "./routes/PatientRoutes";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/auth.store";
import { Toaster } from "react-hot-toast";

function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const { fetchAuthenticatedUser } = useAuthStore();
  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-bs-theme", "light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);
  return (
    <>
      <Toaster />
      <Routes>
        {/* NAVBAR ACCROSS ALL AUTHORIZED PAGES */}
        <Route
          element={
            <ProtectedLayout theme={theme} toggleDarkMode={toggleTheme} />
          }
        >
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
    </>
  );
}

export default App;
