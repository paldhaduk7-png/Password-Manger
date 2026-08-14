import { useContext, useState } from "react";
import { AuthContext } from "../ContextAPI/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, updateUser } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    email: "",
    password: ""
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  const submitData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        input,
        {
          withCredentials: true
        }
      );

      if (res.data.success) {
        if (updateUser) {
          updateUser(res.data.user, res.data.token);
        } else {
          setUser(res.data.user);
          if (res.data.token) localStorage.setItem("token", res.data.token);
        }
        toast.success(res.data.message || "Logged in successfully!");
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
        
        {/* Glow ambient background inside card */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="w-14 h-14 mx-auto mb-3.5 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg text-indigo-400">
            <LockKeyhole size={28} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Access and manage your encrypted credentials vault
          </p>
        </div>

        <form onSubmit={submitData} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                required
                placeholder="name@example.com"
                className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Master Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                required
                placeholder="••••••••••••"
                className="glass-input w-full pl-10 pr-11 py-3 rounded-2xl text-sm font-mono"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow-primary font-bold py-3 px-6 rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Unlocking Vault...</span>
                </>
              ) : (
                <>
                  <span>Log In to Vault</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-slate-900 px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-500 absolute">
            Or continue with
          </span>
        </div>

        {/* Google Authentication */}
        <GoogleLoginButton text="signin_with" />

        <p className="text-center text-slate-400 text-xs sm:text-sm mt-5">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition underline underline-offset-4"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;