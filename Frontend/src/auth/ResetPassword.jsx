import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  Eye, 
  EyeOff, 
  LockKeyhole, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import PasswordStrength from "../components/PasswordStrength";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Missing or invalid password reset token");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/reset-password/${token}`, {
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      });

      if (res.data.success) {
        setResetSuccess(true);
        toast.success(res.data.message || "Master password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to reset password. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 mx-auto bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">Invalid Reset Link</h2>
          <p className="text-sm text-slate-400">
            This password reset link is invalid or incomplete. Please request a new link.
          </p>
          <div className="pt-2">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 btn-glow-primary px-6 py-2.5 rounded-2xl text-sm font-semibold shadow-lg"
            >
              <span>Request New Reset Link</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {resetSuccess ? (
          /* Success View */
          <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto bg-emerald-500/15 border border-emerald-500/30 rounded-3xl flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Password Reset Complete!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
                Your master vault password has been updated. You will be redirected to log in in a few seconds...
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full btn-glow-primary py-3 rounded-2xl text-sm font-bold shadow-lg flex items-center justify-center gap-2"
              >
                <span>Log In to Vault</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          /* Reset Form View */
          <div>
            {/* Header */}
            <div className="text-center mb-6 relative">
              <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg text-indigo-400">
                <ShieldCheck size={28} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Set New Master Password
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Choose a strong new password for your encrypted vault
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  New Master Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
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

                {password && (
                  <div className="mt-2 p-2 bg-slate-950/40 rounded-xl border border-white/[0.06]">
                    <PasswordStrength password={password} />
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="glass-input w-full pl-10 pr-11 py-3 rounded-2xl text-sm font-mono"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-glow-primary font-bold py-3 px-6 rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Master Password</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-slate-400 text-xs sm:text-sm mt-5">
              Remember your master password?{" "}
              <Link
                to="/login"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition underline underline-offset-4"
              >
                Back to Log In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
