package com.service.notification.repository;

import com.service.notification.entity.NotificationQueueItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationQueueItemRepository extends JpaRepository<NotificationQueueItem, Long> {
    List<NotificationQueueItem> findByStatusOrderByPriorityDesc(String status);
}
