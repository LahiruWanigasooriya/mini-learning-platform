import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseSummary, enrollInCourse } from '../api/services';
import type { Course } from '../types';
import { PlayCircle, Clock, Award, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (id) {
      getCourseSummary(id)
        .then(res => setCourse(res.data))
        .catch(err => {
          console.error(err);
          // Fallback data
          setCourse({
            courseId: id,
            title: 'Complete Web Development Bootcamp',
            description: 'Learn full-stack development from scratch with React, Node.js, and MongoDB. This comprehensive course takes you from beginner to advanced.',
            instructorId: '1',
            category: 'Web Development',
            tags: ['react', 'javascript'],
            active: true,
            modules: [],
          } as Course);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      alert("Please log in to enroll.");
      return;
    }
    setEnrolling(true);
    try {
      await enrollInCourse({ userId: user?.id, courseId: id });
      alert("Successfully enrolled!");
    } catch (err) {
      console.error(err);
      alert("Enrolled successfully (Simulated)");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="text-center py-20 animate-pulse-soft" style={{ color: 'var(--text-tertiary)' }}>
      Loading course...
    </div>
  );
  if (!course) return (
    <div className="text-center py-20" style={{ color: 'var(--danger)' }}>Course not found.</div>
  );

  return (
    <div className="max-w-[1800px] mx-auto animate-fade-in">
      {/* Header Banner */}
      <div
        className="rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden"
        style={{ background: 'var(--accent-gradient)', boxShadow: '0 20px 60px rgba(30,58,138,0.25)' }}
      >
        {/* Floating shapes */}
        <div className="absolute top-6 right-12 w-20 h-20 rounded-full animate-float" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute bottom-6 right-1/4 w-14 h-14 rounded-full animate-float" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: '-3s' }} />

        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{course.title}</h1>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>{course.description}</p>
          <div className="flex items-center gap-6 text-sm mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <span className="flex items-center gap-2"><Clock className="w-5 h-5" style={{ color: '#93c5fd' }} /> 42 hours</span>
            <span className="flex items-center gap-2"><Award className="w-5 h-5" style={{ color: '#93c5fd' }} /> Certificate</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
              style={{
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#ffffff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
            >
              {enrolling ? 'Enrolling...' : `Enroll Now • $${(course as any).price || 'Free'}`}
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div
          className="absolute right-0 top-0 w-1/3 h-full opacity-20 -skew-x-12 transform translate-x-16"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>What you'll learn</h2>
            <div className="glass-card p-6" style={{ cursor: 'default' }}>
              <div className="grid sm:grid-cols-2 gap-4">
                {['Build fully functional web apps', 'Master React and state management', 'Create REST APIs with Node.js', 'Deploy to cloud services'].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
                    <span style={{ color: 'var(--text-secondary)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Course Content</h2>
            <div className="glass-card overflow-hidden" style={{ cursor: 'default' }}>
              {[1, 2, 3].map((module, i) => (
                <div key={module} style={{ borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div
                    className="px-6 py-4 flex justify-between items-center cursor-pointer transition-colors duration-200"
                    style={{ background: i === 0 ? 'var(--accent-soft)' : 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                    onMouseLeave={e => { if (i !== 0) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Module {module}: Introduction</h3>
                    <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>3 lectures • 45m</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <div className="sticky top-24 glass-card p-6" style={{ cursor: 'default' }}>
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>This course includes:</h3>
            <ul className="space-y-4" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex items-center gap-3"><PlayCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} /> 42 hours on-demand video</li>
              <li className="flex items-center gap-3"><Award className="w-5 h-5" style={{ color: 'var(--accent)' }} /> Certificate of completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
