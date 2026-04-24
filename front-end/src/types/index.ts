export interface User {
  id: number;
  email: string;
  role: string;
  roles?: string[];
  firstName?: string;
  lastName?: string;
}

// --- Course Catalog Types (matches backend schemas) ---

export interface Resource {
  name: string;
  type: string;
  url: string;
}

export interface Lesson {
  lesson_id: string;
  title: string;
  content_type: string;
  video_url?: string;
  text_content?: string;
  order: number;
  resources: Resource[];
}

export interface Module {
  module_id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseMetadata {
  level?: string;
  language?: string;
  estimated_duration?: string;
}

export interface Course {
  courseId: string;
  title: string;
  description: string;
  instructorId: string;
  category: string;
  tags: string[];
  active: boolean;
  metadata?: CourseMetadata | null;
  modules: Module[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseCreatePayload {
  title: string;
  description: string;
  instructor_id: string;
  category: string;
  tags: string[];
  active: boolean;
  metadata?: CourseMetadata | null;
  modules: Module[];
}

export interface CourseUpdatePayload {
  title?: string;
  description?: string;
  instructor_id?: string;
  category?: string;
  tags?: string[];
  active?: boolean;
  metadata?: CourseMetadata | null;
  modules?: Module[];
}
