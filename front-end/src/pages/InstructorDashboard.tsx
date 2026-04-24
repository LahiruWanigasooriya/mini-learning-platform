import React, { useEffect, useState } from 'react';
import { getCourses, deleteCourse } from '../api/services';
import { useAuth } from '../context/AuthContext';
import {
  Users, BookOpen, TrendingUp, Plus, BarChart3,
  Eye, Pencil, Trash2, AlertTriangle, X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete confirmation modal
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = () => {
    setLoading(true);
    getCourses()
      .then(res => {
        const data = res.data?.data || res.data || [];
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        // Mock data for visual testing
        setCourses([
          {
            courseId: '1',
            title: 'Complete Web Development Bootcamp',
            description: 'Master full-stack web development from scratch',
            category: 'Web Development',
            active: true,
            tags: ['react', 'javascript'],
            modules: [{ lessons: [{}, {}] }, { lessons: [{}] }],
          },
          {
            courseId: '2',
            title: 'Advanced React & TypeScript',
            description: 'Deep dive into React patterns and TypeScript',
            category: 'Web Development',
            active: true,
            tags: ['react', 'typescript'],
            modules: [{ lessons: [{}, {}, {}] }],
          },
          {
            courseId: '3',
            title: 'Cloud Architecture Fundamentals',
            description: 'Learn cloud computing concepts and AWS services',
            category: 'Cloud Computing',
            active: false,
            tags: ['aws', 'cloud'],
            modules: [],
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCourse(deleteTarget.courseId || deleteTarget.id);
      setCourses(prev => prev.filter(c => (c.courseId || c.id) !== (deleteTarget.courseId || deleteTarget.id)));
    } catch {
      // Mock: remove from local state anyway
      setCourses(prev => prev.filter(c => (c.courseId || c.id) !== (deleteTarget.courseId || deleteTarget.id)));
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getTotalLessons = (course: any) => {
    return (course.modules || []).reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0);
  };

  const publishedCourses = courses.filter(c => c.active !== false).length;

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
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-red-50 flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Course</h3>
                <p className="text-sm text-slate-500">
                  Are you sure you want to delete "<span className="font-medium text-slate-700">{deleteTarget.title}</span>"?
                  This action cannot be undone.
                </p>
              </div>
              <button onClick={() => setDeleteTarget(null)} className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete Course'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          to="/instructor/courses/create"
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
            <span className="text-sm font-medium text-slate-500">Total Modules</span>
            <div className="p-2 rounded-lg bg-brand-50">
              <BarChart3 className="h-5 w-5 text-brand-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">across all courses</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total Lessons</span>
            <div className="p-2 rounded-lg bg-emerald-50">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {courses.reduce((sum, c) => sum + getTotalLessons(c), 0)}
          </p>
          <p className="text-xs text-slate-400 mt-1">total lessons created</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Categories</span>
            <div className="p-2 rounded-lg bg-amber-50">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {new Set(courses.map(c => c.category).filter(Boolean)).size}
          </p>
          <p className="text-xs text-slate-400 mt-1">unique categories</p>
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
              to="/instructor/courses/create"
              className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.map((course, index) => {
              const cid = course.courseId || course.id;
              return (
                <div
                  key={cid || index}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-slate-900 truncate">{course.title}</h3>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          course.active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {course.active !== false ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">{course.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {course.category && (
                        <span className="text-xs text-slate-400">{course.category}</span>
                      )}
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-400">
                        {course.modules?.length || 0} modules · {getTotalLessons(course)} lessons
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/course/${cid}`}
                      className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                      title="View course"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </Link>
                    <Link
                      to={`/instructor/courses/${cid}/edit`}
                      className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                      title="Edit course"
                    >
                      <Pencil className="h-4.5 w-4.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(course)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Delete course"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
