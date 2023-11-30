// Importation des modules nécessaires depuis React et d'autres bibliothèques
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// Logique de la page des factures
const InvoiceLogic = () => {
  // Récupère le jeton JWT du localStorage
  const [token, setToken] = useState(localStorage.getItem("Token"));

  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // Données utilisateur stockées localement
  const userData = JSON.parse(localStorage.getItem("UserData"));

  // État local pour stocker les informations sur les entreprises de l'utilisateur
  const [userCompanies, setUserCompanies] = useState([]);

  // URL de l'API backend
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    // Redirige vers la page de connexion si aucun jeton n'est présent
    if (!token) {
      navigate("/login");
    }
    // Effectue une requête pour obtenir les données des entreprises associées à l'utilisateur
    else if (userData && userData.companies && userData.companies.length) {
      const companyIds = userData.companies.map((company) => company.id);

      // En-têtes pour l'autorisation
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fonction pour récupérer les données d'une entreprise
      const fetchCompanyData = async (companyId) => {
        try {
          const response = await Axios.get(`${apiUrl}/companies/${companyId}`, {
            headers,
          });
          return response.data;
        } catch (error) {
          console.error("Error fetching company data:", error);
        }
      };

      // Utilisation de Promise.all pour effectuer les requêtes en parallèle
      Promise.all(companyIds.map((companyId) => fetchCompanyData(companyId)))
        .then((companies) => {
          setUserCompanies(companies);
        })
        .catch((error) => {
          console.error("Error fetching company data:", error);
        });
    }
  }, [token, navigate, userData, apiUrl]);

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR");
  };

  // Retourne les valeurs nécessaires à la page des factures
  return {
    userCompanies,
    formattedDate,
    setToken
  };
};

export default InvoiceLogic;
