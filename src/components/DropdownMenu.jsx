import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa6';

const DropdownMenu = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = "",
  titleClassName = "",
  contentClassName = "",
  showIcon = true,
  openIcon: OpenIcon = FaChevronDown,
  closedIcon: ClosedIcon = FaChevronRight,
  routes = [] // Array of routes that should keep this dropdown open
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Check if current path matches any of the dropdown routes
  const isCurrentRouteActive = () => {
    return routes.some(route => location.pathname.startsWith(route));
  };

  // Keep dropdown open if current route matches
  useEffect(() => {
    if (isCurrentRouteActive()) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`dropdown-menu ${className}`}>
      <button 
        onClick={toggleDropdown}
        className={`dropdown-toggle flex items-center justify-between w-full text-left ${titleClassName} ${
          isCurrentRouteActive() ? 'text-blue-600 font-semibold' : ''
        }`}
      >
        <span className='w-full'>{title}</span>
        {showIcon && (
          isOpen ? <OpenIcon className="text-sm" /> : <ClosedIcon className="text-sm" />
        )}
      </button>
      {isOpen && (
        <div className={`dropdown-content ml-4 mt-2 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;