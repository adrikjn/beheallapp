import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const token = localStorage.getItem("Token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  //<div>
  //{token ? <p>Vous êtes connecté !</p> : <p>Vous n'êtes pas connecté.</p>}
  // </div>

  return (
    <div className="dashboard-page">
      <div className="welcome-user">
        <h1>Welcome</h1>
        <img src="/profil-icon.svg" alt="facture" />
      </div>

      <div className="invoice-table">
        <p>Factures envoyées</p>
        <p>statut</p>
      </div>
      <div className="invoice-list">
      <ul>
          <li>Parella Group</li>
          <li>Parella Group</li>
        </ul>
      </div>
    </div>
  );
};
