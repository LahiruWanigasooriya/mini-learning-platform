import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginSelect: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
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

      {/* Bypass / Demo Section */}
      <div className="mt-12 glass-card p-6 border-dashed border-2 border-[var(--border)] max-w-lg w-full">
        <div className="flex items-center gap-2 mb-4 justify-center">
          <ShieldCheck className="h-4 w-4" style={{ color: 'var(--warning)' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>Development Bypass</span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => {
              login('mock_token_student', { id: 1, email: 'student@demo.com', role: 'STUDENT', firstName: 'Demo', lastName: 'Student' });
              navigate('/dashboard');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--accent)' }}
          >
            Login as Student
          </button>
          <button 
            onClick={() => {
              login('mock_token_instructor', { id: 2, email: 'instructor@demo.com', role: 'INSTRUCTOR', firstName: 'Demo', lastName: 'Instructor' });
              navigate('/instructor/dashboard');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
            style={{ background: 'var(--violet-soft)', color: 'var(--violet)', border: '1px solid var(--violet)' }}
          >
            Login as Instructor
          </button>
        </div>
        <p className="mt-3 text-[10px] text-center italic" style={{ color: 'var(--text-tertiary)' }}>
          * These buttons skip backend authentication for testing UI components.
        </p>
      </div>

      {/* Footer link */}
      <p className="mt-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold transition-colors" style={{ color: 'var(--accent)' }}>
          Create one for free
        </Link>
      </p>
    </div>
  );
};

export default LoginSelect;
