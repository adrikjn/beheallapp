import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import AccordionNav from "../components/AccordionNav";

export const InvoiceStepTwo = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="invoice-step-one-page">
      <div className="welcome-user">
        <h1>creation factures</h1>
        <img src="/profil-icon.svg" alt="facture" />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°2</h2>
      </div>
      <p className="invoice-step-one-p">Sélectionné un client</p>
      <select className="select-company">
        <option>Parella</option>
      </select>
      <div className="add-company-exp">
        <h2>new client</h2>
      </div>
      <form>
        <div className="add-company">
          <div className="input-row">
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Nom"
            />
            <input
              type="text"
              id="firstName"
              placeholder="Prénom"
              name="firstName"
            />
          </div>
          <input
            type="text"
            id="companyName"
            placeholder="Nom de l'entreprise"
            name="companyName"
          />
          <input type="email" id="email" placeholder="E-mail" name="email" />
          <input
            type="tel"
            id="tel"
            placeholder="Téléphone"
            name="phoneNumber"
          />
          <input
            type="text"
            id="activity"
            placeholder="Activité"
            name="activity"
          />
          <input
            type="text"
            id="siret"
            placeholder="SIREN/SIRET"
            name="sirenSiret"
          />
          <input
            type="text"
            id="address"
            placeholder="Adresse"
            name="address"
          />
          <input
            type="text"
            id="addressLine2"
            placeholder="Suite de l'adresse de livraison"
            name="addressLine2"
          />
          <input type="text" id="city" placeholder="Ville" name="city" />
          <input
            type="text"
            id="postalCode"
            placeholder="Code postal"
            name="postalCode"
          />
          <input
            type="text"
            id="website"
            placeholder="Site web"
            name="website"
          />
          <input type="text" id="country" placeholder="Pays" name="country" />
          <input
            type="text"
            id="companyAddress"
            placeholder="Adresse de l'entreprise"
            name="companyAddress"
          />
          <input
            type="text"
            id="billingAddress"
            placeholder="Adresse de facturation"
            name="billingAddress"
          />
          <input
            type="tel"
            id="tel"
            placeholder="Numéro de téléphone"
            name="phoneNumber"
          />
            <textarea
            id="notes"
            placeholder="Notes"
            name="notes"
          ></textarea>

        </div>
        <div className="btn-invoice-3">
          <button>Ajouter un client</button>
        </div>
      </form>
      <AccordionNav />
    </div>
  );
};
