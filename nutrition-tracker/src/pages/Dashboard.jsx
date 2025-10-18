import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-500 mb-2 text-center">
          {user?.name ? `Welcome, ${user.name} 👋` : "Welcome 👋"}
        </h1>

        <p className="text-center text-neutral-400 mb-10 max-w-2xl mx-auto">
          This is your personalized nutrition and fitness dashboard.
          Easily track meals, monitor calories, plan workouts,
          and achieve your health goals—all in one place.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/maintenance"
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-md hover:border-purple-600 hover:shadow-purple-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Maintenance Calories</h2>
            <p className="text-neutral-300">Calculate your daily calorie requirements based on your goals.</p>
          </Link>

          <Link
            to="/log-meals"
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-md hover:border-purple-600 hover:shadow-purple-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Log Meals</h2>
            <p className="text-neutral-300">Track the meals you've consumed with nutritional data.</p>
          </Link>

          <Link
            to="/nutrition-summary"
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-md hover:border-purple-600 hover:shadow-purple-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Nutrition Summary</h2>
            <p className="text-neutral-300">View your macro & micro nutrient summary with recommendations.</p>
          </Link>

          <Link
            to="/workout-plan"
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-md hover:border-purple-600 hover:shadow-purple-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Workout Plan</h2>
            <p className="text-neutral-300">Manage and follow your custom workout routines.</p>
          </Link>

          <Link
            to="/profile"
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-md hover:border-purple-600 hover:shadow-purple-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Your Profile</h2>
            <p className="text-neutral-300">Update your account details, weight, height and more.</p>
          </Link>

          <Link
            to="/settings"
            className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-md hover:border-purple-600 hover:shadow-purple-700 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-400 mb-2">Settings</h2>
            <p className="text-neutral-300">App preferences, security, and general settings.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
