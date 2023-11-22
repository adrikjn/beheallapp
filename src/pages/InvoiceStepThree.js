// Importation des modules nécessaires depuis React et d'autres bibliothèques
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
  Page permettant de créer la base de la facture et d'obtenir des informations dont le bill number'.
  Permet de passer au step 4 de la création de la facture
 */
export const InvoiceStepThree = () => {
  // Récupération des données depuis le stockage local
  const token = localStorage.getItem("Token");
  const invoiceData = JSON.parse(localStorage.getItem("InvoiceData"));
  const selectedCompanyId = invoiceData ? invoiceData.company : null;
  const selectedCustomerId = invoiceData ? invoiceData.customer : null;

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // État pour les données du formulaire et les erreurs globales
  const [formData, setFormData] = useState({
    company: `/api/companies/${selectedCompanyId}`,
    customer: `/api/customers/${selectedCustomerId}`,
    title: "",
    description: "",
    billNumber: "",
    fromDate: "",
    deliveryDate: "",
    totalPrice: 0,
    billValidityDuration: "",
    status: "brouillon",
    paymentMethod: "",
  });
  const [globalErrors, setGlobalErrors] = useState([]);

  // URL de l'API
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Redirection si l'utilisateur n'est pas authentifié ou si les données de la facture sont manquantes
    if (!token) {
      navigate("/login");
    } else if (!invoiceData) {
      navigate("/invoice-step-two");
    }
  }, [token, navigate, invoiceData]);

  useEffect(() => {
    // Récupération et configuration du prochain numéro de facture lorsque l'entreprise sélectionnée change
    if (selectedCompanyId) {
      const companyApiUrl = `${apiUrl}/companies/${selectedCompanyId}`;

      Axios.get(companyApiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const companyData = response.data;
          const invoices = companyData.invoices;

          // Tri des factures par date de création
          const sortedInvoices = invoices.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          // On récupère la dernière facture
          if (sortedInvoices.length > 0) {
            const lastInvoice = sortedInvoices[0];
            const lastBillNumber = lastInvoice.billNumber;

            // Extraction de la partie numérique du numéro de facture
            const lastBillNumberNumeric = parseInt(
              lastBillNumber.split("-")[0].substring(1)
            );

            // Génération du prochain numéro de facture
            const nextBillNumberNumeric = lastBillNumberNumeric + 1;
            const currentYear = new Date().getFullYear();
            const nextBillNumber = `F${nextBillNumberNumeric
              .toString()
              .padStart(2, "0")}-${currentYear}`;

            // Configuration du prochain numéro de facture dans les données du formulaire
            setFormData((prevData) => ({
              ...prevData,
              billNumber: nextBillNumber,
            }));
          } else {
            // Si aucune facture précédente, configuration d'un numéro de facture initial
            const currentYear = new Date().getFullYear();
            const initialBillNumber = `F01-${currentYear}`;
            setFormData((prevData) => ({
              ...prevData,
              billNumber: initialBillNumber,
            }));
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération du dernier bill :",
            error
          );
        });
    }
  }, [selectedCompanyId, token]);

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Soumission des données du formulaire pour créer une facture
      const response = await Axios.post(`${apiUrl}/invoices`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Stockage de l'ID de la facture créée dans le stockage local
      const invoiceId = response.data.id;
      console.log(invoiceId);
      localStorage.setItem("invoice", invoiceId);
      localStorage.removeItem("InvoiceData");
      // Navigation vers l'étape suivante
      navigate("/invoice-step-four");
    } catch (error) {
      console.error("Error submitting invoice data:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.violations
      ) {
        // Gestion des erreurs de validation
        const validationErrors = [];

        error.response.data.violations.forEach((violation) => {
          validationErrors.push(violation.message);
        });

        setGlobalErrors([...globalErrors, ...validationErrors]);
      }
    }
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    // Définir la nouvelle valeur en fonction du type de champ
    let newValue;

    if (type === "date") {
      newValue = value;
    } else {
      newValue = value;
    }

    // Mettre à jour les données du formulaire
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  // Fermer l'alerte des erreurs globales
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  // Obtenir la date actuelle au format requis
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="invoice-step-one-page fade-in">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Création Facture | Beheall</title>
          <meta
            name="description"
            content="Personnalisez et créez votre facture sur Beheall. Entrez les détails de la transaction et générez une facture professionnelle en quelques étapes simples. Simplifiez votre processus de facturation avec Beheall."
          />
        </Helmet>

        {/* Affichage d'une superposition en cas d'erreurs globales */}
        {globalErrors.length > 0 && <div className="overlay"></div>}
        {/* Bloc avec le titre et le composant Account */}
        <div className="beheall-title-style-page">
          <h1>création factures</h1>
          <Account />
        </div>
        <div className="invoice-step-one-title">
          <h2>Etape</h2>
          <h2>N°3</h2>
        </div>
        <div className="invoice-create">
          <div className="add-company">
            {/* Affichage d'alertes en cas d'erreurs globales */}
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

            {/* Formulaire de création de facture */}
            <form onSubmit={handleFormSubmit} id="submit-invoice">
              <div className="invoice-step-sizes">
                {/* readOnly car la valeur est générée automatiquement */}
                <input
                  type="text"
                  id="billNumber"
                  name="billNumber"
                  placeholder="Numéro de facture"
                  value={formData.billNumber}
                  readOnly
                />
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Objet (ex: Prestation de Marchandise)"
                  value={formData.title}
                  onChange={handleInputChange}
                ></input>
              </div>
              <textarea
                id="description"
                placeholder="Conditions générales de vente (si nécessaire)"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              <label htmlFor="fromDate">
                Date de début de l'opération{" "}
                <span className="label-span-red">
                  (Laisser le champ vide si l'opération dure moins d'une
                  journée){" "}
                </span>
              </label>
              <input
                type="date"
                id="fromDate"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleInputChange}
                min={getCurrentDate()}
              />
              <label htmlFor="deliveryDate">
                Date de l'opération / date de fin de l'opération
              </label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                min={getCurrentDate()}
              />
              <div className="invoice-step-sizes">
                <label htmlFor="paymentMethod">
                  Sélectionner un moyen de paiement :
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="select-form-3"
                >
                  <option value="">Sélectionner un moyen de paiement</option>
                  <option value="Cartes de paiement">Cartes de paiement</option>
                  <option value="Paiement en ligne">Paiement en ligne</option>
                  <option value="Transfert électroniques">
                    Transfert électroniques
                  </option>
                  <option value="Paiement mobiles">Paiement mobiles</option>
                  <option value="Méthodes traditionnelles">
                    Méthodes traditionnelles
                  </option>
                </select>

                <label htmlFor="billValidityDuration">
                  Sélectionner une durée de validité de facture :
                </label>
                <select
                  id="billValidityDuration"
                  name="billValidityDuration"
                  value={formData.billValidityDuration}
                  onChange={handleInputChange}
                  className="select-form-3"
                >
                  <option value="">
                    Sélectionner une durée de validité de facture
                  </option>
                  <option value="15 jours">15 jours</option>
                  <option value="30 jours">30 jours</option>
                  <option value="45 jours">45 jours</option>
                  <option value="60 jours">60 jours</option>
                  <option value="90 jours">90 jours</option>
                </select>
              </div>
            </form>
          </div>
        </div>
        {/* Bouton de soumission du formulaire */}
        <div className="btn-invoice-3">
          <button type="submit" form="submit-invoice">
            Continuer
          </button>
        </div>

        {/* Composant de navigation par accordéon */}
        <AccordionNav />

        {/* Pied de page pour les écrans de bureau */}
        <div className="desktop-footer">
          <Footer />
        </div>
      </HelmetProvider>
    </div>
  );
};
