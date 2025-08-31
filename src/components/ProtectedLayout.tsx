import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function ProtectedLayout() {
  const { user, loadingUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  function patientNavLinks() {
    return (
      <div className="navbar-nav">
        <a className="nav-link active" aria-current="page" href="/">
          Home
        </a>
        <a className="nav-link" aria-current="page" href="/">
          All Doctors
        </a>
        <a className="nav-link" aria-current="page" href="/">
          About
        </a>
        <a className="nav-link" aria-current="page" href="/">
          Contact
        </a>
      </div>
    );
  }

  function doctorNavLinks() {
    return (
      <div className="navbar-nav">
        <a className="nav-link active" aria-current="page" href="/">
          Home
        </a>
        <a className="nav-link" aria-current="page" href="/">
          Appointments
        </a>
        <a className="nav-link" aria-current="page" href="/">
          About
        </a>
        <a className="nav-link" aria-current="page" href="/">
          Contact
        </a>
      </div>
    );
  }

  if (loadingUser) return <p>Loading user...</p>;
  return (
    user && (
      <div className="min-vh-100 p-4">
        {/* Navbar */}
        <nav className="navbar navbar-expand-md bg-body-tertiary justify-content-between">
          <div className="container-fluid">
            <div className="navbar-brand position-absolute start-0">
              <strong>{user.fullName}</strong> ({user.role})
            </div>
            <div className="ms-auto">
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarToggler"
                aria-controls="navbarToggler"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div className="collapse navbar-collapse" id="navbarToggler">
              <div className="navbar-nav mx-auto">
                {user.role == "Admin" && patientNavLinks()}
              </div>
              <button
                className="btn btn-secondary position-absolute end-0"
                onClick={handleLogOut}
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="container mt-4 p-2">
          <Outlet />
        </main>
      </div>
    )
  );
}

export default ProtectedLayout;
