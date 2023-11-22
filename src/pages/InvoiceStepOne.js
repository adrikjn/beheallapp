// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
  Page représentant l'ajout d'entreprise de l'utilisateur.
  Permet de passer au step 2 de la création de la facture
 */
export const InvoiceStepOne = () => {
  // Récupération du token et de l'ID utilisateur depuis le stockage local
  const token = localStorage.getItem("Token");
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const userId = userData.id;

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // États pour gérer les entreprises de l'utilisateur, l'entreprise sélectionnée,
  // les erreurs globales et l'affichage des champs facultatifs
  const [selectedCompanie, setSelectedCompanie] = useState("undefined");
  const [userCompanies, setUserCompanies] = useState([]);
  const [globalErrors, setGlobalErrors] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [formData, setFormData] = useState({
    user: `/api/users/${userId}`,
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
    city: "",
    postalCode: "",
    country: "",
    sirenSiret: "",
    legalForm: "",
    shareCapital: "",
    cityRegistration: "",
    vatId: "",
    website: "",
    descriptionWork: "",
  });

  // URL de l'API
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Effet pour récupérer les entreprises de l'utilisateur depuis l'API
  useEffect(() => {
    Axios.get(`${apiUrl}/users/${userId}`)
      .then((response) => {
        const companies = response.data.companies;
        setUserCompanies(companies);
      })
      .catch((error) => {
        console.error("Error fetching user companies:", error);
      });
  }, [userId]);

  // Effet pour rediriger vers la page de connexion si le token est absent
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Effet pour gérer l'affichage du formulaire en fonction de la sélection d'entreprise
  useEffect(() => {
    console.log(selectedCompanie);
    if (selectedCompanie !== "undefined") {
      document.getElementById("newCompanieForm").classList.add("display-none");
    } else {
      document
        .getElementById("newCompanieForm")
        .classList.remove("display-none");
    }
  }, [selectedCompanie]);

  // Fonction pour gérer la soumission du formulaire
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      // Envoi des données du formulaire à l'API pour créer une nouvelle entreprise
      const response = await Axios.post(
        `${apiUrl}/companies`,
        JSON.stringify(formData),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Réinitialisation des données du formulaire
      setFormData({
        user: `/api/users/${userId}`,
        name: "",
        address: "",
        email: "",
        phoneNumber: "",
        city: "",
        postalCode: "",
        country: "",
        sirenSiret: "",
        legalForm: "",
        shareCapital: "",
        cityRegistration: "",
        vatId: "",
        website: "",
        descriptionWork: "",
      });

      // Mise à jour des données utilisateur avec les nouvelles entreprises
      const userResponse = await Axios.get(`${apiUrl}/users/${userId}`);
      const updatedUserData = userResponse.data;
      localStorage.setItem("UserData", JSON.stringify(updatedUserData));
      setUserCompanies(updatedUserData.companies);

      // Mise à jour des données de la facture avec l'ID de la nouvelle entreprise
      const invoiceData = JSON.parse(localStorage.getItem("InvoiceData")) || {};
      invoiceData.company = response.data.id;
      localStorage.setItem("InvoiceData", JSON.stringify(invoiceData));

      // Redirection vers la deuxième étape de création de facture
      navigate("/invoice-step-two");
    } catch (error) {
      // Gestion des erreurs de validation renvoyées par l'API
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

  // Fonction pour gérer le changement des champs de formulaire
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  // Fonction pour gérer le changement de la sélection d'entreprise
  const handleSelectChange = async (e) => {
    setSelectedCompanie(e.target.value);
  };

  // Fonction pour gérer le clic sur le bouton "Continuer"
  const handleContinueClick = async () => {
    if (selectedCompanie) {
      try {
        // Mise à jour des données de la facture avec l'ID de l'entreprise sélectionnée
        const invoiceData =
          JSON.parse(localStorage.getItem("InvoiceData")) || {};
        invoiceData.company = selectedCompanie;
        localStorage.setItem("InvoiceData", JSON.stringify(invoiceData));

        // Redirection vers la deuxième étape de création de facture
        navigate("/invoice-step-two");
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    }
  };

  // Fonction pour fermer les alertes d'erreur
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return (
    <div className="invoice-page fade-in">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Ajout Entreprise | Beheall</title>
          <meta
            name="description"
            content="Ajoutez votre entreprise sur Beheall pour créer vos factures. Saisissez les informations essentielles de votre société et bénéficiez d'une expérience de facturation en ligne facile."
          />
        </Helmet>

        {/* Affichage d'une superposition en cas d'erreurs globales */}
        {globalErrors.length > 0 && <div className="overlay"></div>}
        {/* Bloc avec le titre et le composant Account */}
        <div className="beheall-title-style-page">
          <h1>création factures</h1>
          <Account />
        </div>
        {/* Affichage du titre de la première étape de création de facture */}
        <div className="invoice-step-one-title">
          <h2>Etape</h2>
          <h2>N°1</h2>
        </div>

        {/* Paragraphe de description de la première étape */}
        <p className="invoice-step-one-p">Sélectionner un expéditeur</p>

        {/* Menu déroulant pour sélectionner une entreprise existante */}
        <select
          className="select-company"
          onChange={handleSelectChange}
          name="name"
        >
          <option defaultValue value="undefined">
            Sélectionner une entreprise
          </option>
          {userCompanies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>

        {/* Formulaire pour ajouter une nouvelle entreprise */}
        <div id="newCompanieForm">
          <div className="add-company-exp">
            <h2>nouvel expéditeur</h2>
          </div>
          <form onSubmit={handleFormSubmit}>
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

              {/* Champs de formulaire pour les informations de la nouvelle entreprise */}
              <div className="invoice-step-sizes">
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Entreprise (NOM Prénom, si indépendant)"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="siret"
                  placeholder="SIREN/SIRET"
                  name="sirenSiret"
                  value={formData.sirenSiret}
                  onChange={handleInputChange}
                />
              </div>
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
                placeholder="Adresse"
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
                  id="postalcode"
                  placeholder="Code postal"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              {/* Interrupteur pour afficher les champs facultatifs */}
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

              {/* Champs facultatifs affichés en fonction de l'interrupteur */}
              {showAdditionalFields && (
                <>
                  <input
                    type="text"
                    id="vatId"
                    placeholder="Numéro de TVA Intracommunautaire"
                    name="vatId"
                    value={formData.vatId}
                    onChange={handleInputChange}
                  />
                  <select
                    id="legalForm"
                    name="legalForm"
                    className="select-legal-form"
                    value={formData.legalForm}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionnez une forme juridique</option>
                    <option value="Entreprise Individuelle">
                      Entreprise individuelle (EI)
                    </option>
                    <option value="Entreprise unipersonnelle à responsabilité limitée">
                      Entreprise unipersonnelle à responsabilité limitée (EURL)
                    </option>
                    <option value="Société à responsabilité limitée">
                      Société à responsabilité limitée (SARL)
                    </option>
                    <option value="Société anonyme">
                      Société anonyme (SA)
                    </option>
                    <option
                      value="Société par actions simplifiée (SAS) ou société par actions
                simplifiée unipersonnelle"
                    >
                      Société par actions simplifiée (SAS) ou société par
                      actions simplifiée unipersonnelle (SASU)
                    </option>
                    <option value="Société en nom collectif">
                      Société en nom collectif (SNC)
                    </option>
                    <option value="Société coopérative de production">
                      Société coopérative de production (Scop)
                    </option>
                    <option
                      value="Société en commandite par actions (SCA) et société en commandite
                simple"
                    >
                      Société en commandite par actions (SCA) et société en
                      commandite simple (SCS)
                    </option>
                  </select>
                  <div className="invoice-step-sizes">
                    <input
                      type="text"
                      id="shareCapital"
                      placeholder="Capital"
                      name="shareCapital"
                      value={formData.shareCapital}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      id="cityRegistration"
                      placeholder="Ville d'enregistrement"
                      name="cityRegistration"
                      value={formData.cityRegistration}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="invoice-step-sizes">
                    <input
                      type="text"
                      id="country"
                      placeholder="Pays"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      id="website"
                      placeholder="Site web"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  <textarea
                    id="descriptionWork"
                    placeholder="Description de votre secteur d'activité"
                    name="descriptionWork"
                    value={formData.descriptionWork}
                    onChange={handleInputChange}
                  ></textarea>
                </>
              )}
            </div>

            {/* Bouton Ajouter */}
            <div className="btn-invoice-2 btn-m">
              <button>Ajouter</button>
            </div>
          </form>
        </div>

        {/* Bouton Continuer */}
        <div className="btn-invoice-2 fixed-btn">
          {selectedCompanie !== "undefined" && selectedCompanie !== null && (
            <button onClick={handleContinueClick}>Continuer</button>
          )}
        </div>

        {/* Composant de navigation par accordéon */}
        <AccordionNav />

        {/* Pied de page pour la version bureau */}
        <div className="desktop-footer">
          <Footer />
        </div>
      </HelmetProvider>
    </div>
  );
};
