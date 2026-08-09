import { FaUser, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { MessageSquare } from "lucide-react";

const Contact = () => {
  const contactLinks = [
    {
      icon: <FaUser className="text-xl text-indigo-400" />,
      label: "Creator & Author",
      value: "Dhaduk Pal G.",
      href: null,
      color: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      icon: <FaEnvelope className="text-xl text-emerald-400" />,
      label: "Email Address",
      value: "paldhaduk7@gmail.com",
      href: "mailto:paldhaduk7@gmail.com",
      color: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <FaGithub className="text-xl text-slate-200" />,
      label: "GitHub Profile",
      value: "github.com/paldhaduk7-png",
      href: "https://github.com/paldhaduk7-png",
      color: "bg-slate-800/60 border-slate-700/50",
    },
    {
      icon: <FaLinkedin className="text-xl text-cyan-400" />,
      label: "LinkedIn Profile",
      value: "linkedin.com/in/pal-dhaduk",
      href: "https://www.linkedin.com/in/",
      color: "bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="max-w-lg w-full glass-panel rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
        
        {/* Decorative Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center shadow-lg text-indigo-400">
            <MessageSquare size={28} />
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Get in Touch
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Questions, feedback, or collaborations? Reach out anytime.
          </p>
        </div>

        {/* Links Grid */}
        <div className="space-y-3">
          {contactLinks.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-slate-950/60 border border-white/[0.06] hover:border-indigo-500/30 transition-all flex items-center gap-4 group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${item.color} group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-slate-200 hover:text-indigo-400 transition truncate block"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-slate-200 truncate">
                    {item.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          Built with care & security in mind ✨
        </p>

      </div>
    </div>
  );
};

export default Contact;
