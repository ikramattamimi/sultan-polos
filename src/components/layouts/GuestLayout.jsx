import React from 'react';
import Navbar from "../Navbar.jsx";
import {Outlet} from "react-router-dom";

const GuestLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default GuestLayout;