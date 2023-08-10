import React from "react";

export const Dashboard = () => {
  
  const token = localStorage.getItem('Token')

  return (
    <div className="dashboard-page">
      <div>
        {token ? (
          <p>Vous êtes connecté !</p>
        ) : (
          <p>Vous n'êtes pas connecté.</p>
        )}
      </div>
    </div>
  );
};
