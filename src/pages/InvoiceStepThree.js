import React from "react";

export const InvoiceStepThree = () => {
  return (
    <div className="invoice-step-one-page">
      <div className="welcome-user">
        <h1>creation factures</h1>
        <img src="/profil-icon.svg" alt="facture" />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°3</h2>
      </div>
      <div className="invoice-create">
        <div className="add-company">
          <form>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Titre de la facture"
            ></input>
            <textarea
              id="description"
              placeholder="Description"
              name="description"
            ></textarea>
            <input type="date" />
            <input type="date" />
            <label htmlFor="billValidityDuration">Sélectionner une durée de validité de la facture</label>
            <select
              id="billValidityDuration"
              name="billValidityDuration"
              className="select-legal-form"
            >
              <option disabled>
                Sélectionner une durée de validité de la facture
              </option>
              <option value="15 jours">15 jours</option>
              <option value="30 jours">30 jours</option>
              <option value="45 jours">45 jours</option>
              <option value="60 jours">60 jours</option>
            </select>
            <label htmlFor="paymentMethod">
              Sélectionner les moyens de méthode de paiement que vous acceptez
            </label>
            <div className="checkbox-container">
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Cartes de paiement"
                />
                <span>Cartes de paiement</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Paiement en ligne"
                />
                <span>Paiement en ligne</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Transfert électroniques"
                />
                <span>Transfert électroniques</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Paiement mobiles"
                />
                <span>Paiement mobiles</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Méthodes traditionnelles"
                />
                <span>Méthodes traditionnelles</span>
              </div>
              <div className="checkbox-label">
                <input type="checkbox" name="paymentMethod" value="Autres" />
                <span>Autres</span>
              </div>
            </div>
          <input type="date" />
          </form>
        </div>
      </div>
    </div>
  );
};

//? faire les labels des date

//?Set le company depuis le local storage
//?Set le customer depuis le local storage
//? Set le numéro de la facture
//? Set le total price sur 0
//? Set la tva sur 0
//? set le depositReduce sur 0
//? Set le status sur en attente
//? Set le paymentDays sur 0 pour l'instant (peut etre enlever) ça représente le jour restant avant le paymentDateLimit


//? je vais faire un put pour changer les valeurs des choses a set 0 ou en attente etc


//? lorsque le formulaire est envoyé stocker le invoiceId pour la partie service