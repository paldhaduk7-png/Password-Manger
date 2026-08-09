import Navbar from "../pages/Navbar";

export default function Layout({ children }) {
  return (
    <div className="app-viewport text-slate-100 min-h-screen flex flex-col relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Decorative Ambient Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 mesh-pattern opacity-40"></div>
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        {children}
      </main>
    </div>
  );
}