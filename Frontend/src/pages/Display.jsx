import { useState } from "react";
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import CopyButton from "../components/CopyButton";
import PasswordStrength from "../components/PasswordStrength";

export default function Display({ users = [], getPasswords }) {
  const [visibleIndex, setVisibleIndex] = useState(null);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const showPassword = (index) => {
    setVisibleIndex(index);
    setTimeout(() => {
      setVisibleIndex(null);
    }, 5000); // Hide after 5 seconds
  };

  const updateData = (id) => {
    navigate("/update", {
      state: { id }
    });
  };

  const deletePassword = async (id) => {
    if (!window.confirm("Are you sure you want to delete this password?")) return;
    try {
      const res = await axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message || "Password deleted successfully");
        await getPasswords();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete password");
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-950/40">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.08] bg-slate-900/70 text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <th className="px-5 py-3.5">Website / App</th>
              <th className="px-5 py-3.5">Username</th>
              <th className="px-5 py-3.5">Password</th>
              <th className="px-5 py-3.5">Strength</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.06] text-sm">
            {users.map((item, index) => {
              const displayUrl = item.weburl ? item.weburl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "") : "Unknown";
              const href = item.weburl?.startsWith("http") ? item.weburl : `https://${item.weburl}`;

              return (
                <tr
                  key={item._id || index}
                  className="hover:bg-slate-800/40 transition-colors duration-150 group"
                >
                  {/* Website column */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                        {displayUrl.charAt(0) || "W"}
                      </div>
                      <div className="min-w-0 max-w-[200px] sm:max-w-[260px]">
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-slate-200 hover:text-indigo-400 transition flex items-center gap-1.5 truncate"
                          title={item.weburl}
                        >
                          <span className="truncate">{displayUrl}</span>
                          <ExternalLink size={12} className="shrink-0 text-slate-500 opacity-0 group-hover:opacity-100 transition" />
                        </a>
                      </div>
                    </div>
                  </td>

                  {/* Username column */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 max-w-[180px]">
                      <span className="text-slate-300 truncate font-mono text-xs">{item.username}</span>
                      <CopyButton text={item.username} label="Username" />
                    </div>
                  </td>

                  {/* Password column */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-300 w-28 truncate tracking-wider">
                        {visibleIndex === index ? item.password : "••••••••••••"}
                      </span>

                      <button
                        type="button"
                        onClick={() => visibleIndex === index ? setVisibleIndex(null) : showPassword(index)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition"
                        title={visibleIndex === index ? "Hide password" : "Show password (5s)"}
                      >
                        {visibleIndex === index ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>

                      <CopyButton text={item.password} label="Password" />
                    </div>
                  </td>

                  {/* Strength column */}
                  <td className="px-5 py-4 min-w-[120px]">
                    <PasswordStrength password={item.password} />
                  </td>

                  {/* Action column */}
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => updateData(item._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => deletePassword(item._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
