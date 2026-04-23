package SimpleLMS.EPService.Repositories;


import SimpleLMS.EPService.Entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, String courseId);
    boolean existsByUserIdAndCourseId(Long userId, String courseId);
}
