"use client";
import React, { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <FiHome size={18} /> },
    { name: "Properties", icon: <FaBuilding size={18} /> },
    { name: "Analytics", icon: <FiBarChart2 size={18} /> },
    { name: "Settings", icon: <FiSettings size={18} /> },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3 shadow-sm">
        <h1 className="font-bold text-lg">RealEstate</h1>
        <button
          className="p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        >
          <FiMenu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[250px] bg-white border-r border-gray-200 shadow-sm z-50 
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center justify-center h-[70px] border-b border-gray-200">
          <h1 className="text-xl font-bold">RealEstate</h1>
        </div>

        {/* Links */}
        <nav className="flex flex-col mt-20 md:mt-6 px-4 space-y-2">
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition"
            >
              {item.icon}
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
};

export default Navbar;
