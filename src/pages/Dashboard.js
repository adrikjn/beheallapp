import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer.js";

export const Dashboard = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const [userCompanies, setUserCompanies] = useState([]);
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const currentDate = new Date();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

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
          const response = await fetch(`${apiUrl}/companies/${companyId}`, {
            method: "GET",
            headers: headers,
          });
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
  }, [token, navigate, userData, apiUrl]);

  const allInvoices = userCompanies.flatMap((company) => company.invoices);

  const sortedInvoices = allInvoices.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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

  const totalThisMonth = invoicesThisMonth.reduce((total, invoice) => {
    return total + invoice.totalPrice;
  }, 0);

  const formattedTotalThisMonth = totalThisMonth.toFixed(2);

  const displayTotalThisMonth =
    totalThisMonth <= 99999999
      ? `${formattedTotalThisMonth} €`
      : "Supérieur à 99.999.999€ ";

  const hasDraftInvoice = lastTwoInvoices.some(
    (invoice) => invoice.status === "brouillon"
  );

  const storeDraftInvoiceIdLocally = () => {
    const lastDraftInvoice = lastTwoInvoices.find(
      (invoice) => invoice.status === "brouillon"
    );

    if (lastDraftInvoice) {
      localStorage.setItem("invoice", lastDraftInvoice.id);
    }
  };

  const storedDraftInvoiceId = localStorage.getItem("invoice");

  if (!storedDraftInvoiceId && hasDraftInvoice) {
    storeDraftInvoiceIdLocally();
  }

  return (
    <div className="dashboard-page fade-in">
      <Helmet>
        <title>Dashboard | Beheall</title>
      </Helmet>
      {userData && (
        <div className="welcome-user">
          <h1>Welcome, {userData.firstName}</h1>
          <Account />
        </div>
      )}
      {userCompanies.length > 0 && (
        <div>
          <div className="draft-button">
            {storedDraftInvoiceId && (
              <Link to={`/invoice-step-four`} className="link-no-underline">
                <button>
                  Finaliser le brouillon
                  <img src="favicon.ico" alt="" />
                </button>
              </Link>
            )}
          </div>
  
          <div className="invoice-title">
            <p>Dernières factures</p>
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
              <p className="revenue-amount">{displayTotalThisMonth}</p>
            </div>
          </div>
  
          <div className="btn-invoice">
            <Link to="/invoice-step-one">
              <button>Créer une facture</button>
            </Link>
          </div>
  
          <AccordionNav />
          <div className="desktop-footer">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
};
