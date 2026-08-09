import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../ContextAPI/AuthContext";
import axios from 'axios';
import { toast } from "sonner";
import { User, LogOut, FileText, Bookmark, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const UserLogout = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setUser(null);
        localStorage.removeItem("user");
        toast.success(res.data.message || "Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    }
  };

  return (
    <nav className='flex items-center justify-between px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white shadow-lg sticky top-0 z-50'>
      {/* Logo */}
      <Link to="/" className='flex items-center gap-2 group'>
        <h1 className='text-2xl font-bold tracking-wide cursor-pointer text-white group-hover:text-purple-100 transition duration-200'>
          Password <span className='text-purple-200'>Manager</span>
        </h1>
      </Link>

      {/* Navigation Links */}
      <ul className='flex items-center gap-5 text-sm sm:text-base font-medium'>
        {user ? (
          <>
            <li>
              <Link
                to="/"
                className='hover:text-purple-200 transition duration-200'
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className='hover:text-purple-200 transition duration-200'
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className='hover:text-purple-200 transition duration-200'
              >
                Contact
              </Link>
            </li>

            {/* Profile Dropdown Trigger */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className='flex items-center gap-2 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full transition duration-200 border border-white/20 cursor-pointer select-none'
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullname || "Profile"}
                    className='w-7 h-7 rounded-full object-cover object-top border border-white/60 shadow-sm'
                  />
                ) : (
                  <div className='w-7 h-7 rounded-full bg-white text-purple-700 font-bold text-xs flex items-center justify-center shadow-sm'>
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User size={14} />}
                  </div>
                )}
                <span className='hidden sm:inline font-semibold text-sm'>
                  {user.fullname ? user.fullname.split(" ")[0] : "Profile"}
                </span>
                <ChevronDown size={14} className={`text-white/80 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Exact User Card Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-12 w-72 bg-white rounded-3xl shadow-2xl p-4 border border-gray-100 text-gray-800 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Top Profile Card */}
                  <div className="bg-purple-50/80 p-3 rounded-2xl flex items-center gap-3 border border-purple-100/60 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-300 shrink-0 bg-purple-200 flex items-center justify-center shadow-sm">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.fullname}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-lg font-bold text-purple-700">
                          {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-base leading-tight truncate">
                        {user.fullname || "User"}
                      </h4>
                      <div className="inline-flex items-center gap-1.5 mt-1 bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
                        <span className="truncate">{user.bio || "Student"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-1.5">
                    {/* Profile */}
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 text-purple-700 font-semibold transition"
                    >
                      <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                        <User size={18} />
                      </div>
                      <span className="text-sm font-medium">Profile</span>
                    </Link>

                    {/* Saved Passwords */}
                    <Link
                      to="/"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold transition"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <span className="text-sm font-medium">Saved Passwords</span>
                    </Link>

                    {/* Saved / Security Guide */}
                    <Link
                      to="/about"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-semibold transition"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Bookmark size={18} />
                      </div>
                      <span className="text-sm font-medium">Security Guide</span>
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-2.5"></div>

                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      UserLogout();
                    }}
                    className="w-full border border-gray-200 hover:border-red-200 rounded-2xl p-2.5 flex items-center gap-3 hover:bg-red-50/50 transition cursor-pointer text-left group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                      <LogOut size={18} />
                    </div>
                    <span className="font-semibold text-gray-700 group-hover:text-red-600 text-sm">
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/signup"
                className="bg-white text-purple-700 px-5 py-2 rounded-lg
                font-semibold hover:bg-purple-50 transition duration-200 shadow-sm"
              >
                Sign Up
              </Link>
            </li>

            <li>
              <Link
                to="/login"
                className="border-2 border-white/70 text-white px-5 py-1.5 rounded-lg
                font-semibold hover:bg-white hover:text-purple-700
                transition duration-200"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;