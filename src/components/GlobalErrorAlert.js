import React from "react";

const GlobalErrorAlert = ({ errors, onClose }) => (
  <>
  {/* Affichage d'alertes en cas d'erreurs globales */}
    {errors.length > 0 && (
      <div className="alert">
        <span onClick={onClose} className="close-alert">
          &times;
        </span>
        {errors.map((error, index) => (
          <p key={index}>{error}</p>
        ))}
      </div>
    )}
  </>
);

export default GlobalErrorAlert;
