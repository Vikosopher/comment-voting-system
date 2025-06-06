import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';

interface AuthFormProps {
  isSignup?: boolean;
}

export default function AuthForm({ isSignup = false }: AuthFormProps) {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignup) {
        await signup(formData.email, formData.password, formData.username);
        showToast('Your account is ready! Get started by exploring comments');
      } else {
        await login(formData.email, formData.password);
        showToast("You're logged in, Be happy!");
      }
      setTimeout(() => navigate('/'), 1000); // Delay navigation so toast is visible
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper to get input class based on value
  const getInputClass = (value: string) =>
    `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-white text-black transition-colors duration-200 ` +
    (value
      ? 'bg-gray-100'
      : 'bg-yellow-100');

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm text-gray-900 font-bold mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={getInputClass(formData.username)}
                placeholder="Enter your username"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm text-gray-900 font-bold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={getInputClass(formData.email)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm text-gray-900 font-bold mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className={getInputClass(formData.password)}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md font-bold text-black bg-green-200 hover:bg-green-500 hover:text-black transition-colors duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting
              ? isSignup
                ? 'Creating Account...'
                : 'Logging in...'
              : isSignup
              ? 'Sign Up'
              : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700">
                Login
              </Link>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
