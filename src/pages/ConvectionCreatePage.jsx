import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ConvectionCreatePage = () => {
  const navigate = useNavigate();

  // Redirect to convection page since we now use modals
  useEffect(() => {
    navigate("/convection");
  }, [navigate]);

  return null;
};

export default ConvectionCreatePage;