import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  KeyRound, 
  RefreshCw, 
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Lock
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import PasswordStrength from "../components/PasswordStrength";

const ForgotPassword = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;
  const navigate = useNavigate();

  // Wizard Step:
  // 1 = Enter Email
  // 2 = Enter & Verify OTP
  // 3 = Set New Password & Confirm Password
  const [step, setStep] = useState(1);

  // Form Fields
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend OTP Cooldown Timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // STEP 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    const trimmedEmail = email?.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Please enter your registered email address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/forgot-password`, {
        email: trimmedEmail,
      });

      if (res.data.success) {
        setStep(2);
        setResendCooldown(60); // 60-second cooldown
        toast.success(res.data.message || "OTP sent successfully");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(
        error.response?.data?.message || (error.response ? "Failed to dispatch verification code." : "Cannot connect to server. Please ensure the backend is running.")
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify 6-Digit OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();

    const trimmedEmail = email?.trim().toLowerCase();
    const cleanOtp = otp?.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/verify-otp`, {
        email: trimmedEmail,
        otp: cleanOtp,
      });

      if (res.data.success) {
        toast.success("Code verified! Now set your new master password.");
        setStep(3); // Transition directly to Step 3 (Set Password)
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(
        error.response?.data?.message || "Invalid or expired verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Set Password & Confirm Password -> Directly Navigate to Login
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const trimmedEmail = email?.trim().toLowerCase();
    const cleanOtp = otp?.trim();
    const cleanPass = password?.trim();
    const cleanConfirm = confirmPassword?.trim();

    if (!cleanPass || !cleanConfirm) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (cleanPass !== cleanConfirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (cleanPass.length < 6) {
      toast.error("Master password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/reset-password-otp`, {
        email: trimmedEmail,
        otp: cleanOtp,
        password: cleanPass,
        confirmPassword: cleanConfirm,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Master password reset successfully! Please log in.");
        // Directly navigate to login page
        navigate("/login");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input restriction (numeric only, max 6 digits)
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
  };

  return (
    <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md glass-panel rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Step Indicator Progress Pills */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step >= 1 ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"
          }`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step >= 2 ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"
          }`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            step >= 3 ? "w-8 bg-indigo-500" : "w-2 bg-slate-700"
          }`}></div>
        </div>

        {/* ========================================================= */}
        {/* STEP 1: Enter Registered Email Address                    */}
        {/* ========================================================= */}
        {step === 1 && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center mb-7 relative">
              <div className="w-14 h-14 mx-auto mb-3.5 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg text-indigo-400">
                <KeyRound size={28} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Forgot Password?
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                Step 1 of 3: Enter your registered email address to receive your 6-digit verification code.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Email Field */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-sm"
                  />
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
                      <span>Sending 6-Digit OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-slate-400 text-xs sm:text-sm mt-6">
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

        {/* ========================================================= */}
        {/* STEP 2: Enter & Verify 6-Digit OTP Code                   */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center mb-5 relative">
              <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg text-indigo-400">
                <ShieldCheck size={28} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Enter Verification Code
              </h1>

              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-xs">
                <span className="text-slate-400">Code sent to:</span>
                <span className="text-indigo-300 font-mono font-semibold truncate max-w-[170px]">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-400 hover:text-white text-[10px] underline ml-1 cursor-pointer"
                  title="Change email"
                >
                  Edit
                </button>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* 6-Digit OTP Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                    6-Digit OTP
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className={`text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                      resendCooldown > 0
                        ? "text-slate-500 cursor-not-allowed"
                        : "text-indigo-400 hover:text-indigo-300"
                    }`}
                  >
                    <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
                    <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}</span>
                  </button>
                </div>

                <div className="relative">
                  <KeyRound
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="000000"
                    autoFocus
                    required
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-2xl text-center text-xl font-mono tracking-[8px] font-black text-sky-300 placeholder:text-slate-600"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="py-3 px-4 rounded-2xl border border-white/10 text-slate-300 hover:bg-white/5 text-xs font-semibold transition cursor-pointer"
                  title="Back to Email"
                >
                  <ArrowLeft size={16} />
                </button>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex-1 btn-glow-primary font-bold py-3 px-6 rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-slate-400 text-xs sm:text-sm mt-5">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-indigo-400 font-semibold hover:text-indigo-300 transition underline underline-offset-4"
              >
                Back to Log In
              </Link>
            </p>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: Set Password & Confirm Password -> Direct Login  */}
        {/* ========================================================= */}
        {step === 3 && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="text-center mb-5 relative">
              <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-emerald-600/30 to-indigo-600/30 border border-emerald-500/30 rounded-2xl flex items-center justify-center shadow-lg text-emerald-400">
                <Lock size={28} />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
                <CheckCircle2 size={13} />
                <span>OTP Verified</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Set New Password
              </h1>

              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Choose a strong new master password for your vault.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
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
                    autoFocus
                    placeholder="Enter new master password"
                    className="glass-input w-full pl-10 pr-11 py-2.5 rounded-2xl text-sm font-mono"
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

              {/* Confirm New Password */}
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
                    placeholder="Confirm new master password"
                    className="glass-input w-full pl-10 pr-11 py-2.5 rounded-2xl text-sm font-mono"
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

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-glow-primary font-bold py-3 px-6 rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving New Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Password & Log In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
