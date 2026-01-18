



import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Receipt, Package, BarChart3, Menu, X, LogOut, User, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "./supabase";

// Pages
import Bill from "./pages/Bill";
import Stock from "./pages/Stock";
import Report from "./pages/Report";

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
      window.location.href = "/"; // Redirect to main app after login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-slate-200">
        {/* Logo */}
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}


// ProtectedRoute component
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return null; // Optionally show a loading spinner

  if (!session) return <Navigate to="/login" />;

  return children;
}

// Navigation
function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Bill", icon: Receipt },
    { path: "/stock", label: "Stock", icon: Package },
    { path: "/report", label: "Report", icon: BarChart3 },
  ];


  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-lg bg-opacity-95 shadow-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Bansi Ice-cream"
              className="h-16 w-auto object-contain rounded-3xl"
            />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`relative flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${
                    isActive(path)
                      ? "text-white shadow-md"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {label}
                {isActive(path) && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-14 h-1 rounded-full bg-pink-200" />
                )}
              </Link>
            ))}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-white hover:bg-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                  ${
                    isActive(path)
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

// App Component
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Bill />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route path="/report" element={<Report />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
