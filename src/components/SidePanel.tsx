import { UserRole } from "../types/dtos";

type SidePanelProps = {
  role: UserRole;
};

type PanelLink = {
  name: string;
  link: string;
};
const doctorPanelLinks: PanelLink[] = [
  { name: "Dashboard", link: "/" },
  { name: "Appointments", link: "/" },
  { name: "Profile", link: "/" },
];
const adminPanelLinks: PanelLink[] = [
  { name: "Dashboard", link: "/" },
  { name: "Appointments", link: "/" },
  { name: "Add Doctor", link: "/" },
  { name: "Doctors List", link: "/" },
];

function SidePanel({ role }: SidePanelProps) {
  const panelLinks: PanelLink[] =
    role == "Admin" ? adminPanelLinks : doctorPanelLinks;
  return (
    <div
      className="d-flex h-100 p-3 text-white bg-dark collapse"
    >
      <ul className="nav nav-pills flex-column">
        {panelLinks.map((p) => (
          <li>
            <a href={p.link} className="nav-link text-white">
              {p.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SidePanel;
