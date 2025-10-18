import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./componants/Layout.jsx";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import Workoutplan from "./pages/Workoutplan";
import Profile from "./user/Profile";
import Settings from "./user/Settings";
import Login from "./user/Login";
import Register from "./user/Register";
import Logmeals from "./pages/Logmeals";
import Nutrition from "./pages/Nutrition";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import MealLogs from './pages/Meal.history.jsx';
import Chatbot from "./pages/Chatbot.jsx";
import Progress from "./pages/Progress.jsx";
export default function App() {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    return <div className="text-white bg-black min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="log-meals" element={<Logmeals />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="workout" element={<Workoutplan />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="/logs" element={<MealLogs/>} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/progress" element={<Progress />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  );
}
