import React from "react";
import About from "../components/ui/About";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return <About onClose={handleClose} />;
};

export default AboutPage;
