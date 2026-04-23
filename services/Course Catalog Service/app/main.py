from fastapi import FastAPI
from app.routes.course_routes import router as course_router

app = FastAPI(title="Course Catalog Service")

app.include_router(course_router)


@app.get("/")
def root():
    return {"message": "Course Catalog Service Running"}