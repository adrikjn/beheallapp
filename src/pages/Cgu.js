import React from "react";
import "../App.css";
import { Helmet } from "react-helmet";
import AccordionNav from "../components/AccordionNav";
import Footer from "../components/Footer.js";
import Account from "../components/Account";

export const Cgu = () => {
  const hasToken = !!localStorage.getItem("Token");
  return (
    <div className="legal-policy fade-in">
      <Helmet>
        <title> | Beheall</title>
        <meta
          name="description"
          content=""
        />
      </Helmet>
      <div>
        <h1>Mentions Légales {hasToken &&<Account />}</h1>
        
        <div className="legal-notice-rules">
          <p>
            Ce site web permet de créer des factures en ligne dans le cadre d'un
            projet scolaire réalisé dans le cadre de l'obtention de mon bac +2
            Développeur d'Applications Multimédia à Doranco. Les factures
            générées respectent les lois en vigueur et sont utilisables
            conformément à la législation.
          </p>
          <p>Responsable de la publication : KOUYOUMJIAN Adrien</p>
          <p>
            Les factures générées sur ce site sont destinées à des fins
            pédagogiques et démonstratives, mais elles sont également conformes
            aux exigences légales. Elles peuvent être utilisées conformément à
            la législation en vigueur.
          </p>
          <p>
            Pour toute question ou commentaire concernant ce projet scolaire,
            veuillez nous contacter à beheallpro@outlook.com.
          </p>
          <p>Date de dernière mise à jour : 30/09/2023</p>
        </div>
      </div>
      {hasToken && <AccordionNav />}
      <Footer />
    </div>
  );
};
