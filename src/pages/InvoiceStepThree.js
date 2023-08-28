import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";

export const InvoiceStepThree = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const invoiceData = JSON.parse(localStorage.getItem("InvoiceData"));
  const selectedCompanyId = invoiceData.company;
  const selectedCustomerId = invoiceData.customer;
  const [formData, setFormData] = useState({
    company: `/api/companies/${selectedCompanyId}`,
    customer: `/api/customers/${selectedCustomerId}`,
    title: "",
    description: "",
    billNumber: "10",
    fromDate: "",
    deliveryDate: "",
    totalPrice: 0,
    vat: 0,
    billValidityDuration: "",
    status: "brouillon",
    paymentMethod: [],
    paymentDays: "0",
    paymentDateLimit: "",
  });

  //? Il faudra récupérer l'id et le stocker dans le storage qu'on a déja crée à la fin. (2/4)

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(
        "http://localhost:8000/api/invoices", 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const invoiceId = response.data.invoiceId;
      localStorage.setItem("CurrentInvoiceId", invoiceId);

      navigate("/invoice-step-three");
    } catch (error) {
      console.error("Error submitting invoice data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let newValue;
  
    if (type === "checkbox") {
      const isChecked = e.target.checked;
  
      if (isChecked) {
        newValue = [...formData.paymentMethod, value]; 
      } else {
        newValue = formData.paymentMethod.filter(method => method !== value);
      }
    } else if (type === "date") {
      newValue = value;
    } else if (type === "radio") {
      if (e.target.checked) {
        newValue = value;
      } else {
        newValue = "";
      }
    } else {
      newValue = value;
    }
  
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
        <h2>N°3</h2>
      </div>
      <div className="invoice-create">
        <div className="add-company">
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Titre de la facture"
              value={formData.title}
              onChange={handleInputChange}
            ></input>
            <textarea
              id="description"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            ></textarea>
            <label htmlFor="fromDate">Date de début de l'opération</label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
            />
            <label htmlFor="deliveryDate">
              Date de l'opération / date de fin de l'opération
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
            />
            <label htmlFor="billValidityDuration">
              Sélectionner une durée de validité de la facture
            </label>
            <select
              id="billValidityDuration"
              name="billValidityDuration"
              className="select-legal-form"
              value={formData.billValidityDuration}
              onChange={handleInputChange}
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
                  checked={formData.paymentMethod.includes("Cartes de paiement")}
                  onChange={handleInputChange}
                />
                <span>Cartes de paiement</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Paiement en ligne"
                  checked={formData.paymentMethod.includes("Paiement en ligne")}
                  onChange={handleInputChange}
                />
                <span>Paiement en ligne</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Transfert électroniques"
                  checked={formData.paymentMethod.includes("Transfert électroniques")}
                  onChange={handleInputChange}
                />
                <span>Transfert électroniques</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Paiement mobiles"
                  checked={formData.paymentMethod.includes("Paiement mobiles")}
                  onChange={handleInputChange}
                />
                <span>Paiement mobiles</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Méthodes traditionnelles"
                  checked={formData.paymentMethod.includes("Méthodes traditionnelles")}
                  onChange={handleInputChange}
                />
                <span>Méthodes traditionnelles</span>
              </div>
              <div className="checkbox-label">
                <input
                  type="checkbox"
                  name="paymentMethod"
                  value="Autres"
                  checked={formData.paymentMethod.includes("Autres")}
                  onChange={handleInputChange}
                />
                <span>Autres</span>
              </div>
            </div>
            <label htmlFor="paymentDateLimit">Date de limite de paiement</label>
            <input
              type="date"
              id="paymentDateLimit"
              name="paymentDateLimit"
              value={formData.paymentDateLimit}
              onChange={handleInputChange}
            />
            <div className="btn-invoice-3">
              <button type="submit">Continuer</button>
            </div>
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
//? Set le status sur en attente
//? Set le paymentDays sur 0 pour l'instant (peut etre enlever) ça représente le jour restant avant le paymentDateLimit

//? je vais faire un put pour changer les valeurs des choses a set 0 ou en attente etc

//? lorsque le formulaire est envoyé stocker le invoiceId pour la partie service
