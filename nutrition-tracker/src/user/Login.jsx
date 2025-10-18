import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleGetStarted = () => {
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (message) {
      setMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate("/", { replace: true });
      } else {
        setMessage(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {!showForm && (
        <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center px-4 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-violet-500">
            Welcome to Nutrition Tracker
          </h1>
          <p className="text-neutral-300 max-w-md">
            Track your meals, monitor your macros, and stay on top of your nutrition goals easily and efficiently.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-violet-700 hover:bg-violet-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Get Started
          </button>
        </div>
      )}

      {showForm && (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
          <div className="bg-neutral-800 border border-neutral-700 p-8 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-3xl font-bold text-violet-500 mb-6 text-center">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-violet-400 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`w-full p-3 rounded-lg bg-neutral-700 text-white border transition ${
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-neutral-600 focus:border-violet-600'
                  } focus:outline-none`}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-violet-400 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full p-3 pr-12 rounded-lg bg-neutral-700 text-white border transition ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-neutral-600 focus:border-violet-600'
                    } focus:outline-none`}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-violet-400 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-violet-700 hover:bg-violet-600 disabled:bg-violet-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center ${
                message.includes('success') || message.includes('logged in')
                  ? 'bg-green-900 text-green-300 border border-green-700'
                  : 'bg-red-900 text-red-300 border border-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6 text-center space-y-2">
              <p className="text-violet-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="text-violet-300 underline hover:text-violet-400 transition"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
