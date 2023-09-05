import React, { useState } from "react";
import { Link } from "react-router-dom";

const AccordionNav = () => {
  const [isLinksVisible, setIsLinksVisible] = useState(false);

  const handleToggleLinks = () => {
    setIsLinksVisible(!isLinksVisible);
  };

  return (
    <div className="accordion-nav">
      <div className={`toggle-button ${isLinksVisible ? "open" : ""}`} onClick={handleToggleLinks}>
        <span>Home</span>
        <div className="toggle-lines">
          <img src="/line-16.svg" alt="Logo" />
          <img src="/line-17.svg" alt="Logo" />
        </div>
      </div>
      <div className={`nav-links ${isLinksVisible ? "links-open" : ""}`}>
        <ul>
          <li><Link to="/parametres" className="links-style">Paramètres</Link></li>
          <li><Link to="/factures" className="links-style">Factures</Link></li>
          <li><Link to="/devis" className="links-style">Devis</Link></li>
          <li><Link to="/clients" className="links-style">Clients</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default AccordionNav;

