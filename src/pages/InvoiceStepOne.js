import React, { useState } from "react";
import "../App.css";

export const InvoiceStepOne = () => {
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
      <select>
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
          <input type="text" id="city" placeholder="City" />
          <input type="text" id="postalcode" placeholder="Code postal" />
        </div>
        <input type="text" id="country" placeholder="Country" />
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

        <label for="imageUpload">Logo</label>
        <input type="file" id="imageUpload" accept="image/*" />
      </div>
    </div>
  );
};
