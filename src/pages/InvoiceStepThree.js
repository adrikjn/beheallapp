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
  const [globalErrors, setGlobalErrors] = useState([]);
  const [formData, setFormData] = useState({
    company: `/api/companies/${selectedCompanyId}`,
    customer: `/api/customers/${selectedCustomerId}`,
    title: "",
    description: "",
    billNumber: "",
    fromDate: "",
    deliveryDate: "",
    totalPrice: 0,
    billValidityDuration: "",
    status: "brouillon",
    paymentMethod: "",
  });

  // const addGlobalError = (error) => {
  //   setGlobalErrors([...globalErrors, error]);
  // };

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
          } else {
            // Aucune facture existante, initialisez le numéro de facture
            const currentYear = new Date().getFullYear();
            const initialBillNumber = `F01-${currentYear}`;
            setFormData((prevData) => ({
              ...prevData,
              billNumber: initialBillNumber,
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

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  

  return (
    <div className="invoice-step-one-page">
      {globalErrors.length > 0 && <div className="overlay"></div>}
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
          <form onSubmit={handleFormSubmit} id="submit-invoice">
            <input
              type="text"
              id="billNumber"
              name="billNumber"
              placeholder="Numéro de facture"
              value={formData.billNumber}
              readOnly
            />
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Objet (ex: Prestation de Marchandise)"
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
            <label htmlFor="fromDate">
              Date de début de l'opération (Laisser le champ vide si l'opération
              dure moins d'une journée)
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleInputChange}
              min={getCurrentDate()}
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
              min={getCurrentDate()}
            />

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
              <option value="">Sélectionner un moyen de paiement</option>
              <option value="Cartes de paiement">Cartes de paiement</option>
              <option value="Paiement en ligne">Paiement en ligne</option>
              <option value="Transfert électroniques">
                Transfert électroniques
              </option>
              <option value="Paiement mobiles">Paiement mobiles</option>
              <option value="Méthodes traditionnelles">
                Méthodes traditionnelles
              </option>
            </select>

            <label htmlFor="billValidityDuration">
              Sélectionner une durée de validité de la facture
            </label>
            <select
              id="billValidityDuration"
              name="billValidityDuration"
              value={formData.billValidityDuration}
              onChange={handleInputChange}
              className="select-legal-form"
            >
              <option value="">
                Sélectionner une durée de validité de la facture
              </option>
              <option value="15 jours">15 jours</option>
              <option value="30 jours">30 jours</option>
              <option value="45 jours">45 jours</option>
              <option value="60 jours">60 jours</option>
              <option value="90 jours">90 jours</option>
            </select>
          </form>
        </div>
      </div>
      <div className="btn-invoice-2">
        <button type="submit" form="submit-invoice">Continuer</button>
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
