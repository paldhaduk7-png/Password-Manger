import { useEffect } from "react";
import { Trash2, AlertTriangle, X, Loader2, Globe, User } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  item = null,
  loading = false,
}) {
  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const displayUrl = item?.weburl
    ? item.weburl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").replace(/\/.*$/, "")
    : "this credential";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-rose-500/20 p-6 sm:p-7 relative overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background inside card */}
        <div className="absolute -top-14 -right-14 w-40 h-40 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-14 -left-14 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

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

        {/* Icon & Heading */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/10">
            <Trash2 size={24} />
          </div>

          <div className="min-w-0 pr-6">
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Delete Password?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              This credential will be permanently removed from your vault.
            </p>
          </div>
        </div>

        {/* Target Item Details Card (if item info is passed) */}
        {item && (
          <div className="my-4 p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.08] space-y-2">
            {item.weburl && (
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Globe size={14} className="text-slate-500 shrink-0" />
                <span className="font-semibold text-slate-200 truncate">{displayUrl}</span>
              </div>
            )}
            {item.username && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <User size={14} className="text-slate-500 shrink-0" />
                <span className="font-mono text-slate-300 truncate">{item.username}</span>
              </div>
            )}
          </div>
        )}

        {/* Warning Banner */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-300 text-xs mb-6">
          <AlertTriangle size={15} className="shrink-0 text-rose-400" />
          <span>This action is irreversible and cannot be recovered.</span>
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
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
