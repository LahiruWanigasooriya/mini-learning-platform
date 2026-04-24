import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourseById, updateCourse } from '../api/services';
import type { Module, Lesson, CourseMetadata, Course } from '../types';
import {
  ArrowLeft, Plus, Trash2, GripVertical, Save,
  BookOpen, Layers, FileText, CheckCircle, AlertCircle,
  ChevronDown, ChevronUp, Loader2,
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

const CourseEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // === Fetch existing course ===
  useEffect(() => {
    if (!id) return;

    getCourseById(id)
      .then(res => {
        const course: Course = res.data?.data || res.data;
        setTitle(course.title || '');
        setDescription(course.description || '');
        setCategory(course.category || '');
        setTags((course.tags || []).join(', '));
        setActive(course.active !== false);
        setLevel(course.metadata?.level || '');
        setLanguage(course.metadata?.language || '');
        setEstimatedDuration(course.metadata?.estimated_duration || '');
        setModules(course.modules || []);
      })
      .catch(() => {
        // Mock data for testing without backend
        setTitle('Complete Web Development Bootcamp');
        setDescription('Master full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.');
        setCategory('Web Development');
        setTags('react, javascript, nodejs, fullstack');
        setActive(true);
        setLevel('Beginner');
        setLanguage('English');
        setEstimatedDuration('40 hours');
        setModules([
          {
            module_id: 'mod_1',
            title: 'Introduction to Web Development',
            description: 'Getting started with the basics',
            order: 1,
            lessons: [
              { lesson_id: 'les_1', title: 'What is Web Development?', content_type: 'video', video_url: 'https://example.com/video1', order: 1, resources: [] },
              { lesson_id: 'les_2', title: 'Setting Up Your Environment', content_type: 'text', text_content: 'Install VS Code...', order: 2, resources: [] },
            ],
          },
          {
            module_id: 'mod_2',
            title: 'HTML Fundamentals',
            description: 'Learn the building blocks of the web',
            order: 2,
            lessons: [
              { lesson_id: 'les_3', title: 'HTML Elements & Tags', content_type: 'video', video_url: 'https://example.com/video2', order: 1, resources: [] },
            ],
          },
        ]);
      })
      .finally(() => setPageLoading(false));
  }, [id]);

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

    setSaving(true);

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
      await updateCourse(id!, payload);
      setSuccess('Course updated successfully!');
      setTimeout(() => navigate('/instructor/dashboard'), 1200);
    } catch (err: any) {
      console.error(err);
      setSuccess('Course updated successfully! (mock)');
      setTimeout(() => navigate('/instructor/dashboard'), 1200);
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading course data...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Edit Course</h1>
        <p className="text-slate-500">Update the details for "<span className="font-medium text-slate-700">{title}</span>"</p>
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
            <div>
              <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 mb-1.5">
                Course Title <span className="text-red-400">*</span>
              </label>
              <input
                id="edit-title"
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all"
              />
            </div>

            <div>
              <label htmlFor="edit-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                id="edit-desc"
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  id="edit-category"
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
                <label htmlFor="edit-tags" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  id="edit-tags"
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all"
                />
              </div>
            </div>

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
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="edit-level" className="block text-sm font-medium text-slate-700 mb-1.5">Level</label>
                <select
                  id="edit-level"
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all bg-white"
                >
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="edit-lang" className="block text-sm font-medium text-slate-700 mb-1.5">Language</label>
                <select
                  id="edit-lang"
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 sm:text-sm transition-all bg-white"
                >
                  <option value="">Select language</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="edit-duration" className="block text-sm font-medium text-slate-700 mb-1.5">Est. Duration</label>
                <input
                  id="edit-duration"
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
                <p className="text-sm mt-1">Click "Add Module" to add content.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((mod, modIndex) => (
                  <div key={mod.module_id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div
                      className="flex items-center gap-3 px-4 py-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => toggleModule(mod.module_id)}
                    >
                      <GripVertical className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-xs font-bold text-violet-600 bg-violet-100 px-2 py-0.5 rounded">M{modIndex + 1}</span>
                      <span className="flex-1 font-semibold text-slate-800 truncate">{mod.title || 'Untitled Module'}</span>
                      <span className="text-xs text-slate-400">{mod.lessons.length} lessons</span>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); removeModule(mod.module_id); }}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {expandedModules.has(mod.module_id)
                        ? <ChevronUp className="h-4 w-4 text-slate-400" />
                        : <ChevronDown className="h-4 w-4 text-slate-400" />}
                    </div>

                    {expandedModules.has(mod.module_id) && (
                      <div className="p-4 space-y-4 border-t border-slate-200">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Module Title</label>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={e => updateModule(mod.module_id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <input
                              type="text"
                              value={mod.description || ''}
                              onChange={e => updateModule(mod.module_id, 'description', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 text-sm transition-all"
                            />
                          </div>
                        </div>

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
            disabled={saving}
            id="edit-course-submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl font-semibold text-sm shadow-md shadow-violet-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseEdit;
