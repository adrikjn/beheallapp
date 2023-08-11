import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Logo from "../components/Logo";
import Brand from "../components/Brand";

export const LandingPage = () => {
  const navigate = useNavigate();

  /*useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
*/
  return (
    <div className="landing-page">
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
