import { useState } from "react";

const useGlobalErrors = () => {
  // État local pour les erreurs globales
  const [globalErrors, setGlobalErrors] = useState([]);

  // Fonction pour ajouter une erreur globale à la liste d'erreurs
  const addGlobalError = (error) => {
    setGlobalErrors([...globalErrors, error]);
  };

  // Fonction pour fermer les alertes globales
  const closeAlert = () => {
    setGlobalErrors([]);
  };

  return { globalErrors, addGlobalError, closeAlert };
};

export default useGlobalErrors;
