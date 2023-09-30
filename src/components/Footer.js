import React from "react";
import { Link } from "react-router-dom"; 

const Footer = () => (
  <div className="footer">
    <ul>
      <li>
        <Link to="/legal-notice" className="footer-links">Mentions Légales</Link>
      </li>
      <li>
        <Link to="/privacy-policy" className="footer-links">Politique de Confidentialité</Link>
      </li>
    </ul>
  </div>
);

export default Footer;
