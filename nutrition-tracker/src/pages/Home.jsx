import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <h1 className="text-5xl font-extrabold text-green-700 mb-4 text-center">
        Nutrition & Workout Tracker
      </h1>

      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        Track your food intake, calculate maintenance calories, and get personalized suggestions for your fitness goals.
      </p>

      <div className="flex space-x-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow-md transition duration-200">
            Login
          </button>
        </Link>

        <Link to="/register">
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-md transition duration-200">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
