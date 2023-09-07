import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";

export const Dashboard = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const [userCompanies, setUserCompanies] = useState([]);
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const currentDate = new Date(); // Obtenir la date actuelle

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (userData && userData.companies) {
      // Extract company IDs from userData
      const companyIds = userData.companies.map((company) => company.id);

      // Create an authorization header with the Bearer Token
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Make API calls to fetch company data with the authorization header
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

  const allInvoices = userCompanies.flatMap((company) => company.invoices);

  // Sort all invoices by createdAt in descending order
  const sortedInvoices = allInvoices.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Get the first two invoices (the two most recent)
  const lastTwoInvoices = sortedInvoices.slice(0, 2);

  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const formattedCurrentDate = `${currentMonth} ${currentYear}`;

  const invoicesThisMonth = allInvoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    const invoiceMonth = invoiceDate.toLocaleString("default", {
      month: "long",
    });
    return invoiceMonth.toLowerCase() === currentMonth.toLowerCase();
  });

  // Calculer le total des prix des factures de ce mois
  const totalThisMonth = invoicesThisMonth.reduce((total, invoice) => {
    return total + invoice.totalPrice;
  }, 0);

  const formattedTotalThisMonth = totalThisMonth.toFixed(2);

  return (
    <div className="dashboard-page">
      {userData && (
        <div className="welcome-user">
          <h1>Welcome, {userData.firstName}</h1>
          <Account />
        </div>
      )}

      <div className="invoice-title">
        <p>Dernières factures envoyées</p>
        <p>Statut</p>
      </div>

      <div className="invoice-list">
        {lastTwoInvoices.map((invoice) => (
          <div key={invoice.id} className="invoice-customers">
            <p>
              {invoice.customer.companyName.toUpperCase()} - (
              {invoice.customer.lastName.toUpperCase()}{" "}
              {invoice.customer.firstName.charAt(0).toUpperCase() +
                invoice.customer.firstName.slice(1)}
              )
            </p>
            <p
              className={
                invoice.status === "brouillon" ? "status-draft" : "status-sent"
              }
            >
              {invoice.status}
            </p>
          </div>
        ))}
      </div>

      <div className="revenue-party">
        <h2>Chiffre d'affaires du mois</h2>
        <div className="revenue">
          <div className="revenue-title-date">
            <p>CA :</p>
            <p>{formattedCurrentDate}</p>
          </div>
          <p className="revenue-amount">{formattedTotalThisMonth} €</p>
          <div className="view-more-revenue">
            <img src="/arrow.svg" alt="facture" />
            <Link to="/dashboard" className="link-see-more">
              Voir plus
            </Link>
          </div>
        </div>
      </div>

      <div className="btn-invoice">
        <Link to="/invoice-step-one">
          <button>Créer une facture</button>
        </Link>
      </div>

      <AccordionNav />
    </div>
  );
};
