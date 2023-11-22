// Importation des modules nécessaires depuis React et d'autres bibliothèques
import LogoAndPicture from "../components/LogoAndPicture";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";

/*
 Page de connexion à l'application Beheall.
 Permet aux utilisateurs existants de se connecter et d'accéder au tableau de bord.
*/
export const Login = () => {
  // Vérifie la présence d'un jeton JWT dans le localStorage
  const hasToken = !!localStorage.getItem("Token");

  // Utilisation du hook useNavigate pour la navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifie si l'inscription a réussi pour afficher un message
  const registrationSuccess =
    location.state && location.state.registrationSuccess;

  // États locaux pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // État local pour les erreurs globales
  const [globalErrors, setGlobalErrors] = useState([]);

  // URL de l'API
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fonction pour ajouter une erreur globale
  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  // Fonction de gestion de la connexion
  const handleLogin = async () => {
    try {
      // Appel à l'API pour la vérification des informations de connexion
      const response = await Axios.post(`${apiUrl}/login_check`, {
        email: email,
        password: password,
      });

      // Récupération des informations utilisateur
      const userResponse = await Axios.get(`${apiUrl}/users?email=${email}`);

      const user = userResponse.data[0];

      // Enregistrement des données utilisateur dans le localStorage
      if (user) {
        const userData = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          companies: user.companies,
        };

        localStorage.setItem("UserData", JSON.stringify(userData));
      }

      // Enregistrement du jeton JWT dans le localStorage
      localStorage.setItem("Token", response.data.token);

      // Redirection vers le tableau de bord après la connexion réussie
      navigate("/dashboard");
    } catch (error) {
      // Gestion des erreurs lors de la connexion
      addGlobalError(
        "Erreur de connexion. Veuillez vérifier vos informations d'identification."
      );
    }
  };

  // Fonction pour fermer les alertes globales
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  // Fonction pour gérer la soumission du formulaire
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  // Effet pour rediriger vers le tableau de bord si l'utilisateur est déjà connecté
  useEffect(() => {
    const hasToken = !!localStorage.getItem("Token");

    if (hasToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Rendu du composant Login
  return (
    <div className="login-page fade-in">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Connexion | Beheall</title>
          <meta
            name="description"
            content="Commencez à créer vos factures gratuitement dès maintenant en vous connectant à votre compte Beheall."
          />
        </Helmet>
        {/* Affichage d'une superposition en cas d'erreurs globales */}
        {globalErrors.length > 0 && <div className="overlay"></div>}

        {/* Affichage d'alertes en cas d'erreurs globales */}
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
        <div className="login-part-one">
          <LogoAndPicture />
          <p className="login-description">On s'occupe de tout</p>
          <div className="border-line"></div>
        </div>
        <div className="login-part-two">
          <div className="login-space">
            <h1>Connexion</h1>

            {/* Affichage du message de succès si l'inscription a réussi */}
            {registrationSuccess && (
              <p className="success-message">
                Le compte a été créé avec succès. Vous pouvez dès à présent vous
                connecter.
              </p>
            )}
            <div>
              {/* Formulaire de connexion */}
              <form onSubmit={handleFormSubmit} className="padding-form">
                <input
                  type="text"
                  placeholder="E-MAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="MOT DE PASSE"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p>
                  Vous n'avez pas de compte ?&nbsp;
                  <Link to="/register" className="register-link">
                    S'inscrire
                  </Link>
                </p>
                {/* Lien vers la réinitialisation du mot de passe */}
                <Link to="/reset-password" className="reset-password-login">
                  Mot de passe oublié ?
                </Link>
                <div className="center-btn">
                  <button type="submit">Se connecter</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Affichage de la navigation accordéon ou header si l'utilisateur est connecté */}
        {hasToken && <AccordionNav />}

        {/* Pied de page */}
        <Footer />
      </HelmetProvider>
    </div>
  );
};
