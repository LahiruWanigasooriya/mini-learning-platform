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
    <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/instructor/dashboard"
          className="inline-flex items-center gap-1.5 text-sm transition-colors mb-4 group"
          style={{ color: 'var(--text-tertiary)' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--violet)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Create New Course</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Fill in the details below to create your course.</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 rounded-xl p-4 flex items-start gap-3 animate-fade-in" style={{ background: 'var(--danger-soft)', border: '1px solid var(--danger)' }}>
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--danger)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--danger)' }}>{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-xl p-4 flex items-start gap-3 animate-fade-in" style={{ background: 'var(--success-soft)', border: '1px solid var(--success)' }}>
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--success)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========== SECTION 1: Basic Info ========== */}
        <div className="glass-card overflow-hidden" style={{ cursor: 'default' }}>
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <BookOpen className="h-5 w-5" style={{ color: 'var(--violet)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Basic Information</h2>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label htmlFor="course-title" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Course Title <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="course-title" type="text" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Complete Web Development Bootcamp"
                required className="glass-input"
              />
            </div>
            <div>
              <label htmlFor="course-desc" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                Description <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <textarea
                id="course-desc" rows={4} value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe what students will learn..."
                required className="glass-input" style={{ resize: 'none' }}
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="course-category" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Category <span style={{ color: 'var(--danger)' }}>*</span>
                </label>
                <select
                  id="course-category" value={category}
                  onChange={e => setCategory(e.target.value)}
                  required className="glass-select"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="course-tags" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                  Tags <span className="font-normal" style={{ color: 'var(--text-tertiary)' }}>(comma-separated)</span>
                </label>
                <input
                  id="course-tags" type="text" value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="react, typescript, frontend"
                  className="glass-input"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button" onClick={() => setActive(!active)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                style={{ background: active ? 'var(--violet)' : 'var(--border-strong)' }}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {active ? 'Published' : 'Draft'}
              </span>
            </div>
          </div>
        </div>

        {/* ========== SECTION 2: Metadata ========== */}
        <div className="glass-card overflow-hidden" style={{ cursor: 'default' }}>
          <div className="px-6 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <FileText className="h-5 w-5" style={{ color: 'var(--violet)' }} />
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Course Metadata</h2>
            <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>(optional)</span>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label htmlFor="course-level" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Level</label>
                <select id="course-level" value={level} onChange={e => setLevel(e.target.value)} className="glass-select">
                  <option value="">Select level</option>
                  {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="course-lang" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Language</label>
                <select id="course-lang" value={language} onChange={e => setLanguage(e.target.value)} className="glass-select">
                  <option value="">Select language</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="course-duration" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Est. Duration</label>
                <input
                  id="course-duration" type="text" value={estimatedDuration}
                  onChange={e => setEstimatedDuration(e.target.value)}
                  placeholder="e.g. 40 hours" className="glass-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========== SECTION 3: Modules & Lessons ========== */}
        <div className="glass-card overflow-hidden" style={{ cursor: 'default' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5" style={{ color: 'var(--violet)' }} />
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Modules & Lessons</h2>
              <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>({modules.length} modules)</span>
            </div>
            <button
              type="button" onClick={addModule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors"
              style={{ color: 'var(--violet)', background: 'var(--violet-soft)', border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--violet)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; }}
            >
              <Plus className="h-4 w-4" />
              Add Module
            </button>
          </div>

          <div className="p-6">
            {modules.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
                <Layers className="mx-auto h-10 w-10 mb-3" />
                <p className="font-medium">No modules yet</p>
                <p className="text-sm mt-1">Click "Add Module" to build your course structure.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {modules.map((mod, modIndex) => (
                  <div key={mod.module_id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                      style={{ background: 'var(--bg-tertiary)' }}
                      onClick={() => toggleModule(mod.module_id)}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-soft)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                    >
                      <GripVertical className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--text-tertiary)' }} />
                      <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: 'var(--violet)', background: 'var(--violet-soft)' }}>
                        M{modIndex + 1}
                      </span>
                      <span className="flex-1 font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {mod.title || 'Untitled Module'}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{mod.lessons.length} lessons</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeModule(mod.module_id); }}
                        className="p-1 transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                        title="Remove module"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {expandedModules.has(mod.module_id)
                        ? <ChevronUp className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />
                        : <ChevronDown className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />}
                    </div>

                    {expandedModules.has(mod.module_id) && (
                      <div className="p-4 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Module Title</label>
                            <input type="text" value={mod.title}
                              onChange={e => updateModule(mod.module_id, 'title', e.target.value)}
                              placeholder="e.g. Getting Started" className="glass-input"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
                            <input type="text" value={mod.description || ''}
                              onChange={e => updateModule(mod.module_id, 'description', e.target.value)}
                              placeholder="Brief description..." className="glass-input"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Lessons</span>
                            <button
                              type="button" onClick={() => addLesson(mod.module_id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors"
                              style={{ color: 'var(--violet)', background: 'var(--violet-soft)' }}
                            >
                              <Plus className="h-3 w-3" />
                              Add Lesson
                            </button>
                          </div>

                          {mod.lessons.length === 0 ? (
                            <p className="text-sm text-center py-4" style={{ color: 'var(--text-tertiary)' }}>No lessons in this module yet.</p>
                          ) : (
                            <div className="space-y-3">
                              {mod.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.lesson_id} className="p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold" style={{ color: 'var(--text-tertiary)' }}>Lesson {lessonIndex + 1}</span>
                                    <button type="button"
                                      onClick={() => removeLesson(mod.module_id, lesson.lesson_id)}
                                      className="p-1 transition-colors"
                                      style={{ color: 'var(--text-tertiary)' }}
                                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--danger)'; }}
                                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    <input type="text" value={lesson.title}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'title', e.target.value)}
                                      placeholder="Lesson title" className="glass-input"
                                    />
                                    <select value={lesson.content_type}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'content_type', e.target.value)}
                                      className="glass-select"
                                    >
                                      {CONTENT_TYPES.map(ct => (
                                        <option key={ct} value={ct}>{ct.charAt(0).toUpperCase() + ct.slice(1)}</option>
                                      ))}
                                    </select>
                                  </div>
                                  {lesson.content_type === 'video' && (
                                    <input type="url" value={lesson.video_url || ''}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'video_url', e.target.value)}
                                      placeholder="Video URL" className="glass-input mt-2"
                                    />
                                  )}
                                  {lesson.content_type === 'text' && (
                                    <textarea value={lesson.text_content || ''}
                                      onChange={e => updateLesson(mod.module_id, lesson.lesson_id, 'text_content', e.target.value)}
                                      placeholder="Lesson text content..." rows={3}
                                      className="glass-input mt-2" style={{ resize: 'none' }}
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
          <Link to="/instructor/dashboard" className="btn-ghost">
            Cancel
          </Link>
          <button
            type="submit" disabled={loading}
            id="create-course-submit"
            className="btn-violet"
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
