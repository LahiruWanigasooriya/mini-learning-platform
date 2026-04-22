# Mini Learning Platform – Microservices

## Overview

This project implements a **microservices-based mini learning platform** using:

* **Spring Boot + PostgreSQL** → Enrollment & Progress Service
* **FastAPI + MongoDB** → Course Catalog Service

---

## Architecture

```text
Frontend
   |
   v
API Gateway
   |
   +--> Enrollment & Progress Service
             |
             +--> Course Catalog Service
```

---

# 🔁 Sequence Diagrams

---

## 1. Enroll in Course (Happy Path)

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant AG as API Gateway
    participant EP as Enrollment & Progress Service
    participant CC as Course Catalog Service
    participant DB as Enrollment DB

    User->>FE: Click "Enroll"
    FE->>AG: POST /api/enrollments

    AG->>EP: Forward request

    EP->>CC: GET /courses/{courseId}/summary
    CC-->>EP: courseId, totalLessons, active

    EP->>DB: Save Enrollment
    DB-->>EP: OK

    EP->>DB: Initialize Progress (0%)
    DB-->>EP: OK

    EP-->>AG: Enrollment Success
    AG-->>FE: 201 Created
    FE-->>User: Show success message
```

---

## 2. Complete Lesson & Update Progress

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant AG as API Gateway
    participant EP as Enrollment & Progress Service
    participant DB as Enrollment DB

    User->>FE: Complete Lesson
    FE->>AG: POST /progress/complete-lesson

    AG->>EP: Forward request

    EP->>DB: Check Enrollment
    DB-->>EP: Active

    EP->>DB: Check if lesson already completed
    DB-->>EP: Not completed

    EP->>DB: Save CompletedLesson
    DB-->>EP: OK

    EP->>DB: Count completed lessons
    DB-->>EP: Count = N

    EP->>EP: Calculate progress %

    EP->>DB: Update Progress
    DB-->>EP: OK

    EP-->>AG: Updated Progress
    AG-->>FE: Return progress data
    FE-->>User: Show updated progress
```

---

# 🔗 Inter-Service Communication

### Pattern

* **Synchronous REST (HTTP)**

### Example

Enrollment Service → Course Catalog Service:

```http
GET /api/courses/{courseId}/summary
```

Response:

```json
{
  "courseId": "68072d92f43c0d5c3f7c1111",
  "title": "Cloud Computing Basics",
  "totalLessons": 2,
  "active": true
}
```

---

# 🧠 Key Design Decisions

* API Gateway handles **client requests only**
* Services communicate **directly with each other**
* No shared database between services
* Each service owns its own data

---

# ⚙️ Services Setup

## Course Catalog Service

```bash
uv run uvicorn app.main:app --reload
```

Base URL:

```
http://localhost:8000
```

---

## Enrollment & Progress Service

```bash
mvn spring-boot:run
```

Base URL:

```
http://localhost:5003
```

---

# 🚀 Future Improvements

* API Gateway (Spring Cloud Gateway)
* JWT Authentication Service
* RabbitMQ / Kafka (async communication)
* Docker + Kubernetes deployment

---

