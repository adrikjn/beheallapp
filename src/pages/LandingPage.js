import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../components/Logo";
import Brand from "../components/Brand";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hasToken = !!localStorage.getItem("Token");

    if (hasToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  return (
    <div className="landing-page">
      <HelmetProvider>
        <Helmet>
          <meta
            name="description"
            content="Notre service de facturation en ligne simplifie la création de factures. Générez rapidement et gratuitement des factures professionnelles. Essayez dès maintenant Beheall!"
          />
        </Helmet>
        <div className="landing-page-height">
          <Logo />
          <Brand />
          <div className="infos">
            <p>simple</p>
            <p>intuitif</p>
            <p>rapide</p>
          </div>
        </div>
      </HelmetProvider>
    </div>
  );
};
