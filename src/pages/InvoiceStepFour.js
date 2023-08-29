import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";

export const InvoiceStepFour = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const [invoiceCreateVisible, setInvoiceCreateVisible] = useState(false);
  const [productListVisible, setProductListVisible] = useState(true);
  const invoiceId = localStorage.getItem("invoice");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 0,
    unitCost: 0,
    totalPrice: 0,
    invoice: `/api/invoices/${invoiceId}`,
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form data before submission:", formData);
      const response = await Axios.post(
        "http://localhost:8000/api/services",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/invoice-step-four");
    } catch (error) {
      console.error("Error submitting invoice data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleToggleInvoiceCreate = () => {
    setInvoiceCreateVisible(!invoiceCreateVisible);
    setProductListVisible(false);
  };

  return (
    <div className="invoice-step-one-page">
      <div className="welcome-user">
        <h1>creation factures</h1>
        <img src="/profil-icon.svg" alt="profil" />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°4</h2>
      </div>
      <div>
        <div
          className={`invoice-create ${
            invoiceCreateVisible ? "" : "display-none"
          }`}
        >
          {invoiceCreateVisible && (
            <div className="add-company">
              <form onSubmit={handleFormSubmit}>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Nom de votre produit"
                  value={formData.title}
                onChange={handleInputChange}
                ></input>
                <textarea
                  id="description"
                  placeholder="Descriptif"
                  name="description"
                  value={formData.description}
                onChange={handleInputChange}
                ></textarea>
                <input
                  type="number"
                  name="unitCost"
                  id="unitCost"
                  placeholder="Prix unitaires"
                  value={formData.unitCost}
                onChange={handleInputChange}
                />
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Quantité"
                  value={formData.quantity}
                onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="totalPrice"
                  id="totalPrice"
                  placeholder="Prix HT"
                  value={formData.totalPrice}
                onChange={handleInputChange}
                />
                <div className="btn-invoice-4">
                  <button type="submit">Ajouter le produit</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <div className="product-list">
        {productListVisible && (
          <React.Fragment>
            <ul className="product-header">
              <li>Produits</li>
              <li>Quantité</li>
              <li>Prix unitaires</li>
              <li>TVA</li>
              <li>Prix HT</li>
            </ul>
            <ul className="product-item">
              <li>Test</li>
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

// Le total TTC je vais faire avec du pure js le calculture de tout le prix ht avec la quantité tva etc SANS BACKEND et l'afficher dans le total TTC. Et a partir de ce total TTC je vais envoyer la valeure dans la BDD avec un put sur la facture.
