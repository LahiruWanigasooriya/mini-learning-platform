import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LoginSelect from './pages/LoginSelect';
import StudentLogin from './pages/StudentLogin';
import InstructorLogin from './pages/InstructorLogin';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseDetail from './pages/CourseDetail';
import CourseCreate from './pages/CourseCreate';
import CourseEdit from './pages/CourseEdit';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <div className="min-h-screen bg-mesh" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'background-color 0.35s ease' }}>
      <Navbar />
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Auth Routes */}
          <Route path="/login" element={<LoginSelect />} />
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/login/instructor" element={<InstructorLogin />} />
          <Route path="/register" element={<Register />} />
          {/* Public Routes */}
          <Route path="/course/:id" element={<CourseDetail />} />
          {/* Student Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          {/* Instructor Protected Routes */}
          <Route path="/instructor/dashboard" element={<ProtectedRoute><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses/create" element={<ProtectedRoute><CourseCreate /></ProtectedRoute>} />
          <Route path="/instructor/courses/:id/edit" element={<ProtectedRoute><CourseEdit /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
