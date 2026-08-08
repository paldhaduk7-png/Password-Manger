import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../ContextAPI/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Camera,
  FileText,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Shield,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    bio: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
        bio: user.bio || "",
      });
      setImagePreview(user.profilePicture || "");
    }
  }, [user]);

  // Handle text inputs
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection with live preview
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

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("fullname", formData.fullname);
      data.append("phonenumber", formData.phonenumber);
      data.append("bio", formData.bio);

      if (selectedFile) {
        data.append("profilePicture", selectedFile);
      }

      const res = await axios.put(`${BASE_URL}/update-profile`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        if (updateUser) {
          updateUser(res.data.user);
        }
        toast.success(res.data.message || "Profile updated successfully!");
        setSelectedFile(null);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 py-10 px-4 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-purple-700 to-indigo-700 px-8 pt-8 pb-16 text-white">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition duration-200"
            >
              <ArrowLeft size={18} />
              Back to Passwords
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide uppercase text-purple-100">
              <Shield size={14} className="text-emerald-300" />
              Secure Account
            </div>
          </div>
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
              User Profile
              <Sparkles size={22} className="text-yellow-300" />
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              Manage your personal info and profile avatar
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 sm:px-10 pb-8 pt-0 -mt-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center sm:flex-row sm:items-end gap-5 bg-white p-4 rounded-2xl shadow-md border border-gray-100">
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-purple-700 uppercase">
                      {formData.fullname
                        ? formData.fullname.charAt(0)
                        : "U"}
                    </span>
                  )}
                </div>

                {/* Upload Button overlay / badge */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2.5 rounded-full shadow-lg transition transform hover:scale-105"
                  title="Upload profile picture"
                >
                  <Camera size={16} />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-lg font-bold text-gray-800">
                  {formData.fullname || "Your Name"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Allowed formats: PNG, JPG, JPEG, WEBP (Max 5MB)
                </p>
                {selectedFile && (
                  <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1">
                    <CheckCircle2 size={13} />
                    New photo selected ({selectedFile.name})
                  </p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your name"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm
                    outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    name="phonenumber"
                    value={formData.phonenumber}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm
                    outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
                  />
                </div>
              </div>
            </div>

            {/* Read-Only Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Email Address
                </label>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Lock size={11} /> Read-only
                </span>
              </div>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed select-none"
                />
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Bio / Notes
              </label>
              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-3.5 top-3 text-gray-400"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Tell something about yourself or add a note..."
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm
                  outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition resize-none"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-purple-200 transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Updating Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
