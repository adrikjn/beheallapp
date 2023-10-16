import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer.js";

export const Invoices = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const [userCompanies, setUserCompanies] = useState([]);

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
        <title>Vos Factures | Beheall</title>
      </Helmet>
      <div className="welcome-user">
        <h1>factures</h1>
        <Account />
      </div>
      <div className="invoices-id-companies-list">
        <ul>
          {userCompanies &&
            userCompanies.map(
              (company) =>
                company.invoices &&
                company.invoices.map((invoice) => (
                  <li key={invoice.id}>
                    {invoice.customer.companyName.toUpperCase()} - (
                    {invoice.customer.lastName.toUpperCase()}{" "}
                    {invoice.customer.firstName.charAt(0).toUpperCase() +
                      invoice.customer.firstName.slice(1)}
                    )
                  </li>
                ))
            )}
        </ul>
      </div>

      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};
