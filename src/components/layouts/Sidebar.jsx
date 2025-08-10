import React from 'react';
import { NavLink } from "react-router-dom";
import DarkMode from "../DarkMode.jsx";
import DropdownMenu from "../DropdownMenu.jsx";
import { Crown, Home, Package, Factory, FileBarChart2, FileText, Wallet, Menu, ChevronLeft } from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {

  return (
    <nav
      className={`sidebar shadow h-full flex flex-col transition-all duration-300 ${collapsed ? 'w-[60px] bg-transparent shadow-none' : 'w-[250px] bg-white'}`}
      style={{ minHeight: '100vh', position: 'relative', background: collapsed ? 'transparent' : undefined }}
    >
      {collapsed ? (
        <button
          className="flex items-center justify-center mt-4 ml-2 bg-gray-200 rounded p-2 border border-gray-300 hover:bg-gray-300 transition-all"
          style={{ width: 40, height: 40 }}
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
        >
          <Menu size={24} />
        </button>
      ) : (
          <>
          <NavLink to="/" className="m-0 p-0">
            <div className="logo mb-5 flex items-center gap-2 px-3 py-2">
              <Crown size={28} />
              <span className="font-bold text-lg">SULTAN POLOS</span>
            </div>
          </NavLink>
          <button
            className="absolute top-3 right-[-16px] z-10 bg-gray-200 rounded-full p-1 border border-gray-300 hover:bg-gray-300 transition-all"
            // style={{ width: 28, height: 28 }}
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            title="Hide sidebar"
          >
            <ChevronLeft size={20} />
          </button>
          <ul className="flex-1 pl-4 pr-2 transition-all duration-300">
            {/* <li className="my-2">
              <NavLink to="/" className="flex items-center gap-2">
                <Home size={20} />
                Dashboard
              </NavLink>
            </li> */}
            <li className="my-2">
              <DropdownMenu
                title={
                  <span className="flex items-center gap-2">
                    <Package size={20} />
                    Inventory
                  </span>
                }
                routes={['/product', '/sales']}
                collapsed={false}
              >
                <ul>
                  <li><NavLink to="product">Product</NavLink></li>
                  <li><NavLink to="sales">Sales Order</NavLink></li>
                </ul>
              </DropdownMenu>
            </li>
            <li className="my-2">
              <NavLink to="/convection" className="flex items-center gap-2">
                <Factory size={20} />
                Convection
              </NavLink>
            </li>
            <li className="my-2">
              <DropdownMenu
                title={
                  <span className="flex items-center gap-2">
                    <Wallet size={20} />
                    Finance
                  </span>
                }
                routes={['/income-statement', '/expenses']}
                collapsed={false}
              >
                <ul>
                  <li><NavLink to="income-statement">Laporan Laba Rugi</NavLink></li>
                  <li><NavLink to="expenses">Kelola Expenses</NavLink></li>
                </ul>
              </DropdownMenu>
            </li>
            {/* <li className="my-2">
              <NavLink to="/report" className="flex items-center gap-2">
                <FileBarChart2 size={20} />
                Report
              </NavLink>
            </li>
            <li className="my-2">
              <DropdownMenu
                title={
                  <span className="flex items-center gap-2">
                    <FileText size={20} />
                    Components Docs
                  </span>
                }
                routes={['components']}
                collapsed={false}
              >
                <ul>
                  <li><NavLink to="components/forms">Forms</NavLink></li>
                </ul>
              </DropdownMenu>
            </li> */}
          </ul>
          <div className="absolute left-5 bottom-5 transition-all">
            <DarkMode />
          </div>
        </>
      )}
    </nav>
  );
};

export default Sidebar;