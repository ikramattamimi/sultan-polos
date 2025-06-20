import React from 'react';
import { Link, NavLink } from "react-router-dom";
import DarkMode from "./DarkMode";
import { FaCrop, FaCrown } from 'react-icons/fa6';

const Sidebar = () => {
  return (
    <nav className="sidebar w-[250px]">
      <div className="logo mb-5">
        <FaCrown/>
        SULTAN POLOS
      </div>
      <ul>
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="inventory">Inventory</NavLink></li>
        <li><NavLink to="convection">Convection</NavLink></li>
        <li><NavLink to="report">Report</NavLink></li>
      </ul>

      <div className="fixed bottom-5 left-5">
        <DarkMode />
      </div>
    </nav>
  );
};

export default Sidebar;