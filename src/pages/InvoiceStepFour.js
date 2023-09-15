import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";

export const InvoiceStepFour = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const invoiceId = localStorage.getItem("invoice");
  const [productList, setProductList] = useState([]);
  const [totalTTC, setTotalTTC] = useState(0);
  const [globalErrors, setGlobalErrors] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    quantity: 0,
    unitCost: 0,
    totalPrice: 0,
    vat: 0,
    invoice: `/api/invoices/${invoiceId}`,
  });

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

    // Effectuer la requête GET pour obtenir la liste des produits
    const fetchProducts = async () => {
      try {
        const invoiceResponse = await Axios.get(
          `http://localhost:8000/api/invoices/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedServices = invoiceResponse.data.services;

        // Mettre à jour la liste des produits dans l'état
        setProductList(updatedServices);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      }
    };

    // Charger les produits lorsque le composant est monté
    fetchProducts();
  }, [token, navigate, invoiceId]);

  useEffect(() => {
    // Fonction pour calculer le total TTC
    const calculateTotalTTC = () => {
      let total = 0;

      // Parcourez la liste des produits et ajoutez le prix total de chaque produit au total
      productList.forEach((product) => {
        total += product.totalPrice + (product.totalPrice * product.vat) / 100;
      });

      return total;
    };

    // Après le chargement initial des produits, calculez le total TTC
    const initialTotalTTC = calculateTotalTTC();
    setTotalTTC(initialTotalTTC);
  }, [productList]);

  const MAX_PRODUCTS = 5;

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (productList.length >= MAX_PRODUCTS) {
      // Display an error message or prevent adding more products
      addGlobalError("Vous ne pouvez que ajouter 5 produits/services");
      return;
    }

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

      const invoiceResponse = await Axios.get(
        `http://localhost:8000/api/invoices/${invoiceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assurez-vous que token contient le jeton d'accès valide
          },
        }
      );

      // Mettre à jour la liste des produits dans l'interface utilisateur
      const updatedServices = invoiceResponse.data.services;
      // Supprimez les éléments actuels de la liste (remplacez par la nouvelle liste)
      setProductList([]);
      // Ajoutez les services mis à jour à la liste
      updatedServices.forEach((service) => {
        setProductList((prevList) => [
          ...prevList,
          {
            title: service.title,
            quantity: service.quantity,
            unitCost: service.unitCost,
            vat: service.vat, // Utilisez la TVA saisie dans le formulaire
            totalPrice: service.totalPrice,
          },
        ]);
      });

      // Toggle visibility after form submission
      setIsInvoiceCreateVisible(!isInvoiceCreateVisible);
      setIsProductListVisible(!isProductListVisible);

      navigate("/invoice-step-four");
    } catch (error) {
      console.error("Error submitting invoice data:", error);
      // Si l'erreur est liée à la validation du formulaire, par exemple, en cas de validation Symfony, vous pouvez extraire les erreurs de la réponse
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

  const handleCreateInvoice = async () => {
    try {
      // Envoyer la valeur de totalTTC à l'API pour mettre à jour le champ totalPrice de l'Invoice
      await Axios.put(
        `http://localhost:8000/api/invoices/${invoiceId}`,
        { totalPrice: totalTTC }, // Envoyer la nouvelle valeur de totalPrice
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Rediriger l'utilisateur vers une page de confirmation ou de récapitulatif
      navigate("/invoice-step-five");
    } catch (error) {
      console.error("Error updating invoice data:", error);
      // Gestion des erreurs ici (affichage d'un message à l'utilisateur, etc.)
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
        // Envoyer une requête DELETE à l'API pour supprimer le produit
        await Axios.delete(`http://localhost:8000/api/services/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Mettre à jour la liste des produits en supprimant le produit supprimé
        setProductList((prevList) =>
          prevList.filter((product) => product.id !== productId)
        );
      } else {
        console.error("Product ID is undefined.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      // Gestion des erreurs ici (affichage d'un message à l'utilisateur, etc.)
    }
  };

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return (
    <div className="invoice-step-one-page">
      {globalErrors.length > 0 && <div className="overlay"></div>}
      <div className="welcome-user">
        <h1>creation factures</h1>
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
            {/* Affichez les erreurs globales dans un composant d'alerte */}
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
          <ul className="product-item" key={index}>
            <li>
              {product.title.length > 8
                ? `${product.title.substring(0, 8)}...`
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
                alt="Delete"
              />
            </li>
          </ul>
        ))}
        <div className="center-plus">
          <img src="/plus.svg" alt="add-products" onClick={handleToggle} />
        </div>
        <div className="total-price">
          <p>Total TTC: {totalTTC.toFixed(2)}€</p>
        </div>
        <div className="btn-invoice-2">
          <button type="submit" onClick={handleCreateInvoice}>
            Créer votre facture
          </button>
        </div>
      </div>
      <AccordionNav />
    </div>
  );
};
