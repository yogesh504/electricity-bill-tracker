import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const hasGoogleClientId = !!process.env.REACT_APP_GOOGLE_CLIENT_ID;

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleGoogleSuccess = useCallback(
    async (response) => {
      setError("");
      try {
        const res = await API.post("/auth/google", {
          credential: response.credential,
        });
        login(res.data.user, res.data.token);
        navigate("/");
      } catch (err) {
        console.error("Google login error:", err);
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           "Google login failed";
        setError(errorMessage);
      }
    },
    [login, navigate]
  );

  useEffect(() => {
    if (!hasGoogleClientId) return;

    const initializeGoogle = () => {
      if (!window.google || !process.env.REACT_APP_GOOGLE_CLIENT_ID) return;

      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleSuccess,
        });

        const container = document.getElementById("google-signin-button");
        if (container) {
          // Clear container first to avoid duplicate buttons
          container.innerHTML = "";
          window.google.accounts.id.renderButton(container, {
            theme: "outline",
            size: "large",
            width: "100%",
          });
        }
      } catch (err) {
        console.error("Error initializing Google Sign-In:", err);
      }
    };

    // Check if script already exists
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => {
        console.error("Failed to load Google Sign-In script");
      };
      document.head.appendChild(script);
    } else if (window.google) {
      // Script already loaded, initialize immediately
      initializeGoogle();
    } else {
      // Script exists but not loaded yet, wait for it
      script.onload = initializeGoogle;
    }

    // If Google is already available, initialize immediately
    if (window.google) {
      initializeGoogle();
    }

    return () => {
      // Cleanup: remove button but keep script (it might be used elsewhere)
      const container = document.getElementById("google-signin-button");
      if (container) {
        container.innerHTML = "";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGoogleSuccess, hasGoogleClientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          (err.response?.status === 500 ? "Server error - check backend logs" : "Login failed");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur rounded-xl shadow-2xl p-8 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h1>
        {error && (
          <div className="bg-red-500/20 text-red-100 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-3 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full p-3 rounded bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 space-y-2">
          <div className="text-center text-white/60 text-xs">
            Or continue with Google
          </div>
          {hasGoogleClientId ? (
            <div id="google-signin-button" className="flex justify-center" />
          ) : (
            <div className="text-center text-red-100 text-xs bg-red-500/20 rounded p-2">
              Google login is not configured. Set REACT_APP_GOOGLE_CLIENT_ID in
              frontend/.env and restart the dev server.
            </div>
          )}
        </div>
        <p className="text-white/70 text-sm mt-4 text-center">
          No account?{" "}
          <Link className="text-indigo-300" to="/signup">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
