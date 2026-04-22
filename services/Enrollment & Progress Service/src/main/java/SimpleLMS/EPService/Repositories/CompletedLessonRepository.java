package SimpleLMS.EPService.Repositories;

import SimpleLMS.EPService.Entities.CompletedLesson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompletedLessonRepository extends JpaRepository<CompletedLesson, Long> {
    long countByUserIdAndCourseId(Long userId, Long courseId);
    boolean existsByUserIdAndCourseIdAndLessonId(Long userId, Long courseId, Long lessonId);
}
