import Navbar from "../pages/Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-500 to-pink-500">
      <Navbar />
      {children}
    </div>
  );
}