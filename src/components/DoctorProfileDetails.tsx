import { useNavigate } from "react-router-dom";
import { DoctorProfileDto, UserDto } from "../types/dtos";

type DoctorProfileDetailsProps = {
    profile: DoctorProfileDto;
    allowNavigation: boolean;
}

function DoctorProfileDetails({profile, allowNavigation}: DoctorProfileDetailsProps) {
  const navigate = useNavigate();
  const { user, specialty } = profile;
  return (
    <div className="bg-light p-3 rounded border mb-5">
      <div className="d-flex flex-wrap align-items-center mb-3">
        <h2 className="me-5">Doctor Details</h2>
        {allowNavigation && (
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/users/${user.id}/edit-user`)}
          >
            Edit User
          </button>
        )}
      </div>
      <div>
        <p>
          <strong>Full Name:</strong> {user.fullName}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Specialty:</strong> {specialty}
        </p>
      </div>
    </div>
  );
}

export default DoctorProfileDetails;
