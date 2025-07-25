import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layouts/Sidebar.jsx";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Handler untuk Sidebar agar bisa collapse/expand
  const handleCollapse = (value) => setCollapsed(value);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 h-full z-20 transition-all duration-300 ${collapsed ? 'w-[60px]' : 'w-[250px]'}`}
      >
        <Sidebar collapsed={collapsed} setCollapsed={handleCollapse} />
      </div>

      <div className="flex gap-5">
        {/* Spacer agar konten tidak tertutup sidebar */}
        <div className={collapsed ? 'w-[60px]' : 'w-[250px]'}></div>
        <div className="m-5 flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;