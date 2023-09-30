import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import LogoAndPicture from "../components/LogoAndPicture";
import { Helmet } from 'react-helmet';
import Footer from "../components/Footer.js";


export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [globalErrors, setGlobalErrors] = useState([]);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  const handleRegister = async (e) => {
    e.preventDefault(); 

    try {
      if (plainPassword !== confirmPassword) {
        addGlobalError("Les mots de passe ne correspondent pas.");
        return;
      }

      const response = await Axios.post(`${apiUrl}/users`, {
        firstName,
        lastName,
        email,
        phoneNumber,
        plainPassword,
      });

      if (response.status === 201) {
        navigate("/login", { state: { registrationSuccess: true } });
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);

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

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return (
    <div className="login-page fade-in">
      <Helmet>
        <title>Inscription | Beheall</title>
        <meta
          name="description"
          content="Rejoignez Beheall en vous inscrivant dès maintenant. Créez votre compte et commencez à profiter de nos services de facturation en ligne."
        />
      </Helmet>
      {globalErrors.length > 0 && <div className="overlay"></div>}
      <LogoAndPicture />
      <h1 className="register-title">Inscription</h1>
      <div className="register">
        <form onSubmit={handleRegister}>
          <div className="register-marge">
            {/* Affichez les erreurs globales dans un composant d'alerte */}
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
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="number"
              placeholder="Numéro de téléphone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
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

          <div className="align-btn">
            <button type="submit">S'inscrire</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};
