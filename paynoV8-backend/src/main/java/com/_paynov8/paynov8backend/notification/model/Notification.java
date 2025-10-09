package com._paynov8.paynov8backend.notification.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    private String userId;
    private String message;
    private String paymentId;
    private String groupId;
    private String link;
    private LocalDateTime timestamp;

}
