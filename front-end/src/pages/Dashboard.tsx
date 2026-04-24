import React, { useEffect, useState } from 'react';
import { getUserEnrollments } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      getUserEnrollments(user.id)
        .then(res => setEnrollments(res.data))
        .catch(err => {
          console.error(err);
          // Mock data
          setEnrollments([
            { id: '1', course: { id: '1', title: 'Complete Web Development Bootcamp' }, progressPercentage: 45 },
            { id: '2', course: { id: '3', title: 'UI/UX Design Masterclass' }, progressPercentage: 12 },
          ]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your learning dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Learning</h1>
        <p className="text-slate-600">Pick up where you left off</p>
      </div>

      {enrollments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">You aren't enrolled in any courses yet</h3>
          <p className="text-slate-500 mb-6">Explore our catalog and start learning today!</p>
          <Link to="/" className="inline-block bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors">
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment, index) => (
            <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video bg-slate-100 relative group">
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-slate-900 mb-4 line-clamp-2">
                  {enrollment.course.title}
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">{enrollment.progressPercentage}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-brand-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${enrollment.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                <button className="mt-6 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium transition-colors">
                  Continue Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
