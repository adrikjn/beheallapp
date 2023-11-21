import React from "react";

// Composant représentant le logo de l'application avec une image de facture
const LogoAndPicture = () => {
  return (
    <div>
      <p className="brand-login-register">
        Be<span>heall</span>
      </p>
      <div className="register-facture-image">
        <img src="/facture.png" alt="Image de Facture" />
      </div>
    </div>
  );
};

export default LogoAndPicture;
