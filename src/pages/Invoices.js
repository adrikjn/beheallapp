import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer.js";

export const Invoices = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const userId = userData.id;
  //   const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Axios.get(`http://localhost:8000/api/users/${userId}`)

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="invoice-step-one-page fade-in">
      <Helmet>
        <title>Ajout Entreprise | Beheall</title>
      </Helmet>
      <div className="welcome-user">
        <h1>factures</h1>
        <Account />
      </div>
      <div className="invoices-history">
        <div className="invoices-companies-list">
          <select name="" id="" className="select-company">
            <option value="">a</option>
          </select>
        </div>
      </div>
      <div className="invoices-id-companies-list">
        <ul>
            <li>yo</li>
            <li>yo</li>
            <li>yo</li>
            <li>yo</li>
        </ul>
      </div>
      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};

// prendre le user_id de la table company en compte  (requête company (user_id??)) OU userData et récupérer l'id de l'utilsateur
// afficher les entreprises dans la liste déroulante et récupérer les id
// afficher les invoices a partir de l'id des company à l'aide de la sérialization
