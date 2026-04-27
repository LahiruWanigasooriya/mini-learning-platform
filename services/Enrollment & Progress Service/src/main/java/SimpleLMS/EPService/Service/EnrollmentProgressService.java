package SimpleLMS.EPService.Service;


import SimpleLMS.EPService.DTO.CompleteLessonRequest;
import SimpleLMS.EPService.DTO.CourseSummaryResponse;
import SimpleLMS.EPService.DTO.EnrollmentRequest;
import SimpleLMS.EPService.Entities.CompletedLesson;
import SimpleLMS.EPService.Entities.Enrollment;
import SimpleLMS.EPService.Entities.Progress;
import SimpleLMS.EPService.Enum.EnrollmentStatus;
import SimpleLMS.EPService.Exceptions.BadRequestException;
import SimpleLMS.EPService.Exceptions.ConflictException;
import SimpleLMS.EPService.Exceptions.ResourceNotFoundException;
import SimpleLMS.EPService.Repositories.CompletedLessonRepository;
import SimpleLMS.EPService.Repositories.EnrollmentRepository;
import SimpleLMS.EPService.Repositories.ProgressRepository;
import SimpleLMS.EPService.client.CourseCatalogClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnrollmentProgressService {

    private final EnrollmentRepository enrollmentRepository;
    private final ProgressRepository progressRepository;
    private final CompletedLessonRepository completedLessonRepository;
    private final CourseCatalogClient courseCatalogClient;

    public EnrollmentProgressService(EnrollmentRepository enrollmentRepository,
                                     ProgressRepository progressRepository,
                                     CompletedLessonRepository completedLessonRepository,
                                     CourseCatalogClient courseCatalogClient) {
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
        this.completedLessonRepository = completedLessonRepository;
        this.courseCatalogClient = courseCatalogClient;
    }

    @Transactional
    public Enrollment enrollStudent(EnrollmentRequest request) {

        if (enrollmentRepository.existsByUserIdAndCourseId(request.getUserId(), request.getCourseId())) {
            throw new ConflictException("User is already enrolled in this course");
        }

        CourseSummaryResponse course = courseCatalogClient.getCourseSummary(request.getCourseId());

        if (Boolean.FALSE.equals(course.getActive())) {
            throw new BadRequestException("Course is not active");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(request.getUserId());
        enrollment.setCourseId(request.getCourseId());
        enrollment.setEnrolledAt(LocalDateTime.now());
        enrollment.setStatus(EnrollmentStatus.ACTIVE);

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        Progress progress = new Progress();
        progress.setUserId(request.getUserId());
        progress.setCourseId(request.getCourseId());
        progress.setCompletedLessons(0);
        progress.setTotalLessons(course.getTotalLessons());
        progress.setProgressPercentage(0.0);
        progress.setLastUpdated(LocalDateTime.now());

        progressRepository.save(progress);

        return savedEnrollment;
    }

    public List<Enrollment> getEnrollmentsByUserId(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    @Transactional
    public Progress completeLesson(CompleteLessonRequest request) {

        Enrollment enrollment = enrollmentRepository
                .findByUserIdAndCourseId(request.getUserId(), request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("User is not enrolled in this course"));

        if (enrollment.getStatus() != EnrollmentStatus.ACTIVE) {
            throw new ConflictException("Enrollment is not active");
        }

        boolean alreadyCompleted = completedLessonRepository
                .existsByUserIdAndCourseIdAndLessonId(
                        request.getUserId(),
                        request.getCourseId(),
                        request.getLessonId()
                );

        if (alreadyCompleted) {
            throw new ConflictException("Lesson already completed");
        }

        CompletedLesson completedLesson = new CompletedLesson();
        completedLesson.setUserId(request.getUserId());
        completedLesson.setCourseId(request.getCourseId());
        //chnage Long to string
        completedLesson.setLessonId(Long.valueOf(request.getLessonId()));
        completedLesson.setCompletedAt(LocalDateTime.now());

        completedLessonRepository.save(completedLesson);

        long completedCount = completedLessonRepository
                .countByUserIdAndCourseId(request.getUserId(), request.getCourseId());

        Progress progress = progressRepository
                .findByUserIdAndCourseId(request.getUserId(), request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Progress record not found"));

        progress.setCompletedLessons((int) completedCount);

        int totalLessons = progress.getTotalLessons();
        double percentage = 0.0;

        if (totalLessons > 0) {
            percentage = ((double) completedCount / totalLessons) * 100;
        }

        progress.setProgressPercentage(percentage);
        progress.setLastUpdated(LocalDateTime.now());

        if (totalLessons > 0 && completedCount == totalLessons) {
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollmentRepository.save(enrollment);
        }

        return progressRepository.save(progress);
    }

    public Progress getProgress(Long userId, String courseId) {
        return progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found"));
    }
}