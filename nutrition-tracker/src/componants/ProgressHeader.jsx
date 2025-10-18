export default function ProgressHeader({ maintenance, logs }) {
  const avgKcal = (logs.reduce((sum, l) => sum + l.totalKcal, 0) / logs.length).toFixed(0);
  const avgSurplus = (avgKcal - maintenance.maintenanceKcal).toFixed(0);
  const estWeightChange = ((avgSurplus * 30) / 7700).toFixed(2); // 7700 kcal ≈ 1 kg

  return (
    <div className="bg-violet-100 rounded-xl p-4 mb-4 shadow">
      <h2 className="text-xl font-semibold text-purple-800">Summary</h2>
      <p>Maintenance: {maintenance.maintenanceKcal} kcal/day</p>
      <p>Average Intake: {avgKcal} kcal/day</p>
      <p>Average Surplus/Deficit: {avgSurplus} kcal/day</p>
      <p>Estimated Weight Change: {estWeightChange} kg/month</p>
    </div>
  );
}
