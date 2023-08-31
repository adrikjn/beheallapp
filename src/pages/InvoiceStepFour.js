import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";

export const InvoiceStepFour = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const invoiceId = localStorage.getItem("invoice");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 0,
    unitCost: 0,
    totalPrice: 0,
    vat: 0,
    invoice: `/api/invoices/${invoiceId}`,
  });
  
  const [isInvoiceCreateVisible, setIsInvoiceCreateVisible] = useState(false);
  const [isProductListVisible, setIsProductListVisible] = useState(true);

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
      console.log(response);

      // Toggle visibility after form submission
      setIsInvoiceCreateVisible(!isInvoiceCreateVisible);
      setIsProductListVisible(!isProductListVisible);

      navigate("/invoice-step-four");
    } catch (error) {
      console.error("Error submitting invoice data:", error);
    }
  };

  const handleToggle = () => {
    setIsInvoiceCreateVisible(!isInvoiceCreateVisible);
    setIsProductListVisible(!isProductListVisible);
  };


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let newValue;

    if (type === "checkbox") {
      newValue = e.target.checked;
    } else if (type === "number") {
      newValue = parseFloat(value);
      if (name === "quantity" || name === "unitCost") {
        newValue = isNaN(newValue) ? 0 : newValue;
        const updatedTotalPrice = newValue * formData.unitCost;
        setFormData((prevData) => ({
          ...prevData,
          [name]: newValue,
          totalPrice: updatedTotalPrice,
        }));
        return;
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
        <img src="/profil-icon.svg" alt="profil" />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°4</h2>
      </div>
      <div>
      <div className={isInvoiceCreateVisible ? "invoice-create" : "invoice-create display-none"}>
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
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="quantity"
                id="quantity"
                placeholder="Quantité"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="totalPrice"
                id="totalPrice"
                placeholder="Prix HT"
                onChange={handleInputChange}
                value={formData.totalPrice}
              />
              <input
                type="number"
                name="vat"
                id="vat"
                placeholder="TVA"
                onChange={handleInputChange}
              />
              <div className="btn-invoice-4">
                <button type="submit">Ajouter le produit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={isProductListVisible ? "product-list" : "product-list display-none"}>
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
        <img src="/plus.svg" alt="add-products" onClick={handleToggle} />
        </div>
        <div className="total-price">
          <p>Total ttc: 00.00€</p>
        </div>
      </div>

      <div className="btn-invoice-2">
          <button type="submit">Créer votre facture</button>
      </div>
    </div>
  );
};

// Le total TTC je vais faire avec du pure js le calculture de tout le prix ht avec la quantité tva etc SANS BACKEND et l'afficher dans le total TTC. Et a partir de ce total TTC je vais envoyer la valeure dans la BDD avec un put sur la facture.


// Je vais faire un get id a partir du invoice et récupéré toute les données sur les  services à l'aide e la serialization.