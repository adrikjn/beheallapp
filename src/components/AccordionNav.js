import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const AccordionNav = () => {
  const [isLinksVisible, setIsLinksVisible] = useState(true);
  const location = useLocation();

  const handleToggleLinks = () => {
    setIsLinksVisible(!isLinksVisible);
  };

  const getPageName = (path) => {
    if (path === "/dashboard") {
      return "Dashboard";
    } else if (path === "/invoices") {
      return "Factures";
    } else if (path === "/legal-notice") {
      return "Mentions Légales";
    } else if (path === "/privacy-policy") {
      return "Politique de Confidentialité";
    } else if (path === "/cgu") {
      return "CGU";
    } else {
      return "Dashboard";
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
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/invoices" className="nav-links-desktop">
                  Factures
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
              <img src="/line-16.svg" alt="Ouvrir/Fermer la barre de navigation" />
              <img src="/line-17.svg" alt="Ouvrir/Fermer la barre de navigation" />
            </div>
            <div className={`nav-links ${isLinksVisible ? "links-open" : ""}`}>
              <ul>
                <li>
                  <Link to="/dashboard" className="links-style">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/invoices" className="links-style">
                    Factures
                  </Link>
                </li>
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
                  <li>
                    <Link to="/cgu" className="links-style">
                      CGU
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
