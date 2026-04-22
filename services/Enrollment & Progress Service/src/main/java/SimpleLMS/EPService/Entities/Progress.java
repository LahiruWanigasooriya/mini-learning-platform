package SimpleLMS.EPService.Entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "progress",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "course_id"})
        }
)
@Getter
@Setter
@NoArgsConstructor
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "course_id", nullable = false)
    private String courseId;

    @Column(name = "completed_lessons", nullable = false)
    private Integer completedLessons;

    @Column(name = "total_lessons", nullable = false)
    private Integer totalLessons;

    @Column(name = "progress_percentage", nullable = false)
    private Double progressPercentage;

    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;
}
