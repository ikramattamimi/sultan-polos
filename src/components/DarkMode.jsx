import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun } from "react-icons/fa6";

const DarkMode = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    document.body.classList.toggle("dark");
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check localStorage first, then system preference
    const shouldBeDark = currentTheme === "dark" || (currentTheme === null && systemTheme);
    
    if (shouldBeDark) {
      document.body.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    }
  }, []);

  return (
    <button 
      className="
        p-2 rounded-lg 
        bg-gray-100 hover:bg-gray-200 
        dark:bg-gray-700 dark:hover:bg-gray-600 
        text-gray-600 dark:text-gray-300
        transition-all duration-200 ease-in-out
        min-w-[44px] min-h-[44px] 
        flex items-center justify-center
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
      " 
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="text-lg transition-transform duration-300 ease-in-out">
        {isDark ? (
          <FaSun className="text-yellow-500" />
        ) : (
          <FaMoon className="text-gray-600 dark:text-gray-300" />
        )}
      </div>
    </button>
  );
};

export default DarkMode;