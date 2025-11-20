import { useSettings } from "../context/SettingsContext";

export default function ReadingTable({ readings }) {
  const { settings } = useSettings();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-white/90">
        <thead className="bg-white/10">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Appliance</th>
            <th className="p-3">Units</th>
            <th className="p-3">Cost/Unit</th>
            <th className="p-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {readings.map((r) => (
            <tr
              key={r._id || r.date + r.applianceName}
              className="odd:bg-white/5"
            >
              <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
              <td className="p-3">{r.applianceName}</td>
              <td className="p-3">{r.units}</td>
              <td className="p-3">
                {settings.currencySymbol}
                {r.costPerUnit}
              </td>
              <td className="p-3">
                {settings.currencySymbol}
                {r.totalCost}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
