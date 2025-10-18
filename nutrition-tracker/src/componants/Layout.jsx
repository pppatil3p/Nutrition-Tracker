import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { HiChevronUp, HiChevronDown } from "react-icons/hi"; 

export default function Layout() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [navVisible, setNavVisible] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === false && !["/login", "/register"].includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-neutral-900 text-violet-400 flex items-center justify-center">
        <span className="text-xl">Loading...</span>
      </div>
    );
  }

  if (["/login", "/register"].includes(location.pathname)) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="bg-neutral-900 text-violet-400 w-64 flex flex-col shadow-lg border-r border-neutral-800">
        
        {/* Header with toggle */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-neutral-800">
          <h2 className="text-2xl font-bold text-violet-400">Nutrition Tracker</h2>
          <button
            onClick={() => setNavVisible(!navVisible)}
            className="text-violet-400 hover:text-violet-300 transition"
            aria-label="Toggle Nav Items"
          >
            {navVisible ? <HiChevronUp size={22} /> : <HiChevronDown size={22} />}
          </button>
        </div>

        {/* Nav Items - collapsible */}
        {navVisible && (
          <nav className="flex flex-col mt-2 space-y-2 px-4">
            <Link
              to="/"
              className={navLinkClass(location.pathname === "/")}
            >
              Dashboard
            </Link>
            <Link
              to="/maintenance"
              className={navLinkClass(location.pathname === "/maintenance")}
            >
              Maintenance Kcal
            </Link>
            <Link
              to="/log-meals"
              className={navLinkClass(location.pathname === "/log-meals")}
            >
              Log Meals
            </Link>
            <Link
              to="/logs"
              className={navLinkClass(location.pathname === "/logs")}
            >
              Nutrition Summary
            </Link>
            <Link
              to="/progress"
              className={navLinkClass(location.pathname === "/progress")}
            >
              Progress
            </Link>
            <Link
              to="/chatbot"
              className={navLinkClass(location.pathname === "/chatbot")}
            >
              Ai Expert
            </Link>
          </nav>
        )}

        {/* Account Section Always Visible */}
        <div className="mt-4 px-4 py-2 border-t border-neutral-800">
          <button
            onClick={() => setShowAccountMenu(!showAccountMenu)}
            className="w-full bg-neutral-800 text-violet-300 px-4 py-2 rounded-md hover:bg-neutral-700 transition"
            aria-expanded={showAccountMenu}
            aria-haspopup="true"
          >
            👤 Account {showAccountMenu ? "▲" : "▼"}
          </button>
          {showAccountMenu && (
            <div className="mt-2 w-full bg-neutral-800 rounded-md shadow-lg divide-y divide-neutral-700">
              <Link
                to="/profile"
                className="block px-4 py-2 text-violet-400 hover:bg-neutral-700 transition"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-4 py-2 text-violet-400 hover:bg-neutral-700 transition"
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
                className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-b-md transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-neutral-900 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

function navLinkClass(isActive) {
  return `rounded-md px-3 py-2 transition ${
    isActive
      ? "border-l-4 border-violet-700 bg-neutral-800 text-violet-300"
      : "hover:bg-neutral-800 text-violet-400"
  }`;
}
