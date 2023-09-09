import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";

export const InvoiceStepThree = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const invoiceData = JSON.parse(localStorage.getItem("InvoiceData"));
  const selectedCompanyId = invoiceData ? invoiceData.company : null;
  const selectedCustomerId = invoiceData ? invoiceData.customer : null;
  const [formData, setFormData] = useState({
    company: `/api/companies/${selectedCompanyId}`,
    customer: `/api/customers/${selectedCustomerId}`,
    title: "",
    description: "",
    billNumber: "", // Mettez à jour le billNumber avec le numéro généré
    fromDate: "",
    deliveryDate: "",
    totalPrice: 0,
    vat: 0,
    billValidityDuration: "",
    status: "brouillon",
    paymentMethod: "",
    paymentDays: "0",
    paymentDateLimit: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!invoiceData) {
      navigate("/invoice-step-two");
    }
  }, [token, navigate, invoiceData]);

  useEffect(() => {
    if (selectedCompanyId) {
      const apiUrl = `http://localhost:8000/api/companies/${selectedCompanyId}`;

      Axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const companyData = response.data;
          const invoices = companyData.invoices;

          // Triez les factures par date pour obtenir la dernière facture
          const sortedInvoices = invoices.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          // Obtenez le dernier numéro de facture
          if (sortedInvoices.length > 0) {
            const lastInvoice = sortedInvoices[0];
            const lastBillNumber = lastInvoice.billNumber;

            // Extraire la partie numérique du dernier numéro de facture
            const lastBillNumberNumeric = parseInt(
              lastBillNumber.split("-")[0].substring(1)
            );

            // Incrémenter la partie numérique
            const nextBillNumberNumeric = lastBillNumberNumeric + 1;

            // Obtenir l'année actuelle
            const currentYear = new Date().getFullYear();

            // Formater le prochain numéro de facture
            const nextBillNumber = `F${nextBillNumberNumeric
              .toString()
              .padStart(2, "0")}-${currentYear}`;

            // Mettre à jour le champ billNumber du formulaire
            setFormData((prevData) => ({
              ...prevData,
              billNumber: nextBillNumber,
            }));
          }
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération du dernier bill :",
            error
          );
        });
    }
  }, [selectedCompanyId, token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form data before submission:", formData);
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

      const invoiceId = response.data.id;
      console.log(invoiceId);
      localStorage.setItem("invoice", invoiceId);
      localStorage.removeItem("InvoiceData");
      navigate("/invoice-step-four");
    } catch (error) {
      console.error("Error submitting invoice data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let newValue;

    if (type === "date") {
      newValue = value;
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
        <Account />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°3</h2>
      </div>
      <div className="invoice-create">
        <div className="add-company">
          <form onSubmit={handleFormSubmit}>
            <label htmlFor="billNumber">Numéro de facture</label>
            <input
              type="text"
              id="billNumber"
              name="billNumber"
              value={formData.billNumber}
              readOnly // Pour empêcher la modification manuelle du numéro de facture
            />
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
              <option value="30 jours">30 jours</option>
              <option value="60 jours">60 jours</option>
              <option value="90 jours">90 jours</option>
              <option value="120 jours">120 jours</option>
            </select>
            <label htmlFor="paymentMethod">
              Sélectionner les moyens de méthode de paiement que vous acceptez
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="select-legal-form"
            >
              <option disabled>Sélectionner un moyen de paiement</option>
              <option value="Cartes de paiement">Cartes de paiement</option>
              <option value="Paiement en ligne">Paiement en ligne</option>
              <option value="Transfert électroniques">
                Transfert électroniques
              </option>
              <option value="Paiement mobiles">Paiement mobiles</option>
              <option value="Méthodes traditionnelles">
                Méthodes traditionnelles
              </option>
              <option value="Autres">Autres</option>
            </select>
            <label htmlFor="paymentDateLimit">Date de limite de paiement</label>
            <input
              type="date"
              id="paymentDateLimit"
              name="paymentDateLimit"
              value={formData.paymentDateLimit}
              onChange={handleInputChange}
            />
            <div className="btn-invoice-2">
              <button type="submit">Continuer</button>
            </div>
          </form>
        </div>
      </div>
      <AccordionNav />
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

//? a l'aide de la sérialization à partir du invoice je vais pouvoir récupérérer les infos de l'entreprise / customer / service
