import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../ContextAPI/AuthContext";
import {
  User,
  Mail,
  Phone,
  Camera,
  FileText,
  Lock,
  Loader2,
  CheckCircle2,
  Edit3,
  X,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const UpdateProfile = ({ isOpen, onClose }) => {
  const { user, updateUser } = useContext(AuthContext);
  const BASE_URL = import.meta.env.VITE_BASE_URL_USER;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    bio: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Sync modal form with user data when modal opens
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        fullname: user.fullname || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
        bio: user.bio || "",
      });
      setImagePreview(user.profilePicture || "");
      setSelectedFile(null);
    }
  }, [user, isOpen]);

  // Handle text input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input selection with live preview
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

  // Submit profile updates to backend
  const handleSaveProfile = async (e) => {
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
        onClose();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Edit3 size={18} />
            Update Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4.5">
          {/* Avatar Selector with Camera Badge */}
          <div className="flex flex-col items-center justify-center pb-1">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change photo"
            >
              <div className="w-22 h-22 rounded-full overflow-hidden ring-4 ring-purple-500/30 shadow-md bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 15%" }}
                  />
                ) : (
                  <User className="text-purple-600 w-10 h-10" />
                )}
              </div>

              {/* Camera Icon Overlay */}
              <div className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-lg transition transform hover:scale-105">
                <Camera size={14} />
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
                <span className="text-emerald-600 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={13} /> {selectedFile.name}
                </span>
              ) : (
                "Click avatar to choose photo (Max 5MB)"
              )}
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm
                outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone
                size={17}
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

          {/* Bio / Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Bio / Status
            </label>
            <div className="relative">
              <FileText
                size={17}
                className="absolute left-3.5 top-3 text-gray-400"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={2}
                placeholder="e.g. Student, Software Developer"
                className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-xl text-sm
                outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition resize-none"
              />
            </div>
          </div>

          {/* Read-Only Email Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Email Address
              </label>
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Lock size={11} /> Read-only
              </span>
            </div>
            <div className="relative">
              <Mail
                size={17}
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

          {/* Action Buttons: Cancel and Save Changes */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition shadow-md shadow-purple-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
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
      </div>
    </div>
  );
};

export default UpdateProfile;
