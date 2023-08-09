import React from "react";
import LogoAndPicture from "../components/LogoAndPicture";
import RegisterForm from "../components/RegisterForm";

export const Register = () => {
  return (
    <div className="login-page">
      <LogoAndPicture />
      <h1 className="register-title">Inscription</h1>
      <RegisterForm />
    </div>
  );
};
