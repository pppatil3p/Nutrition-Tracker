import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function MealLogs() {
  const [logs, setLogs] = useState([]);
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/meals/all');
      setLogs(res.data.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
      alert('Error fetching logs');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this log?")) return;
    try {
      await axios.delete(`/meals/${id}`);
      fetchLogs();
    } catch (err) {
      console.error('Error deleting log:', err);
      alert('Error deleting log');
    }
  };

  const handleEdit = (log) => {
    navigate('/log-meals', { state: { editId: log._id, meals: log.meals } });
  };

  const toggleExpanded = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-violet-400">
      <h1 className="text-4xl font-bold text-center mb-8">📜 Your Meal Logs</h1>
      {logs.length === 0 && <p className="text-center text-neutral-400">No logs yet.</p>}

      {logs.map((log, idx) => (
        <div
          key={log._id}
          className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-2xl text-violet-300 mb-4">Day {idx + 1}</h2>

          <div className="mb-4 text-neutral-300">
            <strong>Calories:</strong> {log.aiResponse?.totals?.calories ?? 'N/A'} kcal<br />
            <strong>Protein:</strong> {log.aiResponse?.totals?.protein ?? 'N/A'} g<br />
            <strong>Carbs:</strong> {log.aiResponse?.totals?.carbs ?? 'N/A'} g<br />
            <strong>Fats:</strong> {log.aiResponse?.totals?.fats ?? 'N/A'} g
          </div>

          <button
            onClick={() => toggleExpanded(log._id)}
            className="mb-4 bg-violet-700 text-white py-2 px-4 rounded hover:bg-violet-800 transition"
          >
            {expanded[log._id] ? 'Hide Details' : 'See More'}
          </button>

          {expanded[log._id] && (
            <div className="mt-4 space-y-6 text-neutral-300">
              {log.aiResponse?.perItemBreakdown?.length > 0 && (
                <div>
                  <h3 className="text-xl text-violet-400 mb-2">🍽️ Per Item Breakdown</h3>
                  <ul className="space-y-2">
                    {log.aiResponse.perItemBreakdown.map((item, i) => (
                      <li key={i} className="border-b border-neutral-700 pb-2">
                        <strong>{item.food}</strong> ({item.quantity}): 
                        {item.estimatedCalories} kcal, 
                        {item.protein}g protein, 
                        {item.carbs}g carbs, 
                        {item.fats}g fats
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {log.aiResponse?.suggestions?.length > 0 && (
                <div>
                  <h3 className="text-xl text-violet-400 mb-2">✨ Suggestions</h3>
                  <ul className="list-disc pl-6">
                    {log.aiResponse.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}

              {log.aiResponse?.motivation && (
                <p className="italic text-green-400">🌟 {log.aiResponse.motivation}</p>
              )}

              {log.aiResponse?.workoutPlan && (
                <div>
                  <h3 className="text-xl text-violet-400 mb-2">🏋️ Workout Plan</h3>
                  {Object.entries(log.aiResponse.workoutPlan).map(([day, exercises], i) => (
                    <div key={i} className="mb-2">
                      <strong className="capitalize">{day}:</strong>
                      <ul className="list-disc pl-6">
                        {exercises.map((ex, j) => (
                          <li key={j}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => handleEdit(log)}
              className="bg-violet-700 text-white py-2 px-4 rounded hover:bg-violet-800 transition"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(log._id)}
              className="bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
