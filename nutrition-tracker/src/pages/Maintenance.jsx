import { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";

export default function Maintenance() {
  const [goalType, setGoalType] = useState("maintain");
  const [durationMonths, setDurationMonths] = useState("1");
  const [targetKg, setTargetKg] = useState("");

  const [age, setAge] = useState("");
  const [sex, setSex] = useState("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("1.2");

  const [result, setResult] = useState(null);
  const [calculatedMaintenanceCalories, setCalculatedMaintenanceCalories] = useState(null);
  const [calculatedGoalCalories, setCalculatedGoalCalories] = useState(null);
  const [calculatedProtein, setCalculatedProtein] = useState(null);

  const handleCalculate = () => {
    if (!age || !height || !weight) {
      toast.warn(" Please fill in age, height, and weight.");
      return;
    }

    if (goalType !== "maintain" && !targetKg) {
      toast.warn(" Please enter how many kg you want to gain or lose.");
      return;
    } 

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const months = parseInt(durationMonths);
    const weeks = months * 4;

    let bmr = sex === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const maintenance = bmr * parseFloat(activity);
    setCalculatedMaintenanceCalories(Math.round(maintenance));

    let targetCalories = maintenance;
    let proteinPerKg = 1.2;

    let goalCalories = null;
    if (goalType !== "maintain") {
      const totalKcalChange = 7700 * parseFloat(targetKg);
      const dailyAdjustment = totalKcalChange / (weeks * 7);

      if (goalType === "lose") {
        targetCalories = maintenance - dailyAdjustment;
        proteinPerKg = 1.8;
      } else if (goalType === "gain") {
        targetCalories = maintenance + dailyAdjustment;
        proteinPerKg = 2.0;
      }

      goalCalories = Math.round(targetCalories);
      setCalculatedGoalCalories(goalCalories);
    } else {
      setCalculatedGoalCalories(null);
    }

    const recommendedProtein = Math.round(w * proteinPerKg);
    setCalculatedProtein(recommendedProtein);

    let outputLines = [`Maintenance Calories: ${Math.round(maintenance)} kcal/day`];
    if (goalCalories) {
      outputLines.push(`Goal Calories: ${goalCalories} kcal/day`);
    }
    outputLines.push(`Recommended Protein Intake: ${recommendedProtein} g/day`);

    setResult(outputLines.join("\n"));
  };

  const handleSave = async () => {
    if (!calculatedMaintenanceCalories || !calculatedProtein) {
      toast.warn("Please calculate first before saving!");
      return;
    }

    try {
      const payload = {
        goalType,
        durationMonths,
        targetKg,
        age,
        sex,
        height,
        weight,
        activity,
        maintenanceCalories: calculatedMaintenanceCalories,
        goalCalories: calculatedGoalCalories,
        recommendedProtein: calculatedProtein
      };

      const response = await axios.post("/maintenance", payload, {
        withCredentials: true
      });

      console.log("Saved:", response.data);
      toast.success("Saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(error?.response?.data?.message || " Failed to save.");
    }
  };

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col items-center px-4 py-8">
      <div className="max-w-2xl w-full">

        <h2 className="text-4xl font-bold text-violet-400 mb-8 text-center">
          🥗 Goal-Based Calorie & Protein Calculator
        </h2>

        <div className="flex flex-col space-y-10">
          <div>
            <h3 className="text-2xl font-semibold text-violet-300 mb-4">Select Goal</h3>
            <div className="flex flex-col space-y-6">
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                className="bg-neutral-800 border-b rounded-lg border-neutral-700 text-violet-300 py-2 focus:outline-none focus:border-violet-600 transition"
              >
                <option value="maintain" disabled>Select goal</option>
                <option value="maintain">Maintain</option>
                <option value="lose">Lose</option>
                <option value="gain">Gain</option>
              </select>

              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
                className="bg-neutral-800 border-b rounded-lg border-neutral-700 text-violet-300 py-2 focus:outline-none focus:border-violet-600 transition"
              >
                <option value="1" disabled>Select Duration</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="4">4 Months</option>
                <option value="5">5 Months</option>
              </select>

              {(goalType === "gain" || goalType === "lose") && (
                <input
                  type="number"
                  placeholder={`How many kg do you want to ${goalType}?`}
                  value={targetKg}
                  onChange={(e) => setTargetKg(e.target.value)}
                  className="bg-transparent border-b border-neutral-700 text-violet-300 placeholder-violet-500 py-2 focus:outline-none focus:border-violet-600 transition"
                />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-violet-300 mb-4">Add Required Data</h3>
            <div className="flex flex-col space-y-6">
              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="flex-1 bg-transparent border-b border-neutral-700 text-violet-300 placeholder-violet-500 py-2 focus:outline-none focus:border-violet-600 transition"
                />
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="flex-1 bg-neutral-800 rounded-lg border-b border-neutral-700 text-violet-300 py-2 focus:outline-none focus:border-violet-600 transition"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-6 sm:space-y-0">
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="flex-1 bg-transparent border-b border-neutral-700 text-violet-300 placeholder-violet-500 py-2 focus:outline-none focus:border-violet-600 transition"
                />
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="flex-1 bg-transparent border-b border-neutral-700 text-violet-300 placeholder-violet-500 py-2 focus:outline-none focus:border-violet-600 transition"
                />
              </div>

              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="bg-neutral-800 rounded-lg border-b border-neutral-700 text-violet-300 py-2 focus:outline-none focus:border-violet-600 transition"
              >
                <option value="1.2" disabled>Activity</option>
                <option value="1.2">Sedentary (little or no exercise)</option>
                <option value="1.375">Lightly Active (light exercise)</option>
                <option value="1.55">Moderately Active</option>
                <option value="1.725">Very Active</option>
                <option value="1.9">Extra Active</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-4 w-full bg-violet-700 text-white py-3 rounded-md hover:bg-violet-800 transition"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-8 text-center text-violet-300 text-lg font-semibold whitespace-pre-wrap">
            {result}
            <button
              onClick={handleSave}
              className="mt-4 block mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
            >
              Save This Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
