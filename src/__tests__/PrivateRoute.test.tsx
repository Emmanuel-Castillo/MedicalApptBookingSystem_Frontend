// Helper function to render ProtectedRoute

import { render, screen } from "@testing-library/react";
import {
  AuthProvider,
  AuthUser,
  LOCAL_STORAGE_AUTH_KEY,
} from "../context/AuthContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import { UserRole } from "../types/dtos";

// user is set to null by default
// Takes in optional allowedRoles param to test role-based access control
function renderWithAuth(
  user: AuthUser,
  allowedRoles?: UserRole[],
  initialEntries = ["/"]
) {
  localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));

  return render(
    <AuthProvider>
      <MemoryRouter
        initialEntries={initialEntries}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={allowedRoles}>
                <h1>Home Page</h1>
              </PrivateRoute>
            }
          ></Route>
          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

function returnFakeUser(role: UserRole) {
  const fakeUser: AuthUser = {
    id: "1",
    fullName: "Mr. " + role,
    email: "mr" + role + "@gmail.com",
    role: role,
    token: "fake-token",
  };
  return fakeUser;
}

describe("Private Route", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders Home Page for any authenticated User while not passing any allowedRoles arguments", () => {
    renderWithAuth(returnFakeUser("Patient"));
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders Home Page for single allowed role (Patient)", () => {
    renderWithAuth(returnFakeUser("Patient"), ["Patient"]);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders Home Page for multiple allowed roles (Patient, Admin)", () => {
    renderWithAuth(returnFakeUser("Admin"), ["Admin", "Patient"]);
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("navigates User w/ prohibited role back to Login Page", () => {
    renderWithAuth(returnFakeUser("Patient"), ["Doctor"]);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
