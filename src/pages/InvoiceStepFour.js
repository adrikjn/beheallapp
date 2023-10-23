import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet } from "react-helmet";
import Footer from "../components/Footer.js";

export const InvoiceStepFour = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const invoiceId = localStorage.getItem("invoice");
  const [productList, setProductList] = useState([]);
  const [totalTTC, setTotalTTC] = useState(0);
  const [globalErrors, setGlobalErrors] = useState([]);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 0,
    unitCost: 0,
    totalPrice: 0,
    vat: 0,
    invoice: `/api/invoices/${invoiceId}`,
  });

  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth < 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  const [isInvoiceCreateVisible, setIsInvoiceCreateVisible] = useState(false);
  const [isProductListVisible, setIsProductListVisible] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!invoiceId) {
      navigate("/invoice-step-one");
    }

    const fetchProducts = async () => {
      try {
        const invoiceResponse = await Axios.get(
          `${apiUrl}/invoices/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedServices = invoiceResponse.data.services;

        setProductList(updatedServices);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    fetchProducts();
  }, [token, navigate, invoiceId]);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const calculateTotalTTC = () => {
      let total = 0;

      productList.forEach((product) => {
        total += product.totalPrice + (product.totalPrice * product.vat) / 100;
      });

      return total;
    };

    const initialTotalTTC = calculateTotalTTC();
    setTotalTTC(initialTotalTTC);
  }, [productList]);

  const MAX_PRODUCTS = 5;

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (productList.length >= MAX_PRODUCTS) {
      addGlobalError("Vous ne pouvez ajouter que 5 produits/services");
      return;
    }

    try {
      console.log("Form data before submission:", formData);
      const response = await Axios.post(`${apiUrl}/services`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);

      const invoiceResponse = await Axios.get(
        `${apiUrl}/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedServices = invoiceResponse.data.services;
      setProductList([]);
      updatedServices.forEach((service) => {
        setProductList((prevList) => [
          ...prevList,
          {
            title: service.title,
            quantity: service.quantity,
            unitCost: service.unitCost,
            vat: service.vat,
            totalPrice: service.totalPrice,
          },
        ]);
      });

      setIsInvoiceCreateVisible(!isInvoiceCreateVisible);
      setIsProductListVisible(!isProductListVisible);

      navigate("/invoice-step-four");
    } catch (error) {
      console.error("Error submitting invoice data:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.violations
      ) {
        const validationErrors = [];

        error.response.data.violations.forEach((violation) => {
          validationErrors.push(violation.message);
        });

        setGlobalErrors([...globalErrors, ...validationErrors]);
      }
    }
  };

  const handleCreateInvoice = async () => {
  if (productList.length === 0) {
    addGlobalError("Vous ne pouvez créer une facture sans produits.");
    return;
  }

  try {
    await Axios.put(
      `${apiUrl}/invoices/${invoiceId}`,
      { totalPrice: totalTTC },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    navigate("/invoice-step-five");
  } catch (error) {
    console.error("Error updating invoice data:", error);
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

  const handleDeleteProduct = async (productId) => {
    try {
      if (productId) {
        await Axios.delete(`${apiUrl}/services/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProductList((prevList) =>
          prevList.filter((product) => product.id !== productId)
        );
      } else {
        console.error("Product ID is undefined.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return (
    <div className="invoice-step-one-page fade-in">
      <Helmet>
        <title>Ajout Produits/Services | Beheall</title>
      </Helmet>
      {globalErrors.length > 0 && <div className="overlay"></div>}
      <div className="welcome-user">
        <h1>création factures</h1>
        <Account />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°4</h2>
      </div>
      <div>
        <div
          className={
            isInvoiceCreateVisible
              ? "invoice-create"
              : "invoice-create display-none"
          }
        >
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
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Nom du produit ou service"
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
                placeholder="Prix unitaires / Prix journalier"
                onChange={handleInputChange}
                step="0.01"
              />
              <input
                type="number"
                name="quantity"
                id="quantity"
                placeholder="Quantité / Durée en jours"
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="totalPrice"
                id="totalPrice"
                placeholder="Prix HT"
                onChange={handleInputChange}
                value={formData.totalPrice}
                step="0.01"
              />
              <input
                type="number"
                name="vat"
                id="vat"
                placeholder="TVA"
                onChange={handleInputChange}
                step="0.01"
              />
              <div className="btn-invoice-4">
                <button type="submit">Ajouter le produit</button>
              </div>
              <div className="center-plus">
                <img
                  src="going-back.svg"
                  alt="Revenir en arrière"
                  onClick={handleRefreshPage}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className={
          isProductListVisible ? "product-list" : "product-list display-none"
        }
      >
        <ul className="product-header">
          <li>Intitulés</li>
          <li>Volumes</li>
          <li>Tarifs</li>
          <li>TVA</li>
          <li>Prix HT</li>
          <li>Action</li>
        </ul>
        {productList.map((product, index) => (
          <ul
          className={`product-item ${
            isSmallScreen ? "small-screen" : "large-screen"
          }`}
          key={index}
        >
          <li>
            {product.title.length > (isSmallScreen ? 8 : 25)
              ? `${product.title.substring(0, isSmallScreen ? 8 : 25)}...`
              : product.title}
          </li>
            <li>{product.quantity}</li>
            <li>{product.unitCost}€</li>
            <li>{product.vat}%</li>
            <li>{product.totalPrice}€</li>
            <li>
              <img
                className="delete-icon"
                onClick={() => handleDeleteProduct(product.id)}
                src="delete-icon.svg"
                alt="Supprimer le produit"
              />
            </li>
          </ul>
        ))}
        <div className="center-plus">
          <img
            src="/plus.svg"
            alt="Ajouter un produit ou un service"
            onClick={handleToggle}
          />
        </div>
        <div className="total-price">
          <p>Total TTC: {totalTTC.toFixed(2)}€</p>
        </div>
        <div className="btn-invoice-add-ps fixed-btn-4">
          <button type="submit" onClick={handleCreateInvoice}>
            Créer votre facture
          </button>
        </div>
      </div>
      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
    </div>
  );
};
