import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:8000/api/login_check",
        {
          email: email,
          password: password,
        }
      );

      const token = response.data.token;
      console.log("JWT Token:", token);

      // Enregistrer l'état de connexion dans le stockage local
      localStorage.setItem("isLoggedIn", "true");

      // Enregistrer le jeton JWT dans le stockage local
      localStorage.setItem("token", token);

      navigate('/dashboard', { state: { email: email } });
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <div className="login-space">
      <h1>Connexion</h1>
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
        Vous n'avez pas de compte ?{" "}
        <Link to="/register" className="register-link">
          S'inscrire
        </Link>
      </p>
      <div className="center-btn">
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    </div>
  );
};

export default LoginForm;
