import React from 'react';
import { NavLink } from "react-router-dom";
import DarkMode from "../DarkMode.jsx";
import DropdownMenu from "../DropdownMenu.jsx";
import { FaCrown } from 'react-icons/fa6';

const Sidebar = () => {
  return (
    <nav className="sidebar w-[250px]">
      <div className="logo mb-5">
        <FaCrown/>
        SULTAN POLOS
      </div>
      <ul>
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li>
          <DropdownMenu 
            title="Inventory"
            routes={['/inventory']}
          >
            <ul>
              <li><NavLink to="product">Product</NavLink></li>
              <li><NavLink to="sales">Sales Order</NavLink></li>
            </ul>
          </DropdownMenu>
        </li>
        <li><NavLink to="/convection">Convection</NavLink></li>
        <li><NavLink to="/report">Report</NavLink></li>
      </ul>

      <div className="fixed bottom-5 left-5">
        <DarkMode />
      </div>
    </nav>
  );
};

export default Sidebar;