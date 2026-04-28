# Mini Learning Platform – Microservices

## Overview

This project implements a **microservices-based mini learning platform** using a polyglot architecture. It is fully containerized and orchestration is managed via Docker Compose.

The platform consists of:
* **Frontend** (React)
* **API Gateway** (Spring Cloud Gateway)
* **User Auth Service** (Spring Boot + MySQL)
* **Enrollment & Progress Service** (Spring Boot + PostgreSQL)
* **Course Catalog Service** (FastAPI + MongoDB)
* **Notification Service** (Node.js/Express + MySQL)

---

## Architecture

```text
Frontend (Port 5173)
   |
   v
API Gateway (Port 8080)
   |
   +--> User Auth Service (Port 8081, uses MySQL)
   |
   +--> Enrollment & Progress Service (Port 8082, uses PostgreSQL)
   |         |
   |         +--> Course Catalog Service (Port 8083, uses MongoDB)
   |
   +--> Notification Service (Port 8084, uses MySQL)
```

---

## 🚀 How to Run (Using Docker Compose)

The easiest way to run the entire application, including all microservices and databases, is using Docker Compose.

### Prerequisites

* [Docker](https://docs.docker.com/get-docker/) installed and running.
* [Docker Compose](https://docs.docker.com/compose/install/) installed.

### Steps to Run

1. **Clone the repository** (if you haven't already) and navigate to the project root directory:
   ```bash
   cd mini-learning-platform-cloud-project
   ```

2. **Start the application**:
   Run the following command to build the images and start the containers in detached mode:
   ```bash
   docker-compose up --build -d
   ```
   *Note: The first time you run this command, it will take several minutes to download the base images and build all the microservices.*

3. **Verify the services are running**:
   ```bash
   docker-compose ps
   ```
   You should see containers for the databases (`mysql-db`, `enrollment-postgres`, `course-mongo`), the microservices (`auth-service`, `enrollment-service`, `course-catalog-service`, `notification-service`), the `api-gateway`, and the `front-end`.

### Accessing the Platform

* **Frontend UI**: [http://localhost:5173](http://localhost:5173)
* **API Gateway**: [http://localhost:8080](http://localhost:8080)

---

## 🛑 How to Stop

To stop the application and remove the containers, run:
```bash
docker-compose down
```

If you also want to remove the database volumes (which will **delete all your data**), run:
```bash
docker-compose down -v
```

---

## ⚙️ Development / Running Services Individually

If you prefer to run services individually for development:

1. **Start the Databases via Docker Compose**:
   You can start just the database containers:
   ```bash
   docker-compose up -d mysql-db enrollment-postgres course-mongo
   ```

2. **Run the individual microservices**:
   * **Course Catalog Service**: `cd "services/Course Catalog Service"` and run `uv run uvicorn app.main:app --reload`
   * **Enrollment & Progress Service**: `cd "services/Enrollment & Progress Service"` and run `mvn spring-boot:run`
   * *(Follow respective READMEs in other service directories for specific start commands).*

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

* API Gateway handles **client requests only**.
* Services communicate **directly with each other**.
* No shared database between services.
* Each service owns its own data.
