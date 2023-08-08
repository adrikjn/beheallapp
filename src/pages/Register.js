import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import React, { useState } from "react";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [plainPassword, setPlainPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (plainPassword !== confirmPassword) {
        console.error("Les mots de passe ne correspondent pas.");
        return;
      }

      const response = await Axios.post("http://localhost:8000/api/users", {
        firstName,
        lastName,
        email,
        phoneNumber,
        plainPassword,
      });

      if (response.status === 201) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);
    }
  };

  return (
    <div className="login-page">
      <div className="register-part-one">
        <h2>
          Be<span>heall</span>
        </h2>
        <div className="login-facture-image">
          <img src="/facture.png" alt="facture" />
        </div>
      </div>
      <h1 className="register-title">Inscription</h1>
      <div className="register">
        <div className="name-inputs">
          <input
            type="text"
            placeholder="Prenom"
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
        <button onClick={handleRegister}>S'inscrire</button>
      </div>
    </div>
  );
};
