import { Helmet } from "react-helmet";
import React, { useState } from "react";
import axios from "axios";
import LogoAndPicture from "../components/LogoAndPicture";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";

export const ResetPassword = () => {
  const hasToken = !!localStorage.getItem("Token");

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
    <div className="reset-password login-page">
      <Helmet>
        <title>Mot de passe oublié ? | Beheall</title>
        <meta
          name="description"
          content="Besoin d'accéder à votre compte Beheall mais avez oublié votre mot de passe ? Réinitialisez-le facilement et continuez à créer vos factures gratuitement avec Beheall."
        />
      </Helmet>
       <LogoAndPicture />
       <div className="login-border"></div>
    <div className="reset-password-div">
       <h1>Réinitialisation du mot de passe</h1>
      <form onSubmit={handleSendEmail}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={handleEmailChange}
        />
        <div className="align-btn">
          <button type="submit">Envoyer</button>
        </div>
        
      </form>
    </div>
    <Footer />
      {hasToken && <AccordionNav />}
     
    </div>
  );
};

export default ResetPassword;
