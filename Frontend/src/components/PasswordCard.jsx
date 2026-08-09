import { useState } from "react";
import { 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Pencil, 
  Trash2, 
  User, 
  Lock, 
  Calendar
} from "lucide-react";
import CopyButton from "./CopyButton";
import PasswordStrength from "./PasswordStrength";

export default function PasswordCard({ item, onEdit, onDelete }) {
  const [isVisible, setIsVisible] = useState(false);

  // Clean domain name for display
  const displayDomain = item.weburl 
    ? item.weburl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").replace(/\/.*$/, "") 
    : "vault-item";

  const initialLetter = displayDomain.charAt(0).toUpperCase() || "W";

  const hrefUrl = item.weburl?.startsWith("http") ? item.weburl : `https://${item.weburl}`;

  return (
    <div className="glass-panel-interactive rounded-3xl p-5 flex flex-col justify-between group relative overflow-hidden">
      {/* Decorative top accent glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header: Domain avatar & Actions */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-3 min-w-0">
            {/* Domain Favicon / Letter Badge */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-base shadow-sm shrink-0 uppercase">
              {initialLetter}
            </div>

            <div className="min-w-0">
              <a
                href={hrefUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-100 hover:text-indigo-400 transition truncate block text-base flex items-center gap-1.5 group/link"
                title={item.weburl}
              >
                <span className="truncate">{displayDomain}</span>
                <ExternalLink size={13} className="shrink-0 text-slate-500 group-hover/link:text-indigo-400 transition" />
              </a>
              <span className="text-[11px] text-slate-500 truncate block">
                {item.weburl}
              </span>
            </div>
          </div>

          {/* Action Buttons: Edit & Delete */}
          <div className="flex items-center gap-1.5 shrink-0 relative z-20">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item._id);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/20 transition cursor-pointer"
              title="Edit Password"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item);
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
              title="Delete Password"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Credentials Rows */}
        <div className="py-4 space-y-2.5">
          {/* Username Row */}
          <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-white/[0.06] flex items-center justify-between gap-2 group/row hover:border-white/10 transition">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 shrink-0">
                <User size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Username
                </p>
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {item.username || "—"}
                </p>
              </div>
            </div>

            <CopyButton text={item.username} label="Username" />
          </div>

          {/* Password Row */}
          <div className="p-2.5 rounded-2xl bg-slate-950/50 border border-white/[0.06] flex items-center justify-between gap-2 group/row hover:border-white/10 transition">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-slate-400 shrink-0">
                <Lock size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Password
                </p>
                <p className="text-xs font-mono font-bold text-slate-200 truncate tracking-wider">
                  {isVisible ? item.password : "••••••••••••"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition cursor-pointer"
                title={isVisible ? "Hide Password" : "Show Password"}
              >
                {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>

              <CopyButton text={item.password} label="Password" />
            </div>
          </div>

          {/* Password Strength Meter */}
          <div className="pt-1 px-1">
            <PasswordStrength password={item.password} />
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Calendar size={11} />
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "Saved"}
        </span>
        <button
          onClick={() => onEdit(item._id)}
          className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition flex items-center gap-1"
        >
          <span>Update</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
