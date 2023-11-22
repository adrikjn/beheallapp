import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LegalNotice } from "./pages/LegalNotice";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { Cgu } from "./pages/Cgu";
import { MyAccount } from "./pages/MyAccount";
import { ResetPassword } from "./pages/ResetPassword";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Invoices } from "./pages/Invoices";
import { InvoiceStepOne } from "./pages/InvoiceStepOne";
import { InvoiceStepTwo } from "./pages/InvoiceStepTwo";
import { InvoiceStepThree } from "./pages/InvoiceStepThree.js";
import { InvoiceStepFour } from "./pages/InvoiceStepFour.js";
import { InvoiceStepFive } from "./pages/InvoiceStepFive.js";
function App() {
  // Utilisation de l'état pour vérifier si l'utilisateur est connecté
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('Token'));

  // Utilisation de l'utilitaire `useNavigate` de react-router-dom pour naviguer entre les pages
  const navigate = useNavigate();

  useEffect(() => {
    // Définir une temporisation de 10 minutes après la connexion
    const timeoutId = setTimeout(() => {
      // Déconnecter l'utilisateur
      localStorage.clear();
      setIsLoggedIn(false);
      // Naviguer vers la page de connexion après la déconnexion
      navigate('/login');
    }, 10 * 60 * 1000); // 10 minutes en millisecondes

    // Nettoyer le timeout lors du démontage du composant ou lorsqu'il y a une déconnexion
    return () => {
      clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/invoice-step-one" element={<InvoiceStepOne />} />
          <Route path="/invoice-step-two" element={<InvoiceStepTwo />} />
          <Route path="/invoice-step-three" element={<InvoiceStepThree />} />
          <Route path="/invoice-step-four" element={<InvoiceStepFour />} />
          <Route path="/invoice-step-five" element={<InvoiceStepFive />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/legal-notice" element={<LegalNotice />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cgu" element={<Cgu />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>La page demandée n'existe pas</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
