import { createContext, useState, useEffect } from "react";
import axios from "../src/api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/auth/me", { withCredentials: true });
        
        // ensure consistent shape: expect { user: {...} }
        setIsAuthenticated(true);
        setUser(response.data.user);
        
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login helper
  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", 
        { email, password }, 
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Login failed" 
      };
    }
  };

  // Register helper
  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/auth/register", 
        { name, email, password }, 
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error("Registration error:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || "Registration failed" 
      };
    }
  };

  // Logout helper
  const logout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-violet-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-400"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        setIsAuthenticated,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
