import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccordionNav from "../components/AccordionNav";
import Account from "../components/Account";

export const Dashboard = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  return (
    <div className="dashboard-page">
      <div className="welcome-user">
        <h1>Welcome</h1>
        <Account />
      </div>

      <div className="invoice-title">
        <p>Factures envoyées</p>
        <p>statut</p>
      </div>
      <div className="invoice-list">
        <div className="invoice-customers">
          <p>Parella group</p>
          <p>Payé</p>
        </div>
        <div className="line"></div>
        <div className="invoice-customers-2">
          <p>Elyes Voisin</p>
          <p>Non payé</p>
        </div>
        <div className="line"></div>
      </div>
      <div className="revenue-party">
        <h2>Evolution du CA</h2>
        <div className="revenue">
          <div className="revenue-title-date">
            <p>ca :</p>
            <p>
              Juin <span>2023</span>
            </p>
          </div>
          <p className="revenue-amount">123.34 €</p>
          <p className="revenue-evolution">+67%</p>
          <div className="view-more-revenue">
            <img src="/arrow.svg" alt="facture" />
            <Link to="/dashboard" className="link-see-more">
              Voir plus
            </Link>
          </div>
        </div>
      </div>
      <div className="btn-invoice">
        <Link to="/invoice-step-one">
          <button>Créer une facture</button>
        </Link>
      </div>
      <AccordionNav />
    </div>
  );
};
