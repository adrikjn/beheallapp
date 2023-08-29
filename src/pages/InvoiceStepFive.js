import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export const InvoiceStepFive = () => {
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
        <h1>Recapitulatif</h1>
        <img src="/profil-icon.svg" alt="profil" />
      </div>
      <div className="summary">
        <div className="company-summary">
          <h2>Expéditaire</h2>
          <div className="company-summary-part">a</div>
        </div>

        <div className="customer-summary">
          <h2>Clients</h2>
          <div className="customer-summary-part">a</div>
        </div>
        <div className="products-summary">
          <h2>Produits</h2>

          <div className="product-summary-part">a</div>
        </div>
      </div>
    </div>
  );
};

// Le total TTC je vais faire avec du pure js le calculture de tout le prix ht avec la quantité tva etc SANS BACKEND et l'afficher dans le total TTC. Et a partir de ce total TTC je vais envoyer la valeure dans la BDD avec un put sur la facture.
