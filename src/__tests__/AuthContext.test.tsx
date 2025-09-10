// AuthContext is central, so let's test:
// 1. Default state: user is null if nothing in localStorage
// 2. logIn(): stores user in state + localStorage
// 3. logOut(): clear state + removes from localStorage
// 4. useAuth() outside provider: throws error

import { render, screen, waitFor } from "@testing-library/react";
import {
  AuthProvider,
  LOCAL_STORAGE_AUTH_KEY,
  useAuth,
} from "../context/AuthContext";
import userEvent from "@testing-library/user-event";

// Helper: custom test component to use the context
function TestConsumer() {
  const { user, logIn, logOut } = useAuth();

  return (
    <div>
      <p data-testid="user">{user ? user.fullName : "no-user"}</p>
      <button
        onClick={() => {
          logIn({
            id: "1",
            fullName: "Dr. Test",
            email: "test@example.com",
            role: "Doctor",
            token: "fake-token",
          });
        }}
      >
        Login
      </button>
      <button onClick={logOut}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no user when localStorage is empty", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("user")).toHaveTextContent("no-user");
  });

  it("logIn sets the user and saves to localStorage", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    // Code that causes React state updates should be wrapped into act()
    // userEvent wraps events in act()
    await userEvent.click(screen.getByText("Login"));

    // Assert after React flushes the state update
    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("Dr. Test")
    );

    const saved = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!)).toMatchObject({ fullName: "Dr. Test" });
  });

  it("logOut clears the user and removes from localStorage", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("Login"));
    await userEvent.click(screen.getByText("Logout"));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("no-user")
    );

    expect(localStorage.getItem(LOCAL_STORAGE_AUTH_KEY)).toBeNull();
  });

  it("throws erros if useAuth is called outside provider", () => {
    // Suppress React error logging
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      "useAuth must be used within an AuthContext.Provider"
    );

    spy.mockRestore();
  });
});
