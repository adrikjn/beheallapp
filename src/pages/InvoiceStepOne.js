import React, { useState, useEffect } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import AccordionNav from "../components/AccordionNav";

export const InvoiceStepOne = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  const [billingIsDifferent, setBillingIsDifferent] = useState(false);

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
      <div className="add-company">
        <div className="align-form-company">
          <input type="text" id="nom" placeholder="Nom" />
          <input type="text" id="prenom" placeholder="Prénom" />
        </div>
        <input type="text" id="entreprise" placeholder="Entreprise" />
        <input type="text" id="address" placeholder="Adresse" />
        <input type="email" id="email" placeholder="E-mail" />
        <input type="tel" id="tel" placeholder="Téléphone" />
        <div className="input-row">
          <input type="text" id="city" placeholder="Ville" />
          <input type="text" id="postalcode" placeholder="Code postal" />
        </div>
        <input type="text" id="country" placeholder="Pays" />
        <input type="text" id="siret" placeholder="SIREN/SIRET" />
        <input
          type="text"
          id="idTva"
          placeholder="Numéro de TVA Intracommunautaire"
        />

        <label htmlFor="billingIsDifferent">Billing is Different :</label>
        <div className="iphone-switch">
          <input
            type="checkbox"
            id="billingIsDifferent"
            name="billingIsDifferent"
            className="switch-input"
            onChange={() => setBillingIsDifferent(!billingIsDifferent)}
          />
          <label htmlFor="billingIsDifferent" className="switch-label"></label>
        </div>
        {billingIsDifferent && (
          <div className="billing-is-different-input">
            <input
              type="text"
              id="billingAddress"
              placeholder="Billing Address"
            />
            <input
              type="text"
              id="billingCountry"
              placeholder="Billing Country"
            />
            <div className="input-row">
              <input
                type="text"
                id="billingPostalCode"
                placeholder="Billing Postal Code"
              />
              <input type="text" id="billingCity" placeholder="Billing City" />
            </div>
          </div>
        )}

        <label htmlFor="legalForm">Forme juridique :</label>
        <select id="legalForm" name="legalForm" className="select-legal-form">
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
          <input type="text" id="rmNumber" placeholder="RM Number" />
          <input type="text" id="rcsNumber" placeholder="RCS Number" />
        </div>

        <input type="text" id="shareCapital" placeholder="Capital" />
        <input
          type="text"
          id="cityRegistration"
          placeholder="Ville de régistration"
        />

        <input type="text" id="website" placeholder="Site web" />

        <textarea
          id="workDescription"
          placeholder="Work description.."
        ></textarea>

        <textarea
          id="gcs"
          placeholder="Conditions générales de ventes.."
        ></textarea>

        <label htmlFor="imageUpload" className="custom-file-label">
          Télécharger votre logo
          <img src="/download.svg" alt="download-icon" />
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          className="custom-file-input"
        />
      </div>
      <div className="btn-invoice-2">
        <button>Ajouter un expéditaire</button>
      </div>

      <AccordionNav />
    </div>
  );
};
