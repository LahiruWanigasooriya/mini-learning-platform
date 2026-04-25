import React, { useEffect, useState } from 'react';
import { getUserEnrollments, getCourses, getCourseById } from '../api/services';
import { useAuth } from '../context/AuthContext';
import {
  PlayCircle, BookOpen, GraduationCap, Clock,
  TrendingUp, Award, ChevronRight, Search,
  Layers, CheckCircle2, BarChart3, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface EnrolledCourse {
  enrollmentId: string;
  courseId: string;
  title: string;
  description: string;
  category: string;
  status: string;         // ACTIVE | COMPLETED | CANCELLED
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
  enrolledAt: string;
  tags: string[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'enrolled' | 'browse'>('enrolled');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch enrollments
        if (user?.id) {
          const enrollRes = await getUserEnrollments(user.id);
          const enrollData = enrollRes.data?.data || enrollRes.data || [];

          // For each enrollment, try to get course details
          const enriched: EnrolledCourse[] = await Promise.all(
            enrollData.map(async (enrollment: any) => {
              let courseDetails: any = {};
              try {
                const courseRes = await getCourseById(enrollment.courseId);
                courseDetails = courseRes.data?.data || courseRes.data || {};
              } catch {
                // Course service might be down
              }
              const totalLessons = (courseDetails.modules || []).reduce(
                (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
              );
              return {
                enrollmentId: enrollment.id,
                courseId: enrollment.courseId,
                title: courseDetails.title || `Course ${enrollment.courseId}`,
                description: courseDetails.description || '',
                category: courseDetails.category || '',
                status: enrollment.status || 'ACTIVE',
                progressPercentage: enrollment.progressPercentage || 0,
                completedLessons: enrollment.completedLessons || 0,
                totalLessons: totalLessons || enrollment.totalLessons || 0,
                enrolledAt: enrollment.enrolledAt || '',
                tags: courseDetails.tags || [],
              };
            })
          );
          setEnrollments(enriched);
        }
      } catch {
        // Mock data for testing
        setEnrollments([
          {
            enrollmentId: '1', courseId: '1',
            title: 'Complete Web Development Bootcamp',
            description: 'Master full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js',
            category: 'Web Development', status: 'ACTIVE',
            progressPercentage: 68, completedLessons: 17, totalLessons: 25,
            enrolledAt: '2026-03-15', tags: ['react', 'javascript', 'nodejs'],
          },
          {
            enrollmentId: '2', courseId: '2',
            title: 'Advanced React & TypeScript',
            description: 'Deep dive into React patterns, hooks, and TypeScript best practices',
            category: 'Web Development', status: 'ACTIVE',
            progressPercentage: 32, completedLessons: 6, totalLessons: 19,
            enrolledAt: '2026-04-01', tags: ['react', 'typescript'],
          },
          {
            enrollmentId: '3', courseId: '3',
            title: 'Cloud Architecture Fundamentals',
            description: 'Learn cloud computing concepts and AWS services from zero to hero',
            category: 'Cloud Computing', status: 'COMPLETED',
            progressPercentage: 100, completedLessons: 12, totalLessons: 12,
            enrolledAt: '2026-01-20', tags: ['aws', 'cloud', 'devops'],
          },
        ]);
      }

      try {
        const coursesRes = await getCourses();
        setAllCourses(coursesRes.data?.data || coursesRes.data || []);
      } catch {
        setAllCourses([
          { courseId: '4', title: 'UI/UX Design Masterclass', description: 'Master Figma, prototyping, and modern design principles', category: 'UI/UX Design', tags: ['figma', 'design'], modules: [{ lessons: [{}, {}, {}] }] },
          { courseId: '5', title: 'Data Science with Python', description: 'Learn pandas, numpy, and machine learning fundamentals', category: 'Data Science', tags: ['python', 'ml'], modules: [{ lessons: [{}, {}, {}, {}] }, { lessons: [{}, {}] }] },
          { courseId: '6', title: 'DevOps & CI/CD Pipeline', description: 'Docker, Kubernetes, Jenkins, and GitHub Actions', category: 'DevOps', tags: ['docker', 'kubernetes'], modules: [{ lessons: [{}, {}] }] },
        ]);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  // Computed stats
  const activeCourses = enrollments.filter(e => e.status === 'ACTIVE');
  const completedCourses = enrollments.filter(e => e.status === 'COMPLETED');
  const totalLessonsCompleted = enrollments.reduce((sum, e) => sum + e.completedLessons, 0);
  const avgProgress = activeCourses.length > 0
    ? Math.round(activeCourses.reduce((sum, e) => sum + e.progressPercentage, 0) / activeCourses.length)
    : 0;

  // Filtered browse courses (exclude already enrolled)
  const enrolledIds = new Set(enrollments.map(e => e.courseId));
  const browseCourses = allCourses.filter(c => !enrolledIds.has(c.courseId || c.id));
  const filteredBrowse = browseCourses.filter(c =>
    c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin-slow h-8 w-8" style={{ color: 'var(--accent)' }} viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="font-medium" style={{ color: 'var(--text-tertiary)' }}>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.firstName || 'Student'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's your learning progress at a glance.</p>
        </div>
        <Link to="/" className="btn-primary">
          <Sparkles className="h-4 w-4" />
          Explore Courses
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          { label: 'Enrolled', value: enrollments.length, sub: `${activeCourses.length} in progress`, icon: <BookOpen className="h-5 w-5" />, color: 'var(--accent)', soft: 'var(--accent-soft)' },
          { label: 'Completed', value: completedCourses.length, sub: completedCourses.length > 0 ? '🎉 Great work!' : 'Keep going!', icon: <Award className="h-5 w-5" />, color: 'var(--success)', soft: 'var(--success-soft)' },
          { label: 'Lessons Done', value: totalLessonsCompleted, sub: 'total lessons completed', icon: <CheckCircle2 className="h-5 w-5" />, color: 'var(--violet)', soft: 'var(--violet-soft)' },
          { label: 'Avg. Progress', value: `${avgProgress}%`, sub: null, icon: <BarChart3 className="h-5 w-5" />, color: 'var(--warning)', soft: 'var(--warning-soft)', progress: avgProgress },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-5 animate-fade-in" style={{ cursor: 'default' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</span>
              <div className="p-2 rounded-lg transition-colors" style={{ background: stat.soft, color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
            {stat.sub && <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>{stat.sub}</p>}
            {stat.progress !== undefined && (
              <div className="mt-2 w-full rounded-full h-1.5 overflow-hidden" style={{ background: 'var(--border)' }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${stat.progress}%`, background: stat.color }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit glass" style={{ cursor: 'default' }}>
        <button
          onClick={() => setActiveTab('enrolled')}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          style={{
            background: activeTab === 'enrolled' ? 'var(--accent-gradient)' : 'transparent',
            color: activeTab === 'enrolled' ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: activeTab === 'enrolled' ? '0 2px 8px rgba(30,58,138,0.15)' : 'none',
          }}
        >
          My Courses ({enrollments.length})
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className="px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
          style={{
            background: activeTab === 'browse' ? 'var(--accent-gradient)' : 'transparent',
            color: activeTab === 'browse' ? '#ffffff' : 'var(--text-secondary)',
            boxShadow: activeTab === 'browse' ? '0 2px 8px rgba(30,58,138,0.15)' : 'none',
          }}
        >
          Browse New ({browseCourses.length})
        </button>
      </div>

      {/* ========== ENROLLED TAB ========== */}
      {activeTab === 'enrolled' && (
        <div>
          {enrollments.length === 0 ? (
            <div className="text-center py-16 glass-card" style={{ cursor: 'default' }}>
              <BookOpen className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--text-tertiary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>You aren't enrolled in any courses yet</h3>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Explore our catalog and start learning today!</p>
              <Link to="/" className="btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4 stagger-children">
              {/* Active courses first, then completed */}
              {[...activeCourses, ...completedCourses].map((enrollment) => (
                <Link
                  key={enrollment.enrollmentId}
                  to={`/course/${enrollment.courseId}`}
                  className="block glass-card overflow-hidden group cursor-pointer animate-fade-in"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Course thumbnail area */}
                    <div
                      className="sm:w-56 aspect-video sm:aspect-auto relative flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ background: 'var(--bg-tertiary)' }}
                    >
                      <div
                        className="absolute inset-0 transition-opacity duration-300 opacity-30 group-hover:opacity-50"
                        style={{ background: 'var(--accent-gradient)' }}
                      />
                      <Layers className="h-10 w-10 transition-colors relative z-10" style={{ color: 'var(--text-tertiary)' }} />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                      {/* Status badge */}
                      {enrollment.status === 'COMPLETED' && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold text-white" style={{ background: 'var(--success)' }}>
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </div>
                      )}
                    </div>

                    {/* Course info */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-lg transition-colors line-clamp-1" style={{ color: 'var(--text-primary)' }}>
                            {enrollment.title}
                          </h3>
                          <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" style={{ color: 'var(--text-tertiary)' }} />
                        </div>
                        <p className="text-sm line-clamp-1 mb-3" style={{ color: 'var(--text-secondary)' }}>{enrollment.description}</p>

                        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
                          {enrollment.category && (
                            <span className="badge badge-accent">{enrollment.category}</span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Layers className="h-3.5 w-3.5" />
                            {enrollment.totalLessons} lessons
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {enrollment.completedLessons}/{enrollment.totalLessons} done
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between items-center text-sm mb-1.5">
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{enrollment.progressPercentage}% Complete</span>
                          {enrollment.status === 'ACTIVE' && enrollment.progressPercentage > 0 && (
                            <span className="text-xs font-medium flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                              <TrendingUp className="h-3 w-3" />
                              In Progress
                            </span>
                          )}
                        </div>
                        <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: 'var(--border)' }}>
                          <div
                            className="h-2.5 rounded-full transition-all duration-1000"
                            style={{
                              width: `${enrollment.progressPercentage}%`,
                              background: enrollment.progressPercentage >= 100
                                ? 'var(--success)'
                                : enrollment.progressPercentage >= 50
                                  ? 'var(--accent-gradient)'
                                  : 'var(--warning)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========== BROWSE TAB ========== */}
      {activeTab === 'browse' && (
        <div>
          {/* Search bar */}
          <div className="relative mb-6 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="glass-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {filteredBrowse.length === 0 ? (
            <div className="text-center py-16 glass-card" style={{ cursor: 'default' }}>
              <GraduationCap className="mx-auto h-12 w-12 mb-4" style={{ color: 'var(--text-tertiary)' }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                {searchTerm ? 'No courses found' : "You've explored everything!"}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                {searchTerm ? 'Try a different search term.' : 'Check back later for new courses.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {filteredBrowse.map((course: any) => {
                const cid = course.courseId || course.id;
                const lessonCount = (course.modules || []).reduce(
                  (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
                );
                return (
                  <Link
                    key={cid}
                    to={`/course/${cid}`}
                    className="glass-card overflow-hidden hover:-translate-y-1 group cursor-pointer animate-fade-in"
                    style={{ textDecoration: 'none' }}
                  >
                    {/* Thumbnail */}
                    <div
                      className="aspect-video relative flex items-center justify-center overflow-hidden"
                      style={{ background: 'var(--bg-tertiary)' }}
                    >
                      <div
                        className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                        style={{ background: 'var(--accent-gradient)' }}
                      />
                      <BookOpen className="h-10 w-10 transition-colors relative z-10" style={{ color: 'var(--text-tertiary)' }} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {course.category && (
                          <span className="badge badge-accent text-xs">{course.category}</span>
                        )}
                      </div>
                      <h3 className="font-bold transition-colors mb-1 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                        {course.title}
                      </h3>
                      <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                          <Layers className="h-3.5 w-3.5" />
                          {lessonCount} lessons
                        </span>
                        <span className="text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer" style={{ color: 'var(--accent)' }}>
                          Enroll
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>

                      {/* Tags */}
                      {(course.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {(course.tags as string[]).slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ color: 'var(--text-tertiary)', background: 'var(--bg-tertiary)' }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
