"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, Bell, CalendarDays, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mock function for notification click
  const handleNotificationClick = () => {
    alert("Notifications panel would open here!");
    setNotifications(0);
  };

  return (
    <header className="bg-gradient-to-r from-blue-300 to-purple-300 text-black shadow-lg sticky top-0 z-50">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name - Far Left */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-black tracking-wide hover:text-gray-600 transition-colors duration-200"
            >
              <span className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                E
              </span>
              <span className="hidden sm:block">EVENZA</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black p-2 rounded-md hover:bg-blue-200 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Center Section with Navigation - Hidden on Mobile */}
          <div className="hidden md:flex md:items-center md:justify-center space-x-1">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-blue-200 hover:text-blue-800 transition-all duration-200 flex items-center"
            >
              <CalendarDays className="mr-1 h-4 w-4" />
              Events
            </Link>
            <Link
              href="/features"
              className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-blue-200 hover:text-blue-800 transition-all duration-200"
            >
              Pricing
            </Link>
          </div>

          {/* Search Bar - Right Side */}
          <div className="hidden md:flex md:items-center md:justify-end lg:w-1/3" ref={searchRef}>
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`h-5 w-5 ${isSearchFocused ? 'text-blue-600' : 'text-gray-500'}`} />
              </div>
              <input
                id="search"
                name="search"
                className={`block w-full pl-10 pr-3 py-2 border ${isSearchFocused ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'} rounded-full leading-5 bg-white text-black placeholder-gray-500 focus:outline-none transition-all duration-200 sm:text-sm`}
                placeholder="Search events in your city..."
                type="search"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
      

            {/* Profile Circle */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-300 focus:ring-blue-500 transition-all duration-200"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                  <img
                    className="h-8 w-8 rounded-full border-2 border-white"
                    src="/api/placeholder/32/32"
                    alt="User profile"
                  />
                </div>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Alex Johnson</p>
                    <p className="text-xs text-gray-500 truncate">alex.johnson@example.com</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    Your Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                  >
                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link
                    href="/logout"
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4 text-red-500" />
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-lg overflow-hidden">
          <div className="pt-2 pb-4 space-y-1">
            {/* Mobile Search */}
            <div className="px-4 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="mobile-search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search events..."
                  type="search"
                />
              </div>
            </div>
            
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href="/events"
              className="flex px-4 py-2 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600 items-center"
            >
              <CalendarDays className="mr-2 h-5 w-5 text-gray-500" />
              Events
            </Link>
            <Link
              href="/features"
              className="block px-4 py-2 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-2 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600"
            >
              About
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              href="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Your Profile
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-base font-medium text-gray-800 hover:bg-blue-50 hover:text-blue-600"
            >
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}