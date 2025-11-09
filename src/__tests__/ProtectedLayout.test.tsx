import { fireEvent, render, screen } from "@testing-library/react";
import {
  AuthProvider,
  AuthUser,
  LOCAL_STORAGE_AUTH_KEY,
} from "../context/AuthContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedLayout from "../components/ProtectedLayout";

// Helper function to render ProtectedLayout
// user is set to null by default
function renderWithAuth(user: AuthUser | null = null, initialEntries = ["/"]) {
  if (user) {
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  }

  return render(
    <AuthProvider>
      <MemoryRouter
        initialEntries={initialEntries}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            element={<ProtectedLayout theme="dark" toggleDarkMode={() => {}} />}
          >
            <Route path="/" element={<h1>Home Page</h1>} />
          </Route>
          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("ProtectedLayout", () => {
  it("redirects unauthenticated user to /login", () => {
    renderWithAuth(null);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders navbar and outlet for patient", () => {
    const fakeUser: AuthUser = {
      id: "1",
      fullName: "Mr. Patient",
      email: "patient@gmail.com",
      role: "Patient",
      token: "fake-token",
    };

    renderWithAuth(fakeUser);
    expect(screen.getByText("Home Page")).toBeInTheDocument(); // Test if children of ProtectedLayout are mounted

    expect(screen.getByTestId("Mr. Patient navbar")).toBeInTheDocument(); // Test if Navbar is mounted
    expect(screen.getByText("Mr. Patient")).toBeInTheDocument(); // Renders User's fullName
    expect(screen.getByTestId("Patient navlinks")).toBeInTheDocument(); // Test if Navbar navlinks for patients are mounted
  });

  it("renders navbar and sidepanel for doctor", () => {
    const fakeUser: AuthUser = {
      id: "1",
      fullName: "Dr. Doctor",
      email: "doctor@gmail.com",
      role: "Doctor",
      token: "fake-token",
    };

    renderWithAuth(fakeUser);
    expect(screen.getByText("Home Page")).toBeInTheDocument(); // Renders children

    expect(screen.getByTestId("Dr. Doctor navbar")).toBeInTheDocument(); // Renders Navbar
    expect(screen.getByText("Dr. Doctor")).toBeInTheDocument(); // Renders User's fullName
    expect(screen.getByTestId("Doctor sidepanel")).toBeInTheDocument(); // Renders Sidepanel for Doctor
  });

  it("logs out and redirects to login", () => {
    const fakeUser: AuthUser = {
      id: "1",
      fullName: "Dr. Doctor",
      email: "doctor@gmail.com",
      role: "Doctor",
      token: "fake-token",
    };

    renderWithAuth(fakeUser);

    const logoutBtn = screen.getByTestId("logout-btn"); // Grab logout button from Navbar
    fireEvent.click(logoutBtn);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
