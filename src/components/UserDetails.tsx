import { UserDto } from "../types/dtos";

function UserDetails({ user }: { user: UserDto }) {
  return (
    <div className="bg-light p-3 rounded mb-4 border">
      <p>
        <strong>Full Name:</strong> {user.fullName}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
    </div>
  );
}

export default UserDetails;
