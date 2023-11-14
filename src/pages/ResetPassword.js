import { Helmet } from "react-helmet";
import axios from "axios";
import LogoAndPicture from "../components/LogoAndPicture";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export const ResetPassword = () => {
  const hasToken = !!localStorage.getItem("Token");
  const [email, setEmail] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

 

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://api.beheall.com/reset-password", { email });
      setShowOverlay(true);
      setEmail("");
      console.log("E-mail de réinitialisation envoyé avec succès !");
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'e-mail de réinitialisation :",
        error
      );
    }
  };

  const closeOverlay = () => {
    setShowOverlay(false);
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
          <Link to="/login" className="going-back-to-login">
            <img src="going-back.svg" alt="Revenir a la page de connexion"  />
          </Link>
        </form>
      </div>
      {showOverlay && (
        <div className="overlay-password">
          <div className="overlay-content">
            <p>
              Si l'adresse e-mail est associée à Beheall, les instructions de
              réinitialisation de votre mot de passe seront envoyées.
            </p>
            <div className="pw-reset-right-btn">
              <button onClick={closeOverlay}>Fermer</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
      {hasToken && <AccordionNav />}
    </div>
  );
};

export default ResetPassword;
