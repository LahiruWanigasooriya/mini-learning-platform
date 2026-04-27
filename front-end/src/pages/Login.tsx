import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/services';
import { BookOpen, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      // Assuming the backend returns the token in response.data.token
      if (response.data.token) {
        login(response.data.token);
        navigate('/dashboard');
      } else {
        setError('Login failed: No access token received.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div
            className="p-3 rounded-2xl"
            style={{ background: 'var(--accent-gradient)', boxShadow: '0 8px 24px rgba(30,58,138,0.2)' }}
          >
            <BookOpen className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Or{' '}
          <Link to="/register" className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-6 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl p-4" style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)' }}>
                <div className="flex">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" style={{ color: 'var(--danger)' }} />
                  <p className="ml-3 text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
