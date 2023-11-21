import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Composant pour la barre de navigation accordéon ou header présent sur toutes les pages de l'application web si l'utilisateur est connecté
const AccordionNav = () => {
  // État pour contrôler la visibilité des liens dans la version mobile
  const [isLinksVisible, setIsLinksVisible] = useState(true);

  // Utilisation du hook useLocation pour obtenir le chemin de l'URL actuelle
  const location = useLocation();

  // Fonction pour basculer la visibilité des liens dans la version mobile
  const handleToggleLinks = () => {
    setIsLinksVisible(!isLinksVisible);
  };

  // Fonction pour obtenir le nom de la page en fonction du chemin, ainsi l'afficher dans l'accordion nav
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

  // Obtenez le nom de la page actuelle en utilisant le chemin de l'URL
  const currentPage = getPageName(location.pathname);

  // Effet useEffect pour gérer la visibilité des liens en fonction de la largeur de la fenêtre (si supérieur à 922 Header/ si inférieur à 922 Accordion Nav)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setIsLinksVisible(true);
      } else {
        setIsLinksVisible(false);
      }
    };

    // Nettoyer l'écouteur d'événements lors du démontage du composant
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Rendu du composant
  return (
    <div>
      {/* Barre de navigation pour les écrans larges (plus de 992 pixels) */}
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

      {/* Barre de navigation accordéon pour les écrans étroits (992 pixels ou moins) */}
      {window.innerWidth <= 992 && (
        <div className="accordion-nav">
          {/* Bouton de bascule pour afficher/cacher les liens mobiles */}
          {/* Gestionnaire d'événements pour basculer la visibilité des liens */}
          <div
            className={`toggle-button ${isLinksVisible ? "open" : ""}`}
            onClick={handleToggleLinks}
          >
            {/* Affiche le nom de la page actuelle dans */}
            <span>{currentPage}</span>
            <div className="toggle-lines">
              <img
                src="/line-16.svg"
                alt="Ouvrir/Fermer la barre de navigation"
              />
              <img
                src="/line-17.svg"
                alt="Ouvrir/Fermer la barre de navigation"
              />
            </div>
            {/* Conteneur des liens de navigation (mobile) */}
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
        </div>
      )}
    </div>
  );
};

export default AccordionNav;
