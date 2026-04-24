import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, ArrowRight } from 'lucide-react';

const LoginSelect: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl shadow-lg shadow-brand-500/25">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Welcome to MiniLMS
        </h1>
        <p className="text-lg text-slate-500 max-w-md mx-auto">
          Choose how you'd like to sign in to continue
        </p>
      </div>

      {/* Role Selection Cards */}
      <div className="grid sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* Student Card */}
        <Link
          to="/login/student"
          id="login-select-student"
          className="group relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Gradient accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-cyan-50 group-hover:from-brand-100 group-hover:to-cyan-100 transition-colors duration-300">
              <GraduationCap className="h-12 w-12 text-brand-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Student</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Access courses, track your progress, and continue learning
              </p>
            </div>
            <div className="flex items-center gap-2 text-brand-600 font-semibold text-sm mt-2 group-hover:gap-3 transition-all duration-300">
              <span>Sign in as Student</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>

        {/* Instructor Card */}
        <Link
          to="/login/instructor"
          id="login-select-instructor"
          className="group relative bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-violet-300 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          {/* Gradient accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 group-hover:from-violet-100 group-hover:to-fuchsia-100 transition-colors duration-300">
              <Users className="h-12 w-12 text-violet-600 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">Instructor</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Manage courses, view analytics, and engage with students
              </p>
            </div>
            <div className="flex items-center gap-2 text-violet-600 font-semibold text-sm mt-2 group-hover:gap-3 transition-all duration-300">
              <span>Sign in as Instructor</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </div>

      {/* Footer link */}
      <p className="mt-10 text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 transition-colors">
          Create one for free
        </Link>
      </p>
    </div>
  );
};

export default LoginSelect;
