// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React from "react";
import { Link } from "react-router-dom";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";
import DashboardLogic from "../utils/DashboardLogic";

/*
  Page représentant le tableau de bord utilisateur.
  Affiche les dernières factures, le chiffre d'affaires du mois, et permet de créer de nouvelles factures.
 */
export const Dashboard = () => {
  // Utilise la logique du tableau de bord
  const {
    userData,
    lastTwoInvoices,
    formattedCurrentDate,
    displayTotalThisMonth,
    storedDraftInvoiceId,
    deleteInvoice,
  } = DashboardLogic();

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
          <div className="beheall-title-style-page">
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
        <div className="border-line-gray"></div>
        <div className="revenue-create-invoice">
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
