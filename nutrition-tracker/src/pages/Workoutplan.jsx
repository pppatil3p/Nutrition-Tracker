import { useLocation } from 'react-router-dom';

export default function WorkoutPlan() {
  const location = useLocation();
  const workout = location.state?.workout;

  if (!workout) {
    return (
      <div className="text-violet-400 text-center mt-10">
        <h1 className="text-3xl font-bold">🏋️️ Workout Plan</h1>
        <p className="text-neutral-400 mt-2">No workout plan found. Please generate your nutrition analysis first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-violet-400">
      <h1 className="text-3xl font-bold text-center mb-6">🏋️ Workout Plan</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
        {Object.entries(workout).map(([day, exercises], idx) => (
          <div key={idx} className="mb-6 border-b border-neutral-700 pb-4">
            <h2 className="text-2xl text-violet-300 mb-2 capitalize">{day}</h2>
            <ul className="list-disc pl-6 text-neutral-300 space-y-1">
              {exercises.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
