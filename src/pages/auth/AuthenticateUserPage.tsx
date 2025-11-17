import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import ErrorsBox from "../../components/ErrorsBox";
import { useAuthStore } from "../../store/auth.store";
import HospitalIcon from "../../components/ui/HospitalIcon";
import LoginForm from "../../components/authenticateUserPage/loginForm";
import RegisterForm from "../../components/authenticateUserPage/registerForm";

function AuthenticateUserPage() {
  const [formType, setFormType] = useState<"login" | "register">("login");
  const { isAuthenticated } = useAuthStore();

  // If user already logged, navigate to dashboard
  if (isAuthenticated) return <Navigate to={"/"} replace />;

  const toggleFormType = () => {
    setFormType((prevFormType) =>
      prevFormType === "login" ? "register" : "login"
    );
  };

  return (
    <div
      className="container vh-100 d-flex flex-column justify-content-center align-items-center gap-5"
    >
      <HospitalIcon />
      {formType === "login" ? (
        <LoginForm toggleFormType={toggleFormType} />
      ) : (
        <RegisterForm toggleFormType={toggleFormType} />
      )}
    </div>
  );
}

export default AuthenticateUserPage;
