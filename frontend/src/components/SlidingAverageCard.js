export default function SlidingAverageCard({ readings, n, onChangeN }) {
  const k = Math.max(1, Math.min(n, readings.length || 1));
  let sum = 0;
  for (let i = readings.length - k; i < readings.length; i++) {
    if (i >= 0) sum += Number(readings[i].units) || 0;
  }
  const avg = readings.length ? (sum / k).toFixed(2) : '0.00';

  return (
    <div className="bg-white/10 border border-white/10 rounded-xl p-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white/80 text-sm">Sliding Average (last N readings)</h3>
          <div className="text-3xl font-bold">{avg} units</div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-white/70 text-sm">N:</label>
          <input type="number" min="1" value={n} onChange={(e) => onChangeN(Number(e.target.value))} className="w-20 p-2 rounded bg-white/5 border border-white/10 text-white" />
        </div>
      </div>
    </div>
  );
}
