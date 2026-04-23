from pydantic import BaseModel, Field
from typing import List, Optional


class ResourceSchema(BaseModel):
    name: str
    type: str
    url: str


class LessonSchema(BaseModel):
    lesson_id: str
    title: str
    content_type: str
    video_url: Optional[str] = None
    text_content: Optional[str] = None
    order: int
    resources: List[ResourceSchema] = []


class ModuleSchema(BaseModel):
    module_id: str
    title: str
    description: Optional[str] = None
    order: int
    lessons: List[LessonSchema] = []


class CourseMetadataSchema(BaseModel):
    level: Optional[str] = None
    language: Optional[str] = None
    estimated_duration: Optional[str] = None


class CourseCreateSchema(BaseModel):
    title: str
    description: str
    instructor_id: str
    category: str
    tags: List[str] = []
    active: bool = True
    metadata: Optional[CourseMetadataSchema] = None
    modules: List[ModuleSchema] = []


class CourseSummarySchema(BaseModel):
    course_id: str
    title: str
    total_lessons: int
    active: bool