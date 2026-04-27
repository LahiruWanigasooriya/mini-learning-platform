import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, UserCircle, LogOut, GraduationCap, Users, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/login');
  };

  // Determine role for styling and dashboard link
  const isInstructor = user?.role === 'INSTRUCTOR' ||
    (Array.isArray((user as any)?.roles) && (user as any).roles.includes('INSTRUCTOR'));
  const dashboardPath = isInstructor ? '/instructor/dashboard' : '/dashboard';

  return (
    <>
      <nav className="glass-nav sticky top-0 z-50" style={{ transition: 'background-color 0.35s ease, border-color 0.35s ease' }}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
                <div style={{ background: 'var(--accent-gradient)', borderRadius: '0.75rem', padding: '0.4rem', display: 'flex', boxShadow: '0 4px 12px rgba(30,58,138,0.15)', transition: 'transform 0.3s ease' }} className="group-hover:scale-105">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Mini<span style={{ color: 'var(--accent)' }}>LMS</span>
                </span>
              </Link>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to={dashboardPath}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    {isInstructor ? 'Dashboard' : 'My Learning'}
                  </Link>

                  <div className="w-px h-6 mx-1" style={{ background: 'var(--border)' }} />

                  <NotificationBell />

                  <div className="w-px h-6 mx-1" style={{ background: 'var(--border)' }} />

                  {/* Role badge */}
                  {isInstructor ? (
                    <span className="badge badge-violet">
                      <Users className="h-3 w-3" />
                      Instructor
                    </span>
                  ) : (
                    <span className="badge badge-accent">
                      <GraduationCap className="h-3 w-3" />
                      Student
                    </span>
                  )}

                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 ml-1 p-1.5 rounded-lg transition-all duration-200 hover:bg-[var(--accent-soft)]"
                  >
                    <UserCircle className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{user?.firstName || 'User'}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                    title="Logout"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={{ color: 'var(--accent)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    Join for Free
                  </Link>
                </>
              )}

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="ml-2 p-2 rounded-lg transition-all duration-300"
                style={{
                  color: 'var(--text-secondary)',
                  background: isDark ? 'var(--warning-soft)' : 'var(--accent-soft)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1) rotate(12deg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                id="theme-toggle"
              >
                {isDark ? <Sun className="h-4.5 w-4.5" style={{ color: 'var(--warning)' }} /> : <Moon className="h-4.5 w-4.5" style={{ color: 'var(--accent)' }} />}
              </button>
            </div>

            {/* Mobile: theme toggle + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-all duration-200"
                style={{ color: 'var(--text-secondary)', background: isDark ? 'var(--warning-soft)' : 'var(--accent-soft)' }}
                id="theme-toggle-mobile"
              >
                {isDark ? <Sun className="h-4.5 w-4.5" style={{ color: 'var(--warning)' }} /> : <Moon className="h-4.5 w-4.5" style={{ color: 'var(--accent)' }} />}
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
                id="mobile-menu-toggle"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40" style={{ top: '64px' }}>
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }} onClick={() => setMobileOpen(false)} />
          {/* Menu */}
          <div
            className="absolute top-0 right-0 w-72 max-w-[85vw] h-full glass-strong animate-slide-down"
            style={{ borderLeft: '1px solid var(--glass-border)', padding: '1.5rem' }}
          >
            <div className="flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-xl mb-2" style={{ background: 'var(--accent-soft)' }}>
                    <UserCircle className="h-8 w-8" style={{ color: 'var(--accent)' }} />
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user?.firstName || 'User'}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{user?.email}</p>
                    </div>
                  </div>

                  {isInstructor ? (
                    <span className="badge badge-violet w-fit mb-2">
                      <Users className="h-3 w-3" /> Instructor
                    </span>
                  ) : (
                    <span className="badge badge-accent w-fit mb-2">
                      <GraduationCap className="h-3 w-3" /> Student
                    </span>
                  )}

                  <Link
                    to={dashboardPath}
                    onClick={() => setMobileOpen(false)}
                    className="p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    {isInstructor ? '📊 Dashboard' : '📚 My Learning'}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="p-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    🏠 Home
                  </Link>

                  <div className="my-2" style={{ borderTop: '1px solid var(--border)' }} />

                  <button
                    onClick={handleLogout}
                    className="p-3 rounded-xl text-sm font-medium transition-colors text-left"
                    style={{ color: 'var(--danger)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    🚪 Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="p-3 rounded-xl text-sm font-semibold transition-colors"
                    style={{ color: 'var(--accent)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary text-sm mt-2 w-full"
                  >
                    Join for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
