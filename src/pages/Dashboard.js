import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
  Page représentant le tableau de bord utilisateur.
  Affiche les dernières factures, le chiffre d'affaires du mois, et permet de créer de nouvelles factures.
 */
export const Dashboard = () => {
  // Récupère le jeton JWT du localStorage
  const token = localStorage.getItem("Token");

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // État local pour stocker les informations sur les entreprises de l'utilisateur
  const [userCompanies, setUserCompanies] = useState([]);

  // Données utilisateur stockées localement
  const userData = JSON.parse(localStorage.getItem("UserData"));

  // Date actuelle
  const currentDate = new Date();

  // URL de l'API backend
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Redirige vers la page de connexion si aucun jeton n'est présent en LocalStorage
    if (!token) {
      navigate("/login");
    }
    // Effectue une requête pour obtenir les données des entreprises associées à l'utilisateur
    else if (userData && userData.companies && userData.companies.length) {
      const companyIds = userData.companies.map((company) => company.id);

      const fetchData = async () => {
        try {
          const companiesData = await Promise.all(
            companyIds.map(async (companyId) => {
              const response = await fetch(`${apiUrl}/companies/${companyId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const companyData = await response.json();
              return companyData;
            })
          );
          setUserCompanies(companiesData);
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };
      fetchData();
    }
  }, [token, navigate, userData, apiUrl]);

  // Rassemble toutes les factures des entreprises de l'utilisateur
  const allInvoices = userCompanies.flatMap((company) => company.invoices);

  // Trie les factures par date de création (de la plus récente à la plus ancienne)
  const sortedInvoices = allInvoices.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Sélectionne les deux dernières factures
  const lastTwoInvoices = sortedInvoices.slice(0, 2);

  // Mois et année actuels
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const formattedCurrentDate = `${currentMonth} ${currentYear}`;

  // Filtre les factures du mois actuel
  const invoicesThisMonth = allInvoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    const invoiceMonth = invoiceDate.toLocaleString("default", {
      month: "long",
    });
    return invoiceMonth.toLowerCase() === currentMonth.toLowerCase();
  });

  // Calcule le total des factures du mois actuel
  const totalThisMonth = invoicesThisMonth.reduce((total, invoice) => {
    return total + invoice.totalPrice;
  }, 0);

  // Formatte le total du mois actuel
  const formattedTotalThisMonth = totalThisMonth.toFixed(2);

  // Affiche le total du mois actuel avec un indicateur "€" si inférieur à 99 999 999
  const displayTotalThisMonth =
    totalThisMonth <= 99999999
      ? `${formattedTotalThisMonth} €`
      : "Supérieur à 99.999.999€ ";

  // Vérifie si l'utilisateur a une facture en brouillon parmi les deux dernières
  const hasDraftInvoice = lastTwoInvoices.some(
    (invoice) => invoice.status === "brouillon"
  );

  // Stocke localement l'ID de la dernière facture en brouillon
  const storeDraftInvoiceIdLocally = () => {
    const lastDraftInvoice = lastTwoInvoices.find(
      (invoice) => invoice.status === "brouillon"
    );

    if (lastDraftInvoice) {
      localStorage.setItem("invoice", lastDraftInvoice.id);
    }
  };

  // Récupère localement l'ID de la dernière facture en brouillon
  const storedDraftInvoiceId = localStorage.getItem("invoice");

  // Stocke l'ID de la dernière facture en brouillon s'il n'est pas déjà stocké
  if (!storedDraftInvoiceId && hasDraftInvoice) {
    storeDraftInvoiceIdLocally();
  }

  // Supprime une facture par son ID
  const deleteInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`${apiUrl}/invoices/${invoiceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Met à jour les données des entreprises et supprime l'ID de la facture en local
        const updatedInvoices = allInvoices.filter(
          (invoice) => invoice.id !== invoiceId
        );
        setUserCompanies(
          userCompanies.map((company) => ({
            ...company,
            invoices: updatedInvoices.filter(
              (invoice) => invoice.companyId === company.id
            ),
          }))
        );
        localStorage.removeItem("invoice");
      } else {
        console.error("La suppression de la facture a échoué.");
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de la facture:",
        error
      );
    }
  };

  return (
    <div className="dashboard-page">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Dashboard | Beheall</title>
          <meta
            name="description"
            content="Bienvenue sur votre tableau de bord Beheall. Consultez vos dernières factures, gérez votre chiffre d'affaires du mois et créez facilement des factures professionnelles, gratuitement & rapidement. Découvrez toutes les fonctionnalités de votre compte Beheall."
          />
        </Helmet>

        {/* Affichage du message de bienvenue et du bouton de création de facture */}
        {userData && (
          <div className="welcome-user">
            <h1>Bonjour, {userData.firstName}</h1>
            <Account />
          </div>
        )}
        {/* Bouton pour finaliser le brouillon s'il existe */}
        <div className="draft-button">
          {storedDraftInvoiceId && (
            <Link to={`/invoice-step-four`} className="link-no-underline">
              <button>
                Finaliser le brouillon
                <img src="favicon.ico" alt="Dessin de Facture" />
              </button>
            </Link>
          )}
        </div>

        {/* Affichage de la liste des dernières factures */}
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

              {/* Si le status de la facture est brouillon alors status-raft sinon, status-sent */}
              <p
                className={
                  invoice.status === "brouillon"
                    ? "status-draft"
                    : "status-sent"
                }
              >
                {/* Si la facture est un brouillon, possibilité de supprimer */}
                {invoice.status}{" "}
                {invoice.status === "brouillon" && (
                  <button
                    onClick={() => deleteInvoice(invoice.id)}
                    className="delete-invoice-draft"
                  >
                    <img src="/delete-icon.svg" alt="Supprimer le brouillon" />
                  </button>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Affichage du chiffre d'affaires du mois */}
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

        {/* Bouton pour créer une nouvelle facture */}
        <div className="btn-invoice">
          <Link to="/invoice-step-one">
            <button>Créer une facture</button>
          </Link>
        </div>

        {/* Affichage de la navigation accordéon */}
        <AccordionNav />

        {/* Affichage du pied de page sur les écrans de bureau */}
        <div className="desktop-footer">
          <Footer />
        </div>
      </HelmetProvider>
    </div>
  );
};
