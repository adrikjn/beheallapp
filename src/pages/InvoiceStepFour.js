import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

export const InvoiceStepFour = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  const [invoiceCreateVisible, setInvoiceCreateVisible] = useState(false);
  const [productListVisible, setProductListVisible] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleToggleInvoiceCreate = () => {
    setInvoiceCreateVisible(!invoiceCreateVisible);
    setProductListVisible(false);
  };

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

      <div className={`invoice-create ${invoiceCreateVisible ? '' : 'display-none'}`}>
        {invoiceCreateVisible && (
          <div className="add-company">
            <form>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Nom de votre produit"
              ></input>
              <textarea
                id="description"
                placeholder="Descriptif"
                name="description"
              ></textarea>
              <input
                type="number"
                name="unitCost"
                id="unitCost"
                placeholder="Prix unitaires"
              />
              <input
                type="number"
                name="quantity"
                id="quantity"
                placeholder="Quantité"
              />
              <input
                type="text"
                name="totalPrice"
                id="totalPrice"
                placeholder="Prix HT"
              />
              <div className="btn-invoice-4">
                <button type="submit">Ajouter le produit</button>
              </div>
            </form>
          </div>
        )}
      </div>

      <div className="product-list">
        {productListVisible && (
          <React.Fragment>
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
              <img
                src="/plus.svg"
                alt="add-products"
                onClick={handleToggleInvoiceCreate}
              />
            </div>
            <div className="total-price">
              <p>Total ttc: 00.00€</p>
            </div>
          </React.Fragment>
        )}
      </div>

      <div className="btn-invoice-2">
        {productListVisible && (
          <button type="submit">Créer votre facture</button>
        )}
      </div>
    </div>
  );
};
