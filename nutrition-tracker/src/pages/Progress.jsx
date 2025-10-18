import { useEffect, useState } from 'react';
import axios from '../api/axios';

export default function Progress() {
  const [maintenance, setMaintenance] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [maintenanceRes, logsRes] = await Promise.all([
          axios.get('/maintenance'),
          axios.get('/meals/all')
        ]);

        console.log('Server maintenance response:', maintenanceRes.data);

        setMaintenance(
          maintenanceRes.data.maintenance ?? maintenanceRes.data
        );

        setLogs(logsRes.data.data);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data. Please check your login and try again.');
      }
    };

    fetchData();
  }, []);

  // Helper to compute surplus/deficit
  const compareValue = (logged, target, label) => {
    if (logged == null || target == null) return '';

    const diff = logged - target;
    if (diff === 0) return `(Exact match)`;
    if (diff > 0) return `(Surplus of ${diff} ${label})`;
    return `(Deficit of ${Math.abs(diff)} ${label})`;
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl mb-4">Progress Tracker</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl mb-2">Your Maintenance Target</h2>
        {maintenance ? (
          <div>
            <p>Maintenance Calories: {maintenance.maintenanceCalories} kcal</p>
            <p>Goal Calories: {maintenance.goalCalories} kcal</p>
            <p>Recommended Protein: {maintenance.recommendedProtein} g</p>
          </div>
        ) : (
          <p>Loading maintenance data...</p>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl mb-2">Your Logged Meals</h2>
        {logs.length > 0 ? (
          <ul className="space-y-2">
            {logs.map((log) => {
              const totals = log.aiResponse?.totals ?? {};
              return (
                <li key={log._id} className="border border-gray-700 p-2 rounded">
                  <p className="font-semibold">Date: {new Date(log.createdAt).toLocaleDateString()}</p>
                  <p>
                    Calories: {totals.calories ?? 0} kcal{' '}
                    {maintenance && compareValue(totals.calories, maintenance.goalCalories, 'kcal')}
                  </p>
                  <p>
                    Protein: {totals.protein ?? 0} g{' '}
                    {maintenance && compareValue(totals.protein, maintenance.recommendedProtein, 'g')}
                  </p>
                  <p>Carbs: {totals.carbs ?? 0} g</p>
                  <p>Fat: {totals.fats ?? 0} g</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No meal logs found.</p>
        )}
      </div>
    </div>
  );
}
