package com._paynov8.paynov8backend.notification.controller;

import com._paynov8.paynov8backend.common.dto.ApiResponse;
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

    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<List<Notification>>> getUserNotifications(@PathVariable String accountNumber) {
        List<Notification> notifications = notificationService.getUserNotifications(accountNumber);
        return ResponseEntity.ok(
                ApiResponse.success("User notifications retrieved successfully.", notifications)
        );
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<ApiResponse<List<Notification>>> getGroupNotifications(@PathVariable String groupId) {
        List<Notification> notifications = notificationService.getGroupNotifications(groupId);
        return ResponseEntity.ok(
                ApiResponse.success("Group notifications retrieved successfully.", notifications)
        );
    }

//    @GetMapping("/me")
//    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(Authentication auth) {
//        String userId = ((UserDetails) auth.getPrincipal()).getUsername();
//        List<Notification> notifications = notificationService.getNotifications(userId);
//        return ResponseEntity.ok(ApiResponse.success("Your notifications retrieved successfully.", notifications));
//    }
}
