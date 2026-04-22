from fastapi import FastAPI
from app.database import course_collection

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Course Catalog Service Running"}

@app.get("/test-db")
def test_db():
    course_collection.insert_one({"title": "Test Course"})
    return {"message": "Inserted test course"}