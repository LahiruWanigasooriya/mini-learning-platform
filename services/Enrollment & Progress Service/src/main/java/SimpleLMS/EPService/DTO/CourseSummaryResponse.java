package SimpleLMS.EPService.DTO;

import lombok.Data;

@Data
public class CourseSummaryResponse {
    private String courseId;
    private String title;
    private Integer totalLessons;
    private Boolean active;
}