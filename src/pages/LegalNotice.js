// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React from "react";
import "../App.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";
import Account from "../components/Account";
import GoingBackLogin from "../components/GoingBackLogin.js";

/*
 Page représentant les mentions légales de Beheall.
 Affiche les règles et réglementations liées à l'utilisation du service, les coordonnées, et les informations sur le projet scolaire.
*/
export const LegalNotice = () => {
  // Vérifie la présence d'un jeton JWT dans le localStorage
  const hasToken = !!localStorage.getItem("Token");

  // Rendu du composant LegalNotice
  return (
    <div className={`legal-policy${hasToken ? " avec-token" : ""}`}>
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Mentions Légales | Beheall</title>
          <meta
            name="description"
            content="Consultez nos mentions légales pour obtenir des informations sur notre application web, nos coordonnées, et les règles et réglementations qui s'appliquent à l'utilisation de notre service de génération de factures en ligne."
          />
        </Helmet>
        {/* Contenu de la page des Mentions Légales */}
        <div>
          {/* Bouton de retour à la page de connexion s'il n'y a pas de jeton */}
          {!hasToken && <GoingBackLogin />}

          {/* Titre de la page avec le logo permettant d'aller dans la partie compte ou se déconnecter, seulement s'il y a un jeton */}
          <h1>Mentions Légales {hasToken && <Account />}</h1>

          {/* Section des règles des Mentions Légales */}
          <div className="legal-notice-rules">
            <p>
              Ce site web permet de créer des factures en ligne dans le cadre
              d'un projet scolaire réalisé dans le cadre de l'obtention de mon
              bac +2 Développeur d'Applications Multimédia à Doranco. Les
              factures générées respectent les lois en vigueur et sont
              utilisables conformément à la législation.
            </p>
            <p>Responsable de la publication : KOUYOUMJIAN Adrien</p>
            <p>
              Les factures générées sur ce site sont destinées à des fins
              pédagogiques et démonstratives, mais elles sont également
              conformes aux exigences légales. Elles peuvent être utilisées
              conformément à la législation en vigueur.
            </p>
            <p>
              Pour toute question ou commentaire concernant ce projet scolaire,
              veuillez nous contacter à beheallpro@outlook.com.
            </p>
            <p>Date de dernière mise à jour : 30/09/2023</p>
          </div>
        </div>

        {/* Affichage de la navigation accordéon ou header si l'utilisateur est connecté */}
        {hasToken && <AccordionNav />}

        {/* Pied de page */}
        <Footer />
      </HelmetProvider>
    </div>
  );
};
