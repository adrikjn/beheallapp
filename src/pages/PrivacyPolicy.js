// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React from "react";
import "../App.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";
import Account from "../components/Account";
import GoingBackLogin from "../components/GoingBackLogin.js";

/*
 Page représentant la Politique de Confidentialité de Beheall.
 Explique comment les données personnelles sont collectées, utilisées et protégées lors de l'utilisation du service de génération de factures en ligne.
*/
export const PrivacyPolicy = () => {
  // Vérifie la présence d'un jeton JWT dans le localStorage
  const hasToken = !!localStorage.getItem("Token");

  // Rendu du composant PrivacyPolicy
  return (
    <div className={`legal-policy${hasToken ? " avec-token" : ""}`}>
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Politique de Confidentialité | Beheall</title>
          <meta
            name="description"
            content="Découvrez notre politique de confidentialité pour comprendre comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre service de génération de factures en ligne. Nous nous engageons à garantir la sécurité et la confidentialité de vos informations."
          />
        </Helmet>
        {/* Affichage du bouton de retour à la page de connexion s'il n'y a pas de jeton */}
        {!hasToken && <GoingBackLogin />}
        {/* Titre de la page avec le logo permettant d'aller dans la partie compte ou se déconnecter, seulement s'il y a un jeton */}
        <h1>Politique de Confidentialité {hasToken && <Account />}</h1>

        {/* Contenu de la politique de confidentialité */}
        <div className="privacy-policy-rules">
          <p>Date de dernière mise à jour : 30/09/2023</p>
          <h2>Collecte des Données Personnelles</h2>
          <p>
            Nous collectons les données personnelles suivantes lorsque vous
            utilisez notre site web pour générer des factures en PDF :
          </p>
          <ul>
            <li>Votre nom</li>
            <li>Votre adresse e-mail</li>
            <li>Votre numéro de téléphone</li>
            <li>Les informations relatives à vos factures</li>
          </ul>
          <h2>Utilisation des Données Personnelles</h2>
          <p>
            Nous utilisons les données personnelles que nous collectons aux fins
            suivantes :
          </p>
          <ul>
            <li>
              Pour générer des factures en PDF conformément à vos instructions.
            </li>
            <li>
              Pour communiquer avec vous concernant l'utilisation de notre
              service.
            </li>
          </ul>
          <h2>Protection des Données Personnelles</h2>
          <p>
            Nous mettons en place des mesures de sécurité techniques et
            organisationnelles appropriées pour protéger vos données
            personnelles contre tout accès non autorisé ou toute utilisation
            abusive.
          </p>
          <h2>Partage des Données Personnelles</h2>
          <p>
            Nous ne partageons pas vos données personnelles avec des tiers, sauf
            si cela est nécessaire pour fournir les services que vous avez
            demandés ou si la loi l'exige.
          </p>
          <h2>Cookies et Technologies de Suivi</h2>
          <p>
            Nous utilisons des cookies et d'autres technologies de suivi pour
            améliorer l'expérience de l'utilisateur sur notre site web.
          </p>
          <h2>Modifications de la Politique de Confidentialité</h2>
          <p>
            Nous pouvons mettre à jour cette politique de confidentialité de
            temps à autre. La date de la dernière mise à jour sera indiquée en
            haut de la page.
          </p>
          <h2>Contact</h2>
          <p>
            Pour toute question ou préoccupation concernant notre politique de
            confidentialité, veuillez nous contacter à beheallpro@outlook.com.
          </p>
          <p>
            Cette politique de confidentialité est régie par la loi applicable
            en France.
          </p>
        </div>
        {/* Affichage de la navigation accordéon ou header si l'utilisateur est connecté */}
        {hasToken && <AccordionNav />}
        {/* Pied de page */}
        <Footer />
      </HelmetProvider>
    </div>
  );
};
