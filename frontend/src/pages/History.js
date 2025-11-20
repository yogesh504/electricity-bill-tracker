import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import ReadingTable from "../components/ReadingTable";

export default function History() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliance, setAppliance] = useState("");

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const res = await API.get("/readings");
        setReadings(res.data);
      } catch (err) {
        setError("Failed to load readings");
      } finally {
        setLoading(false);
      }
    };
    fetchReadings();
  }, []);

  const filtered = useMemo(() => {
    return readings.filter((r) => {
      const d = new Date(r.date);
      if (startDate && d < new Date(startDate)) return false;
      if (endDate && d > new Date(endDate)) return false;
      if (
        appliance &&
        !r.applianceName.toLowerCase().includes(appliance.toLowerCase())
      )
        return false;
      return true;
    });
  }, [readings, startDate, endDate, appliance]);

  const handleExport = () => {
    if (!filtered.length) return;
    const header = ["Date", "Appliance", "Units", "CostPerUnit", "TotalCost"];
    const rows = filtered.map((r) => [
      new Date(r.date).toISOString(),
      r.applianceName,
      r.units,
      r.costPerUnit,
      r.totalCost,
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "readings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout title="History">
      {error && (
        <div className="bg-red-500/20 text-red-100 text-sm p-3 rounded">
          {error}
        </div>
      )}
      <div className="bg-white/10 border border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col">
            <label className="text-white/70 text-sm">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 rounded bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white/70 text-sm">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 rounded bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-[160px]">
            <label className="text-white/70 text-sm">Appliance</label>
            <input
              placeholder="Filter by appliance"
              value={appliance}
              onChange={(e) => setAppliance(e.target.value)}
              className="p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
          >
            Export CSV
          </button>
        </div>
      </div>
      {loading ? (
        <div className="bg-white/10 border border-white/10 rounded-xl p-4">
          Loading readings...
        </div>
      ) : filtered.length ? (
        <div className="bg-white/10 border border-white/10 rounded-xl p-4">
          <ReadingTable readings={filtered} />
        </div>
      ) : (
        <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-white/70">
          No readings match the selected filters.
        </div>
      )}
    </Layout>
  );
}
