import React from 'react';

const NavbarAdmin = () => {
  return (
    <nav className="navbar">
      <div className="flex justify-between top-0">

        <h1>Logo</h1>

        <ul className="navbar-menu">
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>

        <button className="dark:bg-white bg-white rounded-lg shadow-xl p-4">Login</button>
      </div>
    </nav>
  );
};

export default NavbarAdmin;