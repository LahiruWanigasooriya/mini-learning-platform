# Mini Learning Platform - Entities Design

## 1. User & Auth Service (PostgreSQL)

**Responsibility:** Authentication, authorization, and user management.

**Entities:**

- User
- Role
- Permission
- UserRole
- AuthCredential
- RefreshToken
- UserProfile

---

## 2. Course Catalog Service (MongoDB)

**Responsibility:** Course structure and content management.

**Entities:**

- Course
- Module
- Lesson
- LessonContent
- Resource
- Category
- Tag
- CourseMetadata

---

## 3. Enrollment & Progress Service (PostgreSQL)

**Responsibility:** Enrollment handling and learning progress tracking.

**Entities:**

- Enrollment
- Progress
- CompletedLesson
- CourseProgressSummary
- EnrollmentStatus
- Certificate

---

## 4. Notification Service (Redis / Event-Based)

**Responsibility:** Sending notifications and handling async events.

**Entities:**

- Notification
- NotificationTemplate
- NotificationEvent
- EmailJob
- NotificationQueueItem

---

## 5. API Gateway

**Responsibility:** Request routing, authentication validation, and rate limiting.

**Entities:**

- None

---

## ⚠️ Important Design Rules

- Each service must have its **own database**.
- No direct database sharing between services.
- Services communicate via:
  - REST APIs (synchronous)
  - Events (asynchronous)

---

## ✅ Cross-Service Referencing Strategy

Use only IDs for relationships:

Example:
