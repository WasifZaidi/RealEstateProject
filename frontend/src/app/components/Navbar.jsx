"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu,
  X,
  User,
  Heart,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
  Users,
  Info,
  Phone,
} from "lucide-react";

// The path to your pure logo image
const LOGO_IMAGE_PATH = "/temp_img/logo.webp"; 

const Navbar = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";
  };

  const navigationItems = [
    { name: "About Us", href: "/about", icon: Info },
    { name: "Find Agent", href: "/agents", icon: Users },
    { name: "FAQ", href: "/faq", icon: HelpCircle },
    { name: "Contact Us", href: "/contact", icon: Phone },
  ];

  const excludedPaths = ["/compare", "/results"];
  const meetingRoutePattern = /^\/meeting\/[^/]+\/[^/]+$/; // matches /meeting/:agentId/:listingId
  const tourDetailsPattern = /^\/tourDetails\/[^/]+$/;

  const isExcludedPage =
    excludedPaths.includes(pathname) || meetingRoutePattern.test(pathname) || tourDetailsPattern.test(pathname);

  return (
    <>
      <nav
        className={`${!isExcludedPage ? "fixed top-0 left-0 right-0" : ""
          } z-50 transition-all duration-300 ${isScrolled && !isExcludedPage
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white/90 backdrop-blur-sm border-b border-gray-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo - PROFESSIONALLY PRODUCTION GRADE WAY - Replaced with pure image */}
            <a
              href="/"
              className="flex items-center group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* === Logo Image Box (Pure Logo) === */}
              <div className="relative h-10 w-auto">
                <img
                  src={LOGO_IMAGE_PATH}
                  alt="EstateHub Logo"
                  className="h-full w-auto object-contain"
                  // Next.js Image component would be used in a real project for optimization
                  // <Image src={LOGO_IMAGE_PATH} alt="EstateHub Logo" width={100} height={40} />
                />
              </div>
              {/* The following div for text and tagline is commented/removed as per the requirement
                  to show ONLY the pure logo image. 
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  EstateHub
                </span>
                <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Find Your Dream Home</span>
              </div> 
              */}
            </a>

            {/* Desktop Navigation - Enhanced with active states and better spacing */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 group ${isActive
                      ? "text-blue-700 bg-blue-50 shadow-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <item.icon
                      className={`h-4 w-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                    />
                    {item.name}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right Actions - Enhanced with better visual hierarchy */}
            <div className="flex items-center gap-3">
              {/* Saved - Desktop with notification badge */}
              <button
                className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 relative group"
                title="Saved Homes"
              >
                <div className="relative">
                  <Heart className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </div>
                <span>Saved</span>
              </button>

              {/* User Auth */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-[50px] hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all duration-300"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all duration-300">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                      </div>
                      <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900 leading-tight">
                          {user.name}
                        </span>
                        <span className="text-xs text-gray-600">
                          View Profile
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-gray-600 transition-all duration-300 ${isDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow-md"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white shadow-md">
                                {getInitials(user.name)}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-bold text-gray-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <a
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all duration-200 group-hover:scale-105">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">My Profile</div>
                            <div className="text-xs text-gray-500">View and edit profile</div>
                          </div>
                        </a>
                        <a
                          href="/saved"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-all duration-200 group-hover:scale-105 relative">
                            <Heart className="h-5 w-5 text-red-500" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              3
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">Saved Homes</div>
                            <div className="text-xs text-gray-500">Your favorite properties</div>
                          </div>
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-all duration-200 group-hover:scale-105">
                            <Settings className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">Settings</div>
                            <div className="text-xs text-gray-500">Account preferences</div>
                          </div>
                        </a>
                        <a
                          href="/help"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-all duration-200 group-hover:scale-105">
                            <HelpCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">Help & Support</div>
                            <div className="text-xs text-gray-500">Get assistance</div>
                          </div>
                        </a>
                        <div className="my-2 border-t border-gray-200"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-all duration-200 group-hover:scale-105">
                            <LogOut className="h-5 w-5 text-red-600" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-semibold">Sign Out</div>
                            <div className="text-xs text-red-500">Logout from account</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[50px] font-medium hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-300 active:scale-95"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </a>
              )}

              {/* Mobile Menu Toggle - Enhanced with better animation */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-300 active:scale-95"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-gray-700 absolute inset-0 animate-in fade-in duration-300" />
                  ) : (
                    <Menu className="h-6 w-6 text-gray-700 absolute inset-0 animate-in fade-in duration-300" />
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced with better animation and styling */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md shadow-lg animate-in slide-in-from-top duration-300"
          >
            <div className="px-4 py-4">
              {/* Navigation */}
              <div className="space-y-1 mb-4">
                {navigationItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${isActive
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </a>
                  );
                })}
              </div>

              {/* User Section */}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-3">
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold ring-2 ring-white">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <a
                      href="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <User className="h-5 w-5" />
                      My Profile
                    </a>
                    <a
                      href="/saved"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 relative"
                    >
                      <Heart className="h-5 w-5" />
                      Saved Homes
                      <span className="absolute right-4 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        3
                      </span>
                    </a>
                    <a
                      href="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </a>
                    <a
                      href="/help"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    >
                      <HelpCircle className="h-5 w-5" />
                      Help & Support
                    </a>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-base text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <a
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-[50px] hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 active:scale-95"
                  >
                    <User className="h-5 w-5" />
                    Sign In
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      {!isExcludedPage && <div className="h-16" />}
    </>
  );
};

export default Navbar;