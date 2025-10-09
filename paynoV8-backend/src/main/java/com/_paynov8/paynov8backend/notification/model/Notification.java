package com._paynov8.paynov8backend.notification.model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
public class Notification {
    private String userId;
    private String message;
    private String title;
    private String paymentId;
    private String groupId;
    private String link;
    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();


}
