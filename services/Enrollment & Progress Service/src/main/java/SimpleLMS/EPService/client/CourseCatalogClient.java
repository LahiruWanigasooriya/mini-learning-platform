package SimpleLMS.EPService.client;


import SimpleLMS.EPService.DTO.CourseSummaryResponse;
import SimpleLMS.EPService.Exceptions.BadRequestException;
import SimpleLMS.EPService.Exceptions.ResourceNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Component
public class CourseCatalogClient {

    private final WebClient courseCatalogWebClient;

    public CourseCatalogClient(WebClient courseCatalogWebClient) {
        this.courseCatalogWebClient = courseCatalogWebClient;
    }

    public CourseSummaryResponse getCourseSummary(String courseId) {
        try {
            return courseCatalogWebClient.get()
                    .uri("/api/courses/{courseId}/summary", courseId)
                    .retrieve()
                    .bodyToMono(CourseSummaryResponse.class)
                    .block();
        } catch (WebClientResponseException.NotFound ex) {
            throw new ResourceNotFoundException("Course not found: " + courseId);
        } catch (WebClientResponseException.BadRequest ex) {
            throw new BadRequestException("Invalid course ID: " + courseId);
        } catch (WebClientResponseException ex) {
            throw new RuntimeException("Failed to call Course Catalog Service: " + ex.getMessage());
        }
    }
}