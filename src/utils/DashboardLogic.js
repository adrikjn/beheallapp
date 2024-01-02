import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Fonctionnalités de logique pour le tableau de bord
const DashboardLogic = () => {
  // Récupère le jeton JWT du localStorage
  const token = localStorage.getItem("Token");

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // État local pour stocker les informations sur les entreprises de l'utilisateur
  const [userCompanies, setUserCompanies] = useState([]);

  // Données utilisateur stockées localement
  const userData = JSON.parse(localStorage.getItem("UserData"));

  // Date actuelle
  const currentDate = new Date();

  // URL de l'API backend
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // useEffect(() => {
  //   // Redirige vers la page de connexion si aucun jeton n'est présent en LocalStorage
  //   if (!token) {
  //     navigate("/login");
  //   }
  //   // Effectue une requête pour obtenir les données des entreprises associées à l'utilisateur
  //   else if (userData && userData.companies && userData.companies.length) {
  //     const companyIds = userData.companies.map((company) => company.id);

  //     // Fonction pour récupérer les données d'une entreprise
  //     const fetchData = async () => {
  //       try {
  //         // Utilisation de Promise.all pour effectuer les requêtes en parallèle
  //         const companiesData = await Promise.all(
  //           companyIds.map(async (companyId) => {
  //             const response = await fetch(`${apiUrl}/companies/${companyId}`, {
  //               method: "GET",
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             });
  //             const companyData = await response.json();
  //             return companyData;
  //           })
  //         );
  //         setUserCompanies(companiesData);
  //       } catch (error) {
  //         console.error("Error fetching company data:", error);
  //       }
  //     };
  //     fetchData();
  //   }
  // }, [token, navigate, userData, apiUrl]);

  // Rassemble toutes les factures des entreprises de l'utilisateur
  const allInvoices = userCompanies.flatMap((company) => company.invoices);

  // Trie les factures par date de création (de la plus récente à la plus ancienne)
  const sortedInvoices = allInvoices.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Sélectionne les deux dernières factures
  const lastTwoInvoices = sortedInvoices.slice(0, 2);

  // Mois et année actuels
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();
  const formattedCurrentDate = `${currentMonth} ${currentYear}`;

  // Filtre les factures du mois actuel
  const invoicesThisMonth = allInvoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.createdAt);
    const invoiceMonth = invoiceDate.toLocaleString("default", {
      month: "long",
    });
    return invoiceMonth.toLowerCase() === currentMonth.toLowerCase();
  });

  // Calcule le total des factures du mois actuel
  const totalThisMonth = invoicesThisMonth.reduce(
    (total, invoice) => total + invoice.totalPrice,
    0
  );

  // Formatte le total du mois actuel
  const formattedTotalThisMonth = totalThisMonth.toFixed(2);

  // Affiche le total du mois actuel avec un indicateur "€" si inférieur à 99 999 999
  const displayTotalThisMonth =
    totalThisMonth <= 99999999
      ? `${formattedTotalThisMonth} €`
      : "Supérieur à 99.999.999€ ";

  // Vérifie si l'utilisateur a une facture en brouillon parmi les deux dernières
  const hasDraftInvoice = lastTwoInvoices.some(
    (invoice) => invoice.status === "brouillon"
  );

  // Stocke localement l'ID de la dernière facture en brouillon
  const storeDraftInvoiceIdLocally = () => {
    const lastDraftInvoice = lastTwoInvoices.find(
      (invoice) => invoice.status === "brouillon"
    );

    if (lastDraftInvoice) {
      localStorage.setItem("invoice", lastDraftInvoice.id);
    }
  };

  // Récupère localement l'ID de la dernière facture en brouillon
  const storedDraftInvoiceId = localStorage.getItem("invoice");

  // Stocke l'ID de la dernière facture en brouillon s'il n'est pas déjà stocké
  if (!storedDraftInvoiceId && hasDraftInvoice) {
    storeDraftInvoiceIdLocally();
  }

  // Supprime une facture par son ID
  const deleteInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`${apiUrl}/invoices/${invoiceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Met à jour les données des entreprises et supprime l'ID de la facture en local
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

  // Retourne les valeurs nécessaires
  return {
    userData,
    lastTwoInvoices,
    formattedCurrentDate,
    displayTotalThisMonth,
    storedDraftInvoiceId,
    deleteInvoice
  };
};

export default DashboardLogic;
