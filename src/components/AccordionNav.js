import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const AccordionNav = () => {
  const [isLinksVisible, setIsLinksVisible] = useState(true);
  const location = useLocation();

  const handleToggleLinks = () => {
    setIsLinksVisible(!isLinksVisible);
  };

  const getPageName = (path) => {
    switch (path) {
      case "/dashboard":
        return "Home";
      case "/invoice-step-two":
        return "Factures";
      case "/invoice-step-three":
        return "Clients";
      default:
        return "Home";
    }
  };

  const currentPage = getPageName(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsLinksVisible(true);
      } else {
        setIsLinksVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
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
                <Link to="/dashboard" className="nav-links-desktop">
                  Factures
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="nav-links-desktop">
                  Clients
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      )}

      {window.innerWidth <= 992 && (
        <header className="accordion-nav">
          <div
            className={`toggle-button ${isLinksVisible ? "open" : ""}`}
            onClick={handleToggleLinks}
          >
            <span>{currentPage}</span>
            <div className="toggle-lines">
              <img src="/line-16.svg" alt="Ouvrir/Fermer la nav" />
              <img src="/line-17.svg" alt="Ouvrir/Fermer la nav" />
            </div>
            <div className={`nav-links ${isLinksVisible ? "links-open" : ""}`}>
              <ul>
                <li>
                  <Link to="/dashboard" className="links-style">
                    Home
                  </Link>
                </li>
                <li>
                  <li>
                    <Link to="/legal-notice" className="links-style">
                      Mentions Légales
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="links-style">
                      Politique de Confidentialité
                    </Link>
                  </li>
                </li>
                <li>
                  <Link to="/dashboard" className="links-style">
                    Factures
                  </Link>
                </li>
                <li></li>
                <li>
                  <Link to="/dashboard" className="links-style">
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
