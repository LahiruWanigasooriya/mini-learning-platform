package SimpleLMS.EPService.Repositories;

import SimpleLMS.EPService.Entities.CompletedLesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompletedLessonRepository extends JpaRepository<CompletedLesson, Long> {
    long countByUserIdAndCourseId(Long userId, String courseId);
    boolean existsByUserIdAndCourseIdAndLessonId(Long userId, String courseId, String lessonId);
}
