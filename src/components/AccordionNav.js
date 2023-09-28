import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const AccordionNav = () => {
  const [isLinksVisible, setIsLinksVisible] = useState(true); // Par défaut, l'accordéon est visible
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

  // Utilisez useEffect pour vérifier la largeur de l'écran et masquer l'accordéon en conséquence
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsLinksVisible(true);
      } else {
        setIsLinksVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Appel initial pour définir l'état initial en fonction de la largeur actuelle
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      {/* Barre de navigation de type "header" pour les écrans larges */}
      {window.innerWidth > 992 && (
        <header className="header-nav">
          <nav className="desktop-nav">
            <div className="nav-brand">
              <Link to="/dashboard" className="nav-links-desktop">
                Be<span>heall</span>
              </Link>
            </div>
            <ul>
              <li>
                <Link to="/dashboard" className="nav-links-desktop">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/invoice-step-one" className="nav-links-desktop">
                  Paramètres
                </Link>
              </li>
              <li>
                <Link to="/invoice-step-two" className="nav-links-desktop">
                  Factures
                </Link>
              </li>
              <li>
                <Link to="/invoice-step-four" className="nav-links-desktop">
                  Devis
                </Link>
              </li>
              <li>
                <Link to="/invoice-step-three" className="nav-links-desktop">
                  Clients
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      )}

      {/* Accordéon mobile */}
      {window.innerWidth <= 992 && (
        <header className="accordion-nav">
          <div
            className={`toggle-button ${isLinksVisible ? "open" : ""}`}
            onClick={handleToggleLinks}
          >
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
        </header>
      )}
    </div>
  );
};

export default AccordionNav;
