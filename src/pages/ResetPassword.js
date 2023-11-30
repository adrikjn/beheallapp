// Importation des modules nécessaires depuis React et d'autres bibliothèques
import { Helmet, HelmetProvider } from "react-helmet-async";
import axios from "axios";
import LogoAndPicture from "../components/LogoAndPicture";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

// Composant représentant la page de réinitialisation de mot de passe de l'application Beheall
export const ResetPassword = () => {
  // Vérifie la présence d'un jeton JWT dans le localStorage
  const hasToken = !!localStorage.getItem("Token");

  // Utilisation du hook useState pour gérer l'état de l'adresse e-mail et l'affichage de l'overlay
  const [email, setEmail] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  // Utilisation du hook useNavigate pour gérer la navigation
  const navigate = useNavigate();

  // Effet useEffect pour rediriger l'utilisateur vers le tableau de bord s'il est déjà connecté
  useEffect(() => {
    const hasToken = !!localStorage.getItem("Token");

    if (hasToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Fonction pour gérer le changement de l'adresse e-mail
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Fonction pour envoyer l'e-mail de réinitialisation de mot de passe
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

  // Fonction pour fermer l'overlay
  const closeOverlay = () => {
    setShowOverlay(false);
  };

  // Rendu du composant ResetPassword
  return (
    <div className="reset-password login-page">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Mot de passe oublié ? | Beheall</title>
          <meta
            name="description"
            content="Besoin d'accéder à votre compte Beheall mais avez oublié votre mot de passe ? Réinitialisez-le facilement et continuez à créer vos factures gratuitement avec Beheall."
          />
        </Helmet>
        {/* Affichage du logo et de l'image associée à la page de réinitialisation de mot de passe */}
        <LogoAndPicture />
        <div className="border-line"></div>
        {/* Titre de la page de réinitialisation de mot de passe */}
        <div className="reset-password-div">
          <h1>Réinitialisation du mot de passe</h1>
          {/* Formulaire pour entrer l'adresse e-mail et envoyer l'e-mail de réinitialisation */}
          <form onSubmit={handleSendEmail}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={handleEmailChange}
            />
            {/* Bouton pour envoyer l'e-mail */}
            <div className="align-btn">
              <button type="submit">Envoyer</button>
            </div>
            {/* Lien pour revenir à la page de connexion */}
            <Link to="/login" className="going-back-to-login">
              <img src="going-back.svg" alt="Revenir a la page de connexion" />
            </Link>
          </form>
        </div>
        {/* Affichage de l'overlay si l'e-mail de réinitialisation a été envoyé */}
        {showOverlay && (
          <div className="overlay-password">
            <div className="overlay-content">
              <p>
                Si l'adresse e-mail est associée à Beheall, les instructions de
                réinitialisation de votre mot de passe seront envoyées.
              </p>
              {/* Bouton pour fermer l'overlay */}
              <div className="pw-reset-right-btn">
                <button onClick={closeOverlay}>Fermer</button>
              </div>
            </div>
          </div>
        )}
        {/* Affichage du pied de page */}
        <Footer />
        
        {/* Affichage de la navigation accordéon si l'utilisateur est connecté */}
        {hasToken && <AccordionNav />}
      </HelmetProvider>
    </div>
  );
};

export default ResetPassword;
