import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";

export const InvoiceStepOne = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const userId = userData.id;
  const [selectedCompanie, setSelectedCompanie] = useState("undefined");
  const [userCompanies, setUserCompanies] = useState([]);
  const [globalErrors, setGlobalErrors] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [formData, setFormData] = useState({
    user: `/api/users/${userId}`,
    name: "",
    logo: "",
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

  // const addGlobalError = (error) => {
  //   setGlobalErrors([...globalErrors, error]);
  // };

  useEffect(() => {
    Axios.get(`http://localhost:8000/api/users/${userId}`)
      .then((response) => {
        const companies = response.data.companies;
        setUserCompanies(companies);
      })
      .catch((error) => {
        console.error("Error fetching user companies:", error);
      });
  }, [userId]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      const response = await Axios.post(
        "http://localhost:8000/api/companies",
        JSON.stringify(formData),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Data submitted:", response.data);

      setFormData({
        user: `/api/users/${userId}`,
        name: "",
        logo: "",
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

      // Faire une requête GET pour actualiser les données utilisateur
      const userResponse = await Axios.get(
        `http://localhost:8000/api/users/${userId}`
      );

      // Mettre à jour les données utilisateur dans le localStorage
      const updatedUserData = userResponse.data;
      localStorage.setItem("UserData", JSON.stringify(updatedUserData));
      setUserCompanies(updatedUserData.companies);

      const invoiceData = JSON.parse(localStorage.getItem("InvoiceData")) || {};
      invoiceData.company = response.data.id;
      localStorage.setItem("InvoiceData", JSON.stringify(invoiceData));

      // Rediriger vers l'étape suivante
      navigate("/invoice-step-two");
    } catch (error) {
      console.error("Error submitting data:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.violations
      ) {
        const validationErrors = [];

        // Bouclez sur les violations pour extraire les messages d'erreur
        error.response.data.violations.forEach((violation) => {
          validationErrors.push(violation.message);
        });

        // Ajoutez les erreurs de validation à la liste globale
        setGlobalErrors([...globalErrors, ...validationErrors]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSelectChange = async (e) => {
    setSelectedCompanie(e.target.value);
  };

  const handleContinueClick = async () => {
    if (selectedCompanie) {
      try {
        const invoiceData =
          JSON.parse(localStorage.getItem("InvoiceData")) || {};
        invoiceData.company = selectedCompanie;
        localStorage.setItem("InvoiceData", JSON.stringify(invoiceData));

        navigate("/invoice-step-two");
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    } else {
      // Gérer le cas où aucune entreprise n'est sélectionnée
      console.log("Aucune entreprise sélectionnée.");
    }
  };

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return (
    <div className="invoice-step-one-page">
      {globalErrors.length > 0 && <div className="overlay"></div>}
      <div className="welcome-user">
        <h1>creation factures</h1>
        <Account />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°1</h2>
      </div>
      <p className="invoice-step-one-p">Sélectionné un expéditaire</p>
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
      <div id="newCompanieForm">
        <div className="add-company-exp">
          <h2>new expéditaire</h2>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="add-company">
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
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Entreprise (NOM Prénom si indépendant)"
              value={formData.name}
              onChange={handleInputChange}
            />
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
            <input
              type="text"
              id="siret"
              placeholder="SIREN/SIRET"
              name="sirenSiret"
              value={formData.sirenSiret}
              onChange={handleInputChange}
            />
            <div className="switch-container">
              <label htmlFor="showAdditionalFields">
                Afficher les champs facultatifs :
              </label>
              <input
                type="checkbox"
                id="showAdditionalFields"
                checked={showAdditionalFields}
                onChange={() => setShowAdditionalFields(!showAdditionalFields)}
              />
            </div>         
            {showAdditionalFields && (
              <>
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
                  id="vatId"
                  placeholder="Numéro de TVA Intracommunautaire"
                  name="vatId"
                  value={formData.vatId}
                  onChange={handleInputChange}
                />
                <label htmlFor="legalForm">Forme juridique :</label>
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
                  <option value="Société anonyme">Société anonyme (SA)</option>
                  <option
                    value="Société par actions simplifiée (SAS) ou société par actions
                simplifiée unipersonnelle"
                  >
                    Société par actions simplifiée (SAS) ou société par actions
                    simplifiée unipersonnelle (SASU)
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
                <input
                  type="text"
                  id="website"
                  placeholder="Site web"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
                <textarea
                  id="descriptionWork"
                  placeholder="Description de votre secteur d'activité"
                  name="descriptionWork"
                  value={formData.descriptionWork}
                  onChange={handleInputChange}
                ></textarea>
                <label htmlFor="logo" className="custom-file-label">
                  Télécharger votre logo
                  <img src="/download.svg" alt="download-icon" />
                </label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  className="custom-file-input"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                />
              </>
            )}

          
          </div>

          <div className="btn-invoice-2">
            <button>Ajouter un expéditaire</button>
          </div>
        </form>
      </div>

      <div className="btn-invoice-2 fixed-btn">
        {selectedCompanie !== "undefined" && selectedCompanie !== null && (
          <button onClick={handleContinueClick}>Continuer</button>
        )}
      </div>

      <AccordionNav />
    </div>
  );
};
