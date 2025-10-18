export default function ProgressInsights({ maintenance, logs }) {
  const avgKcal = logs.reduce((sum, l) => sum + l.totalKcal, 0) / logs.length;
  const avgSurplus = avgKcal - maintenance.maintenanceKcal;

  let message;
  if (avgSurplus > 150) {
    message = "You are consistently in surplus. Expect weight gain. Consider reducing calorie intake slightly.";
  } else if (avgSurplus < -150) {
    message = "You are in deficit. Expect weight loss. Ensure adequate protein to preserve muscle.";
  } else {
    message = "Your intake is very close to maintenance. Great consistency!";
  }

  return (
    <div className="bg-purple-100 rounded-xl p-4 shadow">
      <h2 className="text-xl font-semibold text-purple-800 mb-2">AI Insights</h2>
      <p>{message}</p>
    </div>
  );
}
