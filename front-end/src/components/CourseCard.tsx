import React from 'react';
import type { Course } from '../types';
import { Clock, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="group flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-video bg-slate-100 overflow-hidden">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-500">
            <span className="font-semibold text-lg">Course Image</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-slate-900 line-clamp-2 mb-2 group-hover:text-brand-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">
          {course.description}
        </p>
        
        <div className="flex items-center text-xs text-slate-500 gap-4 mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>1.2k</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>8h 30m</span>
          </div>
          <div className="flex items-center gap-1 ml-auto text-amber-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">4.8</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
