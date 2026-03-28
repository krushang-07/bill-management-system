import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Receipt, Package, BarChart3, Menu, X, LogOut, User, Key, AlertTriangle, History } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// Pages
import Bill from "./pages/Bill";
import Stock from "./pages/Stock";
import Report from "./pages/Report";
import LowStock from "./pages/LowStock";
import StockHistory from "./pages/StockHistory";



// Login Page
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-200">

        <div className="flex justify-center mb-6">
          <img
            src="/logo.jpg"
            alt="Bansi Ice-cream"
            className="h-20 w-auto rounded-xl object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
          Login to Dashboard
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>

          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
}


// Protected Route
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  if (loading) return null;

  if (!session) return <Navigate to="/login" />;

  return children;
}


// Sidebar Navigation
function Navigation({ children }) {

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Bill", icon: Receipt },
    { path: "/stock", label: "Stock", icon: Package },
    { path: "/report", label: "Report", icon: BarChart3 },
    { path: "/low-stock", label: "Low Stock", icon: AlertTriangle },
    { path: "/history", label: "Stock history", icon: History }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">

      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </button>


      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        <div className="flex items-center justify-between p-4 border-b border-white/10">

          <img
            src="/logo.jpg"
            alt="Bansi Ice-cream"
            className="h-18 w-32 rounded-3xl"
          />

          <button
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>

        </div>


        <nav className="p-4 space-y-2">

          {navItems.map(({ path, label, icon: Icon }) => (

            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${isActive(path)
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>

          ))}

        </nav>


        <div className="absolute bottom-4 left-0 right-0 px-4">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

        </div>

      </div>


      {/* Page Content */}
      <div className="flex-1 md:ml-64 p-6">
        {children}
      </div>

    </div>
  );
}


// App
export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>

              <Navigation>

                <Routes>
                  <Route path="/" element={<Bill />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/low-stock" element={<LowStock />} />
                  <Route path="/history" element={<StockHistory />} />
                </Routes>

              </Navigation>

            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}