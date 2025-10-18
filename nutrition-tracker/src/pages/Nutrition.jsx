import { useLocation, useNavigate } from 'react-router-dom';

export default function Nutrition() {
  const location = useLocation();
  const navigate = useNavigate();

  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <div className="text-violet-400 text-center mt-10">
        <h1 className="text-3xl font-bold">🍎 Nutrition Summary</h1>
        <p className="text-neutral-400 mt-2">No analysis data found. Please submit meals first.</p>
      </div>
    );
  }

  const safe = (value) => value !== undefined && value !== null ? value : 'N/A';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-violet-400">
      <h1 className="text-3xl font-bold text-center mb-6">🍎 Nutrition Summary</h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg mb-8">
        <h2 className="text-2xl text-violet-300 mb-4">✅ Daily Totals</h2>
        <ul className="list-disc pl-6 text-neutral-300">
          <li>Calories: {safe(analysis?.totals?.calories)} kcal</li>
          <li>Protein: {safe(analysis?.totals?.protein)} g</li>
          <li>Carbs: {safe(analysis?.totals?.carbs)} g</li>
          <li>Fats: {safe(analysis?.totals?.fats)} g</li>
        </ul>
      </div>

      {analysis.perItemBreakdown?.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl text-violet-300 mb-4">🍽️ Per Item Breakdown</h2>
          <ul className="space-y-2 text-neutral-300">
            {analysis.perItemBreakdown.map((item, idx) => (
              <li key={idx} className="border-b border-neutral-700 pb-2">
                <span className="font-bold">{safe(item.food)}</span> ({safe(item.quantity)}): 
                {safe(item.estimatedCalories)} kcal, 
                {safe(item.protein)}g protein, 
                {safe(item.carbs)}g carbs, 
                {safe(item.fats)}g fats
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.suggestions?.length > 0 && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl text-violet-300 mb-4">✨ Suggestions</h2>
          <ul className="list-disc pl-6 text-neutral-300">
            {analysis.suggestions.map((sug, idx) => (
              <li key={idx}>{safe(sug)}</li>
            ))}
          </ul>
        </div>
      )}

      {analysis.motivation && (
        <p className="italic text-green-400 text-center mb-6">🌟 {safe(analysis.motivation)}</p>
      )}

      <button
        onClick={() => navigate('/workout', { state: { workout: analysis.workoutPlan } })}
        className="block mx-auto bg-violet-700 text-white py-3 px-6 rounded-lg hover:bg-violet-800 transition shadow-md"
      >
        See Workout Plan
      </button>
    </div>
  );
}
