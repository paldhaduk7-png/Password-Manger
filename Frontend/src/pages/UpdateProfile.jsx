import { useState, useRef, useContext } from "react";
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

  const [formData, setFormData] = useState(() => ({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phonenumber: user?.phonenumber || "",
    bio: user?.bio || "",
  }));

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() => user?.profilePicture || "");
  const [loading, setLoading] = useState(false);

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

    const trimmedFullname = formData.fullname?.trim();
    const trimmedPhone = formData.phonenumber?.trim();
    const trimmedBio = formData.bio?.trim();

    if (!trimmedFullname) {
      toast.error("Full name cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("fullname", trimmedFullname);
      data.append("phonenumber", trimmedPhone || "");
      data.append("bio", trimmedBio || "");

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-white/[0.08] text-white flex items-center justify-between">
          <h2 className="text-base font-bold flex items-center gap-2 text-slate-100">
            <Edit3 size={17} className="text-indigo-400" />
            Update Profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
          {/* Avatar Selector */}
          <div className="flex flex-col items-center justify-center pb-1">
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change photo"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-indigo-500/40 shadow-lg bg-slate-800 flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center 15%" }}
                  />
                ) : (
                  <User className="text-indigo-400 w-10 h-10" />
                )}
              </div>

              {/* Camera Icon Overlay */}
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
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={12} /> {selectedFile.name}
                </span>
              ) : (
                "Click photo to change avatar (Max 5MB)"
              )}
            </span>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
                className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                name="phonenumber"
                value={formData.phonenumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Bio / Status */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Bio / Role
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={2}
                placeholder="e.g. Student, Software Developer, Vault Admin"
                className="glass-input w-full pl-10 pr-3.5 py-2.5 rounded-xl text-sm resize-none"
              />
            </div>
          </div>

          {/* Read-Only Email Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Lock size={10} /> Read-only
              </span>
            </div>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                disabled
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-white/[0.04] rounded-xl text-sm text-slate-500 cursor-not-allowed select-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-semibold transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 rounded-xl btn-glow-primary text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
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
