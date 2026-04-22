package com.service.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type", nullable = false)
    private String eventType; // e.g., USER_REGISTERED, COURSE_ENROLLED

    @Column(name = "payload", columnDefinition = "JSON")
    private String payload; // JSON string containing event data

    @Column(name = "source_service", nullable = false)
    private String sourceService;

    @Column(name = "processed", nullable = false)
    private boolean processed = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
