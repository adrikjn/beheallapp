import React from "react";
import { Link } from "react-router-dom";

/*
Composant représentant le lien de retour à la page de connexion.
Une flèche de retour cliquable redirigeant vers la page de connexion sur les liens du footer
*/
const GoingBackLogin = () => (
  <Link to="/login" className="back-to-login-footer-infos">
    <img src="going-back.svg" alt="Revenir a la page de connexion" />
  </Link>
);

export default GoingBackLogin;
