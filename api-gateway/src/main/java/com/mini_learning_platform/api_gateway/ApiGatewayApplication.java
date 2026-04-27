package com.mini_learning_platform.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r.path("/api/auth/**")
                        .uri("http://auth-service:8081"))
                .route("user-service", r -> r.path("/api/users/**")
                        .uri("http://auth-service:8081"))
                .route("enrollment-service", r -> r.path("/api/enrollments/**")
                        .uri("http://enrollment-service:8082"))
                .route("course-catalog-service", r -> r.path("/api/courses/**")
                        .uri("http://course-catalog-service:8083"))
                .route("notification-service", r -> r.path("/api/notifications/**")
                        .uri("http://notification-service:8084"))
                .build();
    }
}
