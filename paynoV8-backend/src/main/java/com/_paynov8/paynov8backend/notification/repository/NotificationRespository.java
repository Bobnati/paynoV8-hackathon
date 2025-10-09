package com._paynov8.paynov8backend.notification.repository;

import com._paynov8.paynov8backend.notification.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRespository extends MongoRepository<Notification, String> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    List<Notification> findByGroupIdOrderByCreatedAtDesc(String groupId);
}
