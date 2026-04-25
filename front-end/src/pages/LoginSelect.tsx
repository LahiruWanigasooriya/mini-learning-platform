import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, ArrowRight } from 'lucide-react';

const LoginSelect: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div
            className="p-3.5 rounded-2xl animate-float"
            style={{ background: 'var(--accent-gradient)', boxShadow: '0 8px 24px rgba(30,58,138,0.2)' }}
          >
            <BookOpen className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>
          Welcome to MiniLMS
        </h1>
        <p className="text-lg max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Choose how you'd like to sign in to continue
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl stagger-children">
        {/* Student Card */}
        <Link
          to="/login/student"
          id="login-select-student"
          className="group relative glass-card p-8 overflow-hidden animate-slide-up"
          style={{ textDecoration: 'none' }}
        >
          {/* Gradient accent top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'var(--accent-gradient)' }}
          />

          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className="p-4 rounded-2xl transition-all duration-300"
              style={{ background: 'var(--accent-soft)' }}
            >
              <GraduationCap className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Student</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Access courses, track your progress, and continue learning
              </p>
            </div>
            <div className="flex items-center gap-2 font-semibold text-sm mt-2 group-hover:gap-3 transition-all duration-300" style={{ color: 'var(--accent)' }}>
              <span>Sign in as Student</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Instructor Card */}
        <Link
          to="/login/instructor"
          id="login-select-instructor"
          className="group relative glass-card p-8 overflow-hidden animate-slide-up"
          style={{ textDecoration: 'none' }}
        >
          {/* Gradient accent top bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'var(--violet-gradient)' }}
          />

          <div className="flex flex-col items-center text-center space-y-4">
            <div
              className="p-4 rounded-2xl transition-all duration-300"
              style={{ background: 'var(--violet-soft)' }}
            >
              <Users className="h-12 w-12 group-hover:scale-110 transition-transform duration-300" style={{ color: 'var(--violet)' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Instructor</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Manage courses, view analytics, and engage with students
              </p>
            </div>
            <div className="flex items-center gap-2 font-semibold text-sm mt-2 group-hover:gap-3 transition-all duration-300" style={{ color: 'var(--violet)' }}>
              <span>Sign in as Instructor</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Footer link */}
      <p className="mt-10 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--accent)' }}>
          Create one for free
        </Link>
      </p>
    </div>
  );
};

export default LoginSelect;
