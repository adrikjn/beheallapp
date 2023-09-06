import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const AccordionNav = () => {
  const [isLinksVisible, setIsLinksVisible] = useState(false);
  const location = useLocation(); // Pour obtenir le chemin de la page actuelle

  const handleToggleLinks = () => {
    setIsLinksVisible(!isLinksVisible);
  };

  // Fonction pour obtenir le nom de la page à partir du chemin
  const getPageName = (path) => {
    switch (path) {
      case "/dashboard":
        return "Home";
      case "/invoice-step-one":
        return "Paramètres";
      case "/invoice-step-two":
        return "Factures";
      case "/invoice-step-four":
        return "Devis";
      case "/invoice-step-three":
        return "Clients";
      default:
        return "Home";
    }
  };

  // Obtenez le nom de la page actuelle à partir du chemin
  const currentPage = getPageName(location.pathname);

  return (
    <div className="accordion-nav">
      <div className={`toggle-button ${isLinksVisible ? "open" : ""}`} onClick={handleToggleLinks}>
        <span>{currentPage}</span>
        <div className="toggle-lines">
          <img src="/line-16.svg" alt="Logo" />
          <img src="/line-17.svg" alt="Logo" />
        </div>
        <div className={`nav-links ${isLinksVisible ? "links-open" : ""}`}>
          <ul>
          <li>
              <Link to="/dashboard" className="links-style">
                Home
              </Link>
            </li>
            <li>
              <Link to="/invoice-step-one" className="links-style">
                Paramètres
              </Link>
            </li>
            <li>
              <Link to="/invoice-step-two" className="links-style">
                Factures
              </Link>
            </li>
            <li>
              <Link to="/invoice-step-four" className="links-style">
                Devis
              </Link>
            </li>
            <li>
              <Link to="/invoice-step-three" className="links-style">
                Clients
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccordionNav;
