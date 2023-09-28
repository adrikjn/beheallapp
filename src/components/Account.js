import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("Token");
    localStorage.removeItem("invoice");
    localStorage.removeItem("UserData");
    localStorage.removeItem("InvoiceData");

    navigate("/login");
  };

  return (
    <div className="account-container">
      <img
        src="/profil-icon.svg"
        alt="Gestion du compte"
        className="account-icon"
        onClick={toggleMenu}
      />
      {isOpen && (
        <div className="account-menu">
          <button onClick={handleLogout}>Déconnexion</button>
        </div>
      )}
    </div>
  );
};

export default Account;
