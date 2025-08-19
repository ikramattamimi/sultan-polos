import React, { useEffect } from 'react';
import { NavLink } from "react-router-dom";
import DarkMode from "../DarkMode.jsx";
import DropdownMenu from "../DropdownMenu.jsx";
import { Package, Factory, Wallet, X, Lock } from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, mobileMenuOpen, setMobileMenuOpen }) => {
  // Initialize mobile menu as closed
  useEffect(() => {
    // Ensure mobile menu is closed on component mount
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(false);
    }
    
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setMobileMenuOpen]);

  // Close mobile menu when clicking on navigation links
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      <nav
        className={`
          sidebar shadow h-full flex flex-col transition-all duration-300 z-50
          ${/* Mobile styles */ ''}
          lg:relative lg:translate-x-0
          ${mobileMenuOpen 
            ? 'fixed left-0 top-0 w-[280px] bg-white translate-x-0' 
            : 'fixed left-0 top-0 w-[280px] bg-white -translate-x-full'
          }
          ${/* Desktop styles */ ''}
          ${collapsed 
            ? 'lg:hidden' 
            : 'lg:w-[250px] lg:bg-white'
          }
        `}
        style={{ 
          minHeight: '100vh',
          background: collapsed && window.innerWidth >= 1024 ? 'transparent' : undefined 
        }}
      >
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <NavLink to="/" className="flex items-center gap-2" onClick={handleMobileNavClick}>
            <img src="logo-only.png" className="h-8" alt="Logo" />
            <span className="font-bold text-lg">SULTAN POLOS</span>
          </NavLink>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop collapsed state */}
        {collapsed ? (
          <div className="hidden lg:block"></div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="hidden lg:block relative">
              <NavLink to="/" className="m-0 p-0">
                <div className="logo mb-5 flex items-center gap-2 px-3 py-2">
                  <img src="logo-only.png" className="h-8" alt="Logo" />
                  <span className="font-bold text-lg">SULTAN POLOS</span>
                </div>
              </NavLink>
            </div>

            {/* Navigation menu */}
            <ul className="flex-1 transition-all duration-300 overflow-y-auto space-y-2">
              <li>
                <DropdownMenu
                  title={
                    <span className="flex items-center w-full gap-3 p-3 text-gray-700 transition-colors">
                      <Package size={20} />
                      <span>Inventory</span>
                    </span>
                  }
                  routes={['/product', '/sales']}
                  collapsed={false}
                  titleClassName="rounded-lg hover:bg-blue-100 hover:text-blue-800"
                >
                  <ul className="ml-8 mt-2 space-y-1">
                    <li>
                      <NavLink 
                        to="product" 
                        className={({ isActive }) => 
                          `block p-2 rounded-lg transition-colors text-sm ${
                            isActive 
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'
                          }`
                        }
                        onClick={handleMobileNavClick}
                      >
                        Product
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="sales" 
                        className={({ isActive }) => 
                          `block p-2 rounded-lg transition-colors text-sm ${
                            isActive 
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'
                          }`
                        }
                        onClick={handleMobileNavClick}
                      >
                        Sales Order
                      </NavLink>
                    </li>
                  </ul>
                </DropdownMenu>
              </li>
              
              <li>
                <NavLink 
                  to="/convection" 
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                    }`
                  }
                  onClick={handleMobileNavClick}
                >
                  <Factory size={20} />
                  <span>Convection</span>
                </NavLink>
              </li>
              
              <li>
                <DropdownMenu
                  title={
                    <span className="flex items-center gap-3 p-3 text-gray-700 transition-colors">
                      <Wallet size={20} />
                      <span>Finance</span>
                    </span>
                  }
                  routes={['/income-statement', '/expenses']}
                  collapsed={false}
                  titleClassName="rounded-lg hover:bg-blue-100 hover:text-blue-800"
                >
                  <ul className="ml-8 mt-2 space-y-1">
                    <li>
                      <NavLink 
                        to="income-statement" 
                        className={({ isActive }) => 
                          `block p-2 rounded-lg transition-colors text-sm ${
                            isActive 
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'
                          }`
                        }
                        onClick={handleMobileNavClick}
                      >
                        Laporan Laba Rugi
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="expenses" 
                        className={({ isActive }) => 
                          `block p-2 rounded-lg transition-colors text-sm ${
                            isActive 
                              ? 'bg-blue-100 text-blue-800 font-medium' 
                              : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'
                          }`
                        }
                        onClick={handleMobileNavClick}
                      >
                        Kelola Expenses
                      </NavLink>
                    </li>
                  </ul>
                </DropdownMenu>
              </li>

              <li>
                <NavLink 
                  to="/change-password" 
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-100 text-blue-800 font-medium' 
                        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                    }`
                  }
                  onClick={handleMobileNavClick}
                >
                  <Lock size={20} />
                  <span>Ubah Password</span>
                </NavLink>
              </li>
            </ul>
          </>
        )}
      </nav>
    </>
  );
};

export default Sidebar;