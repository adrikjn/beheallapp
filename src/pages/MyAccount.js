import React, { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer.js";

export const MyAccount = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const userId = userData.id;
  const [userDetails, setUserDetails] = useState(null);
  const [globalErrors, setGlobalErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [passwords, setPasswords] = useState({
    plainPassword: "",
    confirmPassword: "",
  });

  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwords.plainPassword !== passwords.confirmPassword) {
      addGlobalError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
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
      setSuccessMessage("Le mot de passe a été changé avec succès.");
      // Ajoutez ici la logique pour gérer la réponse de l'API
    } catch (error) {
      console.error("Error submitting data:", error);
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

  const handleDeleteAccount = async () => {
    try {
      await Axios.delete(`${apiUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      localStorage.removeItem("Token");
      localStorage.removeItem("UserData");
  
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleDeleteAccountLink = () => {
    setShowDeleteConfirmation(true);
  };

  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
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

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="invoice-step-one-page fade-in">
      <Helmet>
        <title>Ajout Entreprise | Beheall</title>
      </Helmet>
      {globalErrors.length > 0 && <div className="overlay"></div>}
      <div className="welcome-user">
        <h1>Votre compte</h1>
        <Account />
      </div>
      <div>
        {userDetails && (
          <div className="user-infos">
            <p>
              {userDetails.lastName.toUpperCase()}{" "}
              {capitalizeFirstLetter(userDetails.firstName)}{" "}
              <img src="/identity.png" alt="Profil" />
            </p>
            <p>
              {userDetails.email} <img src="/letter.png" alt="Email" />
            </p>
            <p>
              {userDetails.phoneNumber} <img src="/phone.png" alt="Téléphone" />
            </p>
          </div>
        )}
        {successMessage && (
          <div className="success-message-password">{successMessage}</div>
        )}
        <div>
          <form onSubmit={handleSubmit} className="change-password">
            <h2>Modifier le mot de passe</h2>
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
            <div className="account-btn">
              <button type="submit">Confirmer</button>
            </div>
          </form>
        </div>
        <p className="delete-account-link" onClick={handleDeleteAccountLink}>
          Supprimer le compte
        </p>
        {showDeleteConfirmation && (
          <div className="delete-confirmation">
            <p className="confirmation-message">
              Êtes-vous sûr de vouloir supprimer votre compte de façon
              permanente ? Cette action est irréversible et vous ne pourrez pas
              récupérer votre compte ultérieurement.
            </p>
            <div className="confirmation-buttons">
              <button
                className="cancel-button"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Non
              </button>
              <button className="confirm-button" onClick={handleDeleteAccount}>
                Oui
              </button>
            </div>
          </div>
        )}
      </div>
      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};
