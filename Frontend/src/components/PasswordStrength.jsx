import { Shield } from "lucide-react";

const evaluateStrength = (password = "") => {
  if (!password) return { score: 0, label: "None", color: "bg-slate-700", text: "text-slate-500" };
  
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return { score: 1, label: "Weak", color: "bg-rose-500", text: "text-rose-400", border: "border-rose-500/30", bg: "bg-rose-500/10" };
  } else if (score === 3 || score === 4) {
    return { score: 2, label: "Good", color: "bg-amber-500", text: "text-amber-400", border: "border-amber-500/30", bg: "bg-amber-500/10" };
  } else {
    return { score: 3, label: "Strong", color: "bg-emerald-500", text: "text-emerald-400", border: "border-emerald-500/30", bg: "bg-emerald-500/10" };
  }
};

export default function PasswordStrength({ password = "" }) {
  const strength = evaluateStrength(password);

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 flex items-center gap-1 font-medium">
          <Shield size={12} className={strength.text} />
          <span>Security</span>
        </span>
        <span className={`font-semibold ${strength.text}`}>
          {strength.label}
        </span>
      </div>

      {/* Segmented meter bar */}
      <div className="grid grid-cols-3 gap-1 h-1.5 w-full">
        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : "bg-slate-800"}`}></div>
        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : "bg-slate-800"}`}></div>
        <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : "bg-slate-800"}`}></div>
      </div>
    </div>
  );
}
