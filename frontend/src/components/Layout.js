import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ title, children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/history", label: "History" },
    { to: "/analytics", label: "Analytics" },
    { to: "/settings", label: "Settings" },
  ];

  const rootClass =
    "min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 text-white";

  return (
    <div className={rootClass}>
      <div className="max-w-5xl mx-auto p-4 space-y-6">
        <header className="flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <span className="text-2xl font-bold">Electricity Tracker</span>
            <nav className="hidden md:flex items-center gap-4 text-sm">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-2 py-1 rounded ${
                    location.pathname === link.to
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2">
                {user.picture && (
                  <img
                    src={user.picture}
                    alt={user.name || user.email}
                    className="w-8 h-8 rounded-full border border-white/20 object-cover"
                  />
                )}
                <span className="text-sm text-white/80">
                  {user.name || user.email}
                </span>
              </div>
            )}
            <button
              onClick={logout}
              className="px-3 py-2 rounded bg-rose-500 hover:bg-rose-600"
            >
              Logout
            </button>
          </div>
        </header>
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
