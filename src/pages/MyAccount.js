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
      const response = await Axios.put(
        `http://localhost:8000/api/users/${userId}`,
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
      console.log("Changement de mot de passe réussi", response.data);
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
      Axios.get(`http://localhost:8000/api/users/${userId}`)
        .then((response) => {
          setUserDetails(response.data); // Mettez à jour l'état avec les détails de l'utilisateur
        })
        .catch((error) => {
          console.error(
            "Une erreur s'est produite lors de la récupération des données utilisateur",
            error
          );
        });
    }
  }, [token, navigate, userId, apiUrl]);

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
          <div>
            <p>Prénom : {userDetails.firstName}</p>
            <p>Nom : {userDetails.lastName}</p>
            <p>Email : {userDetails.email}</p>
            <p>Numéro de téléphone : {userDetails.phoneNumber}</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Modifier le mot de passe</button>
        </form>
      </div>
      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};
