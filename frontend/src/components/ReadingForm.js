import { useState } from 'react';

export default function ReadingForm({ onAdd }) {
  const [date, setDate] = useState('');
  const [applianceName, setApplianceName] = useState('');
  const [units, setUnits] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || !applianceName || !units || !costPerUnit) return;
    onAdd({ date, applianceName, units: Number(units), costPerUnit: Number(costPerUnit) });
    setApplianceName('');
    setUnits('');
    setCostPerUnit('');
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2 rounded bg-white/5 border border-white/10 text-white" />
      <input placeholder="Appliance" value={applianceName} onChange={(e) => setApplianceName(e.target.value)} className="p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50" />
      <input type="number" step="0.01" placeholder="Units" value={units} onChange={(e) => setUnits(e.target.value)} className="p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50" />
      <input type="number" step="0.01" placeholder="Cost/Unit" value={costPerUnit} onChange={(e) => setCostPerUnit(e.target.value)} className="p-2 rounded bg-white/5 border border-white/10 text-white placeholder:text-white/50" />
      <button className="p-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold">Add</button>
    </form>
  );
}
