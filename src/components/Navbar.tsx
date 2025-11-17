import { UserRole } from "../types/dtos";
import DarkModeIndicator from "./DarkModeIndicator";
import LightModeIndicator from "./LightModeIndicator";

type NavLinkObj = {
  name: string;
  link: string;
};
const patientNavLinks: NavLinkObj[] = [
  { name: "Home", link: "/" },
  { name: "All Doctors", link: "/all-doctors" },
  { name: "Book Appointment", link: "/patients/book-appointment" },
  { name: "Contact", link: "/" },
];

type NavbarProps = {
  fullName: string;
  role: UserRole;
  logOut: () => void;
  theme: string;
  toggleDarkMode: () => void;
};
function Navbar({ fullName, role, logOut, theme, toggleDarkMode }: NavbarProps) {
  return (
    <nav className="navbar navbar-expand-md bg-body-secondary" data-testid={fullName + " navbar"}>
      <div className="container-fluid">
        <div className="navbar-brand text-wrap" data-testid={"navbar-fullName"}>
          <strong>{fullName}</strong> ({role})
        </div>
        {role == "Patient" && (
          <div className="collapse navbar-collapse" id="navbarToggler" data-testid={"patient-navLinks"}>
            <div className="navbar-nav" data-testid={role + " navlinks"}>
              {patientNavLinks.map((n, idx) => (
                <a key={idx} className="nav-link" aria-current="page" href={n.link}>
                  {n.name}
                </a>
              ))}
            </div>
          </div>
        )}
        <div className="d-flex gap-3 ms-auto align-items-center">
          <div onClick={toggleDarkMode} role="button">
            {theme === "dark" ? <DarkModeIndicator/> : <LightModeIndicator/>}
          </div>
          <div className="dropdown" role="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              fill="currentColor"
              className="bi bi-person-circle dropdown-toggle "
              id="dropdownMenuButton"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fillRule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="dropdownMenuButton"
            >
              <li>
                <a className="dropdown-item" href="#">
                  My Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  My Appointments
                </a>
              </li>
              <div className="dropdown-divider"></div>
              <li>
                <button className="dropdown-item" onClick={logOut} data-testid={"logout-btn"}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
          {role == "Patient" && (
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
          )}
          {role == "Admin" && (
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidePanel"
              aria-controls="sidePanel"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
