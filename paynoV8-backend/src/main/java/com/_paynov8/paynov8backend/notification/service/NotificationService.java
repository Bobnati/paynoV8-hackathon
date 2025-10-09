package com._paynov8.paynov8backend.notification.service;

import com._paynov8.paynov8backend.notification.model.Notification;
import com._paynov8.paynov8backend.splitpayment.model.SplitParticipant;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import org.springframework.scheduling.annotation.Async;

import java.util.List;

public interface NotificationService {
//    void notifyParticipants(SplitPayment payment);

    List<Notification> getNotifications(String userId);

    @Async
    void notifyParticipant(SplitParticipant participant, SplitPayment payment, String email);

    List<Notification> getGroupNotifications(String groupId);
}
