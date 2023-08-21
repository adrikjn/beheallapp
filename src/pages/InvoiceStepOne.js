import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";

export const InvoiceStepOne = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const userId = localStorage.getItem("UserId");

  useEffect(() => {
    if (!token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const [billingIsDifferent, setBillingIsDifferent] = useState(false);

  const [formData, setFormData] = useState({
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


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:8000/api/companies",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await Axios.post(
        config.url,
        {
          ...formData,
          user: userId,
        },
        config
      );

      if (response.status === 201) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
    }
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
            onChange={handleInputChange}
            value={formData.name}
          />
          <input
            type="text"
            id="address"
            placeholder="Adresse"
            name="address"
            onChange={handleInputChange}
            value={formData.address}
          />
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            name="email"
            onChange={handleInputChange}
            value={formData.email}
          />
          <input
            type="tel"
            id="tel"
            placeholder="Téléphone"
            name="phoneNumber"
            onChange={handleInputChange}
            value={formData.phoneNumber}
          />
          <div className="input-row">
            <input
              type="text"
              id="city"
              placeholder="Ville"
              name="city"
              onChange={handleInputChange}
              value={formData.city}
            />
            <input
              type="text"
              id="postalcode"
              placeholder="Code postal"
              name="postalCode"
              onChange={handleInputChange}
              value={formData.postalCode}
            />
          </div>
          <input
            type="text"
            id="country"
            placeholder="Pays"
            name="country"
            onChange={handleInputChange}
            value={formData.country}
          />
          <input
            type="text"
            id="siret"
            placeholder="SIREN/SIRET"
            name="sirenSiret"
            onChange={handleInputChange}
            value={formData.sirenSiret}
          />
          <input
            type="text"
            id="idTva"
            placeholder="Numéro de TVA Intracommunautaire"
            name="vatId"
            onChange={handleInputChange}
            value={formData.vatId}
          />

          <label htmlFor="billingIsDifferent">
            Si, l'adresse de facturation est différente :
          </label>
          <div className="iphone-switch">
            <input
              type="checkbox"
              id="billingIsDifferent"
              name="billingIsDifferent"
              checked={billingIsDifferent}
              className="switch-input"
              onChange={() => setBillingIsDifferent(!billingIsDifferent)}
            />

            <label
              htmlFor="billingIsDifferent"
              className="switch-label"
            ></label>
          </div>
          {billingIsDifferent && (
            <div className="billing-is-different-input">
              <input
                type="text"
                id="billingAddress"
                placeholder="Adresse de facturation"
                name="billingAddress"
                onChange={handleInputChange}
                value={formData.billingAddress}
              />
              <input
                type="text"
                id="billingCountry"
                placeholder="Pays de facturation"
                name="billingCountry"
                onChange={handleInputChange}
                value={formData.billingCountry}
              />
              <div className="input-row">
                <input
                  type="text"
                  id="billingPostalCode"
                  placeholder="Code postal de facturation"
                  name="billingPostalCode"
                  onChange={handleInputChange}
                  value={formData.billingPostalCode}
                />
                <input
                  type="text"
                  id="billingCity"
                  placeholder="Ville de facturation"
                  name="billingCity"
                  onChange={handleInputChange}
                  value={formData.billingCity}
                />
              </div>
            </div>
          )}
          <label htmlFor="legalForm">Forme juridique :</label>
          <select
            id="legalForm"
            name="legalForm"
            className="select-legal-form"
            onChange={handleInputChange}
          >
            <option value="option1">Entreprise individuelle (EI)</option>
            <option value="option2">
              Entreprise unipersonnelle à responsabilité limitée (EURL)
            </option>
            <option value="option3">
              Société à responsabilité limitée (SARL)
            </option>
            <option value="option4">Société anonyme (SA)</option>
            <option value="option6">
              Société par actions simplifiée (SAS) ou société par actions
              simplifiée unipersonnelle (SASU)
            </option>
            <option value="option7">Société en nom collectif (SNC)</option>
            <option value="option8">
              Société coopérative de production (Scop)
            </option>
            <option value="option9">
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
              onChange={handleInputChange}
              value={formData.rmNumber}
            />
            <input
              type="text"
              id="rcsNumber"
              placeholder="RCS Number"
              name="vatId"
              onChange={handleInputChange}
              value={formData.rcsNumber}
            />
          </div>

          <input
            type="text"
            id="shareCapital"
            placeholder="Capital"
            name="shareCapital"
            onChange={handleInputChange}
            value={formData.shareCapital}
          />
          <input
            type="text"
            id="cityRegistration"
            placeholder="Ville de régistration"
            name="cityRegistration"
            onChange={handleInputChange}
            value={formData.cityRegistration}
          />

          <input
            type="text"
            id="website"
            placeholder="Site web"
            name="website"
            onChange={handleInputChange}
            value={formData.website}
          />

          <textarea
            id="descriptionWork"
            placeholder="Work description.."
            name="descriptionWork"
            onChange={handleInputChange}
            value={formData.descriptionWork}
          ></textarea>

          <textarea
            id="gcs"
            placeholder="Conditions générales de ventes.."
            name="gcs"
            onChange={handleInputChange}
            value={formData.gcs}
          ></textarea>

          <label htmlFor="imageUpload" className="custom-file-label">
            Télécharger votre logo
            <img src="/download.svg" alt="download-icon" />
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            className="custom-file-input"
            name="logo"
            onChange={handleInputChange}
            value={formData.logo}
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
