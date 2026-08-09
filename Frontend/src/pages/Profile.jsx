import { useState, useContext } from "react";
import { AuthContext } from "../ContextAPI/AuthContext";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  Edit3,
  Maximize2
} from "lucide-react";
import UpdateProfile from "./UpdateProfile";
import ImagePreviewModal from "../components/ImagePreviewModal";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="py-10 px-4 sm:px-6 flex justify-center items-center">
      <div className="w-full max-w-lg glass-panel rounded-3xl shadow-2xl overflow-hidden relative border border-white/10">
        
        {/* Top Header Card Banner */}
        <div className="bg-gradient-to-r from-indigo-900/80 via-purple-900/70 to-slate-900 px-6 pt-6 pb-16 text-white relative border-b border-white/[0.08]">
          <div className="flex items-center justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white text-sm font-medium transition duration-200 bg-black/20 px-3 py-1.5 rounded-xl backdrop-blur-sm border border-white/10"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-8 pb-8 pt-0 -mt-14 text-center relative z-10">
          {/* Avatar (Click to Preview) */}
          <div
            onClick={() => user?.profilePicture && setIsPreviewOpen(true)}
            className={`w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl overflow-hidden ring-4 ring-indigo-500/30 shadow-2xl bg-gradient-to-br from-slate-800 to-indigo-950 flex items-center justify-center relative z-20 group ${
              user?.profilePicture ? "cursor-pointer" : ""
            }`}
            title={user?.profilePicture ? "Click to view full photo" : ""}
          >
            {user?.profilePicture ? (
              <>
                <img
                  src={user.profilePicture}
                  alt={user?.fullname || "User Avatar"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{ objectPosition: "center 15%" }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                  <Maximize2 size={20} />
                </div>
              </>
            ) : (
              <span className="text-3xl sm:text-4xl font-bold text-indigo-400 uppercase">
                {user?.fullname ? user.fullname.charAt(0) : "U"}
              </span>
            )}
          </div>

          {/* User Name & Role */}
          <div className="mt-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {user?.fullname || "User Profile"}
            </h1>

            {/* Role / Bio Pill */}
            <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1 bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{user?.bio || "Active User"}</span>
            </div>
          </div>

          {/* Information Details List */}
          <div className="mt-6 space-y-3 text-left">
            {/* Email Card */}
            <div className="p-3.5 bg-slate-950/50 hover:bg-slate-950/70 transition rounded-2xl border border-white/[0.06] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Email Address
                </p>
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user?.email || "No email provided"}
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-3.5 bg-slate-950/50 hover:bg-slate-950/70 transition rounded-2xl border border-white/[0.06] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Phone size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-slate-200 truncate">
                  {user?.phonenumber || "Not provided"}
                </p>
              </div>
            </div>

            {/* Bio Card */}
            <div className="p-3.5 bg-slate-950/50 hover:bg-slate-950/70 transition rounded-2xl border border-white/[0.06] flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 border border-cyan-500/20">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Bio / Status
                </p>
                <p className="text-sm font-medium text-slate-200 whitespace-pre-wrap">
                  {user?.bio || "Student / Pro User"}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-6 pt-1">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full btn-glow-primary font-semibold py-3 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Edit3 size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      {isEditModalOpen && (
        <UpdateProfile
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {/* Image Preview Modal */}
      <ImagePreviewModal
        open={isPreviewOpen}
        setOpen={setIsPreviewOpen}
        image={user?.profilePicture}
      />
    </div>
  );
};

export default Profile;
