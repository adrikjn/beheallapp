import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../components/Logo";
import Brand from "../components/Brand";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <meta
          name="description"
          content="Notre service de facturation en ligne simplifie la création de factures. Générez rapidement des factures professionnelles. Essayez dès maintenant !"
        />
      </Helmet>
      <div className="landing-page-height">
        <Logo />
        <Brand />
        <div className="infos">
          <p>scale</p>
          <p>accurate</p>
          <p>fast</p>
        </div>
      </div>
    </div>
  );
};
