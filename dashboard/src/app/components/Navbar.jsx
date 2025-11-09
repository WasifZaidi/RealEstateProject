"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  FiLogOut,
} from "react-icons/fi";
import { User, Calendar } from "lucide-react";

const Navbar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [listingsOpen, setListingsOpen] = useState(false);
  const [backofficeOpen, setBackofficeOpen] = useState(false);
  const [meetingsOpen, setMeetingsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isListingsActive = pathname.startsWith("/listings");
  const isBackofficeActive = pathname.startsWith("/backoffice");
  const isMeetingsActive = pathname.startsWith("/meeting");

  const navItems = [
    { name: "Dashboard", href: "/", icon: <FiHome size={18} /> },
    { name: "Analytics", href: "/analytics", icon: <FiBarChart2 size={18} /> },
    {
      name: "Agent Profile",
      href: user?.isVerifiedAgent ? "/agent/manage" : "/createAgentProfile",
      icon: <User size={18} />,
    },
  ];

  const listingsItems = [
    { name: "Create Listing", href: "/listings/create", icon: <FiPlusSquare size={16} /> },
    { name: "Manage Listings", href: "/listings/manage", icon: <FiList size={16} /> },
  ];

  const meetingsItems = [
    { name: "Manage Meeting", href: "/meeting/manage", icon: <Calendar size={16} /> },
  ];

  const backofficeItems = [
    { name: "Manage Users", href: "/backoffice/manageUsers", icon: <FiUsers size={16} /> },
    { name: "Roles & Permissions", href: "/backoffice/roles", icon: <FiSettings size={16} /> },
    { name: "System Logs", href: "/backoffice/logs", icon: <FiList size={16} /> },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/dashboard/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout Failed");
      router.push("/signIn");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-5 py-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <h1 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Horizon Dashboard
          </h1>
        </div>
        <button
          className="p-2 rounded-lg hover:bg-blue-50 active:scale-95 transition-all duration-200"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[265px] bg-white/95 border-r border-gray-200 shadow-xl z-50
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo & Title */}
        <div className="hidden md:flex flex-col items-start justify-center gap-1 h-[80px] px-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-[17px] font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                Horizon Real Estate
              </h1>
              <p className="text-xs text-gray-500 font-medium">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col mt-6 px-3 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-200 relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {isActive && <span className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />}
                <span
                  className={`transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Dropdowns */}
          {[
            {
              label: "Listings",
              open: listingsOpen,
              setOpen: setListingsOpen,
              active: isListingsActive,
              items: listingsItems,
              icon: <FiList size={18} />,
            },
            {
              label: "Meetings",
              open: meetingsOpen,
              setOpen: setMeetingsOpen,
              active: isMeetingsActive,
              items: meetingsItems,
              icon: <Calendar size={18} />,
            },
            {
              label: "Management",
              open: backofficeOpen,
              setOpen: setBackofficeOpen,
              active: isBackofficeActive,
              items: backofficeItems,
              icon: <FiSettings size={18} />,
            },
          ].map(({ label, open, setOpen, active, items, icon }, idx) => (
            <div key={idx} className="space-y-1">
              <button
                onClick={() => setOpen(!open)}
                className={`group w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 relative ${
                  active
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  {active && (
                    <span className="absolute left-0 w-1 h-8 bg-blue-600 rounded-r-full" />
                  )}
                  <span
                    className={`transition-transform duration-200 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  >
                    {icon}
                  </span>
                  <span className="text-[15px]">{label}</span>
                </div>
                <FiChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 pl-3 border-l-2 border-gray-200 space-y-1 pt-1">
                  {items.map((item, idx) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </nav>

        {/* === Logout Button & Footer === */}
        <div className="absolute bottom-0 left-0 w-full px-6 py-5 border-t border-gray-200 bg-gray-50/80">
          <button
  onClick={handleLogout}
  className="w-full border border-gray-400 cursor-pointer flex items-center justify-center gap-2 py-2.5 font-medium text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
>
  <FiLogOut size={16} />
  <span>Logout</span>
</button>
          <p className="text-xs text-gray-500 font-medium mt-4 text-center">
            © {new Date().getFullYear()} Horizon Dashboard
          </p>
          <p className="text-[11px] text-gray-400 text-center mt-1">
            A Product of{" "}
            <a
              href="https://softivy.com"
              target="_blank"
              className="text-blue-600 hover:underline font-semibold"
            >
              Softivy.com
            </a>
          </p>
        </div>
      </aside>

      {/* Overlay for Mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn md:hidden"
        />
      )}

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
