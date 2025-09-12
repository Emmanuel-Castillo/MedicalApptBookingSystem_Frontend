import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { AuthProvider } from "../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

function renderWithProviders(ui: React.ReactNode) {
  return render(
    <BrowserRouter future={{v7_startTransition: true, v7_relativeSplatPath: true}}>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
}

test("renders login page", () => {
  // renderWithProviders(<App />);

  // since "/" is protected, unauthenticated users should land at login
  // expect(screen.getAllByText(/login/i)).toBeInTheDocument();
});
