import { ShieldCheck, Zap, Lock, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: <Lock className="text-indigo-400" size={24} />,
      title: "Zero-Knowledge Encryption",
      desc: "Your data is encrypted so only you can unlock and read your stored credentials. No plaintext storage.",
    },
    {
      icon: <Zap className="text-amber-400" size={24} />,
      title: "Lightning Fast Access",
      desc: "One-click copy, real-time search, and instant password generation built for maximum daily productivity.",
    },
    {
      icon: <Cpu className="text-cyan-400" size={24} />,
      title: "Modern Tech Stack",
      desc: "Engineered with React 19, Vite, Tailwind CSS, Base UI, and Express MongoDB backend for reliable speed.",
    },
    {
      icon: <ShieldCheck className="text-emerald-400" size={24} />,
      title: "Strength Evaluation",
      desc: "Real-time password security scoring to protect against credential leaks and brute-force vulnerabilities.",
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          About <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">PassOP</span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          <strong className="text-white font-semibold">PassOP</strong> is a modern, privacy-first password manager engineered to safely organize, encrypt, and manage all your digital identities in one centralized, intuitive vault.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {features.map((f, i) => (
          <div
            key={i}
            className="glass-panel rounded-3xl p-6 border border-white/[0.08] hover:border-indigo-500/30 transition-all duration-300 group hover:-translate-y-1 shadow-lg"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              {f.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Security Callout Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-72 h-32 bg-indigo-600/15 blur-3xl pointer-events-none"></div>

        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Ready to secure your credentials?</h3>
          <p className="text-slate-400 text-xs sm:text-sm">Store unlimited passwords with zero hassle.</p>
        </div>

        <Link
          to="/"
          className="btn-glow-primary px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shrink-0 shadow-lg cursor-pointer"
        >
          <span>Open Password Vault</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default About;