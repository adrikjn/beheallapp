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
  const [userCompanies, setUserCompanies] = useState([]);
  //   const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (userData && userData.companies) {
      const companyIds = userData.companies.map((company) => company.id);

      const headers = {
        Authorization: `Bearer ${token}`,
      };
      Promise.all(
        companyIds.map(async (companyId) => {
          const response = await fetch(
            `http://localhost:8000/api/companies/${companyId}`,
            {
              method: "GET",
              headers: headers,
            }
          );
          const companyData = await response.json();
          return companyData;
        })
      )
        .then((companies) => {
          setUserCompanies(companies);
        })
        .catch((error) => {
          console.error("Error fetching company data:", error);
        });
    }
  }, [token, navigate, userData]);
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
        </ul>
      </div>

      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};

