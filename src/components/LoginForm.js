import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import jwtDecode from "jwt-decode";

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

      console.log(response.data.token)

      localStorage.setItem('Token', response.data.token)

      const decodedToken = jwtDecode(response.data.token);
      console.log("Decoded Token:", decodedToken);

      
      navigate('/dashboard')
      

    } catch (error) {
      console.error("Erreur de connexion :", error);

      //Afficher une erreur propre sur la vue (alert box) suite a l'erreur de connexion
    }
  };

  return (
      <div className="login-space">
      <h1>Connexion</h1>
      <div className="padding-form">
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
      </div>
      <div className="center-btn">
        <button onClick={handleLogin}>Se connecter</button>
      </div>
    </div>
  );
};

export default LoginForm;



// Filter user sur l'email (Importer)
// get users (where email = email)
// Créer la route du filter
// Utilisation du use state
// email exact