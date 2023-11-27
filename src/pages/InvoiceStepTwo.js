// Importation des modules nécessaires depuis React et d'autres bibliothèques
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
  Page représentant l'ajout du client de l'entreprise.
  Permet de passer au step 3 de la création de la facture
 */
export const InvoiceStepTwo = () => {
  // Récupération du token, de l'ID utilisateur, l'ID de l'entreprise de l'utilisateur depuis le stockage local
  const token = localStorage.getItem("Token");
  const invoiceData = JSON.parse(localStorage.getItem("InvoiceData"));
  const selectedCompanyId = invoiceData ? invoiceData.company : null;

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // États pour gérer les clients de l'utilisateur, le client sélectionnée,
  // les erreurs globales et l'affichage des champs facultatifs
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("undefined");
  const [globalErrors, setGlobalErrors] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [formData, setFormData] = useState({
    company: `/api/companies/${selectedCompanyId}`,
    lastName: "",
    firstName: "",
    companyName: "",
    email: "",
    activity: "",
    address: "",
    vatId: "",
    city: "",
    postalCode: "",
    website: "",
    country: "",
    phoneNumber: "",
    notes: "",
    sirenSiret: "",
  });

  // URL de l'API
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Effet pour gérer la redirection en cas d'absence d'authentification ou de données de facture
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!invoiceData) {
      navigate("/invoice-step-one");
      return;
    }
  }, [token, navigate, invoiceData]);

  // Effet pour ajuster l'affichage des champs en fonction du choix du client
  useEffect(() => {
    if (selectedCustomer !== "undefined") {
      document.getElementById("newCompanieForm").classList.add("display-none");
    } else {
      document
        .getElementById("newCompanieForm")
        .classList.remove("display-none");
    }
  }, [selectedCustomer]);

  // Effet pour récupérer les détails de l'entreprise sélectionnée
  useEffect(() => {
    if (selectedCompanyId) {
      Axios.get(`${apiUrl}/companies/${selectedCompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const selectedCompanyDetails = response.data;

          const customerOptions = selectedCompanyDetails.customers.map(
            (customer) => ({
              id: customer.id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              companyName: customer.companyName,
            })
          );

          setCompanyOptions(customerOptions);
        })
        .catch((error) => {
          console.error("Error fetching selected company details:", error);
        });
    }
  }, [selectedCompanyId, token]);

  // Fonction pour gérer la soumission du formulaire
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Soumission des données du formulaire pour créer un nouveau client
      const response = await Axios.post(`${apiUrl}/customers`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const newCustomerId = response.data.id;

      // Mise à jour des données de facture avec le nouvel identifiant du client
      invoiceData.customer = newCustomerId;
      localStorage.setItem("InvoiceData", JSON.stringify(invoiceData));

      // Récupération des options de clients après l'ajout du nouveau client
      Axios.get(`${apiUrl}/companies/${selectedCompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const selectedCompanyDetails = response.data;

          const customerOptions = selectedCompanyDetails.customers.map(
            (customer) => ({
              id: customer.id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              companyName: customer.companyName,
            })
          );

          setCompanyOptions(customerOptions);
        })
        .catch((error) => {
          console.error("Error fetching selected company details:", error);
        });

      // Redirection vers la prochaine étape du processus de création de facture
      navigate("/invoice-step-three");
    } catch (error) {
      // Gestion des erreurs de validation
      if (
        error.response &&
        error.response.data &&
        error.response.data.violations
      ) {
        const validationErrors = [];

        error.response.data.violations.forEach((violation) => {
          validationErrors.push(violation.message);
        });

        setGlobalErrors([...globalErrors, ...validationErrors]);
      }
    }
  };

  // Fonction pour gérer le changement de sélection du client
  const handleSelectChange = async (e) => {
    setSelectedCustomer(e.target.value);
  };

  // Fonction pour gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  // Fonction pour gérer le clic sur le bouton "Continuer"
  const handleContinueClick = async () => {
    if (selectedCustomer !== "undefined" && selectedCustomer !== null) {
      try {
        // Mise à jour des données de facture avec l'identifiant du client sélectionné
        invoiceData.customer = selectedCustomer;
        localStorage.setItem("InvoiceData", JSON.stringify(invoiceData));

        // Redirection vers la prochaine étape du processus de création de facture
        navigate("/invoice-step-three");
      } catch (error) {
        console.error("Error navigating:", error);
      }
    } else {
      console.log("Aucune entreprise sélectionnée.");
    }
  };

  // Fonction pour fermer l'alerte des erreurs globales
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return (
    <div className="invoice-page fade-in">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Ajout Client | Beheall</title>
          <meta
            name="description"
            content="Ajoutez un nouveau client sur Beheall pour créer vos factures. Enregistrez les informations de votre client et simplifiez le processus de facturation. Profitez d'une gestion efficace de vos relations clients avec Beheall."
          />
        </Helmet>

        {/* Affichage d'une superposition en cas d'erreurs globales */}
        {globalErrors.length > 0 && <div className="overlay"></div>}

        {/* Bloc avec le titre et le composant Account */}
        <div className="beheall-title-style-page">
          <h1>création factures</h1>
          <Account />
        </div>
        <div className="invoice-steps-title">
          <h2>Etape</h2>
          <h2>N°2</h2>
        </div>
        <p className="invoice-steps-p">Sélectionner un destinataire</p>

        {/* Sélecteur pour choisir un client existant */}
        <select
          onChange={handleSelectChange}
          name="name"
          className="select-option"
        >
          <option defaultValue value="undefined">
            Sélectionner un client
          </option>
          {companyOptions.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName} - {customer.companyName}
            </option>
          ))}
        </select>

        {/* Formulaire pour ajouter un nouveau client */}
        <div id="newCompanieForm">
          <div className="add-user-c">
            <h2>nouveau client</h2>
          </div>
          <form onSubmit={handleFormSubmit}>
            {/* Affichage des erreurs globales s'il y en a */}
            <div className="add-create">
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
              {/* Champs du formulaire pour ajouter un nouveau client */}
              <div className="input-row">
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Nom"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="firstName"
                  placeholder="Prénom"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <input
                type="text"
                id="companyName"
                placeholder="Nom de l'entreprise (facultatif pour les travailleurs indépendants)"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
              />
              <div className="invoice-step-sizes">
                <input
                  type="email"
                  id="email"
                  placeholder="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <input
                  type="tel"
                  id="tel"
                  placeholder="Téléphone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <input
                type="text"
                id="address"
                placeholder="Adresse de facturation"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <div className="input-row">
                <input
                  type="text"
                  id="city"
                  placeholder="Ville"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="postalCode"
                  placeholder="Code postal"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>
              <div className="switch-container">
                <label htmlFor="showAdditionalFields">
                  Afficher les champs facultatifs :
                </label>
                <input
                  type="checkbox"
                  id="showAdditionalFields"
                  checked={showAdditionalFields}
                  onChange={() =>
                    setShowAdditionalFields(!showAdditionalFields)
                  }
                />
              </div>

              {/* Affichage des champs facultatifs en fonction de la sélection */}
              {showAdditionalFields && (
                <>
                  <div className="invoice-step-sizes">
                    <input
                      type="text"
                      id="siret"
                      placeholder="SIREN/SIRET"
                      name="sirenSiret"
                      value={formData.sirenSiret}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      id="vatId"
                      placeholder="Numéro de TVA Intracommunautaire"
                      name="vatId"
                      value={formData.vatId}
                      onChange={handleInputChange}
                    />
                  </div>
                  <input
                    type="text"
                    id="activity"
                    placeholder="Activité"
                    name="activity"
                    value={formData.activity}
                    onChange={handleInputChange}
                  />
                  <div className="invoice-step-sizes">
                    <input
                      type="text"
                      id="website"
                      placeholder="Site web"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      id="country"
                      placeholder="Pays"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <textarea
                    id="notes"
                    placeholder="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  ></textarea>
                </>
              )}
            </div>
            {/* Bouton pour soumettre le formulaire */}
            <div className="btn-invoice-2 btn-m">
              <button>Ajouter</button>
            </div>
          </form>
        </div>

        {/* Bouton pour continuer vers la prochaine étape */}
        <div className="btn-invoice-2 fixed-btn">
          {selectedCustomer !== "undefined" && selectedCustomer !== null && (
            <button onClick={handleContinueClick}>Continuer</button>
          )}
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
