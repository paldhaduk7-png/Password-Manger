import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function CopyButton({ text, label = "Item", className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer ${
        copied ? "!text-emerald-400 !bg-emerald-500/10 !border-emerald-500/30" : ""
      } ${className}`}
      title={`Copy ${label}`}
    >
      {copied ? <Check size={14} className="animate-in zoom-in" /> : <Copy size={14} />}
    </button>
  );
}
