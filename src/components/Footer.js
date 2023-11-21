import React from "react";
import { Link } from "react-router-dom";

// Composant représentant le pied de page de l'application présent sur toute les pages
const Footer = () => (
  <div className="footer">
    {/* Liste des liens du pied de page */}
    <ul>
      <li>
        <Link to="/legal-notice" className="footer-links">
          Mentions Légales
        </Link>
      </li>
      <li>
        <Link to="/privacy-policy" className="footer-links">
          Politique de Confidentialité
        </Link>
      </li>
      <li>
        <Link to="/cgu" className="footer-links">
          CGU
        </Link>
      </li>
    </ul>
  </div>
);

export default Footer;
