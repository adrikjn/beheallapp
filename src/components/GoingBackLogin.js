import React from "react";
import { Link } from "react-router-dom";


const GoingBackLogin = () => (
  <Link to="/login" className="back-to-login-footer-infos">
    <img src="going-back.svg" alt="Revenir a la page de connexion" />
  </Link>
);

export default GoingBackLogin;
