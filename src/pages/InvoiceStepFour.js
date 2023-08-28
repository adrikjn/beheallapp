import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export const InvoiceStepFour = () => {
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
        <h2>N°4</h2>
      </div>
      <div className="add-product">
        lalal
        lalal
      </div>
      <div className="product-list">
        <ul className="product-header">
          <li>Produits</li>
          <li>Quantité</li>
          <li>TVA</li>
          <li>Prix HT</li>
        </ul>
        <ul className="product-item">
          <li>Test</li>
          <li>Test</li>
          <li>Test</li>
          <li>Test</li>
        </ul>
        <div className="center-plus">
          <img src="/plus.svg" alt="facture" />
        </div>
      </div>
    </div>
  );
};
