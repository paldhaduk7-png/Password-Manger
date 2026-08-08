import React, { useState, useRef } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

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

    if (input.password !== input.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phonenumber", input.phonenumber);
      formData.append("password", input.password);
      formData.append("bio", input.bio);

      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }

      const res = await axios.post(`${BASE_URL}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
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
    <div className="min-h-[calc(100vh-60px)] bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl bg-white/95 rounded-3xl shadow-2xl px-8 py-7">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-2 bg-purple-100 rounded-2xl flex items-center justify-center">
            <LockKeyhole className="text-purple-600" size={25} />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Create Account
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Start managing your passwords securely with your personal profile
          </p>
        </div>

        <form onSubmit={submitData} className="space-y-4">
          {/* Avatar Upload Area */}
          <div className="flex flex-col items-center justify-center pb-2">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-md bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="text-purple-600 w-12 h-12" />
                )}
              </div>

              {/* Camera Icon Overlay */}
              <div className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition">
                <Camera size={15} />
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <span className="text-xs text-gray-500 mt-2 font-medium">
              {selectedFile ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={13} /> {selectedFile.name}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  required
                  placeholder="Your full name"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl
                  outline-none focus:border-purple-500 focus:ring-2
                  focus:ring-purple-200 transition text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="tel"
                  name="phonenumber"
                  value={input.phonenumber}
                  onChange={changeEventHandler}
                  required
                  placeholder="Phone number"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl
                  outline-none focus:border-purple-500 focus:ring-2
                  focus:ring-purple-200 transition text-sm"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition text-sm"
              />
            </div>
          </div>

          {/* Bio / Status (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio / Role (e.g. Student, Developer)
            </label>

            <div className="relative">
              <FileText
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                placeholder="e.g. Student, Software Engineer, Pro User"
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                required
                placeholder="Create a password"
                className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={changeEventHandler}
                required
                placeholder="Confirm your password"
                className="w-full pl-10 pr-11 py-2.5 border border-gray-300 rounded-xl
                outline-none focus:border-purple-500 focus:ring-2
                focus:ring-purple-200 transition text-sm"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700
            text-white font-semibold py-3 rounded-xl
            transition shadow-lg shadow-purple-200 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:text-purple-800"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;