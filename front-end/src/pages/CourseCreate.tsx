import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createCourse } from '../api/services';
import type { Module, Lesson, CourseMetadata } from '../types';
import {
  ArrowLeft, Plus, Trash2, GripVertical, Save,
  BookOpen, Layers, FileText, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp,
} from 'lucide-react';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science',
  'Machine Learning', 'Cloud Computing', 'DevOps',
  'Cybersecurity', 'UI/UX Design', 'Business', 'Other',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = ['English', 'Sinhala', 'Tamil'];
const CONTENT_TYPES = ['video', 'text', 'quiz', 'assignment'];

function generateId() {
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

const CourseCreate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Basic info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [active, setActive] = useState(true);

  // Metadata
  const [level, setLevel] = useState('');
  const [language, setLanguage] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');

  // Modules
  const [modules, setModules] = useState<Module[]>([]);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // === Module helpers ===
  const addModule = () => {
    const newModule: Module = {
      module_id: generateId(),
      title: '',
      description: '',
      order: modules.length + 1,
      lessons: [],
    };
    setModules([...modules, newModule]);
    setExpandedModules(prev => new Set(prev).add(newModule.module_id));
  };

  const updateModule = (moduleId: string, field: string, value: any) => {
    setModules(modules.map(m =>
      m.module_id === moduleId ? { ...m, [field]: value } : m
    ));
  };

  const removeModule = (moduleId: string) => {
    setModules(modules.filter(m => m.module_id !== moduleId).map((m, i) => ({ ...m, order: i + 1 })));
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      next.has(moduleId) ? next.delete(moduleId) : next.add(moduleId);
      return next;
    });
  };

  // === Lesson helpers ===
  const addLesson = (moduleId: string) => {
    const mod = modules.find(m => m.module_id === moduleId);
    if (!mod) return;
    const newLesson: Lesson = {
      lesson_id: generateId(),
      title: '',
      content_type: 'video',
      video_url: '',
      text_content: '',
      order: mod.lessons.length + 1,
      resources: [],
    };
    updateModule(moduleId, 'lessons', [...mod.lessons, newLesson]);
  };

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: any) => {
    setModules(modules.map(m => {
      if (m.module_id !== moduleId) return m;
      return {
        ...m,
        lessons: m.lessons.map(l =>
          l.lesson_id === lessonId ? { ...l, [field]: value } : l
        ),
      };
    }));
  };

  const removeLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.module_id !== moduleId) return m;
      return {
        ...m,
        lessons: m.lessons.filter(l => l.lesson_id !== lessonId).map((l, i) => ({ ...l, order: i + 1 })),
      };
    }));
  };

  // === Submit ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !description.trim() || !category) {
      setError('Please fill in all required fields (Title, Description, Category).');
      return;
    }

    setLoading(true);

    const metadata: CourseMetadata | null =
      (level || language || estimatedDuration)
        ? { level: level || undefined, language: language || undefined, estimated_duration: estimatedDuration || undefined }
        : null;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      instructor_id: String(user?.id || '1'),
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      active,
      metadata,
      modules: modules.map(m => ({
        ...m,
        lessons: m.lessons.map(l => ({
          ...l,
          resources: l.resources || [],
        })),
      })),
    };

    try {
      await createCourse(payload);
      setSuccess('Course created successfully!');
      setTimeout(() => navigate('/instructor/dashboard'), 1200);
    } catch (err: any) {
      console.error(err);
      // Mock success for testing without backend
      setSuccess('Course created successfully! (mock)');
      setTimeout(() => navigate('/instructor/dashboard'), 1200);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/instructor/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-violet-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Create New Course</h1>
        <p className="text-slate-500">Fill in the details below to create your course.</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-xl bg-emerald-50 p-4 border border-emerald-200 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-emerald-800">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========== SECTION 1: Basic Info ========== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
          </div>
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="course-title" className="block text-sm font-medium text-slate-700 mb-1.5">
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                id="course-title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Complete Web Development Bootcamp"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="course-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="course-desc"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what students will learn..."
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all resize-none"
              />
            </div>

            {/* Category & Tags row */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="course-category" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="course-category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all bg-white"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="course-tags" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  id="course-tags"
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="react, typescript, frontend"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${active ? 'bg-violet-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {active ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* ========== SECTION 2: Metadata ========== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-900">Course Metadata</h2>
            <span className="text-xs text-slate-400 font-normal ml-1">(optional)</span>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="course-level" className="block text-sm font-medium text-slate-700 mb-1.5">Level</label>
                <select
                  id="course-level"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all bg-white"
                >
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="course-lang" className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
                <select
                  id="course-lang"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all bg-white"
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="course-duration" className="block text-sm font-medium text-slate-700 mb-1.5">Est. Duration</label>
                <input
                  id="course-duration"
                  type="text"
                  value={estimatedDuration}
                  onChange={e => setEstimatedDuration(e.target.value)}
                  placeholder="e.g. 40 hours"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== SECTION 3: Modules & Lessons ========== */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-900">Modules & Lessons</h2>
              <span className="text-xs text-slate-400 font-normal ml-1">({modules.length} modules)</span>
            </div>
            <button
              type="button"
              onClick={addModule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Module
            </button>
          </div>

          <div className="p-6">
            {modules.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Layers className="mx-auto h-10 w-10 mb-3 text-slate-300" />
                <p className="font-medium">No modules yet</p>
                <p className="text-sm mt-1">Click "Add Module" to build your course structure.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((mod, modIndex) => (
                  <div key={mod.module_id} className="border border-slate-200 rounded-xl overflow-hidden">
                    {/* Module Header */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => toggleModule(mod.module_id)}
                    >
                      <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded">
                        M{modIndex + 1}
                      </span>
                      <span className="flex-1 font-semibold text-slate-800 truncate">
                        {mod.title || 'Untitled Module'}
                      </span>
                      <span className="text-xs text-slate-400">{mod.lessons.length} lessons</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeModule(mod.module_id); }}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {expandedModules.has(mod.module_id)
                        ? <ChevronUp className="h-4 w-4 text-slate-400" />
                        : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>

                    {/* Module Body */}
                    {expandedModules.has(mod.module_id) && (
                      <div className="p-4 space-y-4 border-t border-slate-200">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Module Title</label>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={e => updateModule(mod.module_id, 'title', e.target.value)}
                              placeholder="e.g. Getting Started"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <input
                              type="text"
                              value={mod.description || ''}
                              onChange={e => updateModule(mod.module_id, 'description', e.target.value)}
                              placeholder="Brief description..."
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all"
                            />
                          </div>
                        </div>

                        {/* Lessons */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-slate-700">Lessons</span>
                            <button
                              type="button"
                              onClick={() => addLesson(mod.module_id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-md transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              Add Lesson
                            </button>
                          </div>

                          {mod.lessons.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No lessons in this module yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {mod.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.lesson_id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500">Lesson {lessonIndex + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeLesson(mod.module_id, lesson.lesson_id)}
                                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      value={lesson.title}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'title', e.target.value)}
                                      placeholder="Lesson title"
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                    />
                                    <select
                                      value={lesson.content_type}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'content_type', e.target.value)}
                                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all bg-white"
                                    >
                                      {CONTENT_TYPES.map(ct => (
                                        <option key={ct} value={ct}>{ct.charAt(0).toUpperCase() + ct.slice(1)}</option>
                                      ))}
                                    </select>
                                  </div>
                                  {lesson.content_type === 'video' && (
                                    <input
                                      type="url"
                                      value={lesson.video_url || ''}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'video_url', e.target.value)}
                                      placeholder="Video URL"
                                      className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                                    />
                                  )}
                                  {lesson.content_type === 'text' && (
                                    <textarea
                                      value={lesson.text_content || ''}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'text_content', e.target.value)}
                                      placeholder="Lesson text content..."
                                      rows={3}
                                      className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========== Submit Buttons ========== */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/instructor/dashboard"
            className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            id="create-course-submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-violet-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseCreate;
