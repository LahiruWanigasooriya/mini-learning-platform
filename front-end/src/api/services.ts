import api from './axios';

// --- Auth & User ---
export const loginUser = (data: any) => api.post('/auth/login', data);
export const registerUser = (data: any) => api.post('/auth/register', data);
export const getUserProfile = () => api.get('/users/me');

// --- Courses ---
export const getCourses = () => api.get('/courses/get_courses');
export const getCourseById = (id: string) => api.get(`/courses/${id}`);
export const getCourseSummary = (id: string) => api.get(`/courses/${id}/summary`);
export const createCourse = (data: any) => api.post('/courses/create', data);
export const updateCourse = (id: string, data: any) => api.put(`/courses/${id}`, data);
export const deleteCourse = (id: string) => api.delete(`/courses/${id}`);

// --- Enrollments & Progress ---
export const enrollInCourse = (data: any) => api.post('/enrollments', data);
export const getUserEnrollments = (userId: number) => api.get(`/enrollments/user/${userId}`);
export const completeLesson = (data: any) => api.post('/enrollments/progress/complete-lesson', data);
export const getProgress = (userId: number, courseId: string) => api.get(`/enrollments/progress/user/${userId}/course/${courseId}`);

