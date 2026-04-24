import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-brand-600" />
              <span className="font-bold text-xl text-slate-800 tracking-tight">MiniLMS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">
                  My Learning
                </Link>
                <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                  <UserCircle className="h-6 w-6 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{user?.firstName || 'User'}</span>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
                >
                  Join for Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
