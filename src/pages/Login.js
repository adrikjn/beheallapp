import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import React, { useState } from "react";

export const Login = () => {
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

      // const token = response.data.token; 
      // console.log("JWT Token:", token);
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  return (
    <div className="login-page">
      <div className="login-part-one">
        <h2>
          Be<span>heall</span>
        </h2>
        <div className="login-facture-image">
          <img src="/facture.png" alt="facture" />
        </div>
        <p className="login-description">On s'occupe de tout</p>
        <div className="login-border"></div>
      </div>
      <div className="login-part-two">
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
      </div>
    </div>
  );
};


/*inscription 
inscrit dans db 
token renvoyé dans la requete 
tester le email
déconnexion automatique avec le token 
*/