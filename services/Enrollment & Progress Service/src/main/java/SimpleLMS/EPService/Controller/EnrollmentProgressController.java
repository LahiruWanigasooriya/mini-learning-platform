package SimpleLMS.EPService.Controller;

import SimpleLMS.EPService.DTO.CompleteLessonRequest;
import SimpleLMS.EPService.DTO.EnrollmentRequest;
import SimpleLMS.EPService.Entities.Enrollment;
import SimpleLMS.EPService.Entities.Progress;
import SimpleLMS.EPService.Service.EnrollmentProgressService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentProgressController {

    private final EnrollmentProgressService enrollmentProgressService;

    public EnrollmentProgressController(EnrollmentProgressService enrollmentProgressService) {
        this.enrollmentProgressService = enrollmentProgressService;
    }

    @PostMapping
    public Enrollment enrollStudent(@Valid @RequestBody EnrollmentRequest request) {
        return enrollmentProgressService.enrollStudent(request);
    }

    @GetMapping("/user/{userId}")
    public List<Enrollment> getEnrollmentsByUserId(@PathVariable Long userId) {
        return enrollmentProgressService.getEnrollmentsByUserId(userId);
    }

    @PostMapping("/progress/complete-lesson")
    public Progress completeLesson(@Valid @RequestBody CompleteLessonRequest request) {
        return enrollmentProgressService.completeLesson(request);
    }

    @GetMapping("/progress/user/{userId}/course/{courseId}")
    public Progress getProgress(@PathVariable Long userId,
                                @PathVariable String courseId) {
        return enrollmentProgressService.getProgress(userId, courseId);
    }
}