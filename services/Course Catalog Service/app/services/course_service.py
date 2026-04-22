from datetime import datetime, timezone
from bson import ObjectId
from fastapi import HTTPException

from app.database import course_collection
from app.models.course import serialize_course, serialize_course_summary, is_valid_object_id


class CourseService:

    @staticmethod
    def create_course(course_data: dict) -> dict:
        course_data["created_at"] = datetime.now(timezone.utc)
        course_data["updated_at"] = datetime.now(timezone.utc)

        result = course_collection.insert_one(course_data)
        created_course = course_collection.find_one({"_id": result.inserted_id})

        return serialize_course(created_course)

    @staticmethod
    def get_all_courses() -> list:
        courses = course_collection.find()
        return [serialize_course(course) for course in courses]

    @staticmethod
    def get_course_by_id(course_id: str) -> dict:
        if not is_valid_object_id(course_id):
            raise HTTPException(status_code=400, detail="Invalid course ID format")

        course = course_collection.find_one({"_id": ObjectId(course_id)})

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        return serialize_course(course)

    @staticmethod
    def get_course_summary(course_id: str) -> dict:
        if not is_valid_object_id(course_id):
            raise HTTPException(status_code=400, detail="Invalid course ID format")

        course = course_collection.find_one({"_id": ObjectId(course_id)})

        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        return serialize_course_summary(course)