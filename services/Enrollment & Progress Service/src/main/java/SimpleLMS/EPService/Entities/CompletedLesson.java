package SimpleLMS.EPService.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "completed_lessons",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "course_id", "lesson_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
public class CompletedLesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "course_id", nullable = false)
    private String courseId;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;
}