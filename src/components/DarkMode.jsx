// import React, {useState} from 'react';
import {FaMoon, FaSun} from "react-icons/fa6";
import {useEffect} from "react";

const DarkMode = () => {

  const toggleTheme = () => {
    document.body.classList.toggle("dark");

    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  }

  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [])

  return (
    <div>
      <button className="p-2 rounded-md flex bg-gray-50 ring-1 ring-gray-300 shadow-sm shadow-gray-400 cursor-pointer" onClick={toggleTheme}>
        <div className="p-2 text-xl bg-gray-200 rounded-md dark:bg-transparent text-gray-500">
            <FaSun/>
        </div>
        <div className="p-2 text-xl bg-transparent rounded-md dark:bg-gray-300 text-gray-500">
            <FaMoon/>
        </div>
      </button>
    </div>
  );
};

export default DarkMode;