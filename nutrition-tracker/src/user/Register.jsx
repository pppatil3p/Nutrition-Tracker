import { useState, useContext } from 'react';
import axios from '../api/axios.js';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await register(formData.name, formData.email, formData.password);
      
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setMessage(result.error || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="bg-neutral-800 border border-neutral-700 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-500 mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-purple-400 mb-1" htmlFor="name">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              className={`w-full p-3 rounded-lg bg-neutral-700 text-white border transition ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-neutral-600 focus:border-purple-600'
              } focus:outline-none`}
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
              aria-describedby={errors.name ? 'name-error' : undefined}
              required
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-400 mb-1" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              className={`w-full p-3 rounded-lg bg-neutral-700 text-white border transition ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-neutral-600 focus:border-purple-600'
              } focus:outline-none`}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
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
            <label className="block text-purple-400 mb-1" htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              id="password"
              className={`w-full p-3 rounded-lg bg-neutral-700 text-white border transition ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-neutral-600 focus:border-purple-600'
              } focus:outline-none`}
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              aria-describedby={errors.password ? 'password-error' : undefined}
              required
            />
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-purple-400 mb-1" htmlFor="confirmPassword">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="confirmPassword"
              className={`w-full p-3 rounded-lg bg-neutral-700 text-white border transition ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-neutral-600 focus:border-purple-600'
              } focus:outline-none`}
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
              required
            />
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-1 text-sm text-red-500">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-700 hover:bg-purple-600 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes('success') || message.includes('registered')
              ? 'bg-green-900 text-green-300 border border-green-700'
              : 'bg-red-900 text-red-300 border border-red-700'
          }`}>
            {message}
          </div>
        )}

        <p className="text-center text-purple-400 mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-300 underline hover:text-purple-400 transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}