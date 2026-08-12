import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
  Phone,
  Camera,
  Loader2,
  CheckCircle2,
  FileText,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import PasswordStrength from "../components/PasswordStrength";

const Signup = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
    bio: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitData = async (e) => {
    e.preventDefault();

    const trimmedFullname = input.fullname?.trim();
    const trimmedEmail = input.email?.trim();
    const trimmedPhone = input.phonenumber?.trim();
    const trimmedBio = input.bio?.trim();

    if (!trimmedFullname || !trimmedEmail || !trimmedPhone || !input.password) {
      toast.error("Please fill in all required fields (Name, Email, Phone, Password)");
      return;
    }

    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", trimmedFullname);
      formData.append("email", trimmedEmail);
      formData.append("phonenumber", trimmedPhone);
      formData.append("password", input.password);
      formData.append("bio", trimmedBio);

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const res = await axios.post(`${BASE_URL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Account registered successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-xl glass-panel rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
        
        {/* Glow ambient background inside card */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-6 relative">
          <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg text-indigo-400">
            <LockKeyhole size={28} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create Master Vault
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Start protecting your credentials with zero-knowledge encryption
          </p>
        </div>

        <form onSubmit={submitData} className="space-y-4">
          {/* Avatar Upload Area */}
          <div className="flex flex-col items-center justify-center pb-2">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-indigo-500/40 shadow-lg bg-slate-800 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <User className="text-indigo-400 w-10 h-10" />
                )}
              </div>

              <div className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-xl shadow-lg transition">
                <Camera size={13} />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-2 font-medium">
              {selectedFile ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={12} /> {selectedFile.name}
                </span>
              ) : (
                "Click avatar to add profile photo (Optional)"
              )}
            </span>
          </div>

          {/* Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  required
                  placeholder="e.g. John Doe"
                  className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-2xl text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="tel"
                  name="phonenumber"
                  value={input.phonenumber}
                  onChange={changeEventHandler}
                  placeholder="+1 (555) 000-0000"
                  className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-2xl text-sm"
                />
              </div>
            </div>
          </div>

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
                className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Bio / Status (Optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Bio / Role (Optional)
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                placeholder="e.g. Developer, Security Enthusiast, Student"
                className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-2xl text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Master Password
            </label>

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
                placeholder="Create a strong password"
                className="glass-input w-full pl-10 pr-11 py-2.5 rounded-2xl text-sm font-mono"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {input.password && (
              <div className="mt-2 p-2 bg-slate-950/40 rounded-xl border border-white/[0.06]">
                <PasswordStrength password={input.password} />
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={changeEventHandler}
                required
                placeholder="Confirm your master password"
                className="glass-input w-full pl-10 pr-11 py-2.5 rounded-2xl text-sm font-mono"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow-primary font-bold py-3 rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating Encrypted Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-slate-400 text-xs sm:text-sm mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition underline underline-offset-4"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;