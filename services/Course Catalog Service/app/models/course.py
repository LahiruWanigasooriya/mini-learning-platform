from bson import ObjectId


def serialize_course(course) -> dict:
    return {
        "courseId": str(course["_id"]),
        "title": course["title"],
        "description": course["description"],
        "instructorId": course["instructor_id"],
        "category": course["category"],
        "tags": course.get("tags", []),
        "active": course.get("active", True),
        "metadata": course.get("metadata"),
        "modules": course.get("modules", []),
        "createdAt": course.get("created_at"),
        "updatedAt": course.get("updated_at"),
    }


def serialize_course_summary(course) -> dict:
    total_lessons = 0
    for module in course.get("modules", []):
        total_lessons += len(module.get("lessons", []))

    return {
        "courseId": str(course["_id"]),
        "title": course["title"],
        "totalLessons": total_lessons,
        "active": course.get("active", True),
    }


def is_valid_object_id(course_id: str) -> bool:
    return ObjectId.is_valid(course_id)