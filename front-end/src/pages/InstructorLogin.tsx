import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const InstructorLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // TODO: Remove bypass — temporary mock login for testing
    setTimeout(() => {
      login('mock_jwt_token_instructor', {
        id: 2,
        email: email || 'instructor@example.com',
        role: 'INSTRUCTOR',
        firstName: 'Instructor',
        lastName: 'User',
      });
      navigate('/instructor/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Back button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-sm transition-colors mb-8 group"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--violet)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to role selection
        </Link>

        {/* Header */}
        <div className="flex justify-center">
          <div
            className="p-3 rounded-2xl"
            style={{ background: 'var(--violet-gradient)', boxShadow: '0 8px 24px rgba(124,58,237,0.2)' }}
          >
            <Users className="h-10 w-10 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Instructor Sign In
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Manage your courses and track student progress
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="glass-card py-8 px-6 sm:px-10">
          {/* Instructor badge */}
          <div className="flex items-center justify-center mb-6">
            <span className="badge badge-violet">
              <Users className="h-3.5 w-3.5" />
              Instructor Portal
            </span>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl p-4 animate-fade-in" style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)' }}>
                <div className="flex">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
                  <p className="ml-3 text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="instructor-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input
                id="instructor-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@institution.edu"
                className="glass-input"
              />
            </div>

            <div>
              <label htmlFor="instructor-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="instructor-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="glass-input"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="instructor-remember"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded cursor-pointer"
                  style={{ accentColor: 'var(--violet)' }}
                />
                <label htmlFor="instructor-remember" className="ml-2 block text-sm cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium transition-colors" style={{ color: 'var(--violet)' }}>
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="instructor-login-submit"
              className="btn-violet w-full py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin-slow h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in as Instructor'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--violet)' }}>
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
