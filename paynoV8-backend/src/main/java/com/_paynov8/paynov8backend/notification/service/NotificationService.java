package com._paynov8.paynov8backend.notification.service;

import com._paynov8.paynov8backend.Group.model.Group;
import com._paynov8.paynov8backend.notification.model.Notification;
import com._paynov8.paynov8backend.splitpayment.model.SplitParticipant;
import com._paynov8.paynov8backend.splitpayment.model.SplitPayment;
import org.springframework.scheduling.annotation.Async;

import java.util.List;

public interface NotificationService {
//    void notifyParticipants(SplitPayment payment);


    @Async
    void notifyGroupParticipants(SplitPayment payment, Group group);

    List<Notification> getUserNotifications(String userId);

    List<Notification> getGroupNotifications(String groupId);

    void notifyPaymentSuccess(String userId, String title, String message);
}
