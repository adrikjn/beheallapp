import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";

export const InvoiceStepFive = () => {
  const token = localStorage.getItem("Token");
  const invoiceId = localStorage.getItem("invoice");
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState(null);

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!invoiceId) {
      navigate("/invoice-step-one"); // Redirection vers invoice-step-one si invoiceId est nul
    }
  }, [token, navigate, invoiceId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/invoices/${invoiceId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setInvoiceData(data);
        } else {
          navigate("/invoice-step-one");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données de la facture : ",
          error
        );
      }
    };

    fetchData();
  }, [invoiceId, navigate, token]);

  const sendInvoice = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/invoices/${invoiceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "envoyé" }), // Mettez à jour le statut ici
        }
      );

      if (response.ok) {
        localStorage.removeItem("invoice");
        localStorage.removeItem("InvoiceData");
        localStorage.removeItem("DraftInvoice");
        navigate("/dashboard");
      } else {
        navigate("/error");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la facture : ", error);
    }
  };

  return (
    <div className="invoice-step-one-page">
      <div className="welcome-user">
        <h1>Recapitulatif</h1>
        <Account />
      </div>
      <div className="summary">
        <div className="company-summary">
          <h2>Expéditaire</h2>
          <div className="company-summary-part">
            <div className="company-info-1">
              <p>
                {userData?.firstName?.toUpperCase()}{" "}
                {userData?.lastName?.toUpperCase()}
              </p>
              <p>{invoiceData?.company?.name}</p>
              <p> {invoiceData?.company?.sirenSiret}</p>
              <p> {invoiceData?.company?.vatId}</p>
            </div>
            <div className="company-info-2">
              <p>
                {invoiceData?.company?.address} {invoiceData?.company?.city}{" "}
                {invoiceData?.company?.postalCode}
              </p>
              <p>{invoiceData?.company?.email}</p>
              <p>{invoiceData?.company?.phoneNumber}</p>
            </div>
          </div>
        </div>

        <div className="customer-summary">
          <h2>Clients</h2>
          <div className="customer-summary-part">
            <div className="customer-info-1">
              <p>
                {invoiceData?.customer?.companyName} (
                {invoiceData?.customer?.lastName?.toUpperCase()}{" "}
                {invoiceData?.customer?.firstName?.toUpperCase()})
              </p>
              <p>{invoiceData?.customer?.email}</p>
              <p>{invoiceData?.customer?.sirenSiret}</p>
            </div>
            <div className="customer-info-2">
              <p>
                {invoiceData?.customer?.address} {invoiceData?.customer?.city}{" "}
                {invoiceData?.customer?.postalCode}
              </p>
              <p>{invoiceData?.customer?.phoneNumber}</p>
              <p>{invoiceData?.customer?.vatId}</p>
            </div>
          </div>
        </div>
        <div className="products-summary">
          <h2>Produits</h2>
          <div className="product-summary-part">
            <ul className="product-summary-header">
              <li>Intitulés</li>
              <li>Volumes</li>
              <li>Tarifs</li>
              <li>TVA</li>
              <li>Prix HT</li>
            </ul>
            {invoiceData?.services?.map((service) => (
              <ul className="product-summary-item" key={service.id}>
                <li>
                  {service.title} <p>- {service.description}</p>
                </li>
                <li>{service.quantity}</li>
                <li>{service.unitCost}€</li>
                <li>{service.vat}%</li>
                <li>{service.totalPrice}€</li>
              </ul>
            ))}
          </div>
          <div className="summary-details">
            <div className="summary-total">
              <p>Details :</p>
              <p>PRIX TTC : {invoiceData?.totalPrice.toFixed(2)}€</p>
            </div>
            <p>Objet : {invoiceData?.title}</p>
            <p>Description : {invoiceData?.description}</p>
            <p>Numéro de facture : {invoiceData?.billNumber.toUpperCase()}</p>
            <p>
              Date de l'opération:{" "}
              {invoiceData?.fromDate
                ? `${formatDate(invoiceData?.fromDate)} - ${formatDate(
                    invoiceData?.deliveryDate
                  )}`
                : formatDate(invoiceData?.deliveryDate)}
            </p>
            <p>
              Durée de validité de la facture :{" "}
              {invoiceData?.billValidityDuration}
            </p>
            <p>Moyen de paiement : {invoiceData?.paymentMethod}</p>
            <p>Conditions générales de vente : {invoiceData?.company?.gcs}</p>
          </div>
          <div className="btn-invoice-2">
            <button onClick={sendInvoice}>Envoyer</button>
          </div>
        </div>
      </div>
      <AccordionNav />
    </div>
  );
};
