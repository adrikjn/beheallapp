import React from "react";
import LoginForm from "../components/LoginForm";

export const Login = () => {
  return (
    <div className="login-page">
      <div className="login-part-one">
        <h2>
          Be<span>heall</span>
        </h2>
        <div className="login-facture-image">
          <img src="/facture.png" alt="facture" />
        </div>
        <p className="login-description">On s'occupe de tout</p>
        <div className="login-border"></div>
      </div>
      <div className="login-part-two">
        <LoginForm />
      </div>
    </div>
  );
};
