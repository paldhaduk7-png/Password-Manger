import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  KeyRound,
  Search,
  ArrowLeft,
  Loader2,
  Trash2,
  X,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const DeletedPasswords = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const loadDeletedPasswords = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/deleted`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setPasswords(res.data.data || []);
      }
    } catch (error) {
      console.error("Fetch deleted passwords error:", error);
      toast.error(error.response?.data?.message || "Failed to load deleted passwords");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeletedPasswords();
  }, [BASE_URL]);

  const handleRestore = async (id) => {
    setActionLoading(id);
    try {
      const res = await axios.patch(
        `${BASE_URL}/${id}/restore`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setPasswords((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to restore password");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePermanentDelete = (id) => {
    toast("Permanently delete this password?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: () => executePermanentDelete(id)
      },
      cancel: {
        label: "Cancel"
      },
      duration: 5000,
      className: "border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
    });
  };

  const executePermanentDelete = async (id) => {
    setActionLoading(id);
    try {
      const res = await axios.delete(`${BASE_URL}/${id}/permanent`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password permanently deleted");
        setPasswords((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to permanently delete password");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEmptyTrash = () => {
    toast("Empty Trash?", {
      description: "Permanently delete ALL items in the trash? This action cannot be undone.",
      action: {
        label: "Empty Trash",
        onClick: () => executeEmptyTrash()
      },
      cancel: {
        label: "Cancel"
      },
      duration: 6000,
      className: "border-rose-500/20 bg-rose-50/90 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
    });
  };

  const executeEmptyTrash = async () => {
    setActionLoading("empty");
    try {
      const res = await axios.delete(`${BASE_URL}/deleted`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Trash emptied successfully");
        setPasswords([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to empty trash");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPasswords = passwords.filter((item) => {
    const query = searchQuery.toLowerCase();
    const urlMatch = item.weburl?.toLowerCase().includes(query);
    const userMatch = item.username?.toLowerCase().includes(query);
    return urlMatch || userMatch;
  });

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-rose-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 transition cursor-pointer shadow-sm"
            title="Back to Dashboard"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Trash
              </h1>
              <span className="px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 text-xs font-bold">
                {passwords.length} {passwords.length === 1 ? "Item" : "Items"}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-500" />
              Items here will be permanently deleted after 30 days
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search domain or username..."
              className="glass-input w-full pl-10 pr-9 py-2.5 rounded-2xl text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X size={15} />
              </button>
            )}
          </div>
          {passwords.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              disabled={actionLoading === "empty"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-2xl font-semibold text-sm cursor-pointer shadow-lg transition disabled:opacity-50"
            >
              {actionLoading === "empty" ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              <span>Empty Trash</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="glass-panel rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 size={36} className="animate-spin text-rose-400" />
          <p className="text-slate-400 font-medium">Loading trash...</p>
        </div>
      ) : filteredPasswords.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 sm:p-16 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-18 h-18 rounded-3xl bg-slate-500/10 border border-slate-500/20 text-slate-400 flex items-center justify-center mb-4 shadow-inner">
            <Trash2 size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            {searchQuery ? "No matching credentials found" : "Trash is Empty"}
          </h3>
          <p className="text-slate-400 text-sm mt-1.5 mb-6">
            {searchQuery
              ? `No credentials match "${searchQuery}". Try another keyword or clear the search.`
              : "Items you delete will appear here for 30 days before being permanently removed."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPasswords.map((item) => (
            <div key={item._id} className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-white/[0.08] relative group flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                    <KeyRound size={20} className="text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-base">
                      {item.weburl}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {item.username}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 flex gap-2 border-t border-slate-100 dark:border-white/5">
                <button
                  onClick={() => handleRestore(item._id)}
                  disabled={actionLoading === item._id}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {actionLoading === item._id ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                  Restore
                </button>
                <button
                  onClick={() => handlePermanentDelete(item._id)}
                  disabled={actionLoading === item._id}
                  className="flex-1 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                  {actionLoading === item._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeletedPasswords;
