import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Footer from "../components/Footer.js";


export const InvoiceStepTwo = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const invoiceData = JSON.parse(localStorage.getItem("InvoiceData"));
  const selectedCompanyId = invoiceData ? invoiceData.company : null;
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("undefined");
  const [globalErrors, setGlobalErrors] = useState([]);
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const [formData, setFormData] = useState({
    company: `/api/companies/${selectedCompanyId}`,
    lastName: "",
    firstName: "",
    companyName: "",
    email: "",
    activity: "",
    address: "",
    vatId: "",
    city: "",
    postalCode: "",
    website: "",
    country: "",
    phoneNumber: "",
    notes: "",
    sirenSiret: "",
  });



  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (!invoiceData) {
      navigate("/invoice-step-one");
      return;
    }
  }, [token, navigate, invoiceData]);

  useEffect(() => {
    console.log(selectedCustomer);
    if (selectedCustomer !== "undefined") {
      document.getElementById("newCompanieForm").classList.add("display-none");
    } else {
      document
        .getElementById("newCompanieForm")
        .classList.remove("display-none");
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (selectedCompanyId) {
      Axios.get(`${apiUrl}/companies/${selectedCompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const selectedCompanyDetails = response.data;

          const customerOptions = selectedCompanyDetails.customers.map(
            (customer) => ({
              id: customer.id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              companyName: customer.companyName,
            })
          );

          setCompanyOptions(customerOptions);
        })
        .catch((error) => {
          console.error("Error fetching selected company details:", error);
        });
    }
  }, [selectedCompanyId, token]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post(
        `${apiUrl}/customers`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Customer data submitted:", response.data);

      const newCustomerId = response.data.id; 

      invoiceData.customer = newCustomerId; 
      localStorage.setItem("InvoiceData", JSON.stringify(invoiceData)); 

      Axios.get(`${apiUrl}/companies/${selectedCompanyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const selectedCompanyDetails = response.data;

          const customerOptions = selectedCompanyDetails.customers.map(
            (customer) => ({
              id: customer.id,
              firstName: customer.firstName,
              lastName: customer.lastName,
              companyName: customer.companyName,
            })
          );

          setCompanyOptions(customerOptions);
        })
        .catch((error) => {
          console.error("Error fetching selected company details:", error);
        });
      navigate("/invoice-step-three");
    } catch (error) {
      console.error("Error submitting customer data:", error);
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

  const handleSelectChange = async (e) => {
    setSelectedCustomer(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? e.target.checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleContinueClick = async () => {
    if (selectedCustomer !== "undefined" && selectedCustomer !== null) {
      try {
        invoiceData.customer = selectedCustomer; 
        localStorage.setItem("InvoiceData", JSON.stringify(invoiceData)); 
        navigate("/invoice-step-three");
      } catch (error) {
        console.error("Error navigating:", error);
      }
    } else {
      console.log("Aucune entreprise sélectionnée.");
    }
  };

  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return (
    <div className="invoice-step-one-page fade-in">
      <HelmetProvider>
      <Helmet>
        <title>Ajout Client | Beheall</title>
      </Helmet>
      {globalErrors.length > 0 && <div className="overlay"></div>}
      <div className="welcome-user">
        <h1>création factures</h1>
        <Account />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°2</h2>
      </div>
      <p className="invoice-step-one-p">Sélectionner un destinataire</p>

      <select
        onChange={handleSelectChange}
        name="name"
        className="select-company"
      >
        <option defaultValue value="undefined">
          Sélectionner un client
        </option>
        {companyOptions.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.firstName} {customer.lastName} - {customer.companyName}
          </option>
        ))}
      </select>
      <div id="newCompanieForm">
        <div className="add-company-exp">
          <h2>nouveau client</h2>
        </div>
        <form onSubmit={handleFormSubmit}>
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
            <div className="input-row">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="firstName"
                placeholder="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              id="companyName"
              placeholder="Entreprise (laissez le champ vide si indépendent)"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
            />
            <div className="invoice-step-sizes">
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="tel"
              id="tel"
              placeholder="Téléphone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            </div>
            <input
              type="text"
              id="address"
              placeholder="Adresse de facturation"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            <div className="input-row">
              <input
                type="text"
                id="city"
                placeholder="Ville"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                id="postalCode"
                placeholder="Code postal"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
              />
            </div>
            <div className="switch-container">
              <label htmlFor="showAdditionalFields">
                Afficher les champs facultatifs :
              </label>
              <input
                type="checkbox"
                id="showAdditionalFields"
                checked={showAdditionalFields}
                onChange={() => setShowAdditionalFields(!showAdditionalFields)}
              />
            </div>
            {showAdditionalFields && (
              <>
            <div className="invoice-step-sizes">
                <input
                  type="text"
                  id="siret"
                  placeholder="SIREN/SIRET"
                  name="sirenSiret"
                  value={formData.sirenSiret}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="vatId"
                  placeholder="Numéro de TVA Intracommunautaire"
                  name="vatId"
                  value={formData.vatId}
                  onChange={handleInputChange}
                />
                </div>
                <input
                  type="text"
                  id="activity"
                  placeholder="Activité"
                  name="activity"
                  value={formData.activity}
                  onChange={handleInputChange}
                />
            <div className="invoice-step-sizes">
                <input
                  type="text"
                  id="website"
                  placeholder="Site web"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  id="country"
                  placeholder="Pays"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
                </div>
                <textarea
                  id="notes"
                  placeholder="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </>
            )}
          </div>
          <div className="btn-invoice-2 btn-m">
            <button>Ajouter</button>
          </div>
        </form>
      </div>

      <div className="btn-invoice-2 fixed-btn">
        {selectedCustomer !== "undefined" && selectedCustomer !== null && (
          <button onClick={handleContinueClick}>Continuer</button>
        )}
      </div>
      <AccordionNav />
      <div className="desktop-footer">
        <Footer />
      </div>
      </HelmetProvider>
    </div>
  );
};
