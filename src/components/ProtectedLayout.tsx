import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SidePanel from "./SidePanel";

function ProtectedLayout() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  if (!user) return <Navigate to={"/login"} />;
  return (
    <div
      className={user.role == "Patient" ? "" : "d-flex flex-column min-vh-100"}
    >
      {/* Navbar */}
      <Navbar fullName={user.fullName} role={user.role} logOut={handleLogOut} />

      {/* Main content */}
      {user.role == "Patient" ? (
        // PATIENT CONTENT
        <main className="container mt-5">
          <Outlet />
        </main>
      ) : (
        // DOCTOR & ADMIN CONTENT
        // <main className="d-flex flex-grow-1">
        //   <SidePanel role={user.role}/>
        //   <Outlet />
        // </main>

          <div className="row m-0 flex-grow-1">
            <div className="col-12 col-md-3 col-xl-2 p-0 d-md-block collapse" id="sidePanel">
              <SidePanel role={user.role}/>
            </div>
            <div className="col-12 col-md-8 col-xl-8 p-0 flex-grow-1">
              <Outlet/>
            </div>
          </div>
      )}
    </div>
  );
}

export default ProtectedLayout;
