import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/services';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { Search, Sparkles, TrendingUp, Award } from 'lucide-react';

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch courses from catalog service
    getCourses()
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => {
        console.error('Error fetching courses', err);
        // Fallback dummy data for visual testing if backend is down
        setCourses([
          { courseId: '1', title: 'Complete Web Development Bootcamp', description: 'Learn full-stack development from scratch with React, Node.js, and MongoDB.', instructorId: '1', category: 'Web Development', tags: ['react', 'node'], active: true, modules: [] },
          { courseId: '2', title: 'Advanced Machine Learning', description: 'Deep dive into neural networks, PyTorch, and AI model deployment strategies.', instructorId: '2', category: 'Data Science', tags: ['python', 'ml'], active: true, modules: [] },
          { courseId: '3', title: 'UI/UX Design Masterclass', description: 'Master Figma, prototyping, and modern design principles for beautiful interfaces.', instructorId: '3', category: 'UI/UX Design', tags: ['figma', 'design'], active: true, modules: [] },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Hero Section */}
      <section
        className="relative rounded-3xl p-8 md:p-16 text-center overflow-hidden"
        style={{
          background: 'var(--accent-gradient)',
          boxShadow: '0 20px 60px rgba(30,58,138,0.2)',
        }}
      >
        {/* Decorative floating shapes */}
        <div className="absolute top-6 left-8 w-16 h-16 rounded-full animate-float" style={{ background: 'rgba(255,255,255,0.08)', filter: 'blur(1px)' }} />
        <div className="absolute bottom-10 right-12 w-24 h-24 rounded-full animate-float" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: '-2s', filter: 'blur(2px)' }} />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full animate-float" style={{ background: 'rgba(255,255,255,0.06)', animationDelay: '-4s' }} />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Sparkles className="h-4 w-4" />
            Trusted by 10,000+ learners
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Advance Your Career with{' '}
            <span style={{ color: '#93c5fd' }}>MiniLMS</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Learn from industry experts. Build the skills you need for the jobs of tomorrow. Start your journey today.
          </p>

          {/* Search bar */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-32 py-4 rounded-2xl text-sm outline-none transition-all"
              placeholder="What do you want to learn?"
              style={{
                background: 'var(--bg-glass-strong)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'var(--text-primary)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              }}
            />
            <button
              className="absolute inset-y-2 right-2 px-6 rounded-xl font-semibold text-sm transition-all duration-200 text-white"
              style={{ background: 'var(--accent-gradient)' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
        {[
          { icon: <Sparkles className="h-5 w-5" />, value: '100+', label: 'Courses' },
          { icon: <TrendingUp className="h-5 w-5" />, value: '10K+', label: 'Students' },
          { icon: <Award className="h-5 w-5" />, value: '95%', label: 'Satisfaction' },
          { icon: <Search className="h-5 w-5" />, value: '24/7', label: 'Support' },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card flex items-center gap-3 p-4 animate-fade-in"
            style={{ cursor: 'default' }}
          >
            <div className="p-2 rounded-lg" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              {stat.icon}
            </div>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Course List Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Recommended for You</h2>
          <button
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: 'var(--accent)' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            View all courses &rarr;
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-card p-4 flex flex-col" style={{ cursor: 'default' }}>
                <div className="animate-shimmer w-full aspect-video rounded-lg mb-4" />
                <div className="animate-shimmer h-6 w-3/4 rounded mb-2" />
                <div className="animate-shimmer h-4 w-full rounded mb-1" />
                <div className="animate-shimmer h-4 w-5/6 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {courses.map(course => (
              <CourseCard key={course.courseId} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
