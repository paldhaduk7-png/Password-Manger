import { useEffect } from "react";
import { createPortal } from "react-dom";
import { LogOut, X, Loader2, ShieldAlert, User } from "lucide-react";

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  user = null,
  loading = false,
}) {
  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-rose-500/25 p-6 sm:p-7 relative overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background accents */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Header with Icon & Heading */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
            <LogOut size={22} className="ml-0.5" />
          </div>

          <div className="min-w-0 pr-6">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Confirm Logout
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Are you sure you want to sign out of your vault?
            </p>
          </div>
        </div>

        {/* User Card Preview (if user passed) */}
        {user && (
          <div className="my-4 p-3 rounded-2xl bg-slate-950/60 border border-white/[0.08] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/30 bg-slate-800 flex items-center justify-center shrink-0">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.fullname || "User"}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <span className="text-sm font-bold text-indigo-400">
                  {user.fullname ? user.fullname.charAt(0).toUpperCase() : <User size={16} />}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-200 truncate">
                {user.fullname || "User"}
              </h4>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Security Info Banner */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mb-6">
          <ShieldAlert size={16} className="shrink-0 text-amber-400" />
          <span>Your session will end and encrypted vault data will be locked.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-2xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Logging Out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} />
                <span>Confirm Logout</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}
