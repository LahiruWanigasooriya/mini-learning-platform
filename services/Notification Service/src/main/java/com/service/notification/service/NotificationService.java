package com.service.notification.service;

import com.service.notification.entity.Notification;
import com.service.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public List<Notification> getUserNotifications(Long userId) {
        log.info("Fetching notifications for user: {}", userId);
        return notificationRepository.findByUserId(userId);
    }

    @Transactional
    public Notification createNotification(Notification notification) {
        log.info("Creating notification for user: {}", notification.getUserId());
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        log.info("Marking notification {} as read", notificationId);
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setStatus("READ");
            notification.setReadAt(java.time.LocalDateTime.now());
            notificationRepository.save(notification);
        });
    }
}
