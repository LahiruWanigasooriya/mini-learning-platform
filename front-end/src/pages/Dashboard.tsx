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
          <svg className="animate-spin h-8 w-8 text-brand-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-500 font-medium">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Welcome back, {user?.firstName || 'Student'} 👋
          </h1>
          <p className="text-slate-500">Here's your learning progress at a glance.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-brand-500/20 transition-all duration-200 hover:shadow-lg cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          Explore Courses
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Enrolled</span>
            <div className="p-2 rounded-lg bg-brand-50 group-hover:bg-brand-100 transition-colors">
              <BookOpen className="h-5 w-5 text-brand-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{enrollments.length}</p>
          <p className="text-xs text-slate-400 mt-1">{activeCourses.length} in progress</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Completed</span>
            <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
              <Award className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{completedCourses.length}</p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">
            {completedCourses.length > 0 ? '🎉 Great work!' : 'Keep going!'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Lessons Done</span>
            <div className="p-2 rounded-lg bg-violet-50 group-hover:bg-violet-100 transition-colors">
              <CheckCircle2 className="h-5 w-5 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalLessonsCompleted}</p>
          <p className="text-xs text-slate-400 mt-1">total lessons completed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-default group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Avg. Progress</span>
            <div className="p-2 rounded-lg bg-amber-50 group-hover:bg-amber-100 transition-colors">
              <BarChart3 className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{avgProgress}%</p>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-1000"
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'enrolled'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          My Courses ({enrollments.length})
        </button>
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeTab === 'browse'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Browse New ({browseCourses.length})
        </button>
      </div>

      {/* ========== ENROLLED TAB ========== */}
      {activeTab === 'enrolled' && (
        <div>
          {enrollments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">You aren't enrolled in any courses yet</h3>
              <p className="text-slate-500 mb-6">Explore our catalog and start learning today!</p>
              <Link
                to="/"
                className="inline-block bg-brand-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-brand-700 transition-colors cursor-pointer"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active courses first, then completed */}
              {[...activeCourses, ...completedCourses].map((enrollment) => (
                <Link
                  key={enrollment.enrollmentId}
                  to={`/course/${enrollment.courseId}`}
                  className="block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:border-brand-200 group cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Course thumbnail area */}
                    <div className="sm:w-56 aspect-video sm:aspect-auto bg-gradient-to-br from-slate-100 to-slate-200 relative flex-shrink-0 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 to-cyan-600/10 group-hover:from-brand-600/20 group-hover:to-cyan-600/20 transition-colors" />
                      <Layers className="h-10 w-10 text-slate-400 group-hover:text-brand-500 transition-colors relative z-10" />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                      {/* Status badge */}
                      {enrollment.status === 'COMPLETED' && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500 text-white text-xs font-bold">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </div>
                      )}
                    </div>

                    {/* Course info */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-1">
                            {enrollment.title}
                          </h3>
                          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-1 mb-3">{enrollment.description}</p>

                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                          {enrollment.category && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                              {enrollment.category}
                            </span>
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
                          <span className="font-semibold text-slate-700">{enrollment.progressPercentage}% Complete</span>
                          {enrollment.status === 'ACTIVE' && enrollment.progressPercentage > 0 && (
                            <span className="text-xs text-brand-600 font-medium flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              In Progress
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-1000 ${
                              enrollment.progressPercentage >= 100
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                                : enrollment.progressPercentage >= 50
                                  ? 'bg-gradient-to-r from-brand-600 to-cyan-500'
                                  : 'bg-gradient-to-r from-amber-500 to-amber-400'
                            }`}
                            style={{ width: `${enrollment.progressPercentage}%` }}
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
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm transition-all"
            />
          </div>

          {filteredBrowse.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <GraduationCap className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {searchTerm ? 'No courses found' : "You've explored everything!"}
              </h3>
              <p className="text-slate-500">
                {searchTerm ? 'Try a different search term.' : 'Check back later for new courses.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBrowse.map((course: any) => {
                const cid = course.courseId || course.id;
                const lessonCount = (course.modules || []).reduce(
                  (sum: number, m: any) => sum + (m.lessons?.length || 0), 0
                );
                return (
                  <Link
                    key={cid}
                    to={`/course/${cid}`}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:border-brand-200 hover:-translate-y-1 group cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/5 to-cyan-600/5 group-hover:from-brand-600/15 group-hover:to-cyan-600/15 transition-colors" />
                      <BookOpen className="h-10 w-10 text-slate-300 group-hover:text-brand-400 transition-colors relative z-10" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                        <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        {course.category && (
                          <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                            {course.category}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors mb-1 line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{course.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5" />
                          {lessonCount} lessons
                        </span>
                        <span className="text-sm font-semibold text-brand-600 flex items-center gap-1 group-hover:gap-2 transition-all cursor-pointer">
                          Enroll
                          <ChevronRight className="h-4 w-4" />
                        </span>
                      </div>

                      {/* Tags */}
                      {(course.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {(course.tags as string[]).slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
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
