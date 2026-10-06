import { Link } from "react-router-dom";
import { 
  Shield, 
  KeyRound, 
  User, 
  Search, 
  Lock, 
  ArrowRight,
  Database,
  CheckCircle2
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../ContextAPI/AuthContext";

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  const features = [
    {
      icon: <Database className="w-6 h-6 text-indigo-500" />,
      title: "Secure Storage",
      description: "Store your credentials in a personalized vault linked to your account."
    },
    {
      icon: <KeyRound className="w-6 h-6 text-purple-500" />,
      title: "Password Generation",
      description: "Generate strong, complex passwords instantly with a single click."
    },
    {
      icon: <User className="w-6 h-6 text-cyan-500" />,
      title: "User Authentication",
      description: "Protected access using industry-standard JWT and bcrypt hashing."
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-500" />,
      title: "Full Management",
      description: "Easily add, edit, view, and delete your passwords at any time."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Create Account",
      description: "Sign up securely using your email or Google account."
    },
    {
      number: "02",
      title: "Login Securely",
      description: "Access your personalized vault from anywhere."
    },
    {
      number: "03",
      title: "Save Your Passwords",
      description: "Store website URLs, usernames, and passwords."
    },
    {
      number: "04",
      title: "Manage Easily",
      description: "Update or delete credentials as needed with ease."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-8">
            <Shield size={16} />
            Your Digital Vault
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
            Secure Your Passwords. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Simplify Your Digital Life.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Store, manage and access your passwords securely from one convenient place. Never forget a password again.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto btn-glow-primary px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg"
              >
                Go to Dashboard
                <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link 
                  to="/register"
                  className="w-full sm:w-auto btn-glow-primary px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-lg"
                >
                  Get Started
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-white dark:bg-slate-900/50 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition shadow-sm"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Features</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Everything you need to keep your online accounts secure and organized.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl hover:translate-y-[-4px] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 flex items-center justify-center mb-6 shadow-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Get started in minutes with our simple and secure workflow.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-[2px] bg-gradient-to-r from-indigo-500/20 to-transparent"></div>
                )}
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex items-center justify-center text-2xl font-black text-indigo-500 mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Info Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
          <div className="flex-1 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <Lock size={16} />
              Security First
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Built on Modern Standards
            </h2>
            <ul className="space-y-4">
              {[
                "Passwords hashed with industry-standard bcrypt algorithm.",
                "JSON Web Tokens (JWT) for secure authentication.",
                "HTTP-only cookies to prevent XSS attacks.",
                "Isolated user vaults ensuring complete privacy."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center relative z-10">
             <div className="w-full max-w-sm relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-3xl rotate-3 opacity-20 blur-lg"></div>
                <div className="glass-panel p-8 rounded-3xl relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Shield className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Secure Authentication</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Your master password never leaves your device unhashed.</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-center px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
          Ready to manage your passwords?
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto">
          Join today and take the first step towards a more secure and simplified digital life.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!user ? (
            <>
              <Link 
                to="/register"
                className="btn-glow-primary px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight size={20} />
              </Link>
              <Link 
                to="/login"
                className="px-8 py-4 rounded-2xl font-bold text-base bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              >
                Log In
              </Link>
            </>
          ) : (
             <Link 
                to="/dashboard"
                className="btn-glow-primary px-8 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2"
              >
                Go to Dashboard
                <ArrowRight size={20} />
              </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/50 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center gap-3 group select-none mb-6">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5">
                  <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                    Pass<span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">OP</span>
                  </span>
                </div>
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                The Password Manager is a web application designed to help users organize and manage credentials for different online services from a single secure interface.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Navigation</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-indigo-500 transition">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-indigo-500 transition">How It Works</a></li>
                <li><Link to="/about" className="hover:text-indigo-500 transition">About</Link></li>
                <li><Link to="/contact" className="hover:text-indigo-500 transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Account</h4>
              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                {!user ? (
                  <>
                    <li><Link to="/login" className="hover:text-indigo-500 transition">Log In</Link></li>
                    <li><Link to="/register" className="hover:text-indigo-500 transition">Register</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/dashboard" className="hover:text-indigo-500 transition">Dashboard</Link></li>
                    <li><Link to="/profile" className="hover:text-indigo-500 transition">Profile</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PassOP Password Manager. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition">Privacy Policy</Link>
              <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
