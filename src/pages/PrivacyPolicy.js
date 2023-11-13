import React from "react";
import "../App.css";
import { Helmet } from "react-helmet";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";
import Account from "../components/Account";
import { Link } from "react-router-dom";

export const PrivacyPolicy = () => {
  const hasToken = !!localStorage.getItem("Token");
  return (
    <div className={`legal-policy${hasToken ? ' avec-token' : ''}`}>
      <Helmet>
        <title>Politique de Confidentialité | Beheall</title>
        <meta
          name="description"
          content="Découvrez notre politique de confidentialité pour comprendre comment nous collectons, utilisons et protégeons vos données personnelles lorsque vous utilisez notre service de génération de factures en ligne. Nous nous engageons à garantir la sécurité et la confidentialité de vos informations."
        />
      </Helmet>
      {!hasToken && (
          <Link to="/login" className="back-to-login-footer-infos">
            <img src="going-back.svg" alt="Revenir a la page de connexion" />
          </Link>
        )}
      <h1>Politique de Confidentialité {hasToken && <Account />}</h1>

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
          organisationnelles appropriées pour protéger vos données personnelles
          contre tout accès non autorisé ou toute utilisation abusive.
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
          Nous pouvons mettre à jour cette politique de confidentialité de temps
          à autre. La date de la dernière mise à jour sera indiquée en haut de
          la page.
        </p>
        <h2>Contact</h2>
        <p>
          Pour toute question ou préoccupation concernant notre politique de
          confidentialité, veuillez nous contacter à beheallpro@outlook.com.
        </p>
        <p>
          Cette politique de confidentialité est régie par la loi applicable en
          France.
        </p>
      </div>

      {hasToken && <AccordionNav />}
      <Footer />
    </div>
  );
};
