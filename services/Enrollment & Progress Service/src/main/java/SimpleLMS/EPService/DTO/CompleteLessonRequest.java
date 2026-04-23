package SimpleLMS.EPService.DTO;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CompleteLessonRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotBlank(message = "courseId is required")
    private String courseId;

    @NotBlank(message = "lessonId is required")
    private String lessonId;
}
