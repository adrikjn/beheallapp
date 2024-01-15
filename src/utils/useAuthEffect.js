import { useState, useEffect } from "react";

function useAuthEffect() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("Token"));

  useEffect(() => {
    // Fonction pour déconnecter l'utilisateur
    const logoutUser = () => {
      localStorage.clear();
      setIsLoggedIn(false);
    };

    // Définir une temporisation de 15 minutes après la connexion
    const timeoutId = setTimeout(logoutUser, 15 * 60 * 1000); // 15 minutes en millisecondes

    // Nettoyer le timeout lors du démontage du composant ou lorsqu'il y a une déconnexion
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    // Fonction pour gérer le déchargement de la page
    const handleBeforeUnload = () => {
      // Stocker le timestamp actuel dans le localStorage
      localStorage.setItem("logoutTime", new Date().getTime());
    };

    // Ajouter l'événement beforeunload
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Nettoyer l'événement lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    // Récupérer le timestamp de déconnexion du localStorage
    const storedLogoutTime = localStorage.getItem("logoutTime");

    // Vérifier si le timestamp existe et si le délai de 15 minutes n'a pas été dépassé
    if (
      storedLogoutTime &&
      new Date().getTime() - parseInt(storedLogoutTime) < 15 * 60 * 1000
    ) {
      // Annuler la suppression du token
      return;
    }

    // Supprimer le token après 1 (4 millisecondes) seconde
    setTimeout(() => {
      localStorage.clear();
    }, 1);
  }, []);

  return isLoggedIn;
}

export default useAuthEffect;
