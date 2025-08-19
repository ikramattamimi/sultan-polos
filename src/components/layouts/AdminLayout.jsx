import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const AdminLayout = () => {
  // Initialize from localStorage or default to false
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const savedState = localStorage.getItem('sidebar-collapsed');
      return savedState !== null ? JSON.parse(savedState) : false;
    } catch (error) {
      // If parsing fails, return default value and clear invalid data
      localStorage.removeItem('sidebar-collapsed');
      return false;
    }
  });
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Save to localStorage whenever collapsed state changes
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;