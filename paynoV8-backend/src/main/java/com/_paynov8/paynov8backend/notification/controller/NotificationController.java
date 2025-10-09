package com._paynov8.paynov8backend.notification.controller;

import com._paynov8.paynov8backend.notification.model.Notification;
import com._paynov8.paynov8backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<Notification>> getGroupNotifications(@PathVariable String groupId) {
        return ResponseEntity.ok(notificationService.getGroupNotifications(groupId));
    }

//    @GetMapping("/me")
//    public ResponseEntity<List<Notification>> getMyNotifications(Authentication auth) {
//        String userId = auth.getPrincipal()).getUsername();
//        return ResponseEntity.ok(notificationService.getNotifications(userId));
//    }
}
