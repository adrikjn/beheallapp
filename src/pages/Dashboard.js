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

  return (
    <div className="dashboard-page">
      <div>
        {token ? <p>Vous êtes connecté !</p> : <p>Vous n'êtes pas connecté.</p>}
      </div>
    </div>
  );
};
