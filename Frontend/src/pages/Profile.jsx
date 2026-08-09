import React, { useState, useContext } from "react";
import { AuthContext } from "../ContextAPI/AuthContext";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  FileText,
  ArrowLeft,
  Edit3,
  Maximize2,
} from "lucide-react";
import UpdateProfile from "./UpdateProfile";
import ImagePreviewModal from "../components/ImagePreviewModal";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 py-10 px-4 flex justify-center items-center">
    
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/40">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 px-6 pt-6 pb-14 text-white relative">
          <div className="flex items-center justify-start">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition duration-200"
            >
              <ArrowLeft size={18} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-8 pb-8 pt-0 -mt-14 text-center relative z-10">
          {/* Avatar (Click to Preview in Fullscreen) */}
          <div
            onClick={() => user?.profilePicture && setIsPreviewOpen(true)}
            className={`w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden ring-4 ring-white shadow-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center relative z-20 group ${
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
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-white">
                  <Maximize2 size={20} />
                </div>
              </>
            ) : (
              <span className="text-3xl sm:text-4xl font-bold text-purple-700 uppercase">
                {user?.fullname}
              </span>
            )}
          </div>

          {/* User Name & Role */}
          <div className="mt-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {user?.fullname || "Pal Dhaduk"}
            </h1>

            {/* Role / Bio Pill */}
            <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
              <span>{user?.bio || "Student"}</span>
            </div>
          </div>

          {/* Information Details List */}
          <div className="mt-6 space-y-3 text-left">
            {/* Email Card */}
            <div className="p-3.5 bg-gray-50/90 hover:bg-purple-50/40 transition rounded-2xl border border-gray-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <Mail size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Email Address
                </p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="p-3.5 bg-gray-50/90 hover:bg-indigo-50/40 transition rounded-2xl border border-gray-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Phone size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Phone Number
                </p>
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user?.phonenumber || "Not provided"}
                </p>
              </div>
            </div>

            {/* Bio Card */}
            <div className="p-3.5 bg-gray-50/90 hover:bg-pink-50/40 transition rounded-2xl border border-gray-100 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Bio / Notes
                </p>
                <p className="text-sm font-medium text-gray-800 whitespace-pre-wrap">
                  {user?.bio || "Student"}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="mt-6 pt-1">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-purple-200 transition flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Edit3 size={18} />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Separate Update Profile Popup Modal */}
      <UpdateProfile
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />

      {/* Full-Screen Image Preview Modal */}
      <ImagePreviewModal
        open={isPreviewOpen}
        setOpen={setIsPreviewOpen}
        image={user?.profilePicture}
      />
    </div>
  );
};

export default Profile;
