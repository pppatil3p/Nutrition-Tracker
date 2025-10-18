import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";

export default function ProgressCharts({ maintenance, logs }) {
  const chartData = logs.map(log => ({
    date: log.date,
    Maintenance: maintenance.maintenanceKcal,
    Actual: log.totalKcal
  }));

  return (
    <div className="bg-violet-50 rounded-xl p-4 mb-4 shadow">
      <h2 className="text-xl font-semibold text-purple-800 mb-2">Daily Calories Comparison</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Maintenance" stroke="#8884d8" />
          <Line type="monotone" dataKey="Actual" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
