// Importation des modules nécessaires depuis React et d'autres bibliothèques
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Footer from "../components/Footer.js";

/*
  Page représentant l'ajout de produits et services pour la facture'.
  Affiche les produits/services, permet de supprimer les ajouts
  Calcul du PVHT & TVA automatique
  Permet de passer au step five de la facture
 */
export const InvoiceStepFour = () => {
  // Récupération du jeton d'authentification et du navigateur
  const token = localStorage.getItem("Token");

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // Récupération de l'identifiant de la facture à partir du stockage local
  const invoiceId = localStorage.getItem("invoice");

  // Initialisation des états locaux pour les produits, le total TTC, les erreurs globales, l'URL de l'API, et le formulaire de création
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

  // État local pour déterminer si l'écran est de petite taille
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1200);

  // Effet pour mettre à jour l'état "isSmallScreen" en fonction de la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fonction pour ajouter une erreur globale à la liste d'erreurs
  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  // États locaux pour gérer l'affichage des sections de création de facture et de liste de produits
  const [isInvoiceCreateVisible, setIsInvoiceCreateVisible] = useState(false);
  const [isProductListVisible, setIsProductListVisible] = useState(true);

  // Effet pour rediriger si l'utilisateur n'est pas authentifié ou s'il n'a pas sélectionné de facture
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (!invoiceId) {
      navigate("/invoice-step-one");
    }

    // Fonction asynchrone pour récupérer les produits associés à la facture
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

    // Appel de la fonction pour récupérer les produits
    fetchProducts();
  }, [token, navigate, invoiceId]);

  // Fonction pour rafraîchir la page
  const handleRefreshPage = () => {
    window.location.reload();
  };

  // Effet pour calculer le total TTC en fonction de la liste de produits
  useEffect(() => {
    const calculateTotalTTC = () => {
      let total = 0;

      productList.forEach((product) => {
        total += product.totalPrice + (product.totalPrice * product.vat) / 100;
      });

      return total;
    };

    // Calcul initial du total TTC
    const initialTotalTTC = calculateTotalTTC();
    setTotalTTC(initialTotalTTC);
  }, [productList]);

  // Constante pour définir le nombre maximum de produits autorisés
  const MAX_PRODUCTS = 5;

  // Fonction pour gérer la soumission du formulaire de création de produit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Vérification du nombre maximum de produits autorisés
    if (productList.length >= MAX_PRODUCTS) {
      addGlobalError("Vous ne pouvez ajouter que 5 produits/services");
      return;
    }

    try {
      // Envoi des données du formulaire pour créer un nouveau produit
      await Axios.post(`${apiUrl}/services`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Réinitialisation du formulaire après la soumission
      setFormData({
        title: "",
        description: "",
        quantity: 0,
        unitCost: 0,
        totalPrice: 0,
        vat: 0,
        invoice: `/api/invoices/${invoiceId}`,
      });

      // Récupération des services mis à jour pour mettre à jour la liste de produits
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

      // Inversion de la visibilité des sections de création de facture et de liste de produits
      setIsInvoiceCreateVisible(!isInvoiceCreateVisible);
      setIsProductListVisible(!isProductListVisible);

      // Redirection vers la page courante
      navigate("/invoice-step-four");
    } catch (error) {
      // Gestion des erreurs de validation et affichage des messages d'erreur appropriés
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
      if (!formData.unitCost) {
        addGlobalError("Le coût unitaire/journalier ne peut être vide.");
        return;
      }

      if (!formData.quantity) {
        addGlobalError("La quantité/durée journalier ne peut être vide.");
        return;
      }

      if (!formData.totalPrice) {
        addGlobalError("Le prix total HT ne peut être vide.");
        return;
      }
    }
  };

  // Fonction pour mettre à jour le total TTC de la facture
  const handleCreateInvoice = async () => {
    try {
      // Mise à jour du montant total de la facture
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

      // Redirection vers l'étape suivante
      navigate("/invoice-step-five");
    } catch (error) {
      navigate("/dashboard");
    }
  };

  // Fonction pour basculer entre l'affichage de la création de facture et la liste de produits
  const handleToggle = () => {
    setIsInvoiceCreateVisible(!isInvoiceCreateVisible);
    setIsProductListVisible(!isProductListVisible);
  };

  // Fonction pour gérer les changements dans les champs du formulaire
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

  // Fonction pour supprimer un produit de la liste
  const handleDeleteProduct = async (productId) => {
    try {
      if (productId) {
        // Suppression du produit via l'API
        await Axios.delete(`${apiUrl}/services/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Mise à jour de la liste de produits côté client
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

  // Fonction pour fermer les alertes globales
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  // Rendu JSX de la page InvoiceStepFour
  return (
    <div className="invoice-step-one-page fade-in">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Ajout Produits/Services | Beheall</title>
          <meta
            name="description"
            content="Ajoutez des produits et services à votre facture sur Beheall. Personnalisez les articles, spécifiez les prix, et créez une liste complète des éléments inclus dans votre facture. Simplifiez la gestion de vos produits et services avec Beheall."
          />
        </Helmet>
        {/* Affichage d'une superposition d'erreur si des erreurs globales sont présentes */}
        {globalErrors.length > 0 && <div className="overlay"></div>}
        
        {/* Bloc avec le titre et le composant Account */}
        <div className="beheall-title-style-page">
          <h1>création factures</h1>
          <Account />
        </div>
        {/* Bloc pour afficher l'étape en cours */}
        <div className="invoice-step-one-title">
          <h2>Etape</h2>
          <h2>N°4</h2>
        </div>
        <div>
          {/* Section de création de facture */}
          <div
            className={
              isInvoiceCreateVisible
                ? "invoice-create"
                : "invoice-create display-none"
            }
          >
            <div className="add-company">
              {/* Affichage d'alertes en cas d'erreurs globales */}
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
                  placeholder="TVA (Mettre 0 si le produit ou service est exempté de la TVA)"
                  onChange={handleInputChange}
                  step="0.01"
                />
                <div className="btn-invoice-4">
                  <button type="submit">Ajouter le produit</button>
                </div>
                <div className="center-plus">
                  <img
                    src="going-back.svg"
                    alt="Rafraîchir la page"
                    onClick={handleRefreshPage}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Section affichant la liste des produits */}
        <div
          className={
            isProductListVisible ? "product-list" : "product-list display-none"
          }
        >
          {/* En-tête de la liste des produits */}
          <ul className="product-header">
            <li>Intitulés</li>
            <li>Volumes</li>
            <li>Tarifs</li>
            <li>TVA</li>
            <li>Prix HT</li>
            <li>Supprimer</li>
          </ul>
          {/* Affichage de chaque produit dans la liste */}
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
          {/* Bouton pour ajouter un nouveau produit ou service */}
          <div className="center-plus">
            <img
              src="/plus.svg"
              alt="Ajouter un produit ou un service"
              onClick={handleToggle}
            />
          </div>
          {/* Affichage du total TTC de la facture */}
          <div className="total-price">
            <p>Total TTC: {totalTTC.toFixed(2)}€</p>
          </div>
          {/* Bouton pour créer la facture si des produits sont présents */}
          <div className="btn-invoice-add-ps fixed-btn-4">
            {productList.length > 0 && (
              <button type="submit" onClick={handleCreateInvoice}>
                Créer votre facture
              </button>
            )}
          </div>
        </div>
        {/* Composant de navigation accordéon */}
        <AccordionNav />
        {/* Pied de page pour la version desktop */}
        <div className="desktop-footer">
          <Footer />
        </div>
      </HelmetProvider>
    </div>
  );
};
