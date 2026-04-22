package SimpleLMS.EPService.DTO;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompleteLessonRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotNull(message = "courseId is required")
    private Long courseId;

    @NotNull(message = "lessonId is required")
    private Long lessonId;
}
