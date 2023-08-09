import React from "react";
import LoginForm from "../components/LoginForm";
import LogoAndPicture from "../components/LogoAndPicture";

export const Login = () => {
  return (
    <div className="login-page">
      <div className="login-part-one">
        <LogoAndPicture />
        <p className="login-description">On s'occupe de tout</p>
        <div className="login-border"></div>
      </div>
      <div className="login-part-two">
        <LoginForm />
      </div>
    </div>
  );
};
