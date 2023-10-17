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
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (userData && userData.companies && userData.companies.length) {
      const companyIds = userData.companies.map((company) => company.id);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const fetchCompanyData = async (companyId) => {
        try {
          const response = await Axios.get(`${apiUrl}/companies/${companyId}`, {
            headers,
          });
          return response.data;
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };

      Promise.all(companyIds.map((companyId) => fetchCompanyData(companyId)))
        .then((companies) => {
          setUserCompanies(companies);
        })
        .catch((error) => {
          console.error("Error fetching company data:", error);
        });
    }
  }, [token, navigate, userData, apiUrl]);
  return (
    <div className="invoice-step-one-page fade-in">
      <Helmet>
        <title>Vos Factures | Beheall</title>
      </Helmet>
      <div className="welcome-user">
        <h1>factures</h1>
        <Account />
      </div>
      <div className="invoices-list-part">
        <ul className="invoices-id-companies-title">
          <li>Entreprise</li>
          <li>Client</li>
          <li>N°Facture</li>
          <li className="hidden-mobile-price">Prix</li>
          <li>Date</li>
        </ul>
      </div>
      <div>
        {userCompanies.map((company) => (
          <ul key={company?.id}>
            {company?.invoices &&
              Array.isArray(company.invoices) &&
              company.invoices.map((invoice) => {
                if (invoice?.status === "envoyé") {
                  const formattedDate = new Date(invoice.createdAt).toLocaleDateString("fr-FR");
                  return (
                    <li key={invoice?.id} className="invoices-id-companies-list">
                      <p>{company?.name}</p>
                      <p>{invoice?.customer && invoice.customer.companyName}</p>
                      <p>{invoice?.billNumber}</p>
                      <p className="hidden-mobile-price">{invoice?.totalPrice}€</p>
                      <p>{formattedDate}</p>
                    </li>
                  );
                } else {
                  return null;
                }
              })}
          </ul>
        ))}
      </div>

      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};
