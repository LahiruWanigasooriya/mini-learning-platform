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

    @staticmethod
    def update_course(course_id: str, update_data: dict) -> dict:
        if not is_valid_object_id(course_id):
            raise HTTPException(status_code=400, detail="Invalid course ID format")

        existing_course = course_collection.find_one({"_id": ObjectId(course_id)})

        if not existing_course:
            raise HTTPException(status_code=404, detail="Course not found")

        clean_data = {key: value for key, value in update_data.items() if value is not None}
        clean_data["updated_at"] = datetime.now(timezone.utc)

        course_collection.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": clean_data}
        )

        updated_course = course_collection.find_one({"_id": ObjectId(course_id)})
        return serialize_course(updated_course)

    @staticmethod
    def delete_course(course_id: str) -> dict:
        if not is_valid_object_id(course_id):
            raise HTTPException(status_code=400, detail="Invalid course ID format")

        result = course_collection.delete_one({"_id": ObjectId(course_id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Course not found")

        return {"message": "Course deleted successfully", "courseId": course_id}