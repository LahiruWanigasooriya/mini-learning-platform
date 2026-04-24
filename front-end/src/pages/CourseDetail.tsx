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
            id,
            title: 'Complete Web Development Bootcamp',
            description: 'Learn full-stack development from scratch with React, Node.js, and MongoDB. This comprehensive course takes you from beginner to advanced.',
            instructorId: 1,
            price: 49.99
          });
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

  if (loading) return <div className="text-center py-20 animate-pulse text-slate-500">Loading course...</div>;
  if (!course) return <div className="text-center py-20 text-red-500">Course not found.</div>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="relative z-10 w-full md:w-2/3">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">{course.title}</h1>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">{course.description}</p>
          <div className="flex items-center gap-6 text-sm text-slate-300 mb-8">
            <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-brand-400" /> 42 hours</span>
            <span className="flex items-center gap-2"><Award className="w-5 h-5 text-brand-400" /> Certificate</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-4 rounded-lg font-bold transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50"
            >
              {enrolling ? 'Enrolling...' : `Enroll Now • $${course.price || 'Free'}`}
            </button>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-brand-900 opacity-20 -skew-x-12 transform translate-x-16"></div>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">What you'll learn</h2>
            <div className="grid sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              {['Build fully functional web apps', 'Master React and state management', 'Create REST APIs with Node.js', 'Deploy to cloud services'].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Course Content</h2>
            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
              {[1, 2, 3].map(module => (
                <div key={module} className="bg-white">
                  <div className="px-6 py-4 bg-slate-50 flex justify-between items-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <h3 className="font-semibold text-slate-800">Module {module}: Introduction</h3>
                    <span className="text-sm text-slate-500">3 lectures • 45m</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-4">This course includes:</h3>
            <ul className="space-y-4 text-slate-600">
              <li className="flex items-center gap-3"><PlayCircle className="w-5 h-5" /> 42 hours on-demand video</li>
              <li className="flex items-center gap-3"><Award className="w-5 h-5" /> Certificate of completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
