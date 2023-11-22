// Importation des modules nécessaires depuis React et d'autres bibliothèques
import React from "react";
import "../App.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";
import Account from "../components/Account";
import GoingBackLogin from "../components/GoingBackLogin.js";

/*
 Page représentant les Conditions Générales d'Utilisation (CGU) de Beheall.
 Affiche les règles d'utilisation du service, les conditions relatives aux comptes utilisateur, le traitement des données personnelles, la propriété intellectuelle, la responsabilité et les modifications des CGU.
*/
export const Cgu = () => {
  // Vérifie la présence d'un jeton JWT dans le localStorage
  const hasToken = !!localStorage.getItem("Token");

  return (
    <div className={`legal-policy${hasToken ? " avec-token" : ""}`}>
      {/* Configuration des balises meta pour le référencement SEO */}
      <HelmetProvider>
        <Helmet>
          <title>Conditions Générales d'Utilisation | Beheall</title>
          <meta
            name="description"
            content="Consultez nos Conditions Générales d'Utilisation pour utiliser notre service de création de facture gratuit en ligne."
          />
        </Helmet>
        <div>
          {/* Bouton de retour à la page de connexion s'il n'y a pas de jeton */}
          {!hasToken && <GoingBackLogin />}
          {/* Titre de la page avec le logo permettant d'aller dans la partie compte ou se déconnecter, seulement s'il y a un jeton */}
          <h1>Conditions Générales d'Utilisation {hasToken && <Account />}</h1>

          <div className="legal-notice-rules">
            <p>
              Bienvenue sur Beheall, un service de création de facture gratuit
              en ligne.
            </p>
            <p>
              En utilisant notre service, vous acceptez de vous conformer aux
              présentes Conditions Générales d'Utilisation ("CGU"). Veuillez les
              lire attentivement avant d'utiliser notre service.
            </p>
            <h2>1. Utilisation du Service</h2>
            <p>
              Vous êtes autorisé à utiliser notre service à des fins légales et
              conformes aux présentes CGU. Vous ne pouvez pas utiliser notre
              service à des fins illégales ou frauduleuses.
            </p>
            <h2>2. Compte Utilisateur</h2>
            <p>
              Pour accéder à certaines fonctionnalités de notre service, vous
              devrez créer un compte utilisateur. Vous êtes responsable de la
              confidentialité de votre mot de passe et de vos informations
              d'identification.
            </p>
            <h2>3. Données Personnelles</h2>
            <p>
              Nous recueillons et traitons vos données personnelles conformément
              à notre Politique de Confidentialité. En utilisant notre service,
              vous consentez à la collecte et au traitement de vos données
              personnelles comme décrit dans cette politique.
            </p>
            <h2>4. Propriété Intellectuelle</h2>
            <p>
              Nous détenons tous les droits de propriété intellectuelle associés
              à notre service, y compris les marques, les logos, les textes, les
              images et le code source.
            </p>
            <h2>5. Responsabilité</h2>
            <p>
              Nous nous efforçons de fournir un service de qualité, mais nous ne
              pouvons garantir son fonctionnement continu et sans erreurs. Nous
              ne sommes pas responsables des pertes ou dommages résultant de
              l'utilisation de notre service.
            </p>
            <h2>6. Modifications des CGU</h2>
            <p>
              Nous nous réservons le droit de modifier ces CGU à tout moment.
              Les modifications prendront effet dès leur publication sur notre
              site web.
            </p>
            <p>
              En utilisant notre service après toute modification, vous acceptez
              les nouvelles CGU.
            </p>
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
