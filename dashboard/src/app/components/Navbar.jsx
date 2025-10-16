"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiHome,
  FiBarChart2,
  FiSettings,
  FiUsers,
  FiPlusSquare,
  FiList,
  FiX,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { FaBuilding } from "react-icons/fa";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [backofficeOpen, setBackofficeOpen] = useState(false);
  const pathname = usePathname();

  // Check if current path is in a dropdown section
  const isListingsActive = pathname.startsWith("/listings");
  const isBackofficeActive = pathname.startsWith("/backoffice");

  const navItems = [
    { name: "Dashboard", href: "/", icon: <FiHome size={18} /> },
    { 
      name: "Analytics", 
      href: "/analytics", 
      icon: <FiBarChart2 size={18} /> 
    },
    { 
      name: "Settings", 
      href: "/settings", 
      icon: <FiSettings size={18} /> 
    },
  ];

  const listingsItems = [
    { name: "Create Listing", href: "/listings/create", icon: <FiPlusSquare size={16} /> },
    { name: "Manage Listings", href: "/listings/manage", icon: <FiList size={16} /> },
    { name: "Draft Listings", href: "/listings/drafts", icon: <FiList size={16} /> },
  ];

  const backofficeItems = [
    { name: "Manage Users", href: "/backoffice/manageUsers", icon: <FiUsers size={16} /> },
    { name: "Roles & Permissions", href: "/backoffice/roles", icon: <FiSettings size={16} /> },
    { name: "System Logs", href: "/backoffice/logs", icon: <FiList size={16} /> },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-5 py-3.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[50px] flex items-center justify-center shadow-sm">
            <FaBuilding size={16} className="text-white" />
          </div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            RealEstate
          </h1>
        </div>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-200"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] bg-white border-r border-gray-200 shadow-lg z-50 
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Logo */}
        <div className="hidden md:flex items-center gap-3 h-[70px] px-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[50px] flex items-center justify-center shadow-md">
            <FaBuilding size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            RealEstate
          </h1>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[50px] flex items-center justify-center shadow-sm">
              <FaBuilding size={16} className="text-white" />
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              RealEstate
            </h1>
          </div>
          <button
            className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all duration-200"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-6 px-3 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {/* Regular Nav Items */}
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 active:scale-[0.98]"
                  }`}
                onClick={() => setOpen(false)}
              >
                {isActive && (
                  <span className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="text-[15px]">{item.name}</span>
              </Link>
            );
          })}

          {/* Listings Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setListingsOpen(!listingsOpen)}
              className={`group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative
                ${
                  isListingsActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
            >
              <div className="flex items-center gap-3">
                {isListingsActive && (
                  <span className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <span className={`transition-transform duration-200 ${isListingsActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <FiList size={18} />
                </span>
                <span className="text-[15px]">Listings</span>
              </div>
              <span className={`transition-transform duration-200 ${listingsOpen ? 'rotate-180' : ''}`}>
                <FiChevronDown size={16} />
              </span>
            </button>
            
            {/* Listings Submenu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              listingsOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-4 pl-3 border-l-2 border-gray-200 space-y-1 pt-1">
                {listingsItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      onClick={() => setOpen(false)}
                    >
                      <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Backoffice Dropdown */}
          <div className="space-y-1">
            <button
              onClick={() => setBackofficeOpen(!backofficeOpen)}
              className={`group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative
                ${
                  isBackofficeActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/80 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
            >
              <div className="flex items-center gap-3">
                {isBackofficeActive && (
                  <span className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
                )}
                <span className={`transition-transform duration-200 ${isBackofficeActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <FiSettings size={18} />
                </span>
                <span className="text-[15px]">Management</span>
              </div>
              <span className={`transition-transform duration-200 ${backofficeOpen ? 'rotate-180' : ''}`}>
                <FiChevronDown size={16} />
              </span>
            </button>
            
            {/* Backoffice Submenu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              backofficeOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="ml-4 pl-3 border-l-2 border-gray-200 space-y-1 pt-1">
                {backofficeItems.map((item, idx) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                        }`}
                      onClick={() => setOpen(false)}
                    >
                      <span className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <div className="text-xs text-gray-500 text-center font-medium">
            © {new Date().getFullYear()} RealEstate Inc.
          </div>
        </div>
      </aside>

      {/* Overlay (Mobile Only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* Add this to your global CSS for the fade animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;