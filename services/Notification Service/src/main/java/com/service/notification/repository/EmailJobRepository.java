package com.service.notification.repository;

import com.service.notification.entity.EmailJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailJobRepository extends JpaRepository<EmailJob, Long> {
    List<EmailJob> findByStatus(String status);
}
