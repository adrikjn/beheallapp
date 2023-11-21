import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/*
  Composant représentant la gestion du compte utilisateur
  Affiche une icône de compte qui, lorsqu'elle est cliquée, ouvre un menu déroulant
  avec des options telles que "Mon compte" et "Déconnexion".
 */
const Account = () => {
  // État local pour gérer l'ouverture/fermeture du menu
  const [isOpen, setIsOpen] = useState(false);

  // Hook de navigation pour rediriger l'utilisateur après la déconnexion
  const navigate = useNavigate();

  // Fonction pour basculer l'état du menu entre ouvert et fermé
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fonction pour gérer la déconnexion de l'utilisateur
  const handleLogout = () => {
    // Supprimer les données du localStorage liées à l'authentification et aux factures
    localStorage.removeItem("Token");
    localStorage.removeItem("invoice");
    localStorage.removeItem("UserData");
    localStorage.removeItem("InvoiceData");

    // Rediriger l'utilisateur vers la page de connexion après la déconnexion
    navigate("/login");
  };

  return (
    <div className="account-container">
      {/* Icône de compte, cliquable pour ouvrir/fermer le menu */}
      <img
        src="/profil-icon.svg"
        alt="Gestion du compte"
        className="account-icon"
        onClick={toggleMenu}
      />
      {/* Menu déroulant affiché s'il est ouvert */}
      {isOpen && (
        <div className="account-menu">
          <Link to="/my-account" className="acc-style">
            Mon compte
          </Link>
          {/* Bouton de déconnexion avec la fonction handleLogout associée */}
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      )}
    </div>
  );
};

export default Account;
