import { useNavigate } from "react-router-dom";
import { PatientProfileDto, UserDto } from "../types/dtos";

type PatientProfileDetailsProps = {
  profile: PatientProfileDto;
  allowNavigation: boolean;
};
function PatientProfileDetails({ profile, allowNavigation }: PatientProfileDetailsProps) {
  const navigate = useNavigate();
  const { user, heightImperial, weightImperial } = profile;
  return (
    <div className="bg-light p-3 rounded border mb-5">
      <div className="d-flex flex-wrap align-items-center mb-3">
        <h2 className="me-5">Patient Details</h2>
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
          <strong>Height:</strong> {heightImperial}
        </p>
        <p>
          <strong>Weight:</strong> {weightImperial}
        </p>
      </div>
    </div>
  );
}

export default PatientProfileDetails;
