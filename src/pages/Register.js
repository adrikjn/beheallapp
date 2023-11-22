// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import LogoAndPicture from "../components/LogoAndPicture";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";
import AccordionNav from "../components/AccordionNav";
import { Link } from "react-router-dom";

// Composant représentant la page d'inscription de l'application Beheall
export const Register = () => {
  // Vérifie la présence d'un jeton JWT dans le localStorage
  const hasToken = !!localStorage.getItem("Token");

  // Utilisation de hooks pour gérer l'état des données du formulaire et les erreurs globales
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // État local pour les erreurs globales
  const [globalErrors, setGlobalErrors] = useState([]);

  // URL de l'API
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Utilisation du hook useNavigate pour gérer la navigation
  const navigate = useNavigate();

  // Fonction pour ajouter une erreur globale
  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  // Effet useEffect pour rediriger l'utilisateur vers le tableau de bord s'il est déjà connecté
  useEffect(() => {
    const hasToken = !!localStorage.getItem("Token");

    if (hasToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Fonction pour gérer l'inscription de l'utilisateur
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Vérification de la correspondance des mots de passe
      if (plainPassword !== confirmPassword) {
        addGlobalError("Les mots de passe ne correspondent pas.");
        return;
      }

      // Vérification de l'acceptation des CGU
      const acceptCguCheckbox = document.getElementById("accept-cgu-checkbox");
      if (!acceptCguCheckbox.checked) {
        addGlobalError(
          "Veuillez accepter les Conditions Générales d'Utilisation avant de vous inscrire."
        );
        return;
      }

      // Appel à l'API pour l'inscription de l'utilisateur
      const response = await Axios.post(`${apiUrl}/users`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        plainPassword,
      });

      // Redirection vers la page de connexion en cas de succès de l'inscription
      if (response.status === 201) {
        navigate("/login", { state: { registrationSuccess: true } });
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);

      // Gestion des erreurs de validation provenant de l'API
      if (
        error.response &&
        error.response.data &&
        error.response.data.violations
      ) {
        const validationErrors = [];

        error.response.data.violations.forEach((violation) => {
          validationErrors.push(violation.message);
        });

        setGlobalErrors([...globalErrors, ...validationErrors]);
      }
    }
  };

  // Fonction pour fermer les alertes globales
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  // Rendu du composant Register
  return (
    <div className="login-page">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Inscription | Beheall</title>
          <meta
            name="description"
            content="Rejoignez Beheall en vous inscrivant dès maintenant. Créez votre compte et commencez à profiter de nos services de facturation en ligne."
          />
        </Helmet>
        {/* Affichage d'une surcouche si des erreurs globales sont présentes */}
        {globalErrors.length > 0 && <div className="overlay"></div>}
        {/* Affichage du logo et de l'image associée à la page d'inscription */}
        <LogoAndPicture />
        <div className="login-border"></div>
        {/* Titre de la page d'inscription */}
        <h1 className="register-title">Inscription</h1>
        <div>
          {/* Formulaire d'inscription */}
          <form onSubmit={handleRegister} className="register">
            {/* Affichage des erreurs globales */}
            {globalErrors.length > 0 && (
              <div className="alert">
                <span onClick={closeAlert} className="close-alert">
                  &times;
                </span>
                {globalErrors.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            {/* Saisie du prénom, nom, e-mail, numéro de téléphone, mot de passe et confirmation du mot de passe */}
            <div className="name-inputs">
              <input
                type="text"
                placeholder="Prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Nom"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="name-inputs-size">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Numéro de téléphone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="name-inputs-size">
              <input
                type="password"
                placeholder="Mot de passe"
                value={plainPassword}
                onChange={(e) => setPlainPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmation du mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {/* Acceptation des CGU via une case à cocher */}
            <div className="accept-cgu">
              <input type="checkbox" id="accept-cgu-checkbox" required />
              <label htmlFor="accept-cgu-checkbox">
                J'accepte les{" "}
                <Link to="/cgu" className="cgu-decoration no-link-style">
                  Conditions Générales d'Utilisation
                </Link>
              </label>
            </div>

            {/* Bouton pour soumettre le formulaire d'inscription */}
            <div className="align-btn">
              <button type="submit">S'inscrire</button>
            </div>
          </form>
        </div>
        {/* Affichage du pied de page */}
        <Footer />
        {/* Affichage de la navigation accordéon si l'utilisateur est connecté */}
        {hasToken && <AccordionNav />}
      </HelmetProvider>
    </div>
  );
};
