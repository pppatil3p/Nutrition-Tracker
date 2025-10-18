import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LogMeals() {
  const navigate = useNavigate();

  const [meals, setMeals] = useState({
    breakfast: [{ food: "", quantity: "" }],
    lunch: [{ food: "", quantity: "" }],
    dinner: [{ food: "", quantity: "" }],
    snacks: [{ food: "", quantity: "" }],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (section, index, field, value) => {
    const updated = [...meals[section]];
    updated[index][field] = value;
    setMeals({ ...meals, [section]: updated });
  };

  const handleAddRow = (section) => {
    setMeals({
      ...meals,
      [section]: [...meals[section], { food: "", quantity: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/meals/analyze', { meals });
      // 🚀 FIX: only send the aiResponse
      navigate('/nutrition', { state: { analysis: res.data.data.aiResponse } });
    } catch (err) {
      console.error('Error submitting meals:', err);
      alert('Error analyzing meals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-violet-400 mb-10">
        🍽️ Log Your Meals
      </h1>

      <form onSubmit={handleSubmit} className="space-y-10">
        {["breakfast", "lunch", "dinner", "snacks"].map((section) => (
          <div key={section} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold capitalize text-violet-300 mb-4 border-b border-neutral-700 pb-2">
              {section}
            </h2>
            <div className="space-y-4">
              {meals[section].map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <input
                    type="text"
                    placeholder="Food Name"
                    value={item.food}
                    onChange={(e) => handleChange(section, index, "food", e.target.value)}
                    className="flex-1 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 placeholder-neutral-500 py-2 px-3 focus:outline-none focus:border-violet-600 transition"
                  />
                  <input
                    type="text"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => handleChange(section, index, "quantity", e.target.value)}
                    className="w-full sm:w-40 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 placeholder-neutral-500 py-2 px-3 focus:outline-none focus:border-violet-600 transition"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddRow(section)}
                className="mt-2 text-violet-400 hover:text-violet-300 transition underline"
              >
                + Add Row
              </button>
            </div>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-violet-700 text-white py-3 rounded-lg hover:bg-violet-800 transition shadow-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Submit Meals'}
        </button>
      </form>
    </div>
  );
}
