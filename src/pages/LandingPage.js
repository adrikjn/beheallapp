import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

export const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  return (
    <div className="landing-page">
      <div className="landing-page-style">
        <div className="logo">
          <img src="/Logo.svg" alt="Logo" />
        </div>
        <div className="brand">
          <h1>
            Be<span>heall</span>
          </h1>
        </div>
        <div className="infos">
          <p>scale</p>
          <p>accurate</p>
          <p>fast</p>
        </div>
      </div>
    </div>
  );
};
