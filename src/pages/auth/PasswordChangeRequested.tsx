import React from "react";

function PasswordChangeRequested() {
  return (
    <div className="container mt-5">
      <h2>Check your inbox!</h2>
      <p>
        An email to reset your password has been sent.
        <br />
        Please note, the link will be valid for 1 hour.
      </p>
    </div>
  );
}

export default PasswordChangeRequested;
