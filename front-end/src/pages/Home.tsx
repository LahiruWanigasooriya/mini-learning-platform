import React, { useEffect, useState } from 'react';
import { getCourses } from '../api/services';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';
import { Search } from 'lucide-react';

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
          { id: '1', title: 'Complete Web Development Bootcamp', description: 'Learn full-stack development from scratch with React, Node.js, and MongoDB.', instructorId: 1, price: 49.99 },
          { id: '2', title: 'Advanced Machine Learning', description: 'Deep dive into neural networks, PyTorch, and AI model deployment strategies.', instructorId: 2, price: 89.99 },
          { id: '3', title: 'UI/UX Design Masterclass', description: 'Master Figma, prototyping, and modern design principles for beautiful interfaces.', instructorId: 3, price: 39.99 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-900 to-brand-700 rounded-3xl p-8 md:p-16 text-white text-center shadow-xl">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Advance Your Career with <span className="text-brand-200">MiniLMS</span>
        </h1>
        <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto mb-10">
          Learn from industry experts. Build the skills you need for the jobs of tomorrow. Start your journey today.
        </p>
        
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-full border-0 text-slate-900 shadow-lg ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-brand-500 outline-none transition-all"
            placeholder="What do you want to learn?"
          />
          <button className="absolute inset-y-2 right-2 bg-brand-600 hover:bg-brand-500 text-white px-6 rounded-full font-medium transition-colors">
            Search
          </button>
        </div>
      </section>

      {/* Course List Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recommended for You</h2>
          <button className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
            View all courses &rarr;
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl aspect-[3/4] animate-pulse border border-slate-200 p-4 flex flex-col">
                <div className="bg-slate-200 w-full aspect-video rounded-lg mb-4"></div>
                <div className="bg-slate-200 h-6 w-3/4 rounded mb-2"></div>
                <div className="bg-slate-200 h-4 w-full rounded mb-1"></div>
                <div className="bg-slate-200 h-4 w-5/6 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
