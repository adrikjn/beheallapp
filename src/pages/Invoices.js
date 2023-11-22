// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React, { useState, useEffect } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
  Page affichant la liste des factures de l'utilisateur.
  Permet de consulter les détails des transactions avec les clients, y compris le numéro de facture, le prix, et la date d'émission.
  Fournit également un lien pour créer une nouvelle facture.
 */
export const Invoices = () => {
  // Récupère le jeton JWT du localStorage
  const token = localStorage.getItem("Token");

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // Données utilisateur stockées localement
  const userData = JSON.parse(localStorage.getItem("UserData"));

  // État local pour stocker les informations sur les entreprises de l'utilisateur
  const [userCompanies, setUserCompanies] = useState([]);

  // URL de l'API backend
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Redirige vers la page de connexion si aucun jeton n'est présent
    if (!token) {
      navigate("/login");
    }
    // Effectue une requête pour obtenir les données des entreprises associées à l'utilisateur
    else if (userData && userData.companies && userData.companies.length) {
      const companyIds = userData.companies.map((company) => company.id);

      // En-têtes pour l'autorisation
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fonction pour récupérer les données d'une entreprise
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

      // Utilisation de Promise.all pour effectuer les requêtes en parallèle
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
    <div className="invoice-page">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Vos Factures | Beheall</title>
          <meta
            name="description"
            content="Consultez la liste de vos factures sur Beheall. Suivez les détails des transactions avec vos clients, y compris le numéro de facture, le prix, et la date d'émission. Gérez facilement vos factures en ligne. Découvrez toutes les fonctionnalités de la gestion de facturation sur Beheall."
          />
        </Helmet>
        {/* Affichage du titre et du bouton de création de facture */}
        <div className="beheall-title-style-page">
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
          {/* Affichage de la liste des factures par entreprise */}
          {userCompanies.map((company) => (
            <ul key={company?.id}>
              {company?.invoices &&
                Array.isArray(company.invoices) &&
                company.invoices.map((invoice) => {
                  if (invoice?.status === "envoyé") {
                    const formattedDate = new Date(
                      invoice.createdAt
                    ).toLocaleDateString("fr-FR");
                    return (
                      <li
                        key={invoice?.id}
                        className="invoices-id-companies-list"
                      >
                        <p>{company?.name}</p>
                        <p>
                          {invoice?.customer && invoice.customer.companyName
                            ? invoice.customer.companyName
                            : invoice.customer.lastName}
                        </p>
                        <p>{invoice?.billNumber}</p>
                        <p className="hidden-mobile-price">
                          {invoice?.totalPrice}€
                        </p>
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
        {/* Bouton pour créer une nouvelle facture */}
        <div className="btn-invoices fixed-btn">
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
