import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import AccordionNav from "../components/AccordionNav";

export const InvoiceStepTwo = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();
  const invoiceData = JSON.parse(localStorage.getItem("InvoiceData"));
  const selectedCompanyId = invoiceData.company;
  const [companyOptions, setCompanyOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("undefined");
  const [formData, setFormData] = useState({
    company: `/api/companies/${selectedCompanyId}`,
    lastName: "",
    firstName: "",
    companyName: "",
    email: "",
    activity: "",
    address: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    website: "",
    country: "",
    companyAddress: "",
    billingAddress: "",
    phoneNumber: "",
    notes: "",
  });

  //? Il faudra récupérer l'id et le stocker dans le storage qu'on a déja crée à la fin. (2/4)

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

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
      Axios.get(`http://localhost:8000/api/companies/${selectedCompanyId}`, {
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
        "http://localhost:8000/api/customers",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Customer data submitted:", response.data);

      const newCustomerId = response.data.id; // Get the newly created customer's ID

      invoiceData.customer = newCustomerId; // Store selectedCustomerId in invoiceData
      localStorage.setItem("InvoiceData", JSON.stringify(invoiceData)); // Save updated invoiceData in localStorage

      Axios.get(`http://localhost:8000/api/companies/${selectedCompanyId}`, {
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
        invoiceData.customer = selectedCustomer; // Store selectedCustomerId in invoiceData
        localStorage.setItem("InvoiceData", JSON.stringify(invoiceData)); // Save updated invoiceData in localStorage
        navigate("/invoice-step-three");
      } catch (error) {
        console.error("Error navigating:", error);
      }
    } else {
      console.log("Aucune entreprise sélectionnée.");
    }
  };

  return (
    <div className="invoice-step-one-page">
      <div className="welcome-user">
        <h1>creation factures</h1>
        <img src="/profil-icon.svg" alt="facture" />
      </div>
      <div className="invoice-step-one-title">
        <h2>Etape</h2>
        <h2>N°2</h2>
      </div>
      <p className="invoice-step-one-p">Sélectionné un destinaire</p>

      <select
        onChange={handleSelectChange}
        name="name"
        className="select-company"
      >
        <option defaultValue value="undefined">Sélectionner un client</option>
        {companyOptions.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.firstName} {customer.lastName} - {customer.companyName}
          </option>
        ))}
      </select>
      <div id="newCompanieForm">
      <div className="add-company-exp">
        <h2>new client</h2>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="add-company">
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
            placeholder="Nom de l'entreprise"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
          />
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
          <input
            type="text"
            id="activity"
            placeholder="Activité"
            name="activity"
            value={formData.activity}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="address"
            placeholder="Adresse"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="addressLine2"
            placeholder="Suite de l'adresse de livraison"
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleInputChange}
          />
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
          <input
            type="text"
            id="companyAddress"
            placeholder="Adresse de l'entreprise"
            name="companyAddress"
            value={formData.companyAddress}
            onChange={handleInputChange}
          />
          <input
            type="text"
            id="billingAddress"
            placeholder="Adresse de facturation"
            name="billingAddress"
            value={formData.billingAddress}
            onChange={handleInputChange}
          />
          <textarea
            id="notes"
            placeholder="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="btn-invoice-2">
          <button>Ajouter un client</button>
        </div>
      </form>
      </div>

      <div className="btn-invoice-2 fixed-btn">
        {selectedCustomer !== "undefined" && selectedCustomer !== null && (
          <button onClick={handleContinueClick}>Continuer</button>
        )}
      </div>
      <AccordionNav />
    </div>
  );
};
