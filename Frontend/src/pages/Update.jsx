import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft, Lock, Globe, User, CheckCircle2, Loader2, Shield } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from 'sonner';
import PasswordStrength from "../components/PasswordStrength";

export default function UpdateData() {
  const location = useLocation();
  const id = location.state?.id;
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [user, setUser] = useState({
    url: "",
    userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(() => Boolean(id));

  const handleInputChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    const getPassword = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${id}`, { withCredentials: true });

        if (res.data.success && isMounted) {
          setUser({
            url: res.data.data.weburl || "",
            userName: res.data.data.username || "",
            password: res.data.data.password || "",
          });
        }
      } catch (error) {
        console.log(error);
        if (isMounted) toast.error("Failed to load password details");
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    getPassword();

    return () => {
      isMounted = false;
    };
  }, [id, BASE_URL]);

  const updatePassword = async (e) => {
    if (e) e.preventDefault();
    if (!user.url || !user.userName || !user.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/${id}`,
        {
          weburl: user.url,
          username: user.userName,
          password: user.password,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password updated successfully!");
        navigate("/saved-passwords");
      }
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-xl glass-panel rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top bar with back button */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
          <Link
            to="/saved-passwords"
            className="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 transition"
          >
            <ArrowLeft size={16} />
            <span className="text-xs font-semibold pr-1">Back to Vault</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
            <Shield size={13} />
            <span>Editing Credential</span>
          </span>
        </div>

        {fetching ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-indigo-400" />
            <p className="text-slate-400 text-sm font-medium">Loading credentials...</p>
          </div>
        ) : (
          <form onSubmit={updatePassword} className="space-y-4">
            {/* Website URL */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Website or App URL
              </label>
              <div className="relative">
                <Globe size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="url"
                  value={user.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  required
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Username or Email
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="userName"
                  value={user.userName}
                  onChange={handleInputChange}
                  placeholder="Username"
                  required
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={user.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  required
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

              {user.password && (
                <div className="mt-2 p-2.5 bg-slate-950/40 rounded-xl border border-white/[0.06]">
                  <PasswordStrength password={user.password} />
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/saved-passwords")}
                className="flex-1 py-3 px-4 rounded-2xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-6 rounded-2xl btn-glow-primary text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
