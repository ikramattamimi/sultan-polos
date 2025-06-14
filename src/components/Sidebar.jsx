import React from 'react';
import {Link, NavLink} from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="sidebar w-[250px]">
      <div className="logo mb-10">Sultan Polos</div>
      <ul>
        <li><NavLink to="dashboard">Dashboard</NavLink></li>
        <li><NavLink to="inventory">Inventory</NavLink></li>
        <li><NavLink to="konveksi">Konveksi</NavLink></li>
      </ul>
    </nav>
  );
};

export default Sidebar;