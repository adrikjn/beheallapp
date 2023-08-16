import React from "react";
import "../App.css";

export const InvoiceStepOne = () => {
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
      <div className="add-company-part">
        <h2>new expéditaire</h2>
      </div>
    </div>
  );
};
