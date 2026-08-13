import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  KeyRound,
  Search,
  Plus,
  ArrowLeft,
  Loader2,
  FolderLock,
  X,
  Star
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import PasswordCard from "../components/PasswordCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const SavedPasswords = () => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState("all"); // "all" | "favorites"

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadPasswords = async () => {
    try {
      const res = await axios.get(BASE_URL, {
        withCredentials: true,
      });

      if (res.data.success) {
        setPasswords(res.data.data || []);
      }
    } catch (error) {
      console.error("Fetch passwords error:", error);
      toast.error(error.response?.data?.message || "Failed to load saved passwords");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasswords();
  }, [BASE_URL]);

  // Toggle favorite status
  const handleToggleFavorite = async (id) => {
    // Optimistic UI update with automatic sorting
    setPasswords((prev) =>
      [...prev]
        .map((p) => (p._id === id ? { ...p, isFavorite: !p.isFavorite } : p))
        .sort((a, b) => {
          if (b.isFavorite !== a.isFavorite) {
            return b.isFavorite ? 1 : -1;
          }
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        })
    );

    try {
      const res = await axios.patch(
        `${BASE_URL}/${id}/favorite`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update favorite status");
      loadPasswords();
    }
  };

  // Trigger delete modal
  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteLoading(true);

    try {
      const res = await axios.delete(`${BASE_URL}/${itemToDelete._id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Password deleted successfully");
        setPasswords((prev) => prev.filter((p) => p._id !== itemToDelete._id));
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.Message || "Failed to delete password");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Navigate to update page
  const handleEditPassword = (id) => {
    navigate(`/update/${id}`, {
      state: { id },
    });
  };

  // Counts
  const favoriteCount = passwords.filter((p) => p.isFavorite).length;

  // Filter passwords by search query and tab
  const filteredPasswords = passwords.filter((item) => {
    if (filterTab === "favorites" && !item.isFavorite) return false;
    const query = searchQuery.toLowerCase();
    const urlMatch = item.weburl?.toLowerCase().includes(query);
    const userMatch = item.username?.toLowerCase().includes(query);
    return urlMatch || userMatch;
  });

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-72 h-32 bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer shadow-sm"
            title="Back to Manager"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <KeyRound size={22} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Saved Passwords
              </h1>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                {passwords.length} {passwords.length === 1 ? "Item" : "Items"}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Encrypted vault containing all your secure account credentials
            </p>
          </div>
        </div>

        {/* Search Bar & Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Add New Password Button */}
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 btn-glow-primary px-5 py-2.5 rounded-2xl font-semibold text-sm cursor-pointer shadow-lg"
          >
            <Plus size={18} />
            <span>Add Password</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs Bar (All vs Favorites) */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/50 border border-white/[0.08] backdrop-blur-md">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              filterTab === "all"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <span>All Passwords</span>
            <span className={`px-2 py-0.2 rounded-full text-[10px] ${
              filterTab === "all" ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
            }`}>
              {passwords.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("favorites")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              filterTab === "favorites"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 font-extrabold"
                : "text-slate-400 hover:text-amber-300 hover:bg-amber-400/10"
            }`}
          >
            <Star size={13} className={filterTab === "favorites" ? "fill-slate-950 text-slate-950" : "text-amber-400"} />
            <span>Favorites</span>
            <span className={`px-2 py-0.2 rounded-full text-[10px] ${
              filterTab === "favorites" ? "bg-slate-950/30 text-slate-950 font-black" : "bg-slate-800 text-amber-400"
            }`}>
              {favoriteCount}
            </span>
          </button>
        </div>

        {filterTab === "favorites" && favoriteCount > 0 && (
          <span className="text-xs text-amber-400/90 font-medium hidden sm:inline-flex items-center gap-1.5">
            <Star size={13} className="fill-amber-400" />
            <span>Showing pinned & favorited credentials</span>
          </span>
        )}
      </div>

      {/* Vault Grid or States */}
      {loading ? (
        <div className="glass-panel rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 size={36} className="animate-spin text-indigo-400" />
          <p className="text-slate-400 font-medium">Decrypting and loading your secure vault...</p>
        </div>
      ) : filteredPasswords.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 sm:p-16 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-18 h-18 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
            {filterTab === "favorites" ? <Star size={36} className="text-amber-400" /> : <FolderLock size={36} />}
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            {filterTab === "favorites"
              ? "No Favorite Passwords Yet"
              : searchQuery
              ? "No matching credentials found"
              : "Your Vault is Empty"}
          </h3>
          <p className="text-slate-400 text-sm mt-1.5 mb-6">
            {filterTab === "favorites"
              ? "Click the star (⭐) icon on any password card to pin your most important accounts here."
              : searchQuery
              ? `No credentials match "${searchQuery}". Try another keyword or clear the search.`
              : "Store your website credentials, emails, and passwords safely with end-to-end encryption."}
          </p>
          {filterTab === "favorites" ? (
            <button
              onClick={() => setFilterTab("all")}
              className="inline-flex items-center gap-2 btn-glow-primary px-6 py-2.5 rounded-2xl font-semibold text-sm shadow-md cursor-pointer"
            >
              <span>View All Passwords</span>
            </button>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 btn-glow-primary px-6 py-2.5 rounded-2xl font-semibold text-sm shadow-md"
            >
              <Plus size={16} />
              <span>Create Your First Password</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPasswords.map((item) => (
            <PasswordCard
              key={item._id}
              item={item}
              onEdit={handleEditPassword}
              onDelete={handleDeleteClick}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!deleteLoading) {
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default SavedPasswords;
