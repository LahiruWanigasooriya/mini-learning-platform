from fastapi import APIRouter
from app.schemas.course import CourseCreateSchema
from app.services.course_service import CourseService

router = APIRouter(prefix="/api/courses", tags=["Courses"])


@router.post("")
def create_course(course: CourseCreateSchema):
    return CourseService.create_course(course.model_dump())


@router.get("")
def get_all_courses():
    return CourseService.get_all_courses()


@router.get("/{course_id}")
def get_course_by_id(course_id: str):
    return CourseService.get_course_by_id(course_id)


@router.get("/{course_id}/summary")
def get_course_summary(course_id: str):
    return CourseService.get_course_summary(course_id)