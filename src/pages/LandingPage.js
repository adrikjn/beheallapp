// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../components/Logo";
import Brand from "../components/Brand";
import { Helmet, HelmetProvider } from "react-helmet-async";

/*
 Page de lancement Beheall
Redirection après quelques secondes sur la page Login
*/
export const LandingPage = () => {
  // Utilitaire de navigation fourni par react-router-dom
  const navigate = useNavigate();

  // Effet pour rediriger vers le tableau de bord si un jeton est présent
  useEffect(() => {
    // Vérification de la présence d'un jeton dans le stockage local
    const hasToken = !!localStorage.getItem("Token");

    // Redirection vers le tableau de bord si un jeton est présent
    if (hasToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Effet pour rediriger vers la page de connexion après un délai de 3 secondes
  useEffect(() => {
    // Configuration d'une temporisation pour la redirection
    const redirectTimeout = setTimeout(() => {
      navigate("/login");
    }, 3000);

    // Nettoyage de la temporisation lorsque le composant est démonté
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  return (
    <div className="landing-page">
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>
            Beheall | Facture en Ligne - Générez des Factures Gratuitement,
            Rapidement & Facilement
          </title>
          <meta
            name="description"
            content="Simplifiez la création de factures avec Beheall, votre service de facturation en ligne. Générez rapidement et gratuitement des factures professionnelles. Essayez dès maintenant Beheall !"
          />
        </Helmet>

        {/* Contenu de la page de lancement */}
        <div className="landing-page-height">
          <Logo />
          <Brand />
          <div className="infos">
            <p>simple</p>
            <p>intuitif</p>
            <p>rapide</p>
          </div>
        </div>
      </HelmetProvider>
    </div>
  );
};
