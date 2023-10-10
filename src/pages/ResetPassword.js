// ResetPassword.js

import React, { useState } from "react";
import axios from "axios";

export const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
    const response = await axios.post("https://api.beheall.com/reset-password", { email });
      console.log("E-mail de réinitialisation envoyé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail de réinitialisation :", error);
    }
  };

  return (
    <div className="reset-password">
      <h2>Réinitialisation de mot de passe</h2>
      <form onSubmit={handleSendEmail}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
        />
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default ResetPassword;
