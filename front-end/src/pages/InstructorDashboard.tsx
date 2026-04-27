import React, { useEffect, useState } from 'react';
import { getCourses, deleteCourse } from '../api/services';
import { useAuth } from '../context/AuthContext';
import {
  Users, BookOpen, TrendingUp, Plus, BarChart3,
  Eye, Pencil, Trash2, AlertTriangle, X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();

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
      toast.success('Course deleted successfully');
    } catch {
      // Mock: remove from local state anyway
      setCourses(prev => prev.filter(c => (c.courseId || c.id) !== (deleteTarget.courseId || deleteTarget.id)));
      toast.info('Course removed (Demo Mode)');
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
          <svg className="animate-spin-slow h-8 w-8" style={{ color: 'var(--violet)' }} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="font-medium" style={{ color: 'var(--text-tertiary)' }}>Loading instructor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card max-w-md w-full mx-4 p-6 animate-scale-in" style={{ cursor: 'default' }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full flex-shrink-0" style={{ background: 'var(--danger-soft)' }}>
                <AlertTriangle className="h-6 w-6" style={{ color: 'var(--danger)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Delete Course</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Are you sure you want to delete "<span className="font-medium" style={{ color: 'var(--text-primary)' }}>{deleteTarget.title}</span>"?
                  This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setDeleteTarget(null)}
                className="p-1 transition-colors"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-xl font-semibold text-sm text-white transition-colors disabled:opacity-60"
                style={{ background: 'var(--danger)' }}
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
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Instructor Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user?.firstName || 'Instructor'}</span>. Here's your overview.
          </p>
        </div>
        <Link to="/instructor/courses/create" className="btn-violet">
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
        {[
          { label: 'Total Courses', value: courses.length, sub: `${publishedCourses} published`, icon: <BookOpen className="h-5 w-5" />, color: 'var(--violet)', soft: 'var(--violet-soft)' },
          { label: 'Total Modules', value: courses.reduce((sum, c) => sum + (c.modules?.length || 0), 0), sub: 'across all courses', icon: <BarChart3 className="h-5 w-5" />, color: 'var(--accent)', soft: 'var(--accent-soft)' },
          { label: 'Total Lessons', value: courses.reduce((sum, c) => sum + getTotalLessons(c), 0), sub: 'total lessons created', icon: <TrendingUp className="h-5 w-5" />, color: 'var(--success)', soft: 'var(--success-soft)' },
          { label: 'Categories', value: new Set(courses.map(c => c.category).filter(Boolean)).size, sub: 'unique categories', icon: <Users className="h-5 w-5" />, color: 'var(--warning)', soft: 'var(--warning-soft)' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 animate-fade-in" style={{ cursor: 'default' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
              <div className="p-2 rounded-lg" style={{ background: stat.soft, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Courses Table */}
      <div className="glass-card overflow-hidden" style={{ cursor: 'default' }}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Your Courses</h2>
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{courses.length} total</span>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>No courses yet</h3>
            <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Create your first course to start teaching!</p>
            <Link to="/instructor/courses/create" className="btn-violet">
              <Plus className="h-4 w-4" />
              Create Course
            </Link>
          </div>
        ) : (
          <div>
            {courses.map((course, index) => {
              const cid = course.courseId || course.id;
              return (
                <div
                  key={cid || index}
                  className="px-6 py-4 flex items-center justify-between transition-colors group"
                  style={{ borderBottom: index < courses.length - 1 ? '1px solid var(--border)' : 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{course.title}</h3>
                      <span className={`badge ${course.active !== false ? 'badge-success' : 'badge-warning'}`}>
                        {course.active !== false ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <p className="text-sm mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {course.category && (
                        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{course.category}</span>
                      )}
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>•</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {course.modules?.length || 0} modules · {getTotalLessons(course)} lessons
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/course/${cid}`}
                      className="p-2 rounded-lg transition-all"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                      title="View course"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </Link>
                    <Link
                      to={`/instructor/courses/${cid}/edit`}
                      className="p-2 rounded-lg transition-all"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--violet)'; e.currentTarget.style.background = 'var(--violet-soft)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                      title="Edit course"
                    >
                      <Pencil className="h-4.5 w-4.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(course)}
                      className="p-2 rounded-lg transition-all"
                      style={{ color: 'var(--text-tertiary)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.background = 'var(--danger-soft)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
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
