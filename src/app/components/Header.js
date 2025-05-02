"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Menu,
  X,
  CalendarDays,
  User,
  LogOut,
  Ticket,
  LayoutDashboard,
  UserIcon,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";

export default function Header() {
  const user = useSelector((store) => store.user);
  const events = useSelector((store) => store.events);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

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

          {/* Center Section with Navigation - Hidden on Mobile */}
          <div className="hidden md:flex md:items-center md:justify-center space-x-1">
            <Link
              href="/dashboard"
              className="flex items-center px-3 py-2 rounded-md text-sm text-black hover:bg-gray-100"
            >
              <LayoutDashboard className="mr-3 h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/events"
              className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-gray-100 flex items-center"
            >
              <CalendarDays className="mr-1 h-4 w-4" />
              Events
            </Link>
            <Link
              href="/tickets"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-black  hover:bg-gray-100"
            >
              <Ticket className="w-5 h-5" />
              My Tickets
            </Link>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {/* Profile Circle */}
            {user ? (
              // 👉 Show profile circle
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-300 focus:ring-blue-500 transition-all duration-200"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
                    {user.photoUrl ? (
                      <Image
                        src={user.photoUrl}
                        alt="User profile"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full border-2 border-white bg-white flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-black" />
                      </div>
                    )}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user.name || ""}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email || ""}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-black  hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 text-black" />
                      Your Profile
                    </Link>
                    <Link
                      href="/events"
                      className="px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-gray-100 flex items-center"
                    >
                      <CalendarDays className="mr-1 h-4 w-4" />
                      Events
                    </Link>
                    <Link
                      href="/tickets"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-black  hover:bg-gray-100"
                    >
                      <Ticket className="w-5 h-5" />
                      My Tickets
                    </Link>
                    <Link
                      href="/wallet"
                      className="flex items-center gap-2 px-3 py-2 rounded-md text-black  hover:bg-gray-100"
                    >
                      <Wallet className="w-5 h-5" />
                      My Wallet
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout} // Replace with your logout handler
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-red-500" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // 👉 Show Login button if user is null
              <Link
                href="/login"
                className="group relative px-6 py-3 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
                <span className="relative flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
