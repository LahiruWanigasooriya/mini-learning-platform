package SimpleLMS.EPService.Repositories;

import SimpleLMS.EPService.Entities.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserIdAndCourseId(Long userId, String courseId);
}