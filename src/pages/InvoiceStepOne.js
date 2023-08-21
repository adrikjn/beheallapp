import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";

export const InvoiceStepOne = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const userId = userData.id;
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
    billingIsDifferent: false,
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
    billingCountry: "",
    sirenSiret: "",
    legalForm: "",
    rmNumber: "",
    rcsNumber: "",
    shareCapital: "",
    cityRegistration: "",
    vatId: "",
    website: "",
    descriptionWork: "",
    gcs: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/invoice-step-one");
    }
  }, [token, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    await Axios.post(
      "http://localhost:8000/api/companies",
      JSON.stringify(formData),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        console.log("Data submitted:", response.data);
        navigate("/invoice-step-one");
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  return (
    <div className="invoice-step-one-page">
      <div className="welcome-user">
        <h1>creation factures</h1>
        <img src="/profil-icon.svg" alt="facture" />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°1</h2>
      </div>
      <p className="invoice-step-one-p">Sélectionné un expéditaire</p>
      <select className="select-company">
        <option>Oxynum</option>
      </select>
      <div className="add-company-exp">
        <h2>new expéditaire</h2>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="add-company">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Entreprise"
            value={formData.name}
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
            id="country"
            placeholder="Pays"
            name="country"
            value={formData.country}
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
          <input
            type="text"
            id="vatId"
            placeholder="Numéro de TVA Intracommunautaire"
            name="vatId"
            value={formData.vatId}
            onChange={handleInputChange}
          />

          <label htmlFor="billingIsDifferent">
            Si, l'adresse de facturation est différente :
          </label>
          <div className="iphone-switch">
            <input
              type="checkbox"
              id="billingIsDifferent"
              name="billingIsDifferent"
              className="switch-input"
              checked={formData.billingIsDifferent}
              onChange={handleInputChange}
            />
            <label
              htmlFor="billingIsDifferent"
              className="switch-label"
            ></label>
          </div>
          {formData.billingIsDifferent && (
            <div className="billing-is-different-input">
              <input
                type="text"
                id="billingAddress"
                placeholder="Adresse de facturation"
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="billingCountry"
                placeholder="Pays de facturation"
                name="billingCountry"
                value={formData.billingCountry}
                onChange={handleInputChange}
              />
              <div className="input-row">
                <input
                  type="text"
                  id="billingPostalCode"
                  placeholder="Code postal de facturation"
                  name="billingPostalCode"
                  value={formData.billingPostalCode}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="billingCity"
                  placeholder="Ville de facturation"
                  name="billingCity"
                  value={formData.billingCity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <label htmlFor="legalForm">Forme juridique :</label>
          <select
            id="legalForm"
            name="legalForm"
            className="select-legal-form"
            value={formData.legalForm}
            onChange={handleInputChange}
          >
            <option disabled>
              Sélectionnez une forme juridique
            </option>
            <option value="Entreprise Individuelle">Entreprise individuelle (EI)</option>
            <option value="Entreprise unipersonnelle à responsabilité limitée">
              Entreprise unipersonnelle à responsabilité limitée (EURL)
            </option>
            <option value="Société à responsabilité limitée">
              Société à responsabilité limitée (SARL)
            </option>
            <option value="Société anonyme">Société anonyme (SA)</option>
            <option value="Société par actions simplifiée (SAS) ou société par actions
              simplifiée unipersonnelle">
              Société par actions simplifiée (SAS) ou société par actions
              simplifiée unipersonnelle (SASU)
            </option>
            <option value="Société en nom collectif">Société en nom collectif (SNC)</option>
            <option value="Société coopérative de production">
              Société coopérative de production (Scop)
            </option>
            <option value="Société en commandite par actions (SCA) et société en commandite
              simple">
              Société en commandite par actions (SCA) et société en commandite
              simple (SCS)
            </option>
          </select>

          <div className="input-row">
            <input
              type="text"
              id="rmNumber"
              placeholder="RM Number"
              name="rmNumber"
              value={formData.rmNumber}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="rcsNumber"
              placeholder="RCS Number"
              name="rcsNumber"
              value={formData.rcsNumber}
              onChange={handleInputChange}
            />
          </div>

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
            placeholder="Ville de régistration"
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
            placeholder="Work description.."
            name="descriptionWork"
            value={formData.descriptionWork}
            onChange={handleInputChange}
          ></textarea>

          <textarea
            id="gcs"
            placeholder="Conditions générales de ventes.."
            name="gcs"
            value={formData.gcs}
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
        </div>
        <div className="btn-invoice-2">
          <button>Ajouter un expéditaire</button>
        </div>
      </form>

      <AccordionNav />
    </div>
  );
};
