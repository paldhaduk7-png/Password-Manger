import { useState, useRef, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from "../ContextAPI/AuthContext";
import axios from 'axios';
import { toast } from "sonner";
import { 
  Shield, 
  KeyRound, 
  User, 
  LogOut, 
  Bookmark, 
  ChevronDown, 
  ChevronRight,
  Menu, 
  X,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";
import LogoutModal from "../components/LogoutModal";
import { useTheme } from "../ContextAPI/context";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
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

  const handleConfirmLogout = async () => {
    setLogoutLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setShowLogoutModal(false);
        toast.success(res.data.message || "Logged out successfully");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Logout failed"
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  const isActive = (path) => location.pathname === path;
  const isLandingPage = location.pathname === "/";
  const isAppRoute = ["/dashboard", "/saved-passwords", "/profile", "/update"].some(path => location.pathname.startsWith(path));

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/75 backdrop-blur-xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Pass<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">OP</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30 rounded-md">
                  Vault
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {(!user || isLandingPage) ? (
              <Link
                to="/"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 shadow-inner"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5"
                }`}
              >
                Home
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 shadow-inner"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5"
                }`}
              >
                Dashboard
              </Link>
            )}

            {isLandingPage && (
              <>
                <a
                  href="/#features"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5"
                >
                  Features
                </a>
                <a
                  href="/#how-it-works"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5"
                >
                  How It Works
                </a>
              </>
            )}

            {user && !isLandingPage && (
              <Link
                to="/saved-passwords"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive("/saved-passwords")
                    ? "text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5"
                }`}
              >
                <KeyRound size={15} />
                <span>Vault</span>
              </Link>
            )}

            {!isAppRoute && (
              <>
                <Link
                  to="/about"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive("/about")
                      ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 shadow-inner"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5"
                  }`}
                >
                  About
                </Link>

                <Link
                  to="/contact"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive("/contact")
                      ? "text-slate-900 dark:text-white bg-slate-100 dark:bg-white/10 shadow-inner"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-white/5"
                  }`}
                >
                  Contact
                </Link>
              </>
            )}
          </div>

          {/* User Profile / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Switcher Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 border border-slate-200 dark:border-white/10 hover:border-amber-400/30 transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-center"
              title={theme === "dark" ? "Switch to Bright / Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800/90 text-slate-800 dark:text-slate-200 px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/40 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <div className="relative">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.fullname || "Profile"}
                        className="w-8 h-8 rounded-full object-cover object-top ring-2 ring-indigo-500/50"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-500/40 shadow-sm">
                        {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User size={14} />}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
                  </div>

                  <div className="text-left flex flex-col">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 leading-tight">
                      {user.fullname ? user.fullname.split(" ")[0] : "Account"}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {user.bio || "Active User"}
                    </span>
                  </div>

                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform duration-200 ${
                      menuOpen ? "rotate-180 text-indigo-400" : ""
                    }`}
                  />
                </button>

                {/* Glassmorphic Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 top-14 w-80 bg-white/98 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)] p-3.5 border border-slate-200/90 dark:border-white/10 text-slate-900 dark:text-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* User Mini Banner */}
                    <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-pink-50/60 dark:from-indigo-950/60 dark:via-purple-950/50 dark:to-slate-900/80 p-3.5 rounded-2xl flex items-center gap-3 border border-indigo-100/90 dark:border-indigo-500/20 mb-3 shadow-xs">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-indigo-500/30 dark:ring-indigo-500/40 shrink-0 bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={user.fullname}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <span className="text-lg font-bold text-white tracking-wide" style={{ color: '#ffffff' }}>
                            {user.fullname ? user.fullname.charAt(0).toUpperCase() : "U"}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate tracking-tight">
                          {user.fullname || "User"}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                        <div className="inline-flex items-center gap-1.5 mt-1.5 bg-white/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-indigo-200/70 dark:border-indigo-500/30 shadow-xs max-w-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                          <span className="truncate">{user.bio || "Student"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white transition-all duration-150 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 group-hover:scale-105 transition-all duration-150">
                          <User size={18} />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Profile Settings</span>
                        <ChevronRight size={14} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-150" />
                      </Link>

                      <Link
                        to="/saved-passwords"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white transition-all duration-150 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 group-hover:scale-105 transition-all duration-150">
                          <KeyRound size={18} />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Saved Passwords</span>
                        <ChevronRight size={14} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all duration-150" />
                      </Link>

                      <Link
                        to="/about"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-100/90 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white transition-all duration-150 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-500/20 group-hover:scale-105 transition-all duration-150">
                          <Bookmark size={18} />
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Security Guide</span>
                        <ChevronRight size={14} className="ml-auto text-slate-300 dark:text-slate-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all duration-150" />
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-200/80 dark:border-white/[0.08] my-2"></div>

                    {/* Logout Button */}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full border border-rose-200/80 hover:border-rose-300 dark:border-rose-500/20 dark:hover:border-rose-500/40 rounded-2xl px-3 py-2.5 flex items-center gap-3 bg-rose-50/60 hover:bg-rose-100/80 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 transition-all duration-150 cursor-pointer text-left group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:bg-rose-500/25 group-hover:scale-105 transition-all duration-150">
                        <LogOut size={18} />
                      </div>
                      <span className="font-bold text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300 text-sm">
                        Log Out
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/5 transition"
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="btn-glow-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles size={15} />
                  <span>Get Started</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer flex items-center justify-center"
              title={theme === "dark" ? "Switch to Bright / Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-amber-400" />
              ) : (
                <Moon size={20} className="text-indigo-500" />
              )}
            </button>

            {user && (
              <Link to="/profile" className="flex items-center">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullname}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User size={14} />}
                  </div>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white/98 dark:bg-slate-950/95 border-b border-slate-200 dark:border-white/10 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {(!user || isLandingPage) ? (
            <Link
              to="/"
              onClick={() => setMobileNavOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive("/") ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              Home
            </Link>
          ) : (
            <Link
              to="/dashboard"
              onClick={() => setMobileNavOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive("/dashboard") ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              Dashboard
            </Link>
          )}

          {isLandingPage && (
            <>
              <a
                href="/#features"
                onClick={() => setMobileNavOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                Features
              </a>
              <a
                href="/#how-it-works"
                onClick={() => setMobileNavOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              >
                How It Works
              </a>
            </>
          )}

          {user && !isLandingPage && (
            <Link
              to="/saved-passwords"
              onClick={() => setMobileNavOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive("/saved-passwords") ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
              }`}
            >
              Saved Passwords
            </Link>
          )}

          {!isAppRoute && (
            <>
              <Link
                to="/about"
                onClick={() => setMobileNavOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive("/about") ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                About
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileNavOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive("/contact") ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                Contact
              </Link>
            </>
          )}

          {/* Mobile Drawer Theme Switcher */}
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.08]">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Theme</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-transparent transition cursor-pointer shadow-xs"
            >
              {theme === "dark" ? (
                <>
                  <Sun size={14} className="text-amber-400" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={14} className="text-indigo-500" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2"
                >
                  <User size={16} className="text-indigo-500 dark:text-indigo-400" />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={() => {
                    setMobileNavOpen(false);
                    setShowLogoutModal(true);
                  }}
                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm font-semibold text-slate-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-center py-2.5 rounded-xl btn-glow-primary text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        user={user}
        loading={logoutLoading}
      />
    </nav>
  );
};

export default Navbar;