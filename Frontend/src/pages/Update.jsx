import { useState, useEffect } from "react";
import { 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Lock, 
  Globe, 
  User, 
  CheckCircle2, 
  Loader2, 
  Shield, 
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import PasswordStrength from "../components/PasswordStrength";

export default function UpdateData() {
  const { id: paramId } = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Resolve ID from route params, location state, or search params
  const targetId = paramId || location.state?.id || searchParams.get("id");

  const [user, setUser] = useState({
    url: "",
    userName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(() => Boolean(targetId));

  const handleInputChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Generate strong random password
  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
    let generated = "";
    for (let i = 0; i < 16; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setUser((prev) => ({
      ...prev,
      password: generated,
    }));
    setShowPassword(true);
    toast.success("Generated strong 16-character password!");
  };

  useEffect(() => {
    let isMounted = true;
    if (!targetId) {
      setFetching(false);
      return;
    }

    const getPasswordDetails = async () => {
      setFetching(true);
      try {
        const res = await axios.get(`${BASE_URL}/${targetId}`, { withCredentials: true });

        if (res.data.success && isMounted) {
          setUser({
            url: res.data.data.weburl || "",
            userName: res.data.data.username || "",
            password: res.data.data.password || "",
          });
        }
      } catch (error) {
        console.error("Fetch password error:", error);
        if (isMounted) {
          toast.error(error.response?.data?.message || "Failed to load password details from vault");
        }
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    getPasswordDetails();

    return () => {
      isMounted = false;
    };
  }, [targetId, BASE_URL]);

  const handleUpdatePassword = async (e) => {
    if (e) e.preventDefault();

    const trimmedUrl = user.url?.trim();
    const trimmedUsername = user.userName?.trim();
    const trimmedPassword = user.password?.trim();

    if (!trimmedUrl || !trimmedUsername || !trimmedPassword) {
      toast.error("Please fill in all fields (URL, Username, and Password)");
      return;
    }

    if (!targetId) {
      toast.error("No valid credential ID specified for update");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${BASE_URL}/${targetId}`,
        {
          weburl: trimmedUrl,
          username: trimmedUsername,
          password: trimmedPassword,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Credential updated successfully!");
        navigate("/saved-passwords");
      }
    } catch (error) {
      console.error("Update password error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to update credential");
    } finally {
      setLoading(false);
    }
  };

  // If no ID is found in URL or state
  if (!targetId) {
    return (
      <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 mx-auto bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">No Credential Selected</h2>
          <p className="text-sm text-slate-400">
            Please choose a password from your vault or saved passwords list to edit.
          </p>
          <div className="pt-2">
            <Link
              to="/saved-passwords"
              className="inline-flex items-center gap-2 btn-glow-primary px-6 py-2.5 rounded-2xl text-sm font-semibold shadow-lg"
            >
              <ArrowLeft size={16} />
              <span>Go to Saved Passwords</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-xl glass-panel rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top bar with back button */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
          <Link
            to="/saved-passwords"
            className="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
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
            <p className="text-slate-400 text-sm font-medium">Decrypting & loading credential...</p>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition cursor-pointer font-medium"
                >
                  <RefreshCw size={12} />
                  <span>Generate New</span>
                </button>
              </div>

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

