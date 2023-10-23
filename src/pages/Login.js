import LogoAndPicture from "../components/LogoAndPicture";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import jwtDecode from "jwt-decode";
import { Helmet } from "react-helmet";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";

export const Login = () => {
  const hasToken = !!localStorage.getItem("Token");
  const navigate = useNavigate();
  const location = useLocation();
  const registrationSuccess =
    location.state && location.state.registrationSuccess;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [globalErrors, setGlobalErrors] = useState([]);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  const handleLogin = async () => {
    try {
      const response = await Axios.post(`${apiUrl}/login_check`, {
        email: email,
        password: password,
      });

      console.log(response.data.token);

      const userResponse = await Axios.get(`${apiUrl}/users?email=${email}`);

      const user = userResponse.data[0];

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

      localStorage.setItem("Token", response.data.token);

      const decodedToken = jwtDecode(response.data.token);
      console.log("Decoded Token:", decodedToken);

      navigate("/dashboard");
    } catch (error) {
      console.error("Erreur de connexion :", error);
      addGlobalError(
        "Erreur de connexion. Veuillez vérifier vos informations d'identification."
      );
    }
  };

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  useEffect(() => {
    const hasToken = !!localStorage.getItem("Token");

    if (hasToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="login-page fade-in">
      <Helmet>
        <title>Connexion | Beheall</title>
        <meta
          name="description"
          content="Commencez à créer vos factures gratuitement dès maintenant en vous connectant à votre compte Beheall."
        />
      </Helmet>
      {globalErrors.length > 0 && <div className="overlay"></div>}
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
        <div className="login-border"></div>
      </div>
      <div className="login-part-two">
        <div className="login-space">
          <h1>Connexion</h1>
          {registrationSuccess && (
            <p className="success-message">
              Le compte a été créé avec succès. Vous pouvez dès à présent vous
              connecter.
            </p>
          )}
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
              Vous n'avez pas de compte ?&nbsp;
              <Link to="/register" className="register-link">
                S'inscrire
              </Link>
            </p>
            <Link to="/reset-password" className="reset-password-login">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="center-btn">
            <button onClick={handleLogin}>Se connecter</button>
          </div>
        </div>
      </div>
      {hasToken && <AccordionNav />}
      <Footer />
    </div>
  );
};
