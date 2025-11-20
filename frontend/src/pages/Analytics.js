import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";

export default function Analytics() {
  const [monthly, setMonthly] = useState([]);
  const [appliance, setAppliance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, aRes] = await Promise.all([
          API.get("/readings/summary/monthly"),
          API.get("/readings/summary/appliance"),
        ]);
        setMonthly(
          mRes.data.map((item) => ({
            ...item,
            label: `${item.year}-${String(item.month).padStart(2, "0")}`,
          }))
        );
        setAppliance(aRes.data);
      } catch (err) {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout title="Analytics">
      {error && (
        <div className="bg-red-500/20 text-red-100 text-sm p-3 rounded">
          {error}
        </div>
      )}
      {loading ? (
        <div className="bg-white/10 border border-white/10 rounded-xl p-4">
          Loading analytics...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white/10 border border-white/10 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Monthly usage</h2>
            {monthly.length ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="label" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.7)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalUnits"
                      name="Units"
                      stroke="#60a5fa"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalCost"
                      name="Total cost"
                      stroke="#f97316"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-white/70">
                Not enough data yet for monthly analytics.
              </div>
            )}
          </div>

          <div className="bg-white/10 border border-white/10 rounded-xl p-4">
            <h2 className="font-semibold mb-3">Appliance breakdown</h2>
            {appliance.length ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={appliance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="applianceName" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.7)",
                        border: "none",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="totalUnits" name="Units" fill="#60a5fa" />
                    <Bar dataKey="totalCost" name="Total cost" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-white/70">
                Not enough data yet for appliance analytics.
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
