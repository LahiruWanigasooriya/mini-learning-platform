package SimpleLMS.EPService.DTO;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnrollmentRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotNull(message = "courseId is required")
    private String courseId;
}