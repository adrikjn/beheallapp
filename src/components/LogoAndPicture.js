// Importation des modules nécessaires depuis React
import React from "react";

// Composant représentant le logo de l'application avec une image de facture
const LogoAndPicture = () => {
  return (
    <div>
      <p className="brand-login-register">
        Be<span>heall</span>
      </p>
      <div className="register-facture-image">
        <img src="/facture.png" alt="Représentation de Facture" />
      </div>
    </div>
  );
};

export default LogoAndPicture;
