import { useEffect, useMemo, useState } from "react";
import API from "../api";
import ReadingForm from "../components/ReadingForm";
import ReadingTable from "../components/ReadingTable";
import SlidingAverageCard from "../components/SlidingAverageCard";
import Layout from "../components/Layout";
import { useSettings } from "../context/SettingsContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const { settings } = useSettings();
  const [readings, setReadings] = useState([]);
  const [n, setN] = useState(settings.defaultWindow || 3);
  const [error, setError] = useState("");

  const fetchReadings = async () => {
    try {
      const res = await API.get("/readings");
      setReadings(res.data);
    } catch (err) {
      setError("Failed to load readings");
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  useEffect(() => {
    if (settings.defaultWindow) {
      setN(settings.defaultWindow);
    }
  }, [settings.defaultWindow]);

  const chartData = useMemo(
    () =>
      readings.map((r) => ({
        date: new Date(r.date).toLocaleDateString(),
        units: r.units,
      })),
    [readings]
  );

  const handleAdd = async (data) => {
    try {
      const payload = { ...data };
      payload.totalCost = Number(data.units) * Number(data.costPerUnit);
      const res = await API.post("/readings", payload);
      setReadings((prev) => [...prev, res.data]);
    } catch (err) {
      setError("Failed to add reading");
    }
  };

  return (
    <Layout title="Dashboard">
      {error && (
        <div className="bg-red-500/20 text-red-100 text-sm p-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white/10 border border-white/10 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Add New Reading</h2>
        <ReadingForm onAdd={handleAdd} />
      </div>

      <SlidingAverageCard readings={readings} n={n} onChangeN={setN} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 border border-white/10 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Usage Chart</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(0,0,0,0.7)",
                    border: "none",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="units"
                  stroke="#60a5fa"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/10 border border-white/10 rounded-xl p-4">
          <h2 className="font-semibold mb-3">Readings</h2>
          <ReadingTable readings={readings} />
        </div>
      </div>

      <div className="bg-white/10 border border-white/10 rounded-xl p-4">
        <h2 className="font-semibold mb-3">Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white/5 rounded p-3">
            <div className="text-white/70 text-sm">Units Consumed</div>
            <div className="text-xl font-bold">
              {readings.reduce((a, b) => a + b.units, 0)}
            </div>
          </div>
          <div className="bg-white/5 rounded p-3">
            <div className="text-white/70 text-sm">Total Cost</div>
            <div className="text-xl font-bold">
              {settings.currencySymbol}
              {readings.reduce((a, b) => a + b.totalCost, 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-white/5 rounded p-3">
            <div className="text-white/70 text-sm">Readings Count</div>
            <div className="text-xl font-bold">{readings.length}</div>
          </div>
          <div className="bg-white/5 rounded p-3">
            <div className="text-white/70 text-sm">Cost/Unit (last)</div>
            <div className="text-xl font-bold">
              {readings[readings.length - 1]?.costPerUnit ?? 0}
            </div>
          </div>
          <div className="bg-white/5 rounded p-3">
            <div className="text-white/70 text-sm">Last Date</div>
            <div className="text-xl font-bold">
              {readings[readings.length - 1]?.date
                ? new Date(
                    readings[readings.length - 1].date
                  ).toLocaleDateString()
                : "-"}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
