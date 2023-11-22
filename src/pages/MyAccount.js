// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
 Page représentant le compte utilisateur dans l'application Beheall.
 Permet aux utilisateurs de consulter et de modifier les détails de leur compte, de changer leur mot de passe, et de supprimer leur compte.
*/
export const MyAccount = () => {
  // Récupération du jeton JWT et des données utilisateur depuis le localStorage
  const token = localStorage.getItem("Token");
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const userId = userData.id;

  // Utilisation du hook useNavigate pour la navigation
  const navigate = useNavigate();

  // États locaux pour les détails de l'utilisateur, les erreurs globales, le message de succès, et la confirmation de suppression du compte
  const [userDetails, setUserDetails] = useState(null);
  const [globalErrors, setGlobalErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // État local pour les mots de passe lors de la modification du mot de passe
  const [passwords, setPasswords] = useState({
    plainPassword: "",
    confirmPassword: "",
  });

  // URL de l'API
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fonction pour gérer le changement des champs de mot de passe
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswords({ ...passwords, [name]: value });
  };

  // Fonction pour soumettre le formulaire de modification de mot de passe
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Vérification si les mots de passe correspondent
    if (passwords.plainPassword !== passwords.confirmPassword) {
      addGlobalError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      // Appel à l'API pour mettre à jour le mot de passe de l'utilisateur
      await Axios.put(
        `${apiUrl}/users/${userId}`,
        JSON.stringify({
          plainPassword: passwords.plainPassword,
        }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Affichage du message de succès
      setSuccessMessage("Le mot de passe a été modifié avec succès.");
    } catch (error) {
      // Gestion des erreurs lors de la modification du mot de passe
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

  // Fonction pour supprimer le compte utilisateur
  const handleDeleteAccount = async () => {
    try {
      // Appel à l'API pour supprimer le compte utilisateur
      await Axios.delete(`${apiUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Suppression du jeton et des données utilisateur du localStorage
      localStorage.removeItem("Token");
      localStorage.removeItem("UserData");

      // Redirection vers la page de connexion
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // Fonction pour afficher la confirmation de suppression du compte
  const handleDeleteAccountLink = () => {
    setShowDeleteConfirmation(true);
  };

  // Fonction pour ajouter une erreur globale
  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  // Fonction pour fermer les alertes globales
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  // Effet pour rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      // Appel à l'API pour récupérer les détails de l'utilisateur
      Axios.get(`${apiUrl}/users/${userId}`)
        .then((response) => {
          setUserDetails(response.data);
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des données utilisateur",
            error
          );
        });
    }
  }, [token, navigate, userId, apiUrl]);

  // Fonction pour capitaliser la première lettre d'une chaîne de caractères
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="invoice-page">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Mon Compte | Beheall</title>
          <meta
            name="description"
            content="Consultez et modifiez les détails de votre compte Beheall. Effectuez des mises à jour, changez votre mot de passe, et gérez les informations associées à votre compte de facturation en ligne."
          />
        </Helmet>
        {/* Affichage d'une overlay en cas d'erreurs globales */}
        {globalErrors.length > 0 && <div className="overlay"></div>}

        {/* Titre de la page et composant Accounnt */}
        <div className="beheall-title-style-page">
          <h1>Votre compte</h1>
          <Account />
        </div>

        {/* Affichage des détails utilisateur et message de succès */}
        <div>
          {userDetails && (
            <div className="user-infos">
              <p>
                {userDetails.lastName.toUpperCase()}{" "}
                {capitalizeFirstLetter(userDetails.firstName)}{" "}
                <img src="/identity.png" alt="Icône de Profil" />
              </p>
              <p>
                {userDetails.email}{" "}
                <img src="/letter.png" alt="Icône d'E-mail" />
              </p>
              <p>
                {userDetails.phoneNumber}{" "}
                <img src="/phone.png" alt="Icône de Téléphone" />
              </p>
            </div>
          )}
          {/* Affichage du message de succès */}
          {successMessage && (
            <div className="success-message-password">{successMessage}</div>
          )}
          <div>
            {/* Formulaire de modification de mot de passe */}
            <form onSubmit={handleSubmit} className="change-password">
              <h2>Modifier le mot de passe</h2>
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
              {/* Champs de mot de passe */}
              <input
                type="password"
                name="plainPassword"
                value={passwords.plainPassword}
                onChange={handleInputChange}
                placeholder="Nouveau mot de passe"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmer le nouveau mot de passe"
                required
              />
              {/* Bouton de confirmation */}
              <div className="account-btn">
                <button type="submit">Confirmer</button>
              </div>
            </form>
          </div>

          {/* Lien de suppression du compte */}
          <p className="delete-account-link" onClick={handleDeleteAccountLink}>
            Supprimer le compte
          </p>

          {/* Confirmation de suppression du compte */}
          {showDeleteConfirmation && (
            <div className="delete-confirmation">
              <p className="confirmation-message">
                Êtes-vous sûr de vouloir supprimer votre compte de façon
                permanente ? Cette action est irréversible et vous ne pourrez
                pas récupérer votre compte ultérieurement.
              </p>

              {/* Boutons de confirmation/d'annulation */}
              <div className="confirmation-buttons">
                <button
                  className="cancel-button"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Non
                </button>
                <button
                  className="confirm-button"
                  onClick={handleDeleteAccount}
                >
                  Oui
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Affichage de la navigation accordéon */}
        <AccordionNav />

        {/* Pied de page */}
        <div className="desktop-footer">
          <Footer />
        </div>
      </HelmetProvider>
    </div>
  );
};
