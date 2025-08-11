import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function ProtectedLayout() {
  const { user, loadingUser, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  if (loadingUser) return <p>Loading user...</p>;
  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className="min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light p-2">
        <div className="navbar-brand">
          <strong>{user.fullName}</strong> ({user.role})
        </div>
        <div className="collapse navbar-collapse">
          <a href="/">Home</a>
        </div>
        <button className="btn btn-secondary" onClick={handleLogOut}>
          Logout
        </button>
      </nav>

      {/* Main content */}
      <main className="container mt-4 p-2">
        <Outlet />
      </main>
    </div>
  );
}

export default ProtectedLayout;
