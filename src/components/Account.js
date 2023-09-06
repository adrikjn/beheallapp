import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Supprimer les données stockées localement
    localStorage.removeItem("Token");
    localStorage.removeItem("invoice");
    localStorage.removeItem("UserData");
    localStorage.removeItem("InvoiceData");

    // Utiliser navigate pour rediriger l'utilisateur vers la page de connexion
    navigate("/login");
  };

  return (
    <div className="account-container">
      <img
        src="/profil-icon.svg"
        alt="account"
        className="account-icon"
        onClick={toggleMenu}
      />
      {isOpen && (
        <div className="account-menu">
          <a href="/mon-profil">Profil</a>
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      )}
    </div>
  );
};

export default Account;
