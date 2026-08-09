import { useState, useEffect, useCallback } from 'react';
import Display from './Display.jsx';
import axios from "axios";
import { toast } from 'sonner';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Globe, 
  User, 
  Lock, 
  RefreshCw, 
  FolderLock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import PasswordStrength from "../components/PasswordStrength";

const Home = () => {

  const [user, setUser] = useState({
    url: '',
    userName: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  // Generate strong random password
  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
    let generated = "";
    for (let i = 0; i < 16; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUser(prev => ({
      ...prev,
      password: generated
    }));
    setShowPassword(true);
    toast.success("Generated strong 16-character password!");
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user.url || !user.userName || !user.password) {
      toast.error("Please fill in all fields (URL, Username, and Password)");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/addPassword`,
        {
          weburl: user.url,
          username: user.userName,
          password: user.password
        },
        {
          withCredentials: true
        }
      );

      if (res.data.success) {
        await fetchPasswords();
        setUser({
          url: "",
          userName: "",
          password: ""
        });
        setShowPassword(false);
        toast.success(res.data.message || "Password saved securely!");
      }
    } catch (error) {
      console.log("Save password error:", error.response?.data || error.message);
      const errMsg = error.response?.data?.message || error.response?.data?.Message || "Failed to save password";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchPasswords = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL, {
        withCredentials: true
      });
      setUsers(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  }, [BASE_URL]);

  useEffect(() => {
    fetchPasswords();
  }, [fetchPasswords]);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3 pt-2 sm:pt-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
          Pass<span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">OP</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
          Your personal zero-knowledge password vault. Store, generate, and autofill credentials effortlessly.
        </p>
      </div>

      {/* Add Password Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-indigo-600/15 via-purple-600/10 to-transparent blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Add New Password</h2>
              <p className="text-xs text-slate-400">Save a new credential to your encrypted storage</p>
            </div>
          </div>

          <button
            type="button"
            onClick={generateStrongPassword}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 text-xs font-semibold transition cursor-pointer"
          >
            <RefreshCw size={13} />
            <span>Generate Password</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Website URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Website or App URL
            </label>
            <div className="relative">
              <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="e.g. https://github.com or google.com"
                name="url"
                value={user.url}
                onChange={handleInputChange}
                className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Username + Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. yourname@example.com"
                  name="userName"
                  value={user.userName}
                  onChange={handleInputChange}
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="sm:hidden text-indigo-400 text-xs hover:underline"
                >
                  Generate
                </button>
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter or generate password"
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  className="glass-input w-full pl-10 pr-11 py-3 rounded-2xl text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Password Strength Indicator (if typed) */}
          {user.password && (
            <div className="p-3 bg-slate-950/40 rounded-2xl border border-white/[0.06]">
              <PasswordStrength password={user.password} />
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto btn-glow-primary px-8 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus size={18} />
              <span>{loading ? "Encrypting & Saving..." : "Save to Vault"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Saved Passwords Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-white">Your Passwords</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              {users.length}
            </span>
          </div>

          <Link
            to="/saved-passwords"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 group"
          >
            <span>View all in Vault</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <FolderLock size={28} />
            </div>
            <p className="text-slate-300 font-semibold">No passwords saved yet</p>
            <p className="text-slate-500 text-xs mt-1">
              Add your first credential above to secure it in your vault.
            </p>
          </div>
        ) : (
          <Display users={users} getPasswords={fetchPasswords} />
        )}
      </div>
    </div>
  );
};

export default Home;