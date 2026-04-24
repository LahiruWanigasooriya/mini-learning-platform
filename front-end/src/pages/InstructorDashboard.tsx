import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, TrendingUp, Plus, BarChart3, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then(res => {
        // Filter courses by this instructor (mock: show all)
        setCourses(res.data?.data || res.data || []);
      })
      .catch(() => {
        // Mock data for visual testing
        setCourses([
          {
            id: '1',
            title: 'Complete Web Development Bootcamp',
            description: 'Master full-stack web development from scratch',
            enrolledCount: 1247,
            rating: 4.8,
            revenue: 24940,
            status: 'Published',
          },
          {
            id: '2',
            title: 'Advanced React & TypeScript',
            description: 'Deep dive into React patterns and TypeScript',
            enrolledCount: 856,
            rating: 4.9,
            revenue: 17120,
            status: 'Published',
          },
          {
            id: '3',
            title: 'Cloud Architecture Fundamentals',
            description: 'Learn cloud computing concepts and AWS services',
            enrolledCount: 0,
            rating: 0,
            revenue: 0,
            status: 'Draft',
          },
        ]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const totalStudents = courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0);
  const totalRevenue = courses.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const publishedCourses = courses.filter(c => c.status === 'Published').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-violet-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 font-medium">Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Instructor Dashboard
          </h1>
          <p className="text-slate-500">
            Welcome back, <span className="font-medium text-slate-700">{user?.firstName || 'Instructor'}</span>. Here's your overview.
          </p>
        </div>
        <Link
          to="/course/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-violet-500/20 transition-all duration-200 hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total Courses</span>
            <div className="p-2 rounded-lg bg-violet-50">
              <BookOpen className="h-5 w-5 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{courses.length}</p>
          <p className="text-xs text-slate-400 mt-1">{publishedCourses} published</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total Students</span>
            <div className="p-2 rounded-lg bg-brand-50">
              <Users className="h-5 w-5 text-brand-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalStudents.toLocaleString()}</p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">↑ 12% this month</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">↑ 8% this month</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Avg. Rating</span>
            <div className="p-2 rounded-lg bg-amber-50">
              <BarChart3 className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {courses.filter(c => c.rating > 0).length > 0
              ? (courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.filter(c => c.rating > 0).length).toFixed(1)
              : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-1">out of 5.0</p>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Your Courses</h2>
          <span className="text-sm text-slate-400">{courses.length} total</span>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No courses yet</h3>
            <p className="text-slate-500 mb-6">Create your first course to start teaching!</p>
            <Link
              to="/course/create"
              className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.map((course, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900 truncate">{course.title}</h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        course.status === 'Published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {course.status || 'Published'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 truncate">{course.description}</p>
                </div>

                <div className="flex items-center gap-8 ml-6">
                  <div className="text-center hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{(course.enrolledCount || 0).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Students</p>
                  </div>
                  <div className="text-center hidden md:block">
                    <p className="text-sm font-semibold text-slate-900">
                      {course.rating > 0 ? `${course.rating} ★` : '—'}
                    </p>
                    <p className="text-xs text-slate-400">Rating</p>
                  </div>
                  <Link
                    to={`/course/${course.id}`}
                    className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
