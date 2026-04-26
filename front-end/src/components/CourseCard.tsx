import React from 'react';
import type { Course } from '../types';
import { Clock, Star, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link
      to={`/course/${course.courseId}`}
      className="group flex flex-col glass-card overflow-hidden animate-fade-in"
      style={{ textDecoration: 'none' }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
        {(course as any).thumbnailUrl ? (
          <img
            src={(course as any).thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'var(--accent-gradient)', opacity: 0.15 }}
          >
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(30,58,138,0.3) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="font-bold text-lg line-clamp-2 mb-2 transition-colors duration-300"
          style={{ color: 'var(--text-primary)' }}
        >
          <span className="group-hover:text-[var(--accent)] transition-colors duration-300">{course.title}</span>
        </h3>
        <p
          className="text-sm line-clamp-2 mb-4 flex-grow"
          style={{ color: 'var(--text-secondary)' }}
        >
          {course.description}
        </p>

        <div
          className="flex items-center text-xs gap-4 mt-auto pt-4"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)' }}
        >
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>1.2k</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>8h 30m</span>
          </div>
          <div className="flex items-center gap-1 ml-auto" style={{ color: 'var(--warning)' }}>
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">4.8</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
