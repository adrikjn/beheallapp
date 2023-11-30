import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardLogic = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  const [userCompanies, setUserCompanies] = useState([]);
  const userData = JSON.parse(localStorage.getItem("UserData"));
  const currentDate = new Date();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else if (userData && userData.companies && userData.companies.length) {
      const companyIds = userData.companies.map((company) => company.id);

      const fetchData = async () => {
        try {
          const companiesData = await Promise.all(
            companyIds.map(async (companyId) => {
              const response = await fetch(`${apiUrl}/companies/${companyId}`, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const companyData = await response.json();
              return companyData;
            })
          );
          setUserCompanies(companiesData);
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };
      fetchData();
    }
  }, [token, navigate, userData, apiUrl]);

  const allInvoices = userCompanies.flatMap((company) => company.invoices);
  const sortedInvoices = allInvoices.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const lastTwoInvoices = sortedInvoices.slice(0, 2);

  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const formattedCurrentDate = `${currentMonth} ${currentYear}`;

  const invoicesThisMonth = allInvoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    const invoiceMonth = invoiceDate.toLocaleString("default", {
      month: "long",
    });
    return invoiceMonth.toLowerCase() === currentMonth.toLowerCase();
  });

  const totalThisMonth = invoicesThisMonth.reduce(
    (total, invoice) => total + invoice.totalPrice,
    0
  );

  const formattedTotalThisMonth = totalThisMonth.toFixed(2);

  const displayTotalThisMonth =
    totalThisMonth <= 99999999
      ? `${formattedTotalThisMonth} €`
      : "Supérieur à 99.999.999€ ";

  const hasDraftInvoice = lastTwoInvoices.some(
    (invoice) => invoice.status === "brouillon"
  );

  const storeDraftInvoiceIdLocally = () => {
    const lastDraftInvoice = lastTwoInvoices.find(
      (invoice) => invoice.status === "brouillon"
    );

    if (lastDraftInvoice) {
      localStorage.setItem("invoice", lastDraftInvoice.id);
    }
  };

  const storedDraftInvoiceId = localStorage.getItem("invoice");

  if (!storedDraftInvoiceId && hasDraftInvoice) {
    storeDraftInvoiceIdLocally();
  }

  const deleteInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`${apiUrl}/invoices/${invoiceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedInvoices = allInvoices.filter(
          (invoice) => invoice.id !== invoiceId
        );
        setUserCompanies(
          userCompanies.map((company) => ({
            ...company,
            invoices: updatedInvoices.filter(
              (invoice) => invoice.companyId === company.id
            ),
          }))
        );
        localStorage.removeItem("invoice");
      } else {
        console.error("La suppression de la facture a échoué.");
      }
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la suppression de la facture:",
        error
      );
    }
  };

  return {
    token,
    navigate,
    userCompanies,
    userData,
    currentDate,
    apiUrl,
    sortedInvoices,
    lastTwoInvoices,
    currentMonth,
    currentYear,
    formattedCurrentDate,
    invoicesThisMonth,
    totalThisMonth,
    formattedTotalThisMonth,
    displayTotalThisMonth,
    hasDraftInvoice,
    storeDraftInvoiceIdLocally,
    storedDraftInvoiceId,
    deleteInvoice,
  };
};

export default DashboardLogic;
