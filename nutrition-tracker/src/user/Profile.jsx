import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-500 mb-6 text-center">My Profile</h2>

        {user ? (
          <div className="space-y-4 text-purple-300">
            <div>
              <p className="text-sm text-neutral-400">Name</p>
              <p className="text-lg font-semibold">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-neutral-400">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-neutral-400">User ID</p>
              <p className="text-lg font-mono">{user.id || user.userId || "N/A"}</p>
            </div>
          </div>
        ) : (
          <p className="text-purple-400 text-center">You are not logged in.</p>
        )}
      </div>
    </div>
  );
}
