import React from "react";
import "../App.css";
import { Helmet } from "react-helmet";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";

export const LegalNotice = () => {
  const hasToken = !!localStorage.getItem("Token");
  return (
    <div className="legal-policy fade-in">
      <Helmet>
        <title>Mentions Légales | Beheall</title>
        <meta name="description" content="" />
      </Helmet>
      <div>
        <h1>Mentions Légales</h1>
        <p>Nom de l'entreprise : [Votre Nom d'Entreprise]</p>
        <p>Forme juridique : [SARL, SAS, auto-entrepreneur, etc.]</p>
        <p>Adresse de l'entreprise : [Votre Adresse]</p>
        <p>Numéro de téléphone de l'entreprise : [Votre Numéro de Téléphone]</p>
        <p>Adresse e-mail de l'entreprise : [Votre Adresse E-mail]</p>
        <p>Numéro SIRET : [Votre Numéro SIRET, si applicable]</p>
        <p>Directeur de la publication : [Votre Nom]</p>
        <p>Hébergeur du site web : [Nom de l'Hébergeur]</p>
        <p>Adresse de l'hébergeur : [Adresse de l'Hébergeur]</p>
        <p>
          Le site web [Votre Nom de Domaine] est régi par la loi applicable en
          France.
        </p>
        <h2>Droits d'auteur</h2>
        <p>
          Tous les contenus de ce site web, y compris les textes, les
          graphiques, les logos, les images, les clips audio et vidéo, sont la
          propriété de [Votre Nom d'Entreprise] ou de ses fournisseurs de
          contenu et sont protégés par les lois françaises sur les droits
          d'auteur. Toute utilisation non autorisée de ces contenus est
          interdite.
        </p>
        <h2>Contact</h2>
        <p>
          Pour toute question ou préoccupation concernant ces mentions légales,
          veuillez nous contacter à [Votre Adresse E-mail].
        </p>
        <p>
          Date de dernière mise à jour : [Date de la dernière mise à jour des
          mentions légales]
        </p>
      </div>
      {hasToken && <AccordionNav />}
      <Footer />
    </div>
  );
};
