import { useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

export default function Settings() {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Layout title="Settings">
      <div className="space-y-4 max-w-xl">
        {user && (
          <div className="bg-white/10 border border-white/10 rounded-xl p-4 flex items-center gap-4">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name || user.email}
                className="w-12 h-12 rounded-full border border-white/20 object-cover"
              />
            )}
            <div>
              <div className="text-sm text-white/60">Logged in as</div>
              <div className="text-base font-semibold">
                {user.name || user.email}
              </div>
              {user.name && (
                <div className="text-xs text-white/50">{user.email}</div>
              )}
            </div>
          </div>
        )}
        <div className="bg-white/10 border border-white/10 rounded-xl p-4">
          {saved && (
            <div className="bg-emerald-500/20 text-emerald-100 text-sm p-3 rounded mb-4">
              Settings saved.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm mb-1">
                Currency symbol
              </label>
              <input
                value={settings.currencySymbol}
                onChange={(e) =>
                  updateSettings({ currencySymbol: e.target.value })
                }
                className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm mb-1">
                Default sliding window (N)
              </label>
              <input
                type="number"
                min="1"
                value={settings.defaultWindow}
                onChange={(e) =>
                  updateSettings({
                    defaultWindow: Number(e.target.value) || 1,
                  })
                }
                className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
              />
            </div>
            <button className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
              Save settings
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
